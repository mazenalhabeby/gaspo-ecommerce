import {FaLocationDot} from "react-icons/fa6"
import {MdPermPhoneMsg, MdEmail} from "react-icons/md"

const navbarLinks = [
  {name: "navbar.links.home", href: "carousel"},
  {name: "navbar.links.about", href: "about"},
  {name: "navbar.links.products", href: "products"},
  {name: "navbar.links.partners", href: "partners"},
  {name: "navbar.links.contact", href: "contact"},
  {name: "navbar.links.shop", href: "/shop"},
]

const navbarContact = [
  {
    name: "common.addressTitle",
    value: "common.address",
    icon: FaLocationDot,
  },
  {
    name: "common.contactTitle",
    value: "common.contact",
    icon: MdPermPhoneMsg,
  },
  {
    name: "common.emailTitle",
    value: "common.email",
    icon: MdEmail,
  },
]

export {navbarLinks, navbarContact}
export type NavbarLink = (typeof navbarLinks)[number]
