import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "./admin.module.css";

type Kind = "success" | "error" | "warning" | "info";
const icons = { success: "checkCircle", error: "close", warning: "fileText", info: "fileText" } as const;

/** Status message box. Errors use role="alert", others role="status". */
export function Notice({ kind, children }: { kind: Kind; children: ReactNode }) {
  return (
    <div className={`${styles.notice} ${styles[kind]}`} role={kind === "error" ? "alert" : "status"}>
      <Icon name={icons[kind]} size={18} />
      <div>{children}</div>
    </div>
  );
}
