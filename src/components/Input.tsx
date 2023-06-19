import { type FC } from "react";

interface InputTypes {
  label: string;
  type: "INPUT" | "TEXTAREA" | "IMAGE";
  variant: "FILLED" | "OUTLINED" | "ROUNDED";
  placeholder: string;
  input_type: "email" | "text" | "password";
  disabled: boolean;
  required: boolean;
  value: string;
  name: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
          value={value}
          onChange={onChange}
        />
      ) : type === "TEXTAREA" ? (
        <textarea
          className={`min-h-[16.4rem] ${
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
          value={value}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
};

export default Input;
