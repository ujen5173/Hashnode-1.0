import { type FC } from "react";

interface InputTypes {
  label: string;
  type: "INPUT" | "TEXTAREA" | "IMAGE";
  variant: "FILLED" | "OUTLINED" | "ROUNDED";
  placeholder: string;
  input_type: "email" | "text" | "password" | "image";
  disabled?: boolean;
  required?: boolean;
  value: string;
  name: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  pattern?: string | undefined;
  max?: number | undefined;
  autoFocus?: boolean;
}

const Input: FC<InputTypes> = ({
  label,
  type,
  variant,
  placeholder,
  input_type,
  disabled = false,
  required = true,
  value,
  name,
  onChange,
  pattern = undefined,
  max = undefined,
  autoFocus = false,
}) => {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-normal text-gray-700 dark:text-text-secondary">
        {label}
      </label>
      {type === "INPUT" ? (
        <input
          type={input_type}
          className={`text-sm ${
            variant === "FILLED"
              ? "input-filled"
              : variant === "ROUNDED"
              ? "input-primary"
              : "input-outline"
          }`}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete="off"
          name={name}
          pattern={pattern}
          autoFocus={autoFocus}
          value={value}
          max={max}
          onChange={onChange}
        />
      ) : type === "TEXTAREA" ? (
        <>
          <textarea
            className={`min-h-[10.4rem] ${
              variant === "FILLED"
                ? "input-filled"
                : variant === "ROUNDED"
                ? "input-primary"
                : "input-outline"
            }`}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            autoComplete="off"
            name={name}
            maxLength={max}
            value={value}
            onChange={onChange}
          />
          {max && (
            <span
              className={`text-sm font-medium text-gray-500 dark:text-text-primary`}
            >
              {max - value.length} / {max}
            </span>
          )}
        </>
      ) : (
        <div className="h-24 w-24 rounded-full border border-border-light bg-light-bg dark:border-border dark:bg-primary-light"></div>
      )}
    </div>
  );
};

export default Input;
