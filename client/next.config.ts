import type {NextConfig} from "next"
import withNextIntl from "next-intl/plugin"

const withIntl = withNextIntl("./next-intl.config.ts")

const nextConfig: NextConfig = {
  /* config options here */
}

export default withIntl(nextConfig)
