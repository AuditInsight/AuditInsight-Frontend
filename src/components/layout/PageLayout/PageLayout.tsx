import React from 'react'
import { Sidebar } from '../sidebar/Sidebar'
import Header from '../header/Header'

type PageLayoutProps = {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div style={layoutStyles.container}>
      <Sidebar />

      <div style={layoutStyles.mainArea}>
        <Header title="Audit Insight" />

        <main style={layoutStyles.content}>
          {children}
        </main>

      </div>
    </div>
  )
}

const layoutStyles: {
  container: React.CSSProperties;
  mainArea: React.CSSProperties;
  content: React.CSSProperties;
} = {
  container: {
    display: 'flex',
    height: '100vh',
  },

  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  content: {
    padding: '24px',
    background: '#F3F5FA',
    flex: 1,
  }
}