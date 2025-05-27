import {SectionTitle} from "../components"
import React from "react"
import {ContactInfo, ContactInfoType} from "../data/contact-data"
import {useTranslations} from "next-intl"

export const ContactSection = () => {
  const t = useTranslations()
  return (
    <section
      className=" bg-black text-white py-20 flex flex-col gap-12"
      id="contact"
    >
      <div className="w-full flex justify-center">
        <SectionTitle
          align="center"
          sectionName={t("home.contact.sectionName")}
          title={t("home.contact.title")}
          subtitle={t("home.contact.subtitle")}
          backgroundText={t("home.contact.backgroundText")}
          backgroundColor="dark"
        />
      </div>
      <div className="max-w-6xl mx-auto px-4  text-center relative">
        <div className="relative z-10 flex flex-wrap justify-center gap-6">
          {ContactInfo.map((info: ContactInfoType, index: number) => (
            <div
              key={index}
              className="bg-gray-700 p-10 rounded-md flex flex-row flex-wrap items-center justify-center gap-4 relative shadow-md min-w-72"
            >
              <info.icon className="text-white w-5 h-5" />
              <p className="font-medium">{info.text}</p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-yellow-500 rounded-t-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
