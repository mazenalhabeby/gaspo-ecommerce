"use client"

import React from "react"
import {NavbarLink, NavbarLinks} from "../data"
import {useTranslations} from "next-intl"
import {Button} from "@/components/ui/button"
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
import {NProgressLink} from "../NProgressLink"

const Navlinks = () => {
  const t = useTranslations()

  return (
    <div className="hidden lg:flex flex-1 flex-row items-center justify-around max-w-7xl">
      {NavbarLinks.map((link: NavbarLink, i: number) =>
        link.href.startsWith("/") ? (
          <NProgressLink
            key={i}
            href={link.href}
            className="hidden lg:inline-block sculpted-text sculpted-text-focus uppercase cursor-pointer"
          >
            {t(link.name)}
          </NProgressLink>
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
            {NavbarLinks.map((link: NavbarLink, i: number) =>
              link.href.startsWith("/") ? (
                <NProgressLink
                  key={i}
                  href={link.href}
                  className="text-xl w-full text-center py-4 cursor-pointer sculpted-text sculpted-text-focus"
                >
                  {t(link.name)}
                </NProgressLink>
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
