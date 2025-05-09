import Footer from "@/components/layouts/Footer"
import Navbar from "@/components/layouts/nabvar/Navbar"
import React, {ReactNode} from "react"

export default function HomeLayout({children}: {children: ReactNode}) {
  return (
    <React.Fragment>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </React.Fragment>
  )
}
