"use client"

import React from "react"
import Logo from "./Logo"
import {navbarContact} from "./data"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import {useTranslations} from "next-intl"
import {Navlinks, NavLinksMobile} from "./Navlinks"

import {useEffect, useState} from "react"

const Navbar = () => {
  const t = useTranslations()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[101] transition-all duration-300 bg-slate-900/40 backdrop-blur-lg  ${
        scrolled ? "h-20 " : "h-28 "
      }`}
    >
      <div className="flex items-stretch h-full">
        <div
          className={`px-12 flex-shrink-0 transition-all duration-300 ${
            scrolled ? "scale-75" : "scale-100"
          } place-self-center`}
        >
          <Logo />
        </div>
        <div className="flex flex-col justify-end flex-1 h-full ">
          <div
            className={`hidden lg:flex flex-row items-center gap-4 justify-end w-full px-4 py-2 transition duration-300 text-white ${
              scrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
            }`}
          >
            {navbarContact.map((item, index) => (
              <div
                key={index}
                className="flex items-center tracking-wider gap-2"
              >
                <item.icon className="text-blue-400 text-2xl" />
                <div className="flex flex-col items-start text-sm font-semibold">
                  <span>{t(item.name)}</span>
                  <span className="opacity-80">{t(item.value)}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="lg:flex-1 flex min-h-[80%] lg:min-h-auto rounded-tl-4xl bg-cover bg-center items-center justify-around px-4 transition duration-300"
            style={{backgroundImage: "url('/images/woodBg.png')"}}
          >
            <Navlinks />
            <LanguageSwitcher />
            <NavLinksMobile />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
