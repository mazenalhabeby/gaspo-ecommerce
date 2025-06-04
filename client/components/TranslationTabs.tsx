import React from "react"
import {TabsList, Tabs, TabsTrigger} from "./ui/tabs"
import {Language} from "@/i18n/routing"

interface TranslationTabsProps {
  children: React.ReactNode
  languages: Language[]
}

export const TranslationTabs = ({
  children,
  languages,
}: TranslationTabsProps) => {
  return (
    <Tabs defaultValue={languages[0].code} className="w-full">
      <TabsList className="mb-4">
        {languages.map((lang) => (
          <TabsTrigger key={lang.code} value={lang.code}>
            {lang.label.toUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
