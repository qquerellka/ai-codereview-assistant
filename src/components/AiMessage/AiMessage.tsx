import { FC } from "react";
import styles from "./AiMessage.module.css";

interface LineComment {
  line: number;
  comment: string;
  suggestion?: string;
}

interface AiMessageProps {
  comments: LineComment[];
  timestamp?: string;
}

export const AiMessage: FC<AiMessageProps> = ({ comments, timestamp }) => {
  return (
    <div className={styles.aiMessage}>
      <div className={styles.bubble}>
        <strong>AI ассистент:</strong>
        <ul>
          {comments
            .sort((a, b) => a.line - b.line)
            .map((c, i) => (
              <li key={i}>
                <strong>Строка {c.line}:</strong> {c.comment}
                {c.suggestion && <div>💡 {c.suggestion}</div>}
              </li>
            ))}
        </ul>
        {timestamp && <div className={styles.timestamp}>{timestamp}</div>}
      </div>
    </div>
  );
};
