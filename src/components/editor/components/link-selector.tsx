import { Editor } from "@tiptap/core";
import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";

interface LinkSelectorProps {
  editor: Editor | undefined;
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
        className="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <p className="text-base text-slate-900 dark:text-slate-200">↗</p>
        <p
          className={`underline text-slate-900 dark:text-slate-200 underline-offset-4 ${editor?.isActive("link") ? "text-blue-500" : ""
            }`}
        >
          Link
        </p>
      </button>
      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement)
              .elements[0] as HTMLInputElement;

            editor?.chain().focus().setLink({ href: input.value }).run();
            setIsOpen(false);
          }}
          className="fixed top-full z-[99999] mt-1 flex min-w-60 overflow-hidden rounded border border-border-light dark:border-border bg-white dark:bg-slate-700 p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
        >
          <input
            ref={inputRef}
            type="url"
            placeholder="Paste a link"
            className="flex-1 bg-transparent p-1 text-slate-800 dark:text-slate-200 text-sm outline-none"
            defaultValue={editor?.getAttributes("link").href || ""}
          />
          {editor?.getAttributes("link").href ? (
            <div className="flex gap-2 items-center">
              <button className="px-3 py-1 rounded-md bg-blue-600 text-white outline-none font-semibold"
                type="submit"
              >
                Update
              </button>
              <button type="button" className="px-3 py-1 rounded-md bg-red text-white outline-none font-semibold"
                onClick={() => {
                  editor?.chain().focus().unsetLink().run();
                  setIsOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <button type="submit" className="px-3 py-1 rounded-md bg-blue-600 text-white outline-none font-semibold">
              Add
            </button>
          )}
        </form>
      )
      }
    </div>
  );
};
