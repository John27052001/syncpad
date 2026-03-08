'use client';

import * as React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/ui/IconButton';

export interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichEditor({ value, onChange, placeholder, className }: RichEditorProps) {
  const lastExternalValue = React.useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing…',
      }),
      CharacterCount,
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'tiptap outline-none',
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      lastExternalValue.current = html;
      onChange(html);
    },
    immediatelyRender: false,
  });

  React.useEffect(() => {
    if (!editor) return;
    if (value === lastExternalValue.current) return;
    lastExternalValue.current = value;
    editor.commands.setContent(value || '<p></p>', false);
  }, [value, editor]);

  if (!editor) return null;

  const cmd = editor.chain().focus();

  return (
    <div className={cn('rounded-2xl border border-surface-border bg-white/5', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-surface-border px-3 py-2">
        <IconButton
          label="Bold"
          className={editor.isActive('bold') ? 'bg-white/10' : undefined}
          onClick={() => cmd.toggleBold().run()}
          type="button"
        >
          <span className="text-sm font-semibold">B</span>
        </IconButton>
        <IconButton
          label="Italic"
          className={editor.isActive('italic') ? 'bg-white/10' : undefined}
          onClick={() => cmd.toggleItalic().run()}
          type="button"
        >
          <span className="text-sm italic">I</span>
        </IconButton>
        <IconButton
          label="Heading 1"
          className={editor.isActive('heading', { level: 1 }) ? 'bg-white/10' : undefined}
          onClick={() => cmd.toggleHeading({ level: 1 }).run()}
          type="button"
        >
          <span className="text-xs font-semibold">H1</span>
        </IconButton>
        <IconButton
          label="Heading 2"
          className={editor.isActive('heading', { level: 2 }) ? 'bg-white/10' : undefined}
          onClick={() => cmd.toggleHeading({ level: 2 }).run()}
          type="button"
        >
          <span className="text-xs font-semibold">H2</span>
        </IconButton>
        <IconButton
          label="Bullet list"
          className={editor.isActive('bulletList') ? 'bg-white/10' : undefined}
          onClick={() => cmd.toggleBulletList().run()}
          type="button"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6h12M9 12h12M9 18h12M5 6h.01M5 12h.01M5 18h.01" />
          </svg>
        </IconButton>
        <IconButton
          label="Numbered list"
          className={editor.isActive('orderedList') ? 'bg-white/10' : undefined}
          onClick={() => cmd.toggleOrderedList().run()}
          type="button"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h11M10 12h11M10 18h11M4 6h1v4H4m0 2h2m-2 4h1v4H4" />
          </svg>
        </IconButton>
        <IconButton
          label="Quote"
          className={editor.isActive('blockquote') ? 'bg-white/10' : undefined}
          onClick={() => cmd.toggleBlockquote().run()}
          type="button"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17h4V7H5v6h2v4zm10 0h4V7h-6v6h2v4z" />
          </svg>
        </IconButton>
        <div className="mx-1 h-5 w-px bg-surface-border" />
        <IconButton label="Undo" onClick={() => editor.commands.undo()} type="button">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v6h6M21 17a9 9 0 00-9-9H9" />
          </svg>
        </IconButton>
        <IconButton label="Redo" onClick={() => editor.commands.redo()} type="button">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 7v6h-6M3 17a9 9 0 019-9h3" />
          </svg>
        </IconButton>

        <div className="ml-auto flex items-center gap-2 text-xs text-white/50">
          <span>{editor.storage.characterCount.words()} words</span>
          <span className="text-white/30">·</span>
          <span>{editor.storage.characterCount.characters()} chars</span>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

