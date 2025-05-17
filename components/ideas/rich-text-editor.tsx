"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code, Palette, X } from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Escreva sua ideia aqui...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[150px] p-3 focus:outline-none rounded-md border border-input bg-background w-full',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return <div>Loading editor...</div>
  }

  const handleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run()
        break
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case 'code':
        editor.chain().focus().toggleCodeBlock().run()
        break
      default:
        break
    }
  }

  return (
    <div className="border rounded-md bg-background">
      <div className="flex p-2 gap-1 flex-wrap border-b bg-muted/40 items-center">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('bold')}
          className={`h-8 w-8 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('italic')}
          className={`h-8 w-8 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('h1')}
          className={`h-8 w-8 ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('h2')}
          className={`h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('bulletList')}
          className={`h-8 w-8 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('orderedList')}
          className={`h-8 w-8 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('code')}
          className={`h-8 w-8 ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="relative h-8 w-8 flex items-center justify-center" title="Text Color">
          <Palette className={`h-4 w-4 absolute pointer-events-none ${editor.getAttributes('textStyle').color ? 'text-[color:var(--current-color)]' : ''}`} style={{ '--current-color': editor.getAttributes('textStyle').color } as React.CSSProperties} />
          <input
            type="color"
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => editor.chain().focus().setColor(event.target.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
        </div>
        
        {editor.getAttributes('textStyle').color && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="h-8 w-8"
            title="Clear Color"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
} 