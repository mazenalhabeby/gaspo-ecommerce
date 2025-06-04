import Footer from "@/components/Footer"
import ShopNavbar from "@/components/navbar/ShopNavbar"
import React, {ReactNode} from "react"

export default function ShopLayout({children}: {children: ReactNode}) {
  return (
    <React.Fragment>
      <ShopNavbar />
      <main>{children}</main>
      <Footer />
    </React.Fragment>
  )
}
