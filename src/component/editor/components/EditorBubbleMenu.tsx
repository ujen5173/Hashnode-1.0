
import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import React, { FC, useState } from "react"; 
import { LinkSelector } from "./link-selector";
import { Bold, Code, Heading1, Heading2, Heading3, Highlighter, Italic, Strikethrough } from "lucide-react";
import Strike from "@tiptap/extension-strike";
import { Highlight } from "@mantine/core";

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: React.ReactNode;
}

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: "heading 1",
      isActive: () => props.editor.isActive("heading1"),
      command: () =>
        props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: <Heading1 />,
    },
    {
      name: "heading 1",
      isActive: () => props.editor.isActive("heading2"),
      command: () =>
        props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: <Heading2 />,
    },
    {
      name: "heading 1",
      isActive: () => props.editor.isActive("heading3"),
      command: () =>
        props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: <Heading3 />,
    },
    {
      name: "bold",
      isActive: () => props.editor.isActive("bold"),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: <Bold />,
    },
    {
      name: "italic",
      isActive: () => props.editor.isActive("italic"),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: <Italic />,
    },
    {
      name: "strike",
      isActive: () => props.editor.isActive("strike"),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: <Strikethrough />,
    },

    {
      name: "highlight",
      isActive: () => props.editor.isActive("highlight"),
      command: () =>
        props.editor
          .chain()
          .focus()
          .toggleHighlight({ color: "#FDE047" })
          .run(),
      icon: <Highlighter />,
    },
    {
      name: "code",
      isActive: () => props.editor.isActive("code"),
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: <Code />,
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      // don't show if image is selected
      if (editor.isActive("image")) {
        return false;
      }
      return editor.view.state.selection.content().size > 0;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        setIsLinkSelectorOpen(false);
      },
    },
  };

  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl"
    >
      <div className="flex">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.command}
            className="p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
          >
            {item.icon}
          </button>
        ))}
      </div>
      <LinkSelector
        editor={props.editor}
        isOpen={isLinkSelectorOpen}
        setIsOpen={() => {
          setIsLinkSelectorOpen(!isLinkSelectorOpen);
        }}
      />
    </BubbleMenu>
  );
};
