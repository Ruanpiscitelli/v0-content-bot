const API_ENDPOINT = "https://n8n-wh.datavibe.ad/webhook/5f1c0c82-0ff9-40c7-9e2e-b1a96ffe24cd/chat"

import { collectDeviceData } from "./device-data"

export async function sendMessage(text: string) {
  try {
    console.log("Starting to collect device data...")

    // Collect comprehensive device data with timeout
    let deviceDataResult
    try {
      // Set a timeout for device data collection
      const deviceDataPromise = collectDeviceData()
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Device data collection timeout")), 3000)
      })

      deviceDataResult = await Promise.race([deviceDataPromise, timeoutPromise]).catch((error) => {
        console.warn("Device data collection failed or timed out:", error)
        // Return a minimal fallback object
        return {
          deviceData: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            error: `Collection failed: ${error instanceof Error ? error.message : String(error)}`,
          },
          fingerprint: {
            visitorId: "fallback_id",
          },
        }
      })

      console.log("Device data collection completed")
    } catch (error) {
      console.error("Critical error in device data collection:", error)
      // Provide minimal fallback data
      deviceDataResult = {
        deviceData: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          error: `Critical collection error: ${error instanceof Error ? error.message : String(error)}`,
        },
        fingerprint: {
          visitorId: "error_fallback_id",
        },
      }
    }

    // Create payload with the same structure as the example
    const payload = {
      message: text,
      type: "text",
      deviceData: deviceDataResult,
    }

    console.log("Sending payload to webhook...")

    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId) // Clear the timeout

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Failed to get error text")
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Handle text response
      const textResponse = await response.text()
      console.log("Response received successfully")
      return { message: textResponse || "Received empty response from server" }
    } catch (error) {
      clearTimeout(timeoutId) // Clear the timeout

      if (error.name === "AbortError") {
        console.error("Request timed out after 10 seconds")
        throw new Error("Request timed out. Please try again.")
      }

      throw error // Re-throw other errors
    }
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export async function sendImage(file: File) {
  try {
    console.log("Starting to collect device data for image upload...")

    // Collect comprehensive device data with timeout
    let deviceDataResult
    try {
      // Set a timeout for device data collection
      const deviceDataPromise = collectDeviceData()
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Device data collection timeout")), 3000)
      })

      deviceDataResult = await Promise.race([deviceDataPromise, timeoutPromise]).catch((error) => {
        console.warn("Device data collection failed or timed out:", error)
        // Return a minimal fallback object
        return {
          deviceData: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            error: `Collection failed: ${error instanceof Error ? error.message : String(error)}`,
          },
          fingerprint: {
            visitorId: "fallback_id",
          },
        }
      })

      console.log("Device data collection completed")
    } catch (error) {
      console.error("Critical error in device data collection:", error)
      // Provide minimal fallback data
      deviceDataResult = {
        deviceData: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          error: `Critical collection error: ${error instanceof Error ? error.message : String(error)}`,
        },
        fingerprint: {
          visitorId: "error_fallback_id",
        },
      }
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "image")
    formData.append("deviceData", JSON.stringify(deviceDataResult))

    console.log("Sending image with device data to webhook...")

    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout for image uploads

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId) // Clear the timeout

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Failed to get error text")
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Handle text response
      const textResponse = await response.text()
      console.log("Response received successfully")
      return { message: textResponse || "Received empty response from server" }
    } catch (error) {
      clearTimeout(timeoutId) // Clear the timeout

      if (error.name === "AbortError") {
        console.error("Image upload request timed out")
        throw new Error("Image upload timed out. Please try again with a smaller image.")
      }

      throw error // Re-throw other errors
    }
  } catch (error) {
    console.error("Error sending image:", error)
    throw error
  }
}
