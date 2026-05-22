"use client";

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleSwitch({
  checked,
  onChange,
}: Props) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        ...styles.switch,
        background: checked ? "#1e3a8a" : "#e5e7eb",
      }}
    >
      <div
        style={{
          ...styles.circle,
          transform: checked
            ? "translateX(18px)"
            : "translateX(2px)",
        }}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  switch: {
    width: 40,
    height: 22,
    borderRadius: 999,
    padding: 2,
    cursor: "pointer",
    transition: "0.2s",
    position: "relative",
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    transition: "0.2s",
  },
};