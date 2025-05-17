"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Trash2, Check, X } from "lucide-react"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Helper function to create a canvas with the cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.crossOrigin = "anonymous" // This avoids CORS issues
    image.src = url
  })

// Helper function to get the cropped canvas
async function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return null
  }

  // Set canvas size to the cropped size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  // Convert canvas to blob
  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
      },
      "image/jpeg",
      0.95,
    )
  })
}

export default function ProfilePicture() {
  const [avatar, setAvatar] = useState("/woman-profile.png")
  const [isLoading, setIsLoading] = useState(false)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string)
          setIsCropperOpen(true)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = useCallback(
    (_: any, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    [],
  )

  const handleCropCancel = () => {
    setIsCropperOpen(false)
    setImageSrc(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCropConfirm = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        setIsLoading(true)
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)

        if (croppedImage) {
          // Upload to Vercel Blob
          const formData = new FormData()
          formData.append("file", croppedImage, "avatar.jpg")

          // Get the upload URL from Vercel Blob
          const response = await fetch("/api/upload-image", {
            method: "POST",
            body: JSON.stringify({ filename: "avatar.jpg", contentType: "image/jpeg" }),
            headers: {
              "Content-Type": "application/json",
            },
          })

          const { url, uploadUrl } = await response.json()

          // Upload the file to the provided URL
          await fetch(uploadUrl, {
            method: "PUT",
            body: croppedImage,
            headers: {
              "Content-Type": "image/jpeg",
            },
          })

          // Update avatar with the new URL
          setAvatar(url)
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been updated successfully.",
          })
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "There was an error uploading your profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsCropperOpen(false)
      setImageSrc(null)
    }
  }

  const handleRemove = () => {
    setAvatar("/woman-profile.png") // Reset to default avatar
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed.",
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-6">
          <Avatar className="h-32 w-32">
            <AvatarImage src={avatar || "/placeholder.svg"} alt="Profile picture" />
            <AvatarFallback>VP</AvatarFallback>
          </Avatar>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <div className="relative">
              <input
                type="file"
                id="avatar-upload"
                ref={fileInputRef}
                accept="image/*"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleAvatarChange}
              />
              <Button type="button" variant="outline" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Upload photo
              </Button>
            </div>

            <Button type="button" variant="outline" onClick={handleRemove} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Accepted formats: JPG, PNG. Max size: 5MB.</p>
          </div>
        </div>
      </CardContent>

      {/* Image Cropper Dialog */}
      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="relative h-64 w-full mt-4">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
              />
            )}
          </div>

          <div className="mt-4">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleCropCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} disabled={isLoading}>
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Apply
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
