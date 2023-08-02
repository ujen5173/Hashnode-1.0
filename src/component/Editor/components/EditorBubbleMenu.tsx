import { BubbleMenu, type BubbleMenuProps } from "@tiptap/react";
import React, { useState, type FC } from "react";
import {
  Bold, Code, Heading1,
  Heading2,
  Heading3,
  Highlight, Italic,
  Strike
} from "~/svgs";
import { LinkSelector } from "./link-selector";

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: (isActive: boolean) => React.ReactNode;
}

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: "heading 1",
      isActive: () => props.editor.isActive("heading 1"),
      command: () =>
        props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: (isActive: boolean) => <Heading1 className={`w-4 h-4 fill-none ${isActive ? "stroke-secondary" : "stroke-gray-700 dark:stroke-text-secondary"}`} />,
    },
    {
      name: "heading 1",
      isActive: () => props.editor.isActive("heading 2"),
      command: () =>
        props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: (isActive: boolean) => <Heading2 className={`w-4 h-4 fill-none ${isActive ? "stroke-secondary" : "stroke-gray-700 dark:stroke-text-secondary"}`} />,
    },
    {
      name: "heading 1",
      isActive: () => props.editor.isActive("heading 3"),
      command: () =>
        props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: (isActive: boolean) => <Heading3 className={`w-4 h-4 fill-none ${isActive ? "stroke-secondary" : "stroke-gray-700 dark:stroke-text-secondary"}`} />,
    },
    {
      name: "bold",
      isActive: () => props.editor.isActive("bold"),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: (isActive: boolean) => <Bold className={`w-4 h-4 fill-none ${isActive ? "stroke-secondary" : "stroke-gray-700 dark:stroke-text-secondary"}`} />,
    },
    {
      name: "italic",
      isActive: () => props.editor.isActive("italic"),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: (isActive: boolean) => <Italic className={`w-4 h-4 fill-none ${isActive ? "stroke-secondary" : "stroke-gray-700 dark:stroke-text-secondary"}`} />,
    },
    {
      name: "strike",
      isActive: () => props.editor.isActive("strike"),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: (isActive: boolean) => <Strike className={`w-4 h-4 fill-none ${isActive ? "stroke-secondary" : "stroke-gray-700 dark:stroke-text-secondary"}`} />,
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
      icon: (isActive: boolean) => <Highlight className={`w-4 h-4 fill-none ${isActive ? "stroke-secondary" : "stroke-gray-700 dark:stroke-text-secondary"}`} />,
    },
    {
      name: "code",
      isActive: () => props.editor.isActive("code"),
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: (isActive: boolean) => <Code className={`w-4 h-4 fill-none ${isActive ? "stroke-secondary" : "stroke-gray-700 dark:stroke-text-secondary"}`} />,
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
            {
              item.icon(item.isActive())
            }
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
