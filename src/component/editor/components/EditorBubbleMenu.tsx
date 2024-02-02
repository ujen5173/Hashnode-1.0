
import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import { Bold, Code, Heading1, Heading2, Heading3, Highlighter, Italic, Strikethrough } from "lucide-react";
import React, { FC, useState } from "react";
import { LinkSelector } from "./link-selector";

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
      isActive: () => props.editor?.isActive("heading1") ?? false,
      command: () =>
        props.editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: <Heading1 size={18} />,
    },
    {
      name: "heading 1",
      isActive: () => props.editor?.isActive("heading2") ?? false,
      command: () =>
        props.editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: <Heading2 size={18} />,
    },
    {
      name: "heading 1",
      isActive: () => props.editor?.isActive("heading3") ?? false,
      command: () =>
        props.editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: <Heading3 size={18} />,
    },
    {
      name: "bold",
      isActive: () => props.editor?.isActive("bold") ?? false,
      command: () => props.editor?.chain().focus().toggleBold().run(),
      icon: <Bold size={18} />,
    },
    {
      name: "italic",
      isActive: () => props.editor?.isActive("italic") ?? false,
      command: () => props.editor?.chain().focus().toggleItalic().run(),
      icon: <Italic size={18} />,
    },
    {
      name: "strike",
      isActive: () => props.editor?.isActive("strike") ?? false,
      command: () => props.editor?.chain().focus().toggleStrike().run(),
      icon: <Strikethrough size={18} />,
    },

    {
      name: "highlight",
      isActive: () => props.editor?.isActive("highlight") ?? false,
      command: () =>
        props.editor?.chain()
          .focus()
          .toggleHighlight({ color: "#FDE047" })
          .run(),
      icon: <Highlighter size={18} />,
    },
    {
      name: "code",
      isActive: () => props.editor?.isActive("code") ?? false,
      command: () => props.editor?.chain().focus().toggleCode().run(),
      icon: <Code size={18} />,
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
      className="flex w-fit select-none divide-x divide-border-light dark:divide-border rounded border border-border-light dark:border-border bg-light-bg dark:bg-primary-light shadow-md"
    >
      <div className="flex">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.command}
            className="p-2 text-gray-700 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-border active:bg-gray-200 dark:active:bg-border"
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
