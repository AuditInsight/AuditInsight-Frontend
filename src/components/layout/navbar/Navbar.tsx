"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Solutions", href: "/solutions" },
    { name: "Projects", href: "/projects" },
    { name: "Catalog", href: "/catalog" },
    { name: "Buy Online", href: "/shop" },
    { name: "Media", href: "/media" },
    { name: "Quote", href: "/request-quote" },
  ];

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* 🔴 Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          BlueShield
        </Link>

        {/* 🧭 Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-primary transition">
              {link.name}
            </Link>
          ))}
        </div>

        {/* 📞 Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+250XXXXXXXXX"
            className="border border-primary text-primary px-4 py-2 rounded-lg text-sm"
          >
            Call
          </a>

          <a
            href="https://wa.me/250XXXXXXXXX"
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            WhatsApp
          </a>
        </div>

        {/* 🍔 Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-4 shadow">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <a
            href="tel:+250XXXXXXXXX"
            className="block border border-primary text-primary px-4 py-2 rounded-lg text-center"
          >
            Call
          </a>

          <a
            href="https://wa.me/250XXXXXXXXX"
            className="block bg-green-500 text-white px-4 py-2 rounded-lg text-center"
          >
            WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}


