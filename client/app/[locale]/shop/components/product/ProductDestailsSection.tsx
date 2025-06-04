import React from "react"

const ProductDestailsSection = ({description}: {description: string}) => {
  return (
    <section>
      <h2 className="text-xl font-semibold">Details</h2>
      <p className="text-gray-600">{description}</p>
    </section>
  )
}

export default ProductDestailsSection
