import Link from "next/link";

export function EmptyState({
  eyebrow = "Pronto para começar",
  title,
  description,
  action,
  href,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="emptyState emptyStateRich">
      <div className="emptyMark">✦</div>
      <div className="eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && href && <Link className="btn primary" href={href}>{action}</Link>}
    </div>
  );
}
