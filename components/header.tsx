"use client"

import Link from "next/link"
import { useState } from "react"
import ShareModal from "./share-modal"
import HistoryModal from "./history-modal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export default function Header() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const contractAddress = "Adding ca after token launch" // Replace with actual contract address

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
  return (
    <header className="sticky top-0 z-50 bg-[#162F29] border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/liq.webp" 
              alt="Goatoweenfy Logo" 
              className="w-8 h-8 object-contain border-1 border-white rounded-lg p-1"
            />
            <h1 className="text-2xl font-bold text-white">
              Goatoweenfy
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setIsContractModalOpen(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              Contract Address
            </button>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              History
            </button>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              Share
            </button>
            <Link 
              href="https://x.com/goatoweenfy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Follow us on X"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-white/10 bg-[#162F29]">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button 
                onClick={() => {
                  setIsContractModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left text-white/80 hover:text-white transition-colors py-2"
              >
                Contract Address
              </button>
              <button 
                onClick={() => {
                  setIsHistoryModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left text-white/80 hover:text-white transition-colors py-2"
              >
                History
              </button>
              <button 
                onClick={() => {
                  setIsShareModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left text-white/80 hover:text-white transition-colors py-2"
              >
                Share
              </button>
              <Link 
                href="https://x.com/goatoweenfy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-white/80 hover:text-white transition-colors py-2"
                aria-label="Follow us on X "
              >
                X
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
        />
        
        {/* Contract Address Modal */}
        <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
          <DialogContent className="bg-[#2A4A3F] border-[#2A4A3F] text-white w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg sm:text-xl">Contract Address</DialogTitle>
              <DialogDescription className="text-white/70 text-sm sm:text-base">
                Copy the contract address for Goatoweenfy token
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Contract Address</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={contractAddress}
                    readOnly
                    className="bg-[#162F29] border-[#2A4A3F] text-white text-xs sm:text-sm flex-1 font-mono"
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
                {copied ? "Contract address copied to clipboard!" : "Click the copy button to copy the contract address"}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>
    )
  }
