import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Textarea } from "./components/Textarea/Textarea";
import { SentMessage } from "./components/SentMessage/SentMessage";
import { AiMessage } from "./components/AiMessage/AiMessage";
import { reviewCode } from "./services/reviewCode";

type Message = {
  type: "user" | "ai";
  content: string;
};

const LOCAL_STORAGE_KEY = "ai_review_chat_history";

function App() {
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isInvalid = touched && code.trim().length < 10;

  const handleSend = async (val: string) => {
    if (isWaitingForResponse) {
      setTouched(true);
      return;
    }

    setMessages((prev) => [...prev, { type: "user", content: val }]);
    setCode("");
    setIsWaitingForResponse(true);

    const aiResponse = await reviewCode(val);

    setMessages((prev) => [...prev, { type: "ai", content: aiResponse }]);
    setIsWaitingForResponse(false);
  };

  return (
    <div className="page">
      <div className="page__container">
        <div className="chat__messages">
          {messages.map((msg, index) =>
            msg.type === "user" ? (
              <SentMessage key={index} code={msg.content} />
            ) : (
              <AiMessage key={index} text={msg.content} />
            )
          )}

          {isWaitingForResponse && (
            <div className="ai-loader">AI думает...</div>
          )}

          {/* ДОЛЖЕН БЫТЬ внизу */}
          <div ref={messagesEndRef} />
        </div>

        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onSend={handleSend}
          errorMessage="Минимум 10 символов"
          isInvalid={isInvalid}
          autoGrow
          placeholder="Введите код..."
          disabled={isWaitingForResponse}
        />
      </div>
    </div>
  );
}

export default App;
