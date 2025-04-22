import {
  TextareaHTMLAttributes,
  forwardRef,
  useId,
  ForwardedRef,
  useLayoutEffect,
  useRef,
} from "react";
import styles from "./Textarea.module.css";
import { SendButton } from "../SendButton/SendButton"; // путь подстрой под структуру проекта

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  autoGrow?: boolean;
  className?: string;
  onSend?: (value: string) => void;
}

export const Textarea = forwardRef(
  (
    {
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

    const textValue = value?.toString() ?? "";
    const isSendDisabled = textValue.trim().length === 0;

    return (
      <div className={styles.textarea__container}>
        <div className="relative">
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
            } pr-12`}
            aria-invalid={isInvalid}
            aria-describedby={isInvalid && errorMessage ? errorId : undefined}
            ref={(node) => {
              innerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isSendDisabled) {
                  onSend?.(textValue);
                }
              }
            }}
            {...rest}
          />

          {onSend && (
            <SendButton
              disabled={isSendDisabled}
              onClick={() => onSend(textValue)}
            />
          )}
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
