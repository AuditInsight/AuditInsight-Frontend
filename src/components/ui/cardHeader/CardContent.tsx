import { ReactNode } from "react"

interface CardContentProps {
  children: ReactNode
}

export function CardContent({ children }: CardContentProps) {
  return <div>{children}</div>
}


