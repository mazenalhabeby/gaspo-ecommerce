import {
  heroSectionImg01,
  heroSectionImg02,
  heroSectionImg03,
  heroSectionImg04,
  heroSectionImg05,
  heroSectionImg06,
} from "@/assets"

export const CarouselData = [
  {
    image: heroSectionImg01,
    name: "home.hero.slider01.name",
    title: "home.hero.slider01.title",
    subtitle: "home.hero.slider01.subtitle",
    description: "home.hero.slider01.description",
  },
  {
    image: heroSectionImg02,
    name: "home.hero.slider02.name",
    title: "home.hero.slider02.title",
    subtitle: "home.hero.slider02.subtitle",
    description: "home.hero.slider02.description",
  },
  {
    image: heroSectionImg03,
    name: "home.hero.slider03.name",
    title: "home.hero.slider03.title",
    subtitle: "home.hero.slider03.subtitle",
    description: "home.hero.slider03.description",
  },
  {
    image: heroSectionImg04,
    name: "home.hero.slider04.name",
    title: "home.hero.slider04.title",
    subtitle: "home.hero.slider04.subtitle",
    description: "home.hero.slider04.description",
  },
  {
    image: heroSectionImg05,
    name: "home.hero.slider05.name",
    title: "home.hero.slider05.title",
    subtitle: "home.hero.slider05.subtitle",
    description: "home.hero.slider05.description",
  },
  {
    image: heroSectionImg06,
    name: "home.hero.slider06.name",
    title: "home.hero.slider06.title",
    subtitle: "home.hero.slider06.subtitle",
    description: "home.hero.slider06.description",
  },
]

export type CarouselDataType = (typeof CarouselData)[number]
