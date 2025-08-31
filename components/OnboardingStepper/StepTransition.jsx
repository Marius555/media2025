"use client"

import { motion, AnimatePresence } from "motion/react"

const StepTransition = ({ currentStep, direction = 1, children }) => {
  // Animation variants for smooth step transitions
  const slideVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
      scale: 0.95
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier curve for smooth animation
        opacity: { duration: 0.3 },
        scale: { duration: 0.35 }
      }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
          style={{
            // Use transform3d for better GPU acceleration
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden"
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default StepTransition