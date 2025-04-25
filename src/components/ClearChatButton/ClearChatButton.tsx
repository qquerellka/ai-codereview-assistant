import { FC } from "react";
import styles from "./ClearChatButton.module.css";

interface ClearChatButtonProps {
  onClear: () => void;
}

export const ClearChatButton: FC<ClearChatButtonProps> = ({ onClear }) => {
  return (
    <button onClick={onClear} className={styles.clearButton}>
      Очистить чат
    </button>
  );
};
