"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  autoCloseTime?: number // in seconds
}

export function Modal({ isOpen, onClose, title, message, autoCloseTime = 10 }: ModalProps) {
  const [countdown, setCountdown] = useState(autoCloseTime)

  useEffect(() => {
    if (!isOpen) return

    setCountdown(autoCloseTime)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, autoCloseTime, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6 border-0 shadow-2xl" style={{ backgroundColor: "#343941" }}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-slate-700 p-1 h-auto">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <p className="text-lg mb-6" style={{ color: "#C9CCD1" }}>
          {message}
        </p>

        <div className="text-right text-sm" style={{ color: "#C9CCD1" }}>
          Closing in {countdown} seconds
        </div>
      </Card>
    </div>
  )
}
