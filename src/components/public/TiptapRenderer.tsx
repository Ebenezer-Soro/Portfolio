import { Fragment } from "react";

type Mark = { type: string; attrs?: Record<string, unknown> };
type Node = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: Node[];
  text?: string;
  marks?: Mark[];
};

function renderText(node: Node, key: number) {
  let el: React.ReactNode = node.text;
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") el = <strong key={key}>{el}</strong>;
    else if (mark.type === "italic") el = <em key={key}>{el}</em>;
    else if (mark.type === "code")
      el = (
        <code key={key} className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-sm">
          {el}
        </code>
      );
    else if (mark.type === "link")
      el = (
        <a
          key={key}
          href={String(mark.attrs?.href ?? "#")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          {el}
        </a>
      );
  }
  return <Fragment key={key}>{el}</Fragment>;
}

function renderNode(node: Node, key: number): React.ReactNode {
  const children = node.content?.map((c, i) => renderNode(c, i));

  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="my-4 leading-relaxed text-[var(--text-secondary)]">
          {children}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const Tag = (`h${Math.min(Math.max(level, 1), 6)}`) as keyof React.JSX.IntrinsicElements;
      return (
        <Tag key={key} className="mt-8 mb-3 font-display font-bold text-[var(--text-primary)]">
          {children}
        </Tag>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="my-4 list-disc space-y-1 pl-6 text-[var(--text-secondary)]">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="my-4 list-decimal space-y-1 pl-6 text-[var(--text-secondary)]">
          {children}
        </ol>
      );
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="my-4 border-l-4 border-primary pl-4 italic text-[var(--text-secondary)]"
        >
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre
          key={key}
          className="my-4 overflow-x-auto rounded-lg bg-[var(--slate-900)] p-4 font-mono text-sm text-slate-100"
        >
          <code>{children}</code>
        </pre>
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          src={String(node.attrs?.src ?? "")}
          alt={String(node.attrs?.alt ?? "")}
          className="my-6 w-full rounded-xl"
        />
      );
    case "hardBreak":
      return <br key={key} />;
    case "text":
      return renderText(node, key);
    default:
      return children ? <Fragment key={key}>{children}</Fragment> : null;
  }
}

export function TiptapRenderer({ content }: { content: string | null | undefined }) {
  if (!content) return null;
  let doc: Node;
  try {
    doc = JSON.parse(content);
  } catch {
    // Texte brut de secours
    return <p className="my-4 leading-relaxed text-[var(--text-secondary)]">{content}</p>;
  }
  return (
    <div className="prose-content">
      {doc.content?.map((node, i) => renderNode(node, i))}
    </div>
  );
}
