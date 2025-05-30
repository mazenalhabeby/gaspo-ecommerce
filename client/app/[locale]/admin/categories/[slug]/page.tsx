import React, {use} from "react"
import CategoryClientPage from "./CategoryClientPage"

export default function CategoryPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)
  return <CategoryClientPage slug={slug} />
}
