"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image, Sparkles, Download, Share2 } from "lucide-react"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveToHistory = (originalName: string, resultUrl: string) => {
    try {
      console.log('=== SAVING TO HISTORY ===')
      console.log('Original name:', originalName)
      console.log('Result URL length:', resultUrl.length)
      
      const historyItem = {
        id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        originalName,
        resultUrl,
        timestamp: Date.now()
      }
      
      // Get existing history
      let history = []
      try {
        const existing = localStorage.getItem('goatoweenfy-history')
        if (existing) {
          history = JSON.parse(existing)
          console.log('Loaded existing history:', history.length, 'items')
        }
      } catch (e) {
        console.log('No existing history or parse error, starting fresh')
        history = []
      }
      
      // Add new item to the beginning
      history.unshift(historyItem)
      
      // Keep only the last 50 items
      const limitedHistory = history.slice(0, 50)
      
      console.log('Final history count:', limitedHistory.length)
      console.log('History items:', limitedHistory.map((item: any) => ({ 
        id: item.id, 
        name: item.originalName, 
        timestamp: new Date(item.timestamp).toLocaleString() 
      })))
      
      // Save to localStorage
      localStorage.setItem('goatoweenfy-history', JSON.stringify(limitedHistory))
      
      // Verify save
      const verification = localStorage.getItem('goatoweenfy-history')
      const verified = verification ? JSON.parse(verification) : []
      console.log('Verification - saved items:', verified.length)
      
      // Notify history modal
      window.dispatchEvent(new CustomEvent('historyUpdated'))
      console.log('=== HISTORY SAVE COMPLETE ===')
      
    } catch (error) {
      console.error('CRITICAL ERROR saving to history:', error)
    }
  }

  const handleUpload = async () => {
    console.log("[v0] Upload started, file:", file)
    if (!file) {
      console.log("[v0] No file selected")
      return
    }

    console.log("[v0] File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append("image", file)
    console.log("[v0] FormData created with file")

    try {
      console.log("[v0] Making API call to /api/convert")
      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] API response status:", res.status)
      const data = await res.json()
      console.log("[v0] API response data:", data)

      if (!res.ok) {
        console.log("[v0] API error:", data.error)
        setError(data.error || "Failed to process image")
        return
      }

      if (data?.data?.[0]?.b64_json) {
        const base64Image = data.data[0].b64_json
        const imageUrl = `data:image/png;base64,${base64Image}`
        console.log("[v0] Setting result from base64 data")
        setResult(imageUrl)
        
        // Save to localStorage
        if (file) {
          console.log("[v0] Saving to history - file:", file.name)
          saveToHistory(file.name, imageUrl)
        } else {
          console.error("[v0] File object is null when trying to save to history")
        }
      } else if (data?.data?.[0]?.url) {
        console.log("[v0] Setting result from URL:", data.data[0].url)
        setResult(data.data[0].url)
        
        // Save to localStorage
        if (file) {
          console.log("[v0] Saving to history - file:", file.name)
          saveToHistory(file.name, data.data[0].url)
        } else {
          console.error("[v0] File object is null when trying to save to history")
        }
      } else {
        console.log("[v0] No image data found in response")
        console.log("[v0] Full API response:", data)
        setError("No image data received from API")
      }
    } catch (error) {
      console.error("[v0] Upload failed:", error)
      setError("Network error occurred. Please try again.")
    } finally {
      setLoading(false)
      console.log("[v0] Upload process completed")
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDownload = (imageUrl: string, filename: string) => {
    try {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `goatoweenfied_${filename}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleShareOnX = async (imageUrl: string, filename: string) => {
    try {
      // First download the image
      handleDownload(imageUrl, filename)
      
      // Then open Twitter with pre-filled text
      const text = encodeURIComponent("I just transformed my image into Goatoweenfy art using @goatoweenfy ! ✨")
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`
      window.open(twitterUrl, '_blank')
    } catch (error) {
      console.error('Share on X failed:', error)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    console.log("[v0] File dropped")
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      console.log("[v0] Dropped file:", {
        name: droppedFile.name,
        size: droppedFile.size,
        type: droppedFile.type,
      })
      setFile(droppedFile)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  return (
    <div className="relative min-h-screen text-white">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/goato.webp)' }}
      >
        {/* Optional dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/liq.webp" 
              alt="Goatoweenfy Logo" 
              className="w-12 h-12 object-contain border-1 border-white rounded-lg p-1"
            />
            <h1 className="text-4xl font-bold text-white">
              Goatoweenfication
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Transform your images into stunning Goatoweenfy art.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Upload Section */}
          <Card className="bg-[#2A4A3F]/50 border-[#2A4A3F] card-animate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Upload className="w-5 h-5 text-white" />
                Upload Image
              </CardTitle>
              <CardDescription className="text-white/70">Choose an image to transform into Halloween art</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-white bg-white/10" : "border-white/30 hover:border-white/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {filePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-full max-w-xs mx-auto rounded-lg"
                    />
                    <p className="text-white/80 text-sm">Preview of selected image</p>
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-[#2A4A3F] hover:bg-[#2A4A3F]/80 rounded-lg cursor-pointer transition-colors text-white"
                    >
                      Change File
                    </label>
                  </div>
                ) : (
                  <div>
                    <Image className="w-12 h-12 text-white/60 mx-auto mb-4" />
                    <p className="text-white/80 mb-2">Drag and drop your image here, or click to select</p>
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-[#2A4A3F] hover:bg-[#2A4A3F]/80 rounded-lg cursor-pointer transition-colors text-white"
                    >
                      Select File
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null
                    console.log(
                      "[v0] File selected via input:",
                      selectedFile
                        ? {
                            name: selectedFile.name,
                            size: selectedFile.size,
                            type: selectedFile.type,
                          }
                        : "No file",
                    )
                    setFile(selectedFile)
                    
                    // Create preview
                    if (selectedFile) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        setFilePreview(e.target?.result as string)
                      }
                      reader.readAsDataURL(selectedFile)
                    } else {
                      setFilePreview(null)
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
              </div>

              {file && (
                <div className="text-sm text-white/80 p-3 bg-[#2A4A3F]/50 rounded-lg">Selected: {file.name}</div>
              )}

              {error && (
                <div className="text-sm text-red-400 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                  <div className="font-medium mb-1">Error:</div>
                  {error}
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-white text-[#162F29] hover:bg-white/90"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#162F29]/30 border-t-[#162F29] rounded-full animate-spin" />
                    Goatoweenfying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Transform Image
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="bg-[#2A4A3F]/50 border-[#2A4A3F] card-animate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-white" />
                Goatoweenfied Result
              </CardTitle>
              <CardDescription className="text-white/70">Your transformed Halloween art will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border-2 border-white/30">
                    <img src={result || "/placeholder.svg"} alt="Goatoweenfied result" className="w-full h-auto" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownload(result, file?.name || 'image')}
                      variant="outline"
                      className="flex-1 border-white/30 text-white hover:bg-white/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleShareOnX(result, file?.name || 'image')}
                      variant="outline"
                      className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share on X
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-white/30 rounded-lg">
                  <div className="text-center text-white/60">
                    <Image className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p>Your goatoweenfied image will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-3 card-animate">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">Upload</h3>
              <p className="text-white/70 text-sm">Choose any image from your device</p>
            </div>
            <div className="space-y-3 card-animate">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">Transform</h3>
              <p className="text-white/70 text-sm">Goatoweenfy creates a Goatoweenfication art version</p>
            </div>
            <div className="space-y-3 card-animate">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">Download</h3>
              <p className="text-white/70 text-sm">Get your stunning Goatoweenfy artwork</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
