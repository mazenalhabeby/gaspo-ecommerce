"use client"
import {Aldi, Kaufland, Penny, toom, unser, vedes} from "@/assets/images"
import SectionTitle from "@/components/SectionTitle"
import Image from "next/image"
import React from "react"
import {motion} from "framer-motion"

const partnerData = [
  {
    name: "aldi",
    logo: Aldi,
    describe:
      " As a globally trusted retail brand, Aldi collaborates with us to bring high-quality garden and lifestyle products to customers seeking both value and excellence. Together, we ensure affordable access to durable and beautifully crafted designs. ",
  },
  {
    name: "kaufland",
    logo: Kaufland,
    describe:
      " With a strong presence across Europe, Kaufland shares our commitment to delivering reliable, functional, and stylish solutions. Our partnership helps customers enjoy premium outdoor and fitness products at accessible prices.",
  },
  {
    name: "penny",
    logo: Penny,
    describe:
      "Focused on simplicity, value, and quality, Penny partners with us to offer carefully curated garden and sport items that meet everyday needs while maintaining a high standard of craftsmanship.",
  },
  {
    name: "toom",
    logo: toom,
    describe:
      " As one of the leading DIY and garden centers, Toom helps us bring professional-grade garden furniture and home improvement products to hands-on customers across the region, all with sustainability in mind. ",
  },
  {
    name: "unser",
    logo: unser,
    describe:
      " Through Unser Lagerhaus, we extend our reach to customers seeking reliable, high-performance outdoor products. This partnership strengthens our mission to serve both urban and rural lifestyles across Austria.",
  },
  {
    name: "vedes",
    logo: vedes,
    describe:
      "Specializing in family and child-focused products, Vedes supports our efforts in delivering safe, fun, and eco-friendly playground solutions like sandboxes—designed to inspire creativity and outdoor play.",
  },
]

const floatingBoxes = [
  {
    size: {base: "w-5 h-5", lg: "lg:w-10 lg:h-10"},
    color: "bg-red-500",
    position: "top-[40%] left-5",
  },
  {
    size: {base: "w-10 h-10", lg: "lg:w-20 lg:h-20"},
    color: "bg-yellow-500",
    position: "top-1/2 left-10",
  },
  {
    size: {base: "w-12 h-12", lg: "lg:w-24 lg:h-24"},
    color: "bg-red-500",
    position: "top-[70%] right-[30%]",
  },
  {
    size: {base: "w-5 h-5", lg: "lg:w-10 lg:h-10"},
    color: "bg-gray-200",
    position: "top-[80%] right-5",
  },
  {
    size: {base: "w-10 h-10", lg: "lg:w-20 lg:h-20"},
    color: "bg-yellow-500",
    position: "top-[90%] right-10",
  },
  {
    size: {base: "w-12 h-12", lg: "lg:w-24 lg:h-24"},
    color: "bg-blue-500",
    position: "top-1/2 left-1/2",
  },
  {
    size: {base: "w-5 h-5", lg: "lg:w-10 lg:h-10"},
    color: "bg-gray-200",
    position: "top-[40%] right-5",
  },
  {
    size: {base: "w-12 h-12", lg: "lg:w-24 lg:h-24"},
    color: "bg-blue-500",
    position: "top-[40%] left-[30%]",
  },
]

const OurPartnersSection = () => {
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
          sectionName="Our Partners"
          title="Trusted By"
          subtitle="Industry Leaders"
          backgroundText="Partners"
        />
      </motion.div>
      <div className="flex flex-row flex-wrap justify-center items-center gap-20 relative z-20">
        {partnerData.map((partner, i) => (
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
                  <p className="text-center leading-relaxed text-gray-700">
                    {partner.describe}
                  </p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-yellow-400 rounded-t-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute w-full h-full top-0 left-0 z-10">
        {floatingBoxes.map((box, index) => (
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

export default OurPartnersSection
