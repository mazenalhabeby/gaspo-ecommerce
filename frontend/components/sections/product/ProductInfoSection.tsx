import ProductInfo from "@/components/sections/product/ProductDetailsInfo"
import ProductImageGallery from "@/components/sections/product/ProductImageGallery"
import {Product} from "@/data/products"

interface ProductInfoSectionProps {
  mainImage: string
  setMainImage: (image: string) => void
  product: Product
  selectedColor: string
  setSelectedColor: (color: string) => void
  selectedSize: string
  setSelectedSize: (size: string) => void
  quantity: number
  setQuantity: (quantity: number) => void
  handleAddToCart: () => void
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  mainImage,
  setMainImage,
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  handleAddToCart,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
      <div className="col-span-1 xl:col-span-2">
        <ProductImageGallery
          mainImage={mainImage}
          setMainImage={setMainImage}
          gallery={product.gallery || []}
          productName={product.name}
        />
      </div>
      <div className="col-span-1 xl:col-span-1 flex flex-col gap-10 ">
        <ProductInfo
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
        />
      </div>
    </section>
  )
}

export default ProductInfoSection
