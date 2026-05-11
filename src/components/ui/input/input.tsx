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
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const isActive = value.length > 0 || isFocused;

  return (
    <div style={inputStyles.container}>
      {/* =========================
          FLOATING LABEL
      ========================= */}
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

      {/* =========================
          INPUT WRAPPER (for icon positioning)
      ========================= */}
      <div style={{ position: "relative" }}>
        {/* ICON INPUT */}
        {Icon && (
          <Icon size={16} style={inputStyles.icon} />
        )}

        <input
          type={type}
          placeholder={isActive ? placeholder : ""} // hide placeholder when floating label is used
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...inputStyles.input,

            // icon spacing
            ...(Icon ? inputStyles.inputWithIcon : {}),

            // focus state
            ...(isFocused ? inputStyles.focus : {}),

            // error state
            ...(error ? inputStyles.error : {}),

            // success state
            ...(success ? inputStyles.success : {}),
          }}
        />
      </div>

      {/* =========================
          ERROR MESSAGE
      ========================= */}
      {error && (
        <span style={inputStyles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
};