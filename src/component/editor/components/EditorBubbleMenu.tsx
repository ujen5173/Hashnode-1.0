import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Sparkles,
  Strikethrough,
} from "lucide-react";
import React, { FC, useCallback, useEffect, useState } from "react";
import { model } from "~/utils/contentGenerator";
import { LinkSelector } from "./link-selector";

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: React.ReactNode;
}

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const [showAskAIModal, setShowAskAIModal] = useState(false);
  const handleChange = useCallback(() => {
    setShowAskAIModal(false);
  }, []);

  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
  const [askAICommand, setAskAICommand] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (askAICommand && props.editor) {
        const { view, state } = props.editor;
        const { from, to } = view.state.selection;
        const text = state.doc.textBetween(from, to, '');

        console.log({ text })
        const prompt = "You are an AI writing assistant." +
          "Convert the content according to the follow command" +
          "'''Command: " + askAICommand + "'''" +
          "The content is: " + text;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const rixResponse = response.text();

        props.editor?.chain().focus().deleteRange({ from, to }).insertContentAt(from, rixResponse).run();

        setAskAICommand(null);
      }
    })()
  }, [askAICommand]);

  const items: BubbleMenuItem[] = [
    {
      name: "rixAi",
      isActive: () => false,
      command: () => {
        setShowAskAIModal(true);
      },
      icon: <Sparkles size={18} />,
    },
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
        props.editor
          ?.chain()
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
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        setIsLinkSelectorOpen(false);
      },
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className={`z-30 flex w-fit select-none divide-x divide-border-light rounded border border-border-light bg-light-bg shadow-md dark:divide-border dark:border-border dark:bg-primary-light`}
    >
      <div className="relative flex">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.command();
              if (item.name === "rixAi") {
                setShowAskAIModal(true);
              }
            }}
            className="p-2 text-gray-700 hover:bg-gray-200 active:bg-gray-200 dark:text-text-secondary dark:hover:bg-border dark:active:bg-border"
          >
            {item.icon}
          </button>
        ))}
        {showAskAIModal && (
          <div className="absolute left-0 top-full mt-2">
            <AskAIModal
              setAskAICommand={setAskAICommand}
              handleChange={handleChange}
            />
          </div>
        )}
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


const AskAIModal = ({ setAskAICommand, handleChange }: {
  setAskAICommand: React.Dispatch<React.SetStateAction<string | null>>;
  handleChange: () => void;
}) => {
  return (
    <div className="w-96 rounded-md border border-slate-300 bg-white p-4 text-left">
      <div className="flex flex-col gap-4">
        <ul>
          <h1 className="mb-4 text-xl font-semibold">Suggestions</h1>
          <li onClick={() => {
            handleChange();
            setAskAICommand("Improve Writing");
          }} className="px-4 py-3 cursor-pointer rounded-md text-lg font-medium hover:bg-slate-100">
            Improve Writing
          </li>
          <li onClick={() => {
            handleChange();
            setAskAICommand("Rewrite as a single sentence");
          }} className="px-4 py-3 cursor-pointer rounded-md text-lg font-medium hover:bg-slate-100">
            Rewrite as a single sentence
          </li>
          <li onClick={() => {
            handleChange();
            setAskAICommand("Simplify language");
          }} className="px-4 py-3 cursor-pointer rounded-md text-lg font-medium hover:bg-slate-100">
            Simplify language
          </li>
          <li onClick={() => {
            handleChange();
            setAskAICommand("Write in friendy tone");
          }} className="px-4 py-3 cursor-pointer rounded-md text-lg font-medium hover:bg-slate-100">
            Write in friendy tone
          </li>
          <li onClick={() => {
            handleChange();
            setAskAICommand("Rewrite into a single paragraph");
          }} className="px-4 py-3 cursor-pointer rounded-md text-lg font-medium hover:bg-slate-100">
            Rewrite into a single paragraph
          </li>
          <li onClick={() => {
            handleChange();
            setAskAICommand("Fix spelling and grammar");
          }} className="px-4 py-3 cursor-pointer rounded-md text-lg font-medium hover:bg-slate-100">
            Fix spelling and grammar
          </li>
        </ul>
      </div>
    </div>
  );
};
