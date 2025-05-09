import Footer from "@/components/layouts/Footer"
import ShopNavbar from "@/components/layouts/nabvar/ShopNavbar"
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
