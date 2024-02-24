import { Editor, Extension, Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { Code2, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Sparkles, Text } from "lucide-react";
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { toast } from "react-toastify";
import tippy from "tippy.js";
import { model } from "~/utils/contentGenerator";

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

const Command = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: "Text",
      description: "Just start typing with plain text.",
      searchTerms: ["p", "paragraph"],
      icon: <Text />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      searchTerms: ["title", "big", "large", "h1", "heading"],
      icon: <Heading1 />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      searchTerms: ["subtitle", "medium", "h2", "heading"],
      icon: <Heading2 />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      searchTerms: ["subtitle", "small", "h3", "heading"],
      icon: <Heading3 />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      searchTerms: ["unordered", "point", "list", "bullet"],
      icon: <List />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      searchTerms: ["ordered", "list", "number"],
      icon: <ListOrdered />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Quote",
      description: "Capture a quote.",
      searchTerms: ["blockquote", "quote"],
      icon: <Quote />,
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      title: "Code",
      description: "Capture a code snippet.",
      searchTerms: ["codeblock"],
      icon: <Code2 />,
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Rix: Generate Article Outline",
      description: "Use Rix AI to create a general article outline.",
      icon: <Sparkles />,
      command: async ({ editor, range }: CommandProps) => {
        const titleInput = document.querySelector(".article_title") as HTMLInputElement;

        if (!titleInput) {
          toast.error("Please add a title to the article before using this command.");
          return;
        }

        const title = titleInput.value;

        if (!title) {
          toast.error("Please add a title to the article before using this command.");
          return;
        }

        const prompt = "You are an AI writing assistant." +
          "Create a general article outline for a given topic: '" + title + "'. " +
          "Make your response interesting, fun, make sure to construct complete sentences. Don't add the title in the beginning of the response. Don't add quotation marks at the start and in the end of the response. " +
          "Use markdown to format your response. Use proper markdown to make the response more appealing. " +
          "Use the following markdown tags only: #, ##, ###, *, 1., >, ```. " +
          "Avoid using the following markdown tags: [], ![], |, ---, ---, <br>. "

        const result = await model.generateContent(prompt);
        const response = result.response;
        const rixResponse = response.text();

        editor.chain().focus().deleteRange(range).insertContentAt(range.from, rixResponse).run();
      },
    },
    {
      title: "Rix: Sumarize Article",
      description: "Use Rix AI to create a sumarize this article.",
      icon: <Sparkles />,
      command: async ({ editor, range }: CommandProps) => {
        const content = editor.getText().slice(0, -1);

        if (!content) {
          toast.error("Please add a content to the article before using this command.");
          return;
        }

        const prompt = "You are an AI writing assistant." +
          "Summarize the following content in simple and fun terms. Analysize the content carefully and summarize the whole content: '''" + content + "'''. " +
          "Make your response interesting, fun, make sure to construct complete sentences. Don't add the title in the beginnig of the response. Don't add quotation marks at the start and in the end of the response. " +
          "Use markdown to format your response. Use proper markdown to make the response more appeling. " +
          "Use the following markdown tags only: #, ##, ###, *, 1., >, ```. " +
          "Avoid using the following markdown tags: [], ![], |, ---, ---, <br>. " +
          "Add `# Conclusion of the article` at the beginning of the response. Don't over summarize the content. "

        const result = await model.generateContent(prompt);
        const response = result.response;
        const rixResponse = response.text();

        editor.chain().focus().deleteRange(range).insertContentAt(range.from, rixResponse).run();
      },
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({
  items,
  command,
  editor,
  range,
}: {
  items: CommandItemProps[];
  command: any;
  editor: any;
  range: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];

      if (item) {
        command(item);
      }
    },
    [command, editor, items]
  );

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      id="slash-command"
      ref={commandListContainer}
      className="z-50 h-auto max-h-[330px] w-72 scroll-area overflow-y-auto rounded-md border border-border-light dark:border-border bg-white dark:bg-primary-light py-2 shadow-md transition-all"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`border-b border-border-light dark:border-border last:border-0 flex w-full items-center space-x-3 px-3 py-4 text-left text-sm text-gray-700 dark:text-text-secondary hover:bg-border-light dark:hover:bg-border ${index === selectedIndex ? "bg-gray-200 dark:bg-border text-gray-700 dark:text-text-secondary" : ""
              }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border-light dark:border-border bg-white dark:bg-primary-light">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-text-primary">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default SlashCommand;
