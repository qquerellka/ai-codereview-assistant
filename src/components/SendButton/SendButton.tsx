import { FC } from "react";
import styles from "./SendButton.module.css";
interface SendButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export const SendButton: FC<SendButtonProps> = ({ disabled, onClick }) => {
  const buttonClass = `${styles.button} ${disabled ? styles.disabled : styles.active}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      aria-label="Отправить код"
    >
      Отправить
    </button>
  );
};
