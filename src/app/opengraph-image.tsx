import { ImageResponse } from "next/og"

import { siteConfig } from "@/config/site"

import { getRowdies } from "@/lib/utils"

import { Icons } from "@/components/icons"
import { OpenGraphImage } from "@/components/og-images"

export const sharedImage = {
  width: 1200,
  height: 630,
  type: "image/png",
}

export const runtime = "edge"
export const alt = siteConfig.name
export const size = {
  width: sharedImage.width,
  height: sharedImage.height,
}
export const contentType = sharedImage.type

export default async function Image() {
  return new ImageResponse(
    (
      <OpenGraphImage
        title={siteConfig.name}
        description={siteConfig.description}
        icon={<Icons.dns width={200} height={220} />}
      />
    ),
    {
      ...size,

      fonts: [
        {
          name: "Rowdies",
          data: await getRowdies(),
          style: "normal",
          weight: 400,
        },
      ],
    }
  )
}
