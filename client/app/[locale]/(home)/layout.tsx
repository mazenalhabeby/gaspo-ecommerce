import React from "react"
import "@/styles/slider.css"
import "@/styles/product-slider.css"
import Navbar from "@/components/navbar/Navbar"
import Footer from "@/components/Footer"

export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
    <React.Fragment>
      <Navbar />
      {children}
      <Footer />
    </React.Fragment>
  )
}
