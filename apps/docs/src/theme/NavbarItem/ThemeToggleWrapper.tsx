import React from 'react';
import ThemeToggle from './ThemeToggle';
import NavbarItem from '@theme/NavbarItem';

export default function ThemeToggleWrapper() {
  return (
    <NavbarItem
      className="navbar__item--theme-toggle"
      component={() => <ThemeToggle />}
    />
  );
}
