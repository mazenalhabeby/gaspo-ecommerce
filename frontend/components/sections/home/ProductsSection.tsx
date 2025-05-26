/* eslint-disable @next/next/no-img-element */
"use client"

import {useEffect} from "react"
import "@/styles/product-slider.css"
import SectionTitle from "@/components/SectionTitle"
import {motion} from "framer-motion"

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      image: "/images/products/img1.png", // update to your actual path
      title: "GASPO COLLECTION",
      topic: "Outdoor Sauna",
      shortDescription:
        "Relax, recharge, and rejuvenate with our premium Gaspo outdoor sauna — crafted for pure Austrian wellness.",
      fullTitle: "Gaspo Outdoor Sauna Premium Edition",
      fullDescription:
        "Experience traditional Austrian relaxation with the Gaspo Outdoor Sauna. Built from high-quality spruce wood, it provides optimal insulation, a spacious interior, and elegant design. Perfect for private gardens, wellness areas, or alpine resorts.",
    },
    {
      id: 2,
      image: "/images/products/img2.png", // update to your actual image path
      title: "GASPO COLLECTION",
      topic: "Double Mickey Sandbox",
      shortDescription:
        "Bring joy to your backyard with the Gaspo Double Mickey Sandbox — a safe, spacious, and durable play area for children.",
      fullTitle: "Gaspo Double Mickey Sandbox with Canopy",
      fullDescription:
        "The Gaspo Double Mickey Sandbox is a premium-quality play area made from natural wood, designed to keep children entertained outdoors for hours. Featuring a UV-protected adjustable canopy, this sandbox offers both shade and fun, with enough space for multiple kids to play together. Easy to assemble and built to last in all weather conditions.",
    },
    {
      id: 3,
      image: "/images/products/img3.png", // update to your actual image path
      title: "GASPO COLLECTION",
      topic: "Wood House Play",
      shortDescription:
        "Create a magical backyard adventure with the Gaspo Wood House Play — where imagination meets craftsmanship.",
      fullTitle: "Gaspo Wooden Playhouse for Kids",
      fullDescription:
        "The Gaspo Wood House Play is a beautifully crafted wooden playhouse that transforms any garden into a world of fun. Made from natural, untreated wood with charming details, it offers a safe and cozy space for children to play, explore, and grow. Weather-resistant and easy to assemble, it’s the perfect addition to your outdoor family space.",
    },
    {
      id: 4,
      image: "/images/products/img4.png", // update to your actual image path
      title: "GASPO COLLECTION",
      topic: "Mickey Sandbox",
      shortDescription:
        "Fun meets function with the original Gaspo Mickey Sandbox — a compact, shaded play area made for sunny backyard days.",
      fullTitle: "Gaspo Mickey Sandbox with Adjustable Roof",
      fullDescription:
        "The Gaspo Mickey Sandbox is a classic wooden sandbox with an integrated UV-resistant canopy to protect kids from sun and light rain. Compact and stylish, it fits perfectly in any garden or terrace. Made from durable, natural wood, this sandbox is designed to offer safe and lasting fun for young children. Easy to set up and maintain, it's a parent-approved favorite.",
    },
    {
      id: 5,
      image: "/images/products/img5.png", // update to your actual image path
      title: "GASPO COLLECTION",
      topic: "Wooden Flower Box",
      shortDescription:
        "Add a touch of nature to any space with the Gaspo Wooden Flower Box — a stylish and sustainable way to grow beauty.",
      fullTitle: "Gaspo Raised Wooden Flower Box Planter",
      fullDescription:
        "The Gaspo Flower Box is an elegant and sturdy wooden planter, ideal for showcasing flowers, herbs, or vegetables. Made from natural Austrian wood, it's perfect for balconies, gardens, or entrances. With its elevated design and excellent drainage, it provides both function and flair for your outdoor décor. Easy to assemble and weather-resistant.",
    },
    {
      id: 6,
      image: "/images/products/img6.png", // update to your actual image path
      title: "GASPO COLLECTION",
      topic: "Corner Flower Box",
      shortDescription:
        "Maximize small spaces with elegance — the Gaspo Corner Flower Box fits perfectly into any garden nook or balcony.",
      fullTitle: "Gaspo Wooden Corner Flower Planter Box",
      fullDescription:
        "The Gaspo Flower Corner Box is a smart and stylish wooden planter designed specifically for corners. Made from premium natural wood, it adds greenery and charm to patios, balconies, and garden spaces. Its triangular design allows it to fit snugly into tight spots while offering ample room for flowers or herbs. Durable, weather-resistant, and beautifully finished.",
    },
    {
      id: 7,
      image: "/images/products/img7.png", // update to your actual image path
      title: "GASPO COLLECTION",
      topic: "Garden Chair",
      shortDescription:
        "Enjoy the outdoors in comfort and style with the Gaspo Garden Chair — built for relaxation, designed to last.",
      fullTitle: "Gaspo Wooden Garden Chair Classic Edition",
      fullDescription:
        "The Gaspo Garden Chair combines traditional Austrian craftsmanship with ergonomic design. Made from solid natural wood, it’s perfect for outdoor seating in gardens, terraces, or patios. With a slanted backrest and sturdy build, it offers lasting comfort and timeless beauty. Weather-resistant and easy to maintain, it’s a great addition to any outdoor setup.",
    },
  ]
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
          sectionName="Our Products"
          title="Premium Quality,
            Sustainable"
          subtitle=" Design, And Unmatched Durability"
          backgroundText="Products"
        />
      </motion.div>
      <div className="carousel-product group">
        <div className="list">
          {products.map((product, i) => (
            <div className="item" key={i}>
              <img src={product.image} alt={product.title} />
              <div className="introduce">
                <div className="title">{product.title}</div>
                <div className="topic">{product.topic}</div>
                <div className="des">{product.shortDescription}</div>
                <button className="seeMore">See more</button>
              </div>
              <div className="detail">
                <div className="title">{product.fullTitle}</div>
                <div className="des">{product.fullDescription}</div>
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

export default ProductsSection
