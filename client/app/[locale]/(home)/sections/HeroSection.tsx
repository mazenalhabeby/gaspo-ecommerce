"use client"

import {useEffect} from "react"
import "@/styles/slider.css"
import {useTranslations} from "next-intl"
import {CarouselData, CarouselDataType} from "../data/carousel-data"
import Image from "next/image"

export const HeroSection = () => {
  const t = useTranslations()
  useEffect(() => {
    const nextButton = document.getElementById(
      "next"
    ) as HTMLButtonElement | null
    const prevButton = document.getElementById(
      "prev"
    ) as HTMLButtonElement | null
    const carousel = document.querySelector(".carousel") as HTMLElement | null
    const sliderList = carousel?.querySelector(".list") as HTMLElement | null
    const thumbnailWrapper = document.querySelector(
      ".carousel .thumbnail"
    ) as HTMLElement | null

    if (
      !nextButton ||
      !prevButton ||
      !carousel ||
      !sliderList ||
      !thumbnailWrapper
    ) {
      console.error("Missing elements for slider initialization.")
      return
    }

    const thumbnailItems = thumbnailWrapper.querySelectorAll(".item")

    // Move the first thumbnail to the end
    thumbnailWrapper.appendChild(thumbnailItems[0])

    const timeRunning = 3000
    const timeAutoNext = 7000
    let autoNextTimeout: NodeJS.Timeout
    let animationTimeout: NodeJS.Timeout

    const moveSlide = (direction: "next" | "prev") => {
      const sliderItems = sliderList.querySelectorAll(".item")
      const thumbnails = thumbnailWrapper.querySelectorAll(".item")

      if (direction === "next") {
        sliderList.appendChild(sliderItems[0])
        thumbnailWrapper.appendChild(thumbnails[0])
        carousel.classList.add("next")
      } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1])
        thumbnailWrapper.prepend(thumbnails[thumbnails.length - 1])
        carousel.classList.add("prev")
      }

      clearTimeout(animationTimeout)
      animationTimeout = setTimeout(() => {
        carousel.classList.remove("next")
        carousel.classList.remove("prev")
      }, timeRunning)

      clearTimeout(autoNextTimeout)
      autoNextTimeout = setTimeout(() => {
        nextButton.click()
      }, timeAutoNext)
    }

    const handleNext = () => moveSlide("next")
    const handlePrev = () => moveSlide("prev")

    nextButton.addEventListener("click", handleNext)
    prevButton.addEventListener("click", handlePrev)

    // Start automatic sliding
    autoNextTimeout = setTimeout(() => {
      nextButton.click()
    }, timeAutoNext)

    return () => {
      nextButton.removeEventListener("click", handleNext)
      prevButton.removeEventListener("click", handlePrev)
      clearTimeout(autoNextTimeout)
      clearTimeout(animationTimeout)
    }
  }, [])

  return (
    <section className="carousel" id="carousel">
      {/* List of slides */}
      <div className="list">
        {CarouselData.map((item: CarouselDataType, i: number) => (
          <div className="item" key={i}>
            <div className="relative w-full h-full">
              <Image
                width={500}
                height={300}
                src={item.image}
                alt={item.name}
              />
              <div className="absolute inset-0 bg-black/70"></div>
            </div>
            <div className="content">
              <div className="author">{t(item.name)}</div>
              <div className="title">{t(item.title)}</div>
              <div className="topic">{t(item.subtitle)}</div>
              <div className="des">{t(item.description)}</div>
              <button>contact us now</button>
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      <div className="thumbnail">
        {CarouselData.map((item: CarouselDataType, i: number) => (
          <div className="item" key={i}>
            <Image src={item.image} alt={item.name} width={100} height={100} />
            <div className="content bg-black/5 backdrop-blur px-2 rounded-lg text-xs">
              <div className="title">{t(item.title)}</div>
              <div className="description">{t(item.name)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="arrows">
        <button id="prev">&lt;</button>
        <button id="next">&gt;</button>
      </div>
    </section>
  )
}
