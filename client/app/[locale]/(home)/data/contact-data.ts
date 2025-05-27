import {FaMapMarkerAlt, FaPhoneAlt, FaEnvelope} from "react-icons/fa"
export const ContactInfo = [
  {
    icon: FaMapMarkerAlt,
    text: "Peiskam 6, 4694 Ohlsdorf",
  },
  {
    icon: FaPhoneAlt,
    text: "+(43) 7612 472920",
  },
  {
    icon: FaEnvelope,
    text: "Office@Gaspo.Com",
  },
]

export type ContactInfoType = (typeof ContactInfo)[number]
