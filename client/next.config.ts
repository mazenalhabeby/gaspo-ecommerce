import {NextConfig} from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  images: {
    domains: [
      "gaspotest.s3.eu-north-1.amazonaws.com",
      "picsum.photos",
      "fsn1.your-objectstorage.com",
    ],
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
