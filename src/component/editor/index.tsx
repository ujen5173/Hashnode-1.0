import { Editor as Ed } from "@tiptap/core";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState, type FC } from "react";
import { useDebouncedCallback } from "use-debounce";
import { type DefaultEditorContent } from "~/types";
import { ArticleData } from "../macroComponent/New/NewArticleBody";
import { EditorBubbleMenu } from "./components";
import { TiptapExtensions } from "./extensions";
import { TiptapEditorProps } from "./props";

const Editor: FC<{
  minHeight?: string;
  data: ArticleData;
  setData: React.Dispatch<React.SetStateAction<ArticleData>>;
  contentRendered: boolean;
}> = ({
  minHeight = "min-h-[500px]",
  data,
  setData,
  contentRendered,
}) => {
    const [hydrated, setHydrated] = useState(false);

    const editor = useEditor({
      extensions: [
        ...TiptapExtensions,
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === "heading") {
              return `Heading ${node.attrs.level}`;
            }
            return "Press '/' for commands";
          },
          includeChildren: true,
        }),
      ],
      editorProps: TiptapEditorProps,
      onUpdate: (e) => {
        debouncedUpdates(e);
      },
      autofocus: "end",
    });

    const debouncedUpdates = useDebouncedCallback(
      ({ editor }: { editor: Ed }) => {
        const json = editor.getJSON() as DefaultEditorContent;
        setData((prev) => ({ ...prev, content: json }));
      },
      750
    );

    useEffect(() => {
      if (editor) {
        editor.commands.setContent(data.content);
        if (!hydrated) {
          setHydrated(true);
        }
      }
    }, [editor, hydrated, contentRendered]);

    return (
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className={`relative w-full max-w-screen-lg select-none bg-transparent ${minHeight}`}
      >
        {editor && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    );
  };

export default Editor;
