"use client"

import {christ, company} from "@/assets/images"
import {useTranslations} from "next-intl"
import Image from "next/image"
import React from "react"
import {motion} from "framer-motion"
import SectionTitle from "@/components/SectionTitle"
import Signature from "@/components/Signature"

const AboutSection = () => {
  const t = useTranslations()
  return (
    <section
      className="section-container flex flex-col items-center justify-center gap-10"
      id="about"
    >
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-20">
        <motion.div
          initial={{x: -100, opacity: 0}}
          whileInView={{x: 0, opacity: 1}}
          transition={{duration: 1, ease: "easeOut"}}
          viewport={{once: true}}
          className=" relative group overflow-hidden rounded-2xl lg:rounded-3xl mx-2 lg:mx-0"
        >
          <Image
            src={company}
            alt="Description"
            width={500}
            height={300}
            className="w-auto rounded-2xl lg:rounded-3xl shadow-lg shadow-gray-300 group-hover:scale-125 transition-transform duration-2000 ease-in-out"
            priority={true}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-80 "></div>
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-red-500 font-bold text-4xl lg:text-6xl opacity-100"
            style={{fontFamily: "var(--font-venus-rising)"}}
          >
            GASPO
          </div>
          <div className=" w-5 h-5 lg:w-10 lg:h-10  absolute z-10 bg-red-500 top-5 left-5 lg:top-10 lg:left-10"></div>
          <div className=" w-5 h-5 lg:w-10 lg:h-10 absolute z-10 bg-yellow-500 top-10 left-10 lg:top-20 lg:left-20"></div>
          <div className=" w-5 h-5 lg:w-10 lg:h-10 absolute z-10 bg-blue-500 top-0 left-0"></div>
        </motion.div>
        <motion.div
          initial={{opacity: 0, x: 100}}
          whileInView={{opacity: 1, x: 0}}
          transition={{duration: 1.5, delay: 0.3}}
          viewport={{once: true}}
          className=" max-w-[90%] lg:max-w-[40%]"
        >
          <SectionTitle
            align="start"
            sectionName={t("home.about.sectionName")}
            title={t("home.about.title")}
            subtitle={t("home.about.subtitle")}
            backgroundText={t("home.about.backgroundText")}
          />
          <div className="space-y-6 text-gray-700 leading-relaxed py-4">
            <p>{t("home.about.descriptions.first")}</p>
            <p>{t("home.about.descriptions.second")}</p>
            <p>{t("home.about.descriptions.third")}</p>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{opacity: 0, y: 100}}
        whileInView={{opacity: 1, y: 0}}
        transition={{duration: 1.5, delay: 0.3}}
        viewport={{once: true}}
        className=" place-self-center flex flex-col lg:flex-row items-center justify-center lg:items-start lg:justify-center rounded-xl overflow-hidden gap-1 px-2 lg:px-0 "
      >
        <Image src={christ} alt="christ" width={183} height={183} />
        <div className="h-1 w-full lg:h-auto lg:w-2 bg-yellow-500 self-stretch"></div>
        <div className=" bg-gray-200 flex flex-col font-serif gap-6 p-4 font-semibold italic leading-relaxed text-gray-800">
          <p>
            <span className="text-xl">“</span>
            {t.rich("home.about.quote", {
              br: () => <br />,
            })}
            <span className="text-xl">”</span>
          </p>
          <div className="flex justify-end px-2">
            <Signature />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default AboutSection
