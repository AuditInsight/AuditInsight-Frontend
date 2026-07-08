import { theme } from "@/styles/theme"

interface CardHeaderProps {
  title: string
  action?: React.ReactNode
}

export function CardHeader({ title, action }: CardHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing.md,
      }}
    >
      <h3
        style={{
          fontSize: theme.typography.lg,
          fontWeight: 600,
          color: theme.colors.textPrimary,
        }}
      >
        {title}
      </h3>

      {action}
    </div>
  )
}


