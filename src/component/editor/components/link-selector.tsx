import { type Editor } from "@tiptap/core";
import { useEffect, useRef, type Dispatch, type FC, type SetStateAction } from "react";
import { Link as LinkSvg } from "~/svgs";

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LinkSelector: FC<LinkSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  return (
    <div className="relative">
      <button
        className="flex h-full items-center px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-border-light dark:hover:bg-border dark:text-text-primary bg-gray-200 dark:bg-primary-light"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <LinkSvg className="w-4 h-4 fill-none stroke-gray-700 dark:stroke-text-secondary" />
      </button>
      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement)
              .elements[0] as HTMLInputElement;
            editor.chain().focus().setLink({ href: input.value }).run();
            setIsOpen(false);
          }}
          className="fixed top-full z-[99999] mt-1 flex w-60 overflow-hidden rounded border border-border-light dark:border-border bg-gray-200 dark:bg-primary-light p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
        >
          <input
            ref={inputRef}
            type="url"
            placeholder="Paste a link"
            className="flex-1 bg-white p-1 text-sm outline-none"
            defaultValue={editor.getAttributes("link").href as string | undefined || ""}
          />
          {editor.getAttributes("link").href ? (
            <button
              className="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setIsOpen(false);
              }}
            >
              Delete
            </button>
          ) : (
            <button className="flex items-center rounded-sm p-1 text-gray-500 dark:text-text-primary transition-all hover:bg-border-light dark:hover:bg-border">
              Add
            </button>
          )}
        </form>
      )}
    </div>
  );
};
