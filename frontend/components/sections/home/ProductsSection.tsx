/* eslint-disable @next/next/no-img-element */
"use client"

import {useEffect} from "react"
import "@/styles/product-slider.css"
import SectionTitle from "@/components/SectionTitle"
import {motion} from "framer-motion"

const ProductsSection = () => {
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
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div className="item" key={i}>
              <img src={`/images/products/img${i}.png`} alt={`Product ${i}`} />
              <div className="introduce">
                <div className="title">DESIGN SLIDER</div>
                <div className="topic">Aerphone</div>
                <div className="des">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Officia, laborum cumque dignissimos quidem atque et eligendi
                  aperiam voluptates beatae maxime.
                </div>
                <button className="seeMore">See more</button>
              </div>

              <div className="detail">
                <div className="title">Aerphone GHTK</div>
                <div className="des">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Dolor, reiciendis suscipit nobis nulla animi, modi explicabo
                  quod corrupti impedit illo.
                </div>
                <div className="specifications">
                  <div>
                    <p>Used Time</p>
                    <p>6 hours</p>
                  </div>
                  <div>
                    <p>Charging port</p>
                    <p>Type-C</p>
                  </div>
                  <div>
                    <p>Compatible</p>
                    <p>Android</p>
                  </div>
                  <div>
                    <p>Bluetooth</p>
                    <p>5.3</p>
                  </div>
                  <div>
                    <p>Controlled</p>
                    <p>Touch</p>
                  </div>
                </div>
                <div className="checkout">
                  <button>ADD TO CART</button>
                  <button>CHECKOUT</button>
                </div>
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
