import { useState } from "react";
import { InputProps } from "./input.types";
import { inputStyles } from "./input.styles";

export const Input = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  icon: Icon,
  type = "text",
  variant = "floating",
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const isActive = value.length > 0 || isFocused;

  const inputStyle = {
    ...inputStyles.input,
    ...(Icon ? inputStyles.inputWithIcon : {}),
    ...(isFocused ? inputStyles.focus : {}),
    ...(error ? inputStyles.error : {}),
    ...(success ? inputStyles.success : {}),
  };

  if (variant === "stacked") {
    return (
      <div style={inputStyles.container}>
        {label && (
          <label style={inputStyles.stackedLabel}>{label}</label>
        )}

        <div style={{ position: "relative" }}>
          {Icon && <Icon size={16} style={inputStyles.icon} />}

          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={inputStyle}
          />
        </div>

        {error && (
          <span style={inputStyles.errorText}>{error}</span>
        )}
      </div>
    );
  }

  return (
    <div style={inputStyles.container}>
      {label && (
        <label
          style={{
            ...inputStyles.floatingLabel,
            ...(isActive ? inputStyles.floatingLabelActive : {}),
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: "relative" }}>
        {Icon && <Icon size={16} style={inputStyles.icon} />}

        <input
          type={type}
          placeholder={isActive ? placeholder : ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyle}
        />
      </div>

      {error && <span style={inputStyles.errorText}>{error}</span>}
    </div>
  );
};
