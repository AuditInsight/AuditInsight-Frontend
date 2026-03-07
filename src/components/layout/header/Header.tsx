import React from 'react';
import { headerStyles } from './header.styles';
import { HeaderProps } from './header.types';

const Header = ({ title }: HeaderProps) => {
  return (
    <div style={headerStyles.container}>
      <h1 style={headerStyles.title}>{title}</h1>

      <div style={headerStyles.rightSection}>
        <span>🔔</span>
        <span>👤</span>
      </div>
    </div>
  );
};

export default Header