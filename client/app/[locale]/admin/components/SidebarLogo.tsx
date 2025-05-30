import {PlusCircleIcon} from "lucide-react"
import React from "react"

export const SidebarLogo = () => {
  return (
    <React.Fragment>
      <PlusCircleIcon className="h-5 w-5" />
      <span className="font-semibold text-base">Gaspo</span>
    </React.Fragment>
  )
}
