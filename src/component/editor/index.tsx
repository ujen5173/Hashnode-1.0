import { Editor as Ed } from "@tiptap/core";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState, type FC } from "react";
import { useDebouncedCallback } from "use-debounce";
import useLocalStorage from "~/hooks/useLocalStorage";
import { type DefaultEditorContent } from "~/types";
import { EditorBubbleMenu } from "./components";
import { TiptapExtensions } from "./extensions";
import { TiptapEditorProps } from "./props";

const Editor: FC<{
  minHeight?: string;
  contentName?: string;
  defaultContent?: DefaultEditorContent | null;
  setSavedState: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ minHeight = "min-h-[500px]", defaultContent, contentName = "content", setSavedState }) => {
  const [content, setContent] = useLocalStorage<DefaultEditorContent>(
    "content",
    defaultContent || {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "",
            },
          ],
        },
      ],
    }
  );

  const [hydrated, setHydrated] = useState(false);

  const editor = useEditor({
    extensions: [
      ...TiptapExtensions,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level as string}`;
          }
          return "Press '/' for commands";
        },
        includeChildren: true,
      }),
    ],
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      setSavedState(false);
      debouncedUpdates(e)
    },
    autofocus: "end",
  });

  const debouncedUpdates = useDebouncedCallback(({ editor }: { editor: Ed }) => {
    const json = editor.getJSON() as DefaultEditorContent;
    setSavedState(false);
    setContent(json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSavedState(true);
    }, 500);
  }, 750);

  useEffect(() => {
    const editArticle = window.location.pathname.includes("edit");
    if (editArticle) {
      if (editor && defaultContent && content && !hydrated) {
        editor.commands.setContent(defaultContent);
        setHydrated(true);
      }
    } else {
      if (editor && content && !hydrated) {
        editor.commands.setContent(content);
        setHydrated(true);
      }
    }
  }, [editor, content, hydrated, defaultContent]);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className={`relative select-none w-full max-w-screen-lg bg-transparent ${minHeight}`}
    >
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}


export default Editor;