"use client"
import {useEffect} from "react"
import {SectionTitle} from "../components"
import {motion} from "framer-motion"
import Image from "next/image"
import {ProductDataType, ProductsData} from "../data/product-data"
import {useTranslations} from "next-intl"

export const ProductsSection = () => {
  const t = useTranslations()
  useEffect(() => {
    const next = document.getElementById("next-product")
    const prev = document.getElementById("prev-product")
    const back = document.getElementById("back-product")
    const carousel = document.querySelector(".carousel-product")
    const list = document.querySelector(".carousel-product .list")
    const seeMoreButtons = document.querySelectorAll(
      ".carousel-product .seeMore"
    )

    let allowClick = true

    function moveSlider(dir: "next" | "prev") {
      if (!carousel || !list || !allowClick) return

      const items = list.querySelectorAll(".item")
      allowClick = false

      if (dir === "next") {
        list.appendChild(items[0])
        carousel.classList.add("next")
      } else {
        list.prepend(items[items.length - 1])
        carousel.classList.add("prev")
      }

      setTimeout(() => {
        carousel.classList.remove("next", "prev")
        allowClick = true
      }, 1000)
    }

    // Navigation
    next?.addEventListener("click", () => moveSlider("next"))
    prev?.addEventListener("click", () => moveSlider("prev"))

    // See More
    seeMoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        carousel?.classList.add("showDetail")
      })
    })

    // Back Button
    back?.addEventListener("click", () => {
      carousel?.classList.remove("showDetail")
    })

    return () => {
      next?.removeEventListener("click", () => moveSlider("next"))
      prev?.removeEventListener("click", () => moveSlider("prev"))
      back?.removeEventListener("click", () =>
        carousel?.classList.remove("showDetail")
      )
      seeMoreButtons.forEach((button) => {
        button.removeEventListener("click", () => {
          carousel?.classList.add("showDetail")
        })
      })
    }
  }, [])

  return (
    <div className="section-container flex flex-col gap-12 " id="products">
      <motion.div
        initial={{y: 100, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        transition={{duration: 1, ease: "easeOut"}}
        viewport={{once: true}}
        className="w-full flex justify-center"
      >
        <SectionTitle
          align="center"
          sectionName={t("home.products.sectionName")}
          title={t("home.products.maintitle")}
          subtitle={t("home.products.subtitle")}
          backgroundText="Products"
        />
      </motion.div>
      <div className="carousel-product group">
        <div className="list">
          {ProductsData.map((product: ProductDataType, i: number) => (
            <div className="item" key={i}>
              <Image
                src={product.image}
                alt={product.topic}
                width={300}
                height={300}
              />
              <div className="introduce">
                <div className="title">{t(product.title)}</div>
                <div className="topic">{t(product.topic)}</div>
                <div className="des">{t(product.shortDescription)}</div>
                <button className="seeMore">
                  {t("home.products.seeMore")}
                </button>
              </div>
              <div className="detail">
                <div className="title">{t(product.fullTitle)}</div>
                <div className="des">{t(product.fullDescription)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="arrows-product">
          <button id="prev-product">&lt;</button>
          <button id="next-product">&gt;</button>
          <button
            className="hidden group-[.showDetail]:inline-block"
            id="back-product"
          >
            ↗
          </button>
        </div>
      </div>
    </div>
  )
}
