import { type Editor } from "@tiptap/core";
import {
  useEffect,
  useRef,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";

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
          className={`text-slate-900 underline underline-offset-4 dark:text-slate-200 ${
            editor?.isActive("link") ? "text-blue-500" : ""
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
          className="animate-in fade-in slide-in-from-top-1 fixed top-full z-[99999] mt-1 flex min-w-60 overflow-hidden rounded border border-border-light bg-white p-1 shadow-xl dark:border-border dark:bg-slate-700"
        >
          <input
            ref={inputRef}
            type="url"
            placeholder="Paste a link"
            className="flex-1 bg-transparent p-1 text-sm text-slate-800 outline-none dark:text-slate-200"
            defaultValue={
              (editor?.getAttributes("link").href as string | undefined) ?? ""
            }
          />
          {editor?.getAttributes("link").href ? (
            <div className="flex items-center gap-2">
              <button
                className="rounded-md bg-blue-600 px-3 py-1 font-semibold text-white outline-none"
                type="submit"
              >
                Update
              </button>
              <button
                type="button"
                className="rounded-md bg-red px-3 py-1 font-semibold text-white outline-none"
                onClick={() => {
                  editor?.chain().focus().unsetLink().run();
                  setIsOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-1 font-semibold text-white outline-none"
            >
              Add
            </button>
          )}
        </form>
      )}
    </div>
  );
};
