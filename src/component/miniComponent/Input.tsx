import { type FC } from "react";

interface Props {
  label?: string;
  type: "INPUT" | "TEXTAREA" | "IMAGE";
  variant: "FILLED" | "OUTLINED" | "ROUNDED" | "TRANSPARENT";
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
  opacity?: boolean;
  description?: string;
  fontSize?: "sm" | "xs" | "lg" | "xl" | "2xl" | "3xl";
}

const Input: FC<Props> = ({
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
  description,
  fontSize = "sm",
  opacity = false,
}) => {
  return (
    <div className="my-3">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-gray-500 dark:text-text-primary md:text-base"
        >
          {label} {required && <span className="text-[#dc2626]">*</span>}
        </label>
      )}

      {description && (
        <p className="mb-2 text-sm text-gray-500 dark:text-text-primary">
          {description}
        </p>
      )}

      {type === "INPUT" ? (
        <input
          id={name}
          type={input_type}
          className={`text-${fontSize} ${fontSize === "xl" || fontSize === "2xl"
            ? "font-semibold"
            : fontSize === "3xl"
              ? "font-bold"
              : "font-normal"
            } ${variant === "FILLED"
              ? "input-filled"
              : variant === "ROUNDED"
                ? "input-primary"
                : variant === "TRANSPARENT"
                  ? "mb-4 w-full bg-transparent py-2 text-gray-700 outline-none dark:text-text-secondary"
                  : "input-outline"
            } w-full ${opacity ? "input-with-opacity" : ""}`}
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
            className={`text-${fontSize} ${fontSize === "xl" || fontSize === "2xl"
              ? "font-semibold"
              : fontSize === "3xl"
                ? "font-bold"
                : "font-medium"
              } ${variant === "FILLED"
                ? "input-filled"
                : variant === "ROUNDED"
                  ? "input-primary"
                  : variant === "TRANSPARENT"
                    ? "mb-4 w-full bg-transparent py-2 text-gray-700 outline-none dark:text-text-secondary"
                    : "input-outline"
              } min-h-[15rem]`}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            autoComplete="off"
            name={name}
            maxLength={max}
            id={name}
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
