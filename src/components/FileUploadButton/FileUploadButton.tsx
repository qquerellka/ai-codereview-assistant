import { FC } from "react";
import styles from "./FileUploadButton.module.css";

interface FileUploadButtonProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadButton: FC<FileUploadButtonProps> = ({
  onFileUpload,
}) => {
  return (
    <label className={styles.attachLabel}>
      📎
      <input
        type="file"
        accept=".js,.ts,.jsx,.tsx,.json,.txt,.html,.css,.scss,.py,.rb,.java,.c,.cpp,.cs,.go,.php,.rs,.swift,.kt,.kts,.sh,.bat,.yaml,.yml,.md,.sql,.xml"
        onChange={onFileUpload}
        className={styles.hiddenInput}
      />
    </label>
  );
};
