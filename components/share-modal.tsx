"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2A4A3F] border-[#2A4A3F] text-white w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg sm:text-xl">Share Liquify</DialogTitle>
          <DialogDescription className="text-white/70 text-sm sm:text-base">
            Share this amazing AI-powered image transformation tool with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Website Link</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={websiteUrl}
                readOnly
                className="bg-[#162F29] border-[#2A4A3F] text-white text-xs sm:text-sm flex-1"
              />
              <Button
                onClick={handleCopy}
                className="bg-white text-[#162F29] hover:bg-white/90 w-full sm:w-auto"
                size="sm"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="ml-2 sm:hidden">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </Button>
            </div>
          </div>
          
          <div className="text-xs sm:text-sm text-white/60 text-center sm:text-left">
            {copied ? "Link copied to clipboard!" : "Click the copy button to share this link"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
