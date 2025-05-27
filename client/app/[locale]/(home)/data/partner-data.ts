import {Aldi, Kaufland, Penny, toom, unser, vedes} from "@/assets"

export const PartnerData = [
  {
    name: "aldi",
    logo: Aldi,
    describe: "home.partners.aldi.describe",
  },
  {
    name: "kaufland",
    logo: Kaufland,
    describe: "home.partners.kaufland.describe",
  },
  {
    name: "penny",
    logo: Penny,
    describe: "home.partners.penny.describe",
  },
  {
    name: "toom",
    logo: toom,
    describe: "home.partners.toom.describe",
  },
  {
    name: "unser",
    logo: unser,
    describe: "home.partners.unser.describe",
  },
  {
    name: "vedes",
    logo: vedes,
    describe: "home.partners.vedes.describe",
  },
]

export const FloatingBoxes = [
  {
    size: {base: "w-5 h-5", lg: "lg:w-10 lg:h-10"},
    color: "bg-red-500",
    position: "top-[40%] left-5",
  },
  {
    size: {base: "w-10 h-10", lg: "lg:w-20 lg:h-20"},
    color: "bg-yellow-500",
    position: "top-1/2 left-10",
  },
  {
    size: {base: "w-12 h-12", lg: "lg:w-24 lg:h-24"},
    color: "bg-red-500",
    position: "top-[70%] right-[30%]",
  },
  {
    size: {base: "w-5 h-5", lg: "lg:w-10 lg:h-10"},
    color: "bg-gray-200",
    position: "top-[80%] right-5",
  },
  {
    size: {base: "w-10 h-10", lg: "lg:w-20 lg:h-20"},
    color: "bg-yellow-500",
    position: "top-[90%] right-10",
  },
  {
    size: {base: "w-12 h-12", lg: "lg:w-24 lg:h-24"},
    color: "bg-blue-500",
    position: "top-1/2 left-1/2",
  },
  {
    size: {base: "w-5 h-5", lg: "lg:w-10 lg:h-10"},
    color: "bg-gray-200",
    position: "top-[40%] right-5",
  },
  {
    size: {base: "w-12 h-12", lg: "lg:w-24 lg:h-24"},
    color: "bg-blue-500",
    position: "top-[40%] left-[30%]",
  },
]

export type PartnerDataType = (typeof PartnerData)[number]
export type FloatingBoxType = (typeof FloatingBoxes)[number]
