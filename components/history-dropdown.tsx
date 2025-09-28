"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Trash2, Image, RefreshCw } from "lucide-react"

interface TransformHistory {
  id: string
  originalName: string
  resultUrl: string
  timestamp: number
}

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [history, setHistory] = useState<TransformHistory[]>([])

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('liquify-history')
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        const sortedHistory = parsedHistory.sort((a: TransformHistory, b: TransformHistory) => b.timestamp - a.timestamp)
        setHistory(sortedHistory) // Show all history in modal
      }
    } catch (error) {
      console.error('Error loading history:', error)
      setHistory([])
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  // Listen for history updates
  useEffect(() => {
    const handleHistoryUpdate = () => {
      if (isOpen) {
        loadHistory()
      }
    }

    window.addEventListener('historyUpdated', handleHistoryUpdate)
    return () => window.removeEventListener('historyUpdated', handleHistoryUpdate)
  }, [isOpen])

  const handleDownload = (resultUrl: string, originalName: string) => {
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = `liquified_${originalName}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    
    // Update localStorage
    const allHistory = JSON.parse(localStorage.getItem('liquify-history') || '[]')
    const filteredHistory = allHistory.filter((item: TransformHistory) => item.id !== id)
    localStorage.setItem('liquify-history', JSON.stringify(filteredHistory))
  }

  const clearAllHistory = () => {
    setHistory([])
    localStorage.removeItem('liquify-history')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2A4A3F] border-[#2A4A3F] text-white w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg sm:text-xl">Recent Transforms</DialogTitle>
          <DialogDescription className="text-white/70 text-sm sm:text-base">
            Your recently transformed images
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Image className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p className="text-sm sm:text-base">No transform history found</p>
              <p className="text-xs sm:text-sm">Your transformed images will appear here</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <p className="text-xs sm:text-sm text-white/70">
                  {history.length} {history.length === 1 ? 'image' : 'images'} in history
                </p>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={loadHistory}
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10 flex-1 sm:flex-none"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    onClick={clearAllHistory}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1 sm:flex-none"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {history.map((item) => (
                  <div key={item.id} className="bg-[#162F29] rounded-lg p-3 sm:p-4 space-y-3">
                    <div className="relative">
                      <img
                        src={item.resultUrl}
                        alt={`Liquified ${item.originalName}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-white text-xs sm:text-sm truncate">
                        {item.originalName}
                      </h4>
                      <p className="text-xs text-white/60">
                        {formatDate(item.timestamp)}
                      </p>
                      
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => handleDownload(item.resultUrl, item.originalName)}
                          size="sm"
                          className="bg-white text-[#162F29] hover:bg-white/90"
                          title="Download image"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          title="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
