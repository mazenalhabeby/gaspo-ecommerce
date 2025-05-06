import SectionTitle from "@/components/SectionTitle"
import React from "react"
import {FaMapMarkerAlt, FaPhoneAlt, FaEnvelope} from "react-icons/fa"

const contactInfo = [
  {
    icon: <FaMapMarkerAlt className="text-white w-5 h-5" />,
    text: "Peiskam 6, 4694 Ohlsdorf",
  },
  {
    icon: <FaPhoneAlt className="text-white w-5 h-5" />,
    text: "+(43) 7612 472920",
  },
  {
    icon: <FaEnvelope className="text-white w-5 h-5" />,
    text: "Office@Gaspo.Com",
  },
]

const ContactSection = () => {
  return (
    <section
      className=" bg-black text-white py-20 flex flex-col gap-12"
      id="contact"
    >
      <div className="w-full flex justify-center">
        <SectionTitle
          align="center"
          sectionName="Get In Touch"
          title="Contact Us"
          subtitle="anytime For Help!"
          backgroundText="Contact "
          backgroundColor="dark"
        />
      </div>
      <div className="max-w-6xl mx-auto px-4  text-center relative">
        <div className="relative z-10 flex flex-wrap justify-center gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-gray-700 p-10 rounded-md flex flex-row flex-wrap items-center justify-center gap-4 relative shadow-md min-w-72"
            >
              {info.icon}
              <p className="font-medium">{info.text}</p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-yellow-500 rounded-t-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ContactSection
