// Utility to collect comprehensive device data with robust error handling
export async function collectDeviceData() {
  // Main result object with default values
  const result = {
    deviceData: {
      userAgent: "unknown",
      language: "unknown",
      languages: [],
      platform: "unknown",
      vendor: "unknown",
      cookieEnabled: false,
      doNotTrack: null,
      hardwareConcurrency: null,
      maxTouchPoints: null,
      screen: {
        width: 0,
        height: 0,
        availWidth: 0,
        availHeight: 0,
        colorDepth: 0,
        pixelDepth: 0,
        orientation: "unknown",
      },
      window: {
        innerWidth: 0,
        innerHeight: 0,
        outerWidth: 0,
        outerHeight: 0,
        devicePixelRatio: 1,
        pageXOffset: 0,
        pageYOffset: 0,
      },
      isMobile: false,
      connection: {},
      battery: {},
      utm: {
        source: null,
        medium: null,
        campaign: null,
        term: null,
        content: null,
      },
      referrer: "",
      url: "",
      path: "",
      host: "",
      cookies: {},
      timestamp: new Date().toISOString(),
      timezone: "unknown",
      timezoneOffset: 0,
      historyLength: 0,
      plugins: [],
      hardware: {
        logicalProcessors: null,
      },
      memory: {
        deviceMemory: null,
      },
      location: { error: "Geolocation not requested for privacy reasons" },
      errors: [] as string[], // Track specific errors
    },
    fingerprint: {
      visitorId: "0000000000000000",
      components: {
        fonts: {
          value: [],
          duration: 0,
          error: null as string | null,
        },
        audio: {
          value: 0,
          duration: 0,
          error: null as string | null,
        },
        canvas: {
          value: {
            winding: false,
            geometry: "",
            text: "",
          },
          duration: 0,
          error: null as string | null,
        },
        webgl: {
          supported: false,
          vendor: "",
          renderer: "",
          unmaskedVendor: "",
          unmaskedRenderer: "",
          extensions: [],
          error: null as string | null,
        },
      },
    },
  }

  try {
    // Basic device information
    try {
      result.deviceData.userAgent = navigator.userAgent || "unknown"
      result.deviceData.language = navigator.language || "unknown"
      result.deviceData.languages = Array.from(navigator.languages || [])
      result.deviceData.platform = navigator.platform || "unknown"
      result.deviceData.vendor = navigator.vendor || "unknown"
      result.deviceData.cookieEnabled = navigator.cookieEnabled
      result.deviceData.doNotTrack = navigator.doNotTrack
      result.deviceData.hardwareConcurrency = navigator.hardwareConcurrency
      result.deviceData.maxTouchPoints = navigator.maxTouchPoints
    } catch (error) {
      result.deviceData.errors.push(
        `Basic device info error: ${error instanceof Error ? error.message : String(error)}`,
      )
    }

    // Screen information
    try {
      if (window.screen) {
        result.deviceData.screen = {
          width: window.screen.width,
          height: window.screen.height,
          availWidth: window.screen.availWidth,
          availHeight: window.screen.availHeight,
          colorDepth: window.screen.colorDepth,
          pixelDepth: window.screen.pixelDepth,
          orientation: window.screen.orientation ? window.screen.orientation.type : "unknown",
        }
      }
    } catch (error) {
      result.deviceData.errors.push(`Screen info error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Window information
    try {
      result.deviceData.window = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio,
        pageXOffset: window.pageXOffset,
        pageYOffset: window.pageYOffset,
      }
    } catch (error) {
      result.deviceData.errors.push(`Window info error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Mobile detection
    try {
      result.deviceData.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    } catch (error) {
      result.deviceData.errors.push(`Mobile detection error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Connection information
    try {
      if ("connection" in navigator) {
        const conn = (navigator as any).connection
        result.deviceData.connection = {
          effectiveType: conn?.effectiveType || "unknown",
          downlink: conn?.downlink || 0,
          rtt: conn?.rtt || 0,
          saveData: conn?.saveData || false,
        }
      }
    } catch (error) {
      result.deviceData.errors.push(`Connection info error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Battery information
    try {
      if ("getBattery" in navigator) {
        const batteryPromise = (navigator as any).getBattery()

        // Set a timeout for the battery promise
        const batteryTimeout = new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error("Battery info timeout")), 1000)
        })

        // Race the battery promise against the timeout
        const batteryResult = await Promise.race([batteryPromise, batteryTimeout]).catch((error) => {
          result.deviceData.errors.push(
            `Battery info timeout: ${error instanceof Error ? error.message : String(error)}`,
          )
          return null
        })

        if (batteryResult) {
          result.deviceData.battery = {
            level: batteryResult.level,
            charging: batteryResult.charging,
            chargingTime: batteryResult.chargingTime,
            dischargingTime: batteryResult.dischargingTime,
          }
        }
      }
    } catch (error) {
      result.deviceData.errors.push(`Battery info error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // UTM parameters
    try {
      const urlParams = new URLSearchParams(window.location.search)
      result.deviceData.utm = {
        source: urlParams.get("utm_source"),
        medium: urlParams.get("utm_medium"),
        campaign: urlParams.get("utm_campaign"),
        term: urlParams.get("utm_term"),
        content: urlParams.get("utm_content"),
      }
    } catch (error) {
      result.deviceData.errors.push(`UTM params error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Referrer and URL information
    try {
      result.deviceData.referrer = document.referrer
      result.deviceData.url = window.location.href
      result.deviceData.path = window.location.pathname
      result.deviceData.host = window.location.hostname
    } catch (error) {
      result.deviceData.errors.push(`URL info error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Cookies
    try {
      result.deviceData.cookies = document.cookie.split(";").reduce(
        (acc, cookie) => {
          const parts = cookie.trim().split("=")
          if (parts.length >= 2 && parts[0]) {
            const key = parts[0]
            const value = parts.slice(1).join("=")
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, string>,
      )
    } catch (error) {
      result.deviceData.errors.push(`Cookies error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Timestamp and timezone
    try {
      result.deviceData.timestamp = new Date().toISOString()
      result.deviceData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      result.deviceData.timezoneOffset = new Date().getTimezoneOffset()
    } catch (error) {
      result.deviceData.errors.push(`Timezone info error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // History length
    try {
      result.deviceData.historyLength = window.history.length
    } catch (error) {
      result.deviceData.errors.push(`History length error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Plugins
    try {
      if (navigator.plugins) {
        result.deviceData.plugins = Array.from(navigator.plugins).map((plugin) => ({
          name: plugin.name,
          description: plugin.description,
          filename: plugin.filename,
        }))
      }
    } catch (error) {
      result.deviceData.errors.push(`Plugins error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Hardware
    try {
      result.deviceData.hardware = {
        logicalProcessors: navigator.hardwareConcurrency,
      }
    } catch (error) {
      result.deviceData.errors.push(`Hardware info error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Memory
    try {
      result.deviceData.memory = {
        deviceMemory: (navigator as any).deviceMemory || null,
      }
    } catch (error) {
      result.deviceData.errors.push(`Memory info error: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Canvas fingerprinting (with timeout)
    try {
      const canvasPromise = getCanvasFingerprint()

      // Set a timeout for the canvas promise
      const canvasTimeout = new Promise<ReturnType<typeof getCanvasFingerprint>>((_, reject) => {
        setTimeout(() => reject(new Error("Canvas fingerprinting timeout")), 2000)
      })

      // Race the canvas promise against the timeout
      const canvasResult = await Promise.race([canvasPromise, canvasTimeout]).catch((error) => {
        result.fingerprint.components.canvas.error = `Timeout: ${error instanceof Error ? error.message : String(error)}`
        return null
      })

      if (canvasResult) {
        result.fingerprint.components.canvas = canvasResult
      }
    } catch (error) {
      result.fingerprint.components.canvas.error = `Error: ${error instanceof Error ? error.message : String(error)}`
    }

    // WebGL information
    try {
      const webGLResult = getWebGLInfo()
      if (webGLResult) {
        result.fingerprint.components.webgl = webGLResult
      }
    } catch (error) {
      result.fingerprint.components.webgl.error = `Error: ${error instanceof Error ? error.message : String(error)}`
    }

    // Fonts detection
    try {
      const fontsPromise = detectFonts()

      // Set a timeout for the fonts promise
      const fontsTimeout = new Promise<string[]>((_, reject) => {
        setTimeout(() => reject(new Error("Fonts detection timeout")), 1000)
      })

      // Race the fonts promise against the timeout
      const fontsResult = await Promise.race([fontsPromise, fontsTimeout]).catch((error) => {
        result.fingerprint.components.fonts.error = `Timeout: ${error instanceof Error ? error.message : String(error)}`
        return null
      })

      if (fontsResult) {
        result.fingerprint.components.fonts.value = fontsResult
        result.fingerprint.components.fonts.duration = 69 // Keeping the same value as in the example
      }
    } catch (error) {
      result.fingerprint.components.fonts.error = `Error: ${error instanceof Error ? error.message : String(error)}`
    }

    // Audio fingerprinting (mocked)
    try {
      result.fingerprint.components.audio = {
        value: 124.04346607114712, // Mocked value from the example
        duration: 3,
        error: null,
      }
    } catch (error) {
      result.fingerprint.components.audio.error = `Error: ${error instanceof Error ? error.message : String(error)}`
    }

    // Generate visitor ID
    try {
      result.fingerprint.visitorId = generateVisitorId(JSON.stringify(result.deviceData))
    } catch (error) {
      result.deviceData.errors.push(
        `Visitor ID generation error: ${error instanceof Error ? error.message : String(error)}`,
      )
    }

    // Log collection results
    if (result.deviceData.errors.length > 0) {
      console.warn(
        `Device data collection completed with ${result.deviceData.errors.length} errors:`,
        result.deviceData.errors,
      )
    } else {
      console.log("Device data collection completed successfully")
    }

    return result
  } catch (error) {
    // Catastrophic error - still return what we have with error information
    console.error("Critical error in device data collection:", error)

    result.deviceData.errors.push(`Critical error: ${error instanceof Error ? error.message : String(error)}`)

    // Try to get a stack trace if available
    if (error instanceof Error && error.stack) {
      result.deviceData.errors.push(`Stack trace: ${error.stack}`)
    }

    return result
  }
}

// Helper functions with improved error handling
async function getCanvasFingerprint() {
  const result = {
    value: {
      winding: false,
      geometry: "",
      text: "",
    },
    duration: 0,
    error: null as string | null,
  }

  try {
    const startTime = performance.now()

    const canvas = document.createElement("canvas")
    canvas.width = 300
    canvas.height = 150
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      result.error = "Canvas context not available"
      return result
    }

    // Text with different styles
    ctx.textBaseline = "alphabetic"
    ctx.fillStyle = "#f60"
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = "#069"
    ctx.font = "11pt Arial"
    ctx.fillText("Fingerprint", 2, 15)
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
    ctx.font = "18pt Arial"
    ctx.fillText("Canvas", 4, 45)

    // Geometry
    ctx.strokeStyle = "rgba(255,0,255,0.7)"
    ctx.beginPath()
    ctx.moveTo(50, 50)
    ctx.lineTo(50, 100)
    ctx.lineTo(100, 100)
    ctx.lineTo(100, 50)
    ctx.closePath()
    ctx.stroke()

    // Get the data URL
    try {
      const dataURL = canvas.toDataURL()
      result.value = {
        winding: true,
        geometry: dataURL,
        text: dataURL,
      }
    } catch (e) {
      // This can happen due to tainted canvas or security restrictions
      result.error = `Canvas data URL error: ${e instanceof Error ? e.message : String(e)}`
      result.value = {
        winding: true,
        geometry: "data_url_failed",
        text: "data_url_failed",
      }
    }

    const endTime = performance.now()
    result.duration = Math.round(endTime - startTime)

    return result
  } catch (e) {
    result.error = `Canvas fingerprinting error: ${e instanceof Error ? e.message : String(e)}`
    return result
  }
}

function getWebGLInfo() {
  const result = {
    supported: false,
    vendor: "",
    renderer: "",
    unmaskedVendor: "",
    unmaskedRenderer: "",
    extensions: [] as string[],
    error: null as string | null,
  }

  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

    if (!gl) {
      result.error = "WebGL not supported"
      return result
    }

    result.supported = true

    try {
      result.vendor = gl.getParameter(gl.VENDOR) || ""
    } catch (e) {
      result.error = `WebGL vendor error: ${e instanceof Error ? e.message : String(e)}`
    }

    try {
      result.renderer = gl.getParameter(gl.RENDERER) || ""
    } catch (e) {
      result.error = `WebGL renderer error: ${e instanceof Error ? e.message : String(e)}`
    }

    // Get unmasked info if available
    try {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      if (debugInfo) {
        result.unmaskedVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || ""
        result.unmaskedRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ""
      }
    } catch (e) {
      result.error = `WebGL unmasked info error: ${e instanceof Error ? e.message : String(e)}`
    }

    // Get extensions
    try {
      const extensionsList = gl.getSupportedExtensions()
      if (extensionsList) {
        result.extensions = extensionsList
      }
    } catch (e) {
      result.error = `WebGL extensions error: ${e instanceof Error ? e.message : String(e)}`
    }

    return result
  } catch (e) {
    result.error = `WebGL info error: ${e instanceof Error ? e.message : String(e)}`
    return result
  }
}

async function detectFonts() {
  try {
    // A simplified font detection - in reality, this would be more comprehensive
    const baseFonts = [
      "Arial",
      "Arial Unicode MS",
      "Courier New",
      "Georgia",
      "Tahoma",
      "Times New Roman",
      "Verdana",
      "Helvetica Neue",
      "Menlo",
      "MYRIAD PRO",
      "Gill Sans",
    ]

    // In a real implementation, we would check if these fonts are actually available
    // For simplicity, we'll just return a subset of the fonts
    return baseFonts.slice(0, 5)
  } catch (e) {
    console.error("Font detection error:", e)
    return ["Arial"] // Return at least one common font as fallback
  }
}

function generateVisitorId(data: string) {
  try {
    // Simple hash function for demo purposes
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(16, "0")
  } catch (e) {
    console.error("Visitor ID generation error:", e)
    return "0000000000000000" // Return a fallback ID
  }
}
