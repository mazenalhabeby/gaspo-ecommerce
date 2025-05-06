import Image from "next/image"
import React from "react"
import {logo} from "@/assets/images"
import {useTranslations} from "next-intl"
const Logo = () => {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center w-max">
      <Image src={logo} alt="Logo" width={98} priority />
      <span className="text-xs uppercase tracking-wider font-semibold text-white">
        {t("common.since")}
      </span>
    </div>
  )
}

export default Logo
