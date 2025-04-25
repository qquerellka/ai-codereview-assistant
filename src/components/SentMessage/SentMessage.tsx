import { FC, useEffect } from "react";
import styles from "./SentMessage.module.css";
import * as Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";

interface LineComment {
  line: number;
  comment: string;
  suggestion?: string;
  type?: "info" | "warning" | "error";
}

interface SentMessageProps {
  code: string;
  comments?: LineComment[];
  timestamp?: string;
}

export const SentMessage: FC<SentMessageProps> = ({
  code,
  comments = [],
  timestamp,
}) => {
  if (!code) return null;

  const time = timestamp ?? new Date().toLocaleTimeString();
  if (typeof code !== "string") return null;

  const lines = code.split("\n");

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div className={styles.messageContainer}>
      <pre className={styles.codeBlock}>
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const commentsForLine = comments.filter((c) => c.line === lineNumber);

          return (
            <div
              key={index}
              className={
                commentsForLine.length
                  ? styles.highlightedLine
                  : styles.normalLine
              }
            >
              <code
                className="language-javascript"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {line}
              </code>
              {commentsForLine.map((c, i) => (
                <div
                  key={i}
                  className={`${styles.comment} ${styles[c.type ?? "info"]}`}
                >
                  {c.comment}
                  {c.suggestion && (
                    <pre className={styles.suggestion}>{c.suggestion}</pre>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </pre>
      <div className={styles.timestamp}>{time}</div>
    </div>
  );
};
