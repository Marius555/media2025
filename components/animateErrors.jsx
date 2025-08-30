"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function AnimateErrors({ 
  error, 
  className,
  variant = "field", // "field" | "form" | "toast"
  type = "error", // "error" | "success"
  ...props 
}) {
  // Show toast for server errors when variant is "toast"
  useEffect(() => {
    if (error && variant === "toast") {
      if (type === "success") {
        toast.success(error, {
          duration: 3000,
          position: "bottom-right",
        })
      } else {
        toast.error(error, {
          duration: 4000,
          position: "bottom-right",
        })
      }
    }
  }, [error, variant, type])

  // Don't render anything for toast variant - toast handles the display
  if (variant === "toast") {
    return null
  }

  const variantStyles = {
    field: "text-sm text-red-500",
    form: cn(
      "text-sm px-3 py-2 rounded-md border",
      type === "success" 
        ? "bg-green-50 border-green-200 text-green-600 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400"
        : "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"
    )
  }

  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.div
          key={error} // Re-animate when error message changes
          initial={{ 
            opacity: 0, 
            height: 0,
            y: -10,
            marginTop: 0,
            marginBottom: 0 
          }}
          animate={{ 
            opacity: 1, 
            height: "auto",
            y: 0,
            marginTop: variant === "field" ? 4 : 8,
            marginBottom: 0
          }}
          exit={{ 
            opacity: 0, 
            height: 0,
            y: -10,
            marginTop: 0,
            marginBottom: 0
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1], // Custom easing for smooth feel
            height: { duration: 0.3 },
            opacity: { duration: 0.2 }
          }}
          className={cn(
            "overflow-hidden",
            variantStyles[variant],
            className
          )}
          {...props}
        >
          <motion.div 
            className={variant === "form" ? "flex items-center gap-2" : ""}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {variant === "form" && (
              <motion.svg
                className="h-4 w-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, duration: 0.3, ease: "backOut" }}
              >
                {type === "success" ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                )}
              </motion.svg>
            )}
            <span>{error}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}