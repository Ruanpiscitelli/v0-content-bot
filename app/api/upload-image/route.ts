import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Validate user authentication here if needed
        // For this example, we'll allow any uploads

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
          tokenPayload: JSON.stringify({
            userId: "anonymous", // Replace with actual user ID in a real app
            timestamp: Date.now(),
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This will be called after the upload is complete
        // You could store the blob URL in a database here
        console.log("Upload completed:", blob.url)

        try {
          const payload = JSON.parse(tokenPayload || "{}")
          console.log("Upload by user:", payload.userId)
          console.log("Upload timestamp:", new Date(payload.timestamp).toISOString())

          // Here you could update a database with the image URL
          // await db.images.create({ url: blob.url, userId: payload.userId })
        } catch (error) {
          console.error("Error processing upload completion:", error)
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 })
  }
}

export const GET = POST
