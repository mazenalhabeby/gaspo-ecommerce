import Image from "next/image"

export default function ProductImageGallery({
  mainImage,
  setMainImage,
  gallery = [],
  productName,
}: {
  mainImage: string
  setMainImage: (img: string) => void
  gallery: string[]
  productName: string
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
        {gallery.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={`${productName} ${i}`}
            width={80}
            height={80}
            onClick={() => setMainImage(img)}
            className={`rounded-md cursor-pointer border ${
              mainImage === img ? "ring-2 ring-blue-600" : ""
            }`}
            priority
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="w-full rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt={productName}
          width={800}
          height={800}
          className="object-contain rounded-lg max-w-4xl max-h-[556px] w-full h-auto"
          priority
        />
      </div>
    </div>
  )
}
