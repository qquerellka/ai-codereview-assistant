import styles from "./AiMessage.module.css";

export const AiMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.messageContainer}>
      <p className={styles.messageText}>{text}</p>
    </div>
  );
};
