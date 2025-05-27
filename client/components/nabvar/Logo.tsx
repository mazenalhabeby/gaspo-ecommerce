import Image from "next/image"
import React from "react"
import {logo} from "@/assets"
import {useTranslations} from "next-intl"

interface LogoProps {
  width?: string
  textColor?: string
  withText?: boolean
}
const Logo: React.FC<LogoProps> = ({
  width = "w-24",
  textColor = "text-white",
  withText = true,
}) => {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center w-max">
      <Image src={logo} alt="Logo" width={98} priority className={`${width}`} />
      {withText && (
        <span
          className={`text-xs uppercase tracking-wider font-semibold ${textColor}`}
        >
          {t("common.since")}
        </span>
      )}
    </div>
  )
}

export default Logo
