import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Textarea } from "./components/Textarea/Textarea";
import { SentMessage } from "./components/SentMessage/SentMessage";
import { AiMessage } from "./components/AiMessage/AiMessage";
import { reviewCode } from "./api/reveiwCode";

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
  const hasInitialized = useRef(false); // ✅ предотвращает раннюю запись в localStorage

  // Загрузка истории при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      } catch (e) {
        console.warn("Ошибка парсинга localStorage:", e);
      }
    }
  
    // ⚠️ Ставим true только ПОСЛЕ setMessages
    setTimeout(() => {
      hasInitialized.current = true;
    }, 0); // через event loop
  }, []);
  

  // Сохранение истории при изменении сообщений
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
