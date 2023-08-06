import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import { InputRule } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { lowlight } from 'lowlight';
import CodeBlock from "../CodeBlock";
import SlashCommand from "./slash-command";

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)
lowlight.registerLanguage('python', python);

export const TiptapExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 -mt-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside leading-3 -mt-2",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal -mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 px-2 border-border-light dark:border-border",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          "rounded-sm bg-gray-300 dark:bg-primary-light p-5 font-mono font-medium text-gray-700 dark:text-text-secondary",
      },
    },
    heading: {
      HTMLAttributes: {
        class: "font-bold text-2xl text-gray-700 dark:text-text-secondary",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "rounded-md bg-gray-300 dark:bg-primary-light px-1.5 py-1 font-mono font-medium text-gray-700 dark:text-text-secondary",
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
  }),
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            const end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end)
            );
          },
        }),
      ];
    },
  }).configure({
    HTMLAttributes: {
      class: "mt-4 mb-6 border-t border-border-light dark:border-border",
    },
  }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlock)
    }
  }).configure({
    lowlight,
    // defaultLanguage: "plaintext",
  }),
  TiptapLink.configure({
    openOnClick: false,
    HTMLAttributes: {
      class:
        "text-text-primary dark:text-text-secondary underline underline-offset-[3px] hover:text-secondary transition-colors cursor-pointer",
    },
  }),
  SlashCommand,
  Highlight.configure({
    multicolor: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
  }),
];
