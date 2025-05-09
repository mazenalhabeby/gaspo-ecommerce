"use client"

import React from "react"
import {navbarLinks} from "./data"
import {useTranslations} from "next-intl"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {IoMdMenu} from "react-icons/io"
import {Link as ScrollLink} from "react-scroll"

const Navlinks = () => {
  const t = useTranslations()

  return (
    <div className="hidden lg:flex flex-1 flex-row items-center justify-around max-w-7xl">
      {navbarLinks.map((link, i) =>
        link.href.startsWith("/") ? (
          <Link
            key={i}
            href={link.href}
            className="hidden lg:inline-block sculpted-text sculpted-text-focus uppercase cursor-pointer"
          >
            {t(link.name)}
          </Link>
        ) : (
          <ScrollLink
            to={link.href}
            spy={true}
            smooth={true}
            duration={500}
            offset={-50}
            key={i}
            className="hidden lg:inline-block sculpted-text sculpted-text-focus uppercase cursor-pointer"
            activeClass="sculpted-text-active"
          >
            {t(link.name)}
          </ScrollLink>
        )
      )}
    </div>
  )
}

const NavLinksMobile = () => {
  const t = useTranslations()

  return (
    <div className="lg:hidden flex">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <IoMdMenu />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="z-[1000] bg-cover bg-center"
          style={{backgroundImage: "url('/images/woodBg.png')"}}
        >
          <SheetHeader>
            <SheetTitle>{t("navbar.mobile.welcomeTitle")}</SheetTitle>
            <SheetDescription className="text-slate-900">
              {t("navbar.mobile.welcomeDescription")}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col items-center justify-around h-full uppercase font-semibold tracking-wider">
            {navbarLinks.map((link, i) =>
              link.href.startsWith("/") ? (
                <Link
                  key={i}
                  href={link.href}
                  className="text-xl w-full text-center py-4 cursor-pointer sculpted-text sculpted-text-focus"
                >
                  {t(link.name)}
                </Link>
              ) : (
                <ScrollLink
                  key={i}
                  to={link.href}
                  smooth={true}
                  duration={500}
                  offset={-50}
                  activeClass="bg-red-500 text-white"
                  className="text-xl w-full text-center py-4 cursor-pointer sculpted-text sculpted-text-focus"
                >
                  {t(link.name)}
                </ScrollLink>
              )
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export {Navlinks, NavLinksMobile}
