import type {NextConfig} from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com", "picsum.photos"],
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
