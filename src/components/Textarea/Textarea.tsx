import {
  TextareaHTMLAttributes,
  forwardRef,
  useId,
  ForwardedRef,
  useLayoutEffect,
  useRef,
} from "react";
import styles from "./Textarea.module.css";
import { FileUploadButton } from "../FileUploadButton/FileUploadButton";
import { ClearChatButton } from "../ClearChatButton/ClearChatButton";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  autoGrow?: boolean;
  className?: string;
  onSend: (value: string) => void;
  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearChat?: () => void;
}

export const Textarea = forwardRef(
  (
    {
      label,
      name,
      id,
      value,
      onChange,
      placeholder,
      disabled = false,
      required = false,
      autoFocus = false,
      errorMessage,
      isInvalid = false,
      autoGrow = true,
      className,
      onSend,
      onFileUpload,
      onClearChat,
      ...rest
    }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const generatedId = useId();
    const textareaId = id || name || generatedId;
    const errorId = `${textareaId}-error`;

    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    useLayoutEffect(() => {
      const el = innerRef.current;
      if (autoGrow && el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    }, [value]);

    return (
      <div className={styles.textarea__container}>
        {label && (
          <label htmlFor={textareaId} className={styles.textarea__label}>
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={`${styles.textarea__element} ${className ?? ""} ${
            isInvalid ? styles.textarea__invalid : ""
          }`}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid && errorMessage ? errorId : undefined}
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref)
              (
                ref as React.MutableRefObject<HTMLTextAreaElement | null>
              ).current = node;
          }}
          {...rest}
        />

        <div className={styles.buttonRow}>
          <button
            type="button"
            onClick={() => onSend(String(value))}
            disabled={disabled || String(value).trim().length == 0}
            className={styles.sendButton}
          >
            Отправить
          </button>
          {onFileUpload && <FileUploadButton onFileUpload={onFileUpload} />}
          {onClearChat && <ClearChatButton onClear={onClearChat} />}
        </div>

        {isInvalid && errorMessage && (
          <span id={errorId} className={styles.textarea__error}>
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);
