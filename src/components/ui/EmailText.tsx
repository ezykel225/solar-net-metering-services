/**
 * Renders an email address with an optional line-break point before "@",
 * so a long address wraps cleanly ("name" / "@domain") instead of mid-word.
 */
export function EmailText({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at <= 0) return <>{email}</>;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}
