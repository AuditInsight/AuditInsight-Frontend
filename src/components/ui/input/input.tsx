import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  // Password fields get an eye button to show/hide what was typed.
  const passwordToggle = isPassword ? (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      style={inputStyles.passwordToggle}
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  ) : null;

  const isActive = value.length > 0 || isFocused;

  const inputStyle = {
    ...inputStyles.input,
    ...(Icon ? inputStyles.inputWithIcon : {}),
    ...(isFocused ? inputStyles.focus : {}),
    ...(error ? inputStyles.error : {}),
    ...(success ? inputStyles.success : {}),
    ...(isPassword ? inputStyles.inputWithToggle : {}),
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
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={inputStyle}
          />
          {passwordToggle}
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
          type={inputType}
          placeholder={isActive ? placeholder : ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyle}
        />
        {passwordToggle}
      </div>

      {error && <span style={inputStyles.errorText}>{error}</span>}
    </div>
  );
};


