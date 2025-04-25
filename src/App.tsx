import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Textarea } from "./components/Textarea/Textarea";
import { SentMessage } from "./components/SentMessage/SentMessage";
import { AiMessage } from "./components/AiMessage/AiMessage";
import { reviewCode } from "./api/reviewCode";

type LineComment = {
  line: number;
  comment: string;
  suggestion?: string;
};

type Message =
  | { type: "user"; content: string; timestamp: string }
  | { type: "ai"; comments: LineComment[]; timestamp: string };

const LOCAL_STORAGE_KEY = "ai_review_chat_history";

function App() {
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Ошибка чтения localStorage", e);
      }
    }
    setTimeout(() => {
      hasInitialized.current = true;
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasInitialized.current) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isInvalid = touched && code.trim().length < 10;

  const handleSend = async (val: string) => {
    if (isWaitingForResponse) {
      setTouched(true);
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [...prev, { type: "user", content: val, timestamp }]);
    setCode("");
    setIsWaitingForResponse(true);

    try {
      const response = await reviewCode(val);
      const raw = response.choices[0].message.content;

      let comments: LineComment[] = [];
      try {
        const parsed = JSON.parse(raw || "{}");
        if (Array.isArray(parsed.comments)) {
          comments = parsed.comments;
        }
      } catch {
        console.warn("AI вернул некорректный JSON");
      }

      setMessages((prev) => [
        ...prev,
        { type: "ai", comments, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (error) {
      console.error("Ошибка AI", error);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCode(text);
      setTouched(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="page">
      <div className="page__container">
        <div className="chat__messages">
          {messages.map((msg, index) =>
            msg.type === "user" ? (
              <SentMessage key={index} code={msg.content} timestamp={msg.timestamp} />
            ) : (
              msg.type === "ai" && msg.comments && (
                <AiMessage key={index} comments={msg.comments} timestamp={msg.timestamp} />
              )
            )
          )}

          {isWaitingForResponse && (
            <div className="ai-loader">AI думает...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onSend={handleSend}
          onFileUpload={handleFileUpload}
          onClearChat={handleClearHistory}
          errorMessage="Минимум 10 символов"
          isInvalid={isInvalid}
          autoGrow
          placeholder="Введите код или прикрепите файл..."
          disabled={isWaitingForResponse}
        />
      </div>
    </div>
  );
}

export default App;
