// import {shoppingRoutes} from "@/lib/routes"
import {FaLocationDot} from "react-icons/fa6"
import {MdPermPhoneMsg, MdEmail} from "react-icons/md"
import {paypal, sofort, vorkasse} from "@/assets"

const NavbarLinks = [
  {name: "navbar.links.home", href: "carousel"},
  {name: "navbar.links.about", href: "about"},
  {name: "navbar.links.products", href: "products"},
  {name: "navbar.links.partners", href: "partners"},
  {name: "navbar.links.contact", href: "contact"},
  //   {name: "navbar.links.shop", href: shoppingRoutes.shop},
]

const NavbarContact = [
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

const FooterSections = [
  {
    title: "footer.gaspo",
    items: [
      "footer.safeShopping",
      "footer.threeYearWarranty",
      "footer.fastShipping",
      "footer.moneyBackGuarantee",
    ],
  },
  {
    title: "footer.openingHours",
    items: [
      "footer.mondayToThursday",
      "footer.friday",
      "footer.closedOnBridgeDays",
    ],
  },
  {
    title: "footer.paymentMethods",
    items: [],
    images: [
      {src: paypal, alt: "Paypal"},
      {src: vorkasse, alt: "Vorkasse"},
      {src: sofort, alt: "Sofort"},
    ],
  },
]

export {NavbarLinks, NavbarContact, FooterSections}
export type NavbarLink = (typeof NavbarLinks)[number]
export type NavbarContact = (typeof NavbarContact)[number]
export type FooterSection = (typeof FooterSections)[number]
