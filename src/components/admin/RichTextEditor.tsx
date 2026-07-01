"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Rédigez votre contenu…",
  label,
}: {
  value?: string | null;
  onChange: (json: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      ImageExt,
      Placeholder.configure({ placeholder }),
    ],
    content: parseContent(value),
    editorProps: {
      attributes: {
        class:
          "prose-content min-h-[200px] max-w-none rounded-b-lg bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(JSON.stringify(editor.getJSON())),
  });

  // Synchronise quand value change depuis l'extérieur (édition existante).
  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    if (value && value !== current) {
      editor.commands.setContent(parseContent(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    cn(
      "flex h-8 w-8 items-center justify-center rounded text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-primary",
      active && "bg-primary/10 text-primary",
    );

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>}
      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border)] bg-[var(--bg-secondary)] p-1.5">
          <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Gras">
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italique">
            <Italic className="h-4 w-4" />
          </button>
          <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Titre 2">
            <Heading2 className="h-4 w-4" />
          </button>
          <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Titre 3">
            <Heading3 className="h-4 w-4" />
          </button>
          <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Liste à puces">
            <List className="h-4 w-4" />
          </button>
          <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Liste numérotée">
            <ListOrdered className="h-4 w-4" />
          </button>
          <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Citation">
            <Quote className="h-4 w-4" />
          </button>
          <button type="button" className={btn(editor.isActive("codeBlock"))} onClick={() => editor.chain().focus().toggleCodeBlock().run()} aria-label="Bloc de code">
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={btn(editor.isActive("link"))}
            onClick={() => {
              const url = window.prompt("URL du lien");
              if (url) editor.chain().focus().setLink({ href: url }).run();
              else editor.chain().focus().unsetLink().run();
            }}
            aria-label="Lien"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <span className="mx-1 h-5 w-px bg-[var(--border)]" />
          <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()} aria-label="Annuler">
            <Undo className="h-4 w-4" />
          </button>
          <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()} aria-label="Rétablir">
            <Redo className="h-4 w-4" />
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function parseContent(value?: string | null) {
  if (!value) return "";
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
