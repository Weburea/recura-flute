"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, ExternalLink } from "lucide-react"

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { name: "Support", href: "/dashboard/help" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Documentation", href: "/dashboard/documentation" },
  ]

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ]

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-gradient-to-r dark:from-[#0D0518] dark:via-[#150a2e] dark:to-[#0D0518] backdrop-blur-sm py-5 px-4 md:px-10 transition-colors">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left side: Logo & Brand */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center">
              <div className="relative w-12 h-8">
                <Image 
                  src="https://res.cloudinary.com/weburea/image/upload/v1783571840/logo_plan.svg" 
                  alt="Recura Logo" 
                  fill
                  className="object-contain dark:brightness-110"
                  priority
                />
              </div>
            </Link>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block mx-1" />
            <span className="text-primary dark:text-purple-400 font-bold text-sm tracking-tight whitespace-nowrap">Dashboard v1.0</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            © {currentYear} Weburea. All rights reserved.
          </p>
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-purple-400 transition-colors text-sm font-bold flex items-center gap-1 group"
            >
              {link.name}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Right side: Socials */}
        <div className="flex items-center gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <Link
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary/5 dark:hover:bg-purple-500/10 hover:text-primary dark:hover:text-purple-400 transition-all duration-300"
                aria-label={social.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
