"use client"

import {SectionTitle} from "../components"
import Image from "next/image"
import React from "react"
import {motion} from "framer-motion"
import {useTranslations} from "next-intl"
import {
  FloatingBoxes,
  FloatingBoxType,
  PartnerData,
  PartnerDataType,
} from "../data/partner-data"

export const OurPartnersSection = () => {
  const t = useTranslations()

  return (
    <section
      className="section-container flex flex-col items-center justify-center gap-20 px-4 container mx-auto relative"
      id="partners"
    >
      <motion.div
        initial={{y: 100, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        transition={{duration: 1, ease: "easeOut"}}
        viewport={{once: true}}
        className="w-full flex justify-center"
      >
        <SectionTitle
          align="center"
          sectionName={t("home.partners.sectionName")}
          title={t("home.partners.maintitle")}
          subtitle={t("home.partners.subtitle")}
          backgroundText={t("home.partners.backgroundText")}
        />
      </motion.div>
      <div className="flex flex-row flex-wrap justify-center items-center gap-20 relative z-20">
        {PartnerData.map((partner: PartnerDataType, i: number) => (
          <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: i * 0.2}}
            className="flex flex-row flex-wrap gap-6 mt-10 "
            key={i}
          >
            <div className="flex flex-wrap justify-center gap-10 z-10">
              <div className="relative w-80 min-h-[320px]">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white shadow-md z-10 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} Logo`}
                    className="w-full h-full object-contain"
                    width={100}
                    height={100}
                    priority={true}
                  />
                </div>
                <div className="w-full h-full backdrop-blur-lg bg-gray-100/30 border border-white/20 shadow-md text-left relative flex flex-col items-center justify-center gap-4 px-4 rounded-4xl">
                  <h3 className="text-xl font-bold uppercase">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-center leading-relaxed text-gray-700">
                    {t(partner.describe)}
                  </p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-yellow-400 rounded-t-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute w-full h-full top-0 left-0 z-10">
        {FloatingBoxes.map((box: FloatingBoxType, index: number) => (
          <motion.div
            key={index}
            className={`absolute z-10 opacity-30 rounded-xl ${box.size.base} ${box.size.lg} ${box.color} ${box.position}`}
            animate={{
              opacity: 0.3,
              rotate: [0, 5, -5, 5, 0],
              y: [0, -10, 0, 10, 0],
              scale: [1, 1.05, 0.95, 1.05, 1],
            }}
            transition={{
              duration: 6 + index * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
            viewport={{once: false}}
          ></motion.div>
        ))}
      </div>
    </section>
  )
}
