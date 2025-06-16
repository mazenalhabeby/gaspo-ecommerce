import {logo, notFoundBg} from "@/assets"
import {NProgressLink} from "@/components/NProgressLink"
import {useTranslations} from "next-intl"
import Image from "next/image"
import React from "react"

export default function NotFound() {
  const t = useTranslations()
  return (
    <main className="relative bg-black min-h-screen">
      <Image
        src={notFoundBg}
        width={500}
        height={300}
        alt="not found bg"
        className="absolute inset-0 object-cover w-screen h-screen opacity-30"
      />
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 min-h-screen text-white">
        <Image
          src={logo}
          alt="GASPO Logo"
          width={200}
          height={250}
          className="grayscale"
        />
        <h1 className="text-4xl font-bold text-center">
          404 - {t("notFound.title")}
        </h1>
        <p className="text-center">{t("notFound.description")}</p>
        <p className="text-center">
          You can go back to the{" "}
          <NProgressLink href="/" className=" text-red-500 underline">
            {t("notFound.home")}
          </NProgressLink>
          .
        </p>
      </div>
    </main>
  )
}
