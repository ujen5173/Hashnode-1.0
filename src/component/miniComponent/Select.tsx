import { useClickOutside } from "@mantine/hooks";
import { useEffect, useState, type FC } from "react";
import { Angledown } from "~/svgs";

interface SelectProps {
  status: boolean;
  selected: string;
  options: {
    label: string;
    value: string;
  }[];
}

interface Props {
  options: {
    label: string;
    value: string;
  }[];
  defaultText: string;
  onChange: (value: { label: string; value: string }) => void;
}

const Select: FC<Props> = ({ options, defaultText, onChange }) => {
  const [opened, setOpened] = useState(false);
  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);
  const [select, setSelect] = useState<SelectProps>({
    status: false,
    selected: defaultText,
    options,
  });

  useEffect(() => {
    setSelect((prev) => ({
      ...prev,
      selected: defaultText,
    }));
  }, [defaultText]);

  return (
    <div
      onClick={() => setOpened(!opened)}
      ref={setControl}
      className={`relative flex w-full min-w-[130px] cursor-pointer select-none items-center justify-between rounded-md border border-border-light bg-light-bg px-4 py-2 text-lg 
      text-gray-700 outline-none transition-[ring] duration-100 focus:bg-light-bg focus:ring-1 focus:ring-secondary dark:border-border dark:bg-transparent dark:text-text-primary 
      hover:dark:border-border dark:focus:bg-primary-light md:min-w-[180px]`}
    >
      <span className="text-base mb-[0!important]">{select.selected}</span>
      <Angledown className="h-5 mb-[0!important] w-5 fill-gray-700 dark:fill-text-primary" />

      {opened && (
        <div
          ref={setDropdown}
          className="absolute left-0 max-h-[300px] overflow-y-auto scroll-area top-full z-50 mt-2 w-56 rounded-md border border-border-light bg-gray-50 text-left shadow-md dark:border-border dark:bg-primary"
        >
          {select.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setSelect({
                  ...select,
                  selected: option.label,
                  status: false,
                });
                onChange(option);
                setOpened(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-text-primary dark:hover:bg-primary-light"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
