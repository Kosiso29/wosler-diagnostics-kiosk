"use client"

import { useEffect, useRef } from "react"

export function useIdleTimer(onIdle: () => void, timeout = 45000) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(onIdle, timeout)
  }

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const resetTimerHandler = () => resetTimer()

    // Set initial timer
    resetTimer()

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimerHandler, true)
    })

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimerHandler, true)
      })
    }
  }, [onIdle, timeout])
}
