import React, {use} from "react"
import CategoryClientEditPage from "./CategoryClientEditPage"

export default function CategoryEditPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)
  return <CategoryClientEditPage slug={slug} />
}
