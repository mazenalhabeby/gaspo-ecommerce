import React, {use} from "react"
import ProductClientUpdatePage from "./ProductClientEditPage"

export default function ProductEditPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)

  return <ProductClientUpdatePage slug={slug} />
}
