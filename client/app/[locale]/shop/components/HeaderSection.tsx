import {useTranslations} from "next-intl"
import React from "react"

const HeaderSection = () => {
  const t = useTranslations()
  return (
    <section className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {t("shop.headerTitle")}
      </h1>
      <p className="text-gray-600 max-w-xl mx-auto text-sm">
        {t("shop.headerDescription")}
      </p>
    </section>
  )
}

export default HeaderSection
