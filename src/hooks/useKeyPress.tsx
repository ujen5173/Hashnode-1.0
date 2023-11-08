import { useEffect } from "react";

type Callback = () => void;

const useKeyPress = (callback: Callback): void => {
  useEffect(() => {
    let isTyping = false;

    const handleKeyPress = (event: KeyboardEvent): void => {
      const { tagName } = event.target as HTMLElement;
      const isTypingArea =
        tagName === "INPUT" ||
        tagName === "SELECT" ||
        tagName === "TEXTAREA" ||
        (event.target instanceof HTMLInputElement &&
          (event.target.type === "text" || event.target.type === "password"));

      if (isTypingArea) {
        isTyping = true;
      } else {
        const isCtrlK = event.key === "k" && (event.ctrlKey || event.metaKey);

        if (!isTyping && isCtrlK) {
          event.preventDefault();
          callback();
        }
      }
    };

    const handleBlur = (): void => {
      isTyping = false;
    };

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("blur", handleBlur);
    };
  }, [callback]);
};

export default useKeyPress;
