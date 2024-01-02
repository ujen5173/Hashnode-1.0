import { Editor as Ed } from "@tiptap/core";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useLayoutEffect, useState, type FC } from "react";
import { useDebouncedCallback } from "use-debounce";
import { type DefaultEditorContent } from "~/types";
import { ArticleData } from "../macroComponent/New/NewArticleBody";
import { EditorBubbleMenu } from "./components";
import { TiptapExtensions } from "./extensions";
import { TiptapEditorProps } from "./props";

const Editor: FC<{
  minHeight?: string;
  data: ArticleData;
  editData?: boolean;
  setData: React.Dispatch<React.SetStateAction<ArticleData>>;
}> = ({ minHeight = "min-h-[500px]", editData = false, data, setData }) => {

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
      debouncedUpdates(e)
    },
    autofocus: "end",
  });

  const debouncedUpdates = useDebouncedCallback(({ editor }: { editor: Ed }) => {
    const json = editor.getJSON() as DefaultEditorContent;
    setData(prev => ({ ...prev, content: json }));
  }, 750);


  useEffect(() => {
    const editArticle = window.location.pathname.includes("edit");
    if (editor) {
      editor.commands.setContent(data.content);
      if (editArticle) {
      }
      if (!hydrated) {
        setHydrated(true);
      }
    }
  }, [editor, hydrated, editData]);

  useLayoutEffect(() => {
    setHydrated(false);
  }, [editData]);

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