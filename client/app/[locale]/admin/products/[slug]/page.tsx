import {use} from "react"
import ProductClientPage from "./ProductClientpage"

export default function ProductPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)

  return <ProductClientPage slug={slug} />
}
