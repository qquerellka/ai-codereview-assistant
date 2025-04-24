import { FC, useEffect } from "react";
import styles from "./SentMessage.module.css";
import * as Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css"; // 👈 тёмная тема
// import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";

interface SentMessageProps {
  code: string;
  timestamp?: string;
}

export const SentMessage: FC<SentMessageProps> = ({ code, timestamp }) => {
  const time = timestamp ?? new Date().toLocaleTimeString();

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div className={styles.messageContainer}>
      <pre className="language-javascript">
        <code className="language-javascript">{code}</code>
      </pre>
      <div className={styles.timestamp}>{time}</div>
    </div>
  );
};