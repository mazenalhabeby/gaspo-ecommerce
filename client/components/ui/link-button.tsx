"use client"

import * as React from "react"
import {cn} from "@/lib/utils"
import {Button, buttonVariants} from "@/components/ui/button"
import type {VariantProps} from "class-variance-authority"
import {NProgressLink} from "../NProgressLink"

interface LinkButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  href: string
  icon?: React.ReactNode
  label: string
  hideLabelOnMobile?: boolean
}

export function LinkButton({
  href,
  icon,
  label,
  hideLabelOnMobile = true,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Button asChild className={cn("w-max", className)} {...props}>
      <NProgressLink href={href}>
        <div className="flex items-center gap-2 justify-center">
          {icon}
          <span
            className={cn(hideLabelOnMobile ? "hidden md:inline-block" : "")}
          >
            {label}
          </span>
        </div>
      </NProgressLink>
    </Button>
  )
}
