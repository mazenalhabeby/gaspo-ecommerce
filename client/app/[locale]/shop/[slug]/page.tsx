import {use} from "react"
import ShopProductClientPage from "./ShopProductClientPage"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)

  return <ShopProductClientPage slug={slug} />
}
