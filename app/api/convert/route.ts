import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting image conversion process")

    const apiKey =
      process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.log("[v0] Error: No API key configured")
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      console.log("[v0] Error: No image provided")
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("[v0] Image received:", image.name, image.size, "bytes")

    const transformationPrompt = process.env.TRANSFORMATION_PROMPT

    if (!transformationPrompt) {
      console.log("[v0] Error: No transformation prompt configured")
      return NextResponse.json({ error: "Transformation prompt not configured" }, { status: 500 })
    }

    const apiFormData = new FormData()
    apiFormData.append("model", "gpt-image-1")
    apiFormData.append("image", image)
    apiFormData.append("prompt", transformationPrompt)

    console.log("[v0] Making request to image edits endpoint with gpt-image-1")

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: apiFormData,
    })

    console.log("[v0] OpenAI response status:", response.status)

    if (response.ok) {
      const result = await response.json()
      console.log("[v0] Image transformation successful with gpt-image-1")
      return NextResponse.json(result)
    }

    const errorData = await response.json()
    console.log("[v0] gpt-image-1 failed:", errorData.error?.message)

    if (errorData.error?.message?.includes("organization must be verified")) {
      return NextResponse.json(
        {
          error:
            "Organization verification is still propagating. Please wait up to 15 minutes after verification and try again.",
        },
        { status: 403 },
      )
    }

    if (errorData.error?.code === "billing_hard_limit_reached") {
      return NextResponse.json(
        {
          error: "OpenAI billing limit reached. Please add credits to your OpenAI account.",
        },
        { status: 402 },
      )
    }

    return NextResponse.json(
      {
        error: errorData.error?.message || "Failed to process image",
      },
      { status: response.status },
    )
  } catch (error) {
    console.error("[v0] API route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
