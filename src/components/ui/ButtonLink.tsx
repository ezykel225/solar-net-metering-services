import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "light";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: "md" | "sm";
  block?: boolean;
};

/** A Next.js <Link> styled as a button. Use for navigation CTAs. */
export function ButtonLink({ variant = "primary", size = "md", block, className, ...props }: ButtonLinkProps) {
  const classes = ["btn", `btn--${variant}`, size === "sm" && "btn--sm", block && "btn--block", className]
    .filter(Boolean)
    .join(" ");
  return <Link className={classes} {...props} />;
}
