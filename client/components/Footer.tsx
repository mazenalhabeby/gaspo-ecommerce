import {state} from "@/assets"
import {useTranslations} from "next-intl"
import Image from "next/image"
import {FooterSection, FooterSections} from "./data"

const Footer = () => {
  const t = useTranslations()

  return (
    <footer className="bg-black text-white w-full">
      <div className="border-t border-gray-700 bg-black container py-10 px-4 mx-auto">
        <div className=" flex flex-row flex-wrap justify-center lg:justify-around gap-8 lg:gap-0 items-start text-sm text-white">
          <Image src={state} alt="Austria Seal" width={80} />
          {FooterSections.map((section: FooterSection, index: number) => (
            <div
              key={index}
              className="flex flex-col items-start justify-center"
            >
              <h4 className="font-bold mb-2">{t(section.title)}</h4>

              {section.items.length > 0 &&
                section.items.map((item, idx) => (
                  <p key={idx} className="pb-2 last-of-type:pb-0">
                    {t(item)}
                  </p>
                ))}

              {section.images && (
                <div className="flex gap-4 mt-2">
                  {section.images.map((img, imgIdx) => (
                    <Image
                      key={imgIdx}
                      src={img.src}
                      alt={img.alt}
                      width={50}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
