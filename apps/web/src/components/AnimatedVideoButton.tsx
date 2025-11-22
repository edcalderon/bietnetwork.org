"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"

interface AnimatedVideoButtonProps {
  onClick: () => void
  text?: string
  className?: string
}

export default function AnimatedVideoButton({ 
  onClick, 
  text = "Watch Video",
  className = "" 
}: AnimatedVideoButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      initial={{ width: 56, height: 56 }}
      whileHover={{ width: 180 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={onClick}
      className={`!bg-white/15 dark:bg-emerald-500/30 backdrop-blur-sm !border-white/25 dark:border-emerald-400/50 !hover:bg-white/25 dark:hover:bg-emerald-500/40 flex items-center justify-center overflow-hidden relative cursor-pointer shadow-lg !hover:shadow-white/25 dark:hover:shadow-emerald-400/50 ${className}`}
      style={{ borderRadius: 28 }}
    >
      {/* Play Icon - fades out on hover */}
      <motion.div
        className="absolute"
        animate={{ 
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 0.8 : 1
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
      </motion.div>

      {/* Text - fades in on hover */}
      <motion.div
        className="w-full flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0, ease: "easeInOut" }}
      >
        <span className="text-white text-sm font-medium whitespace-nowrap">
          {text}
        </span>
      </motion.div>
    </motion.div>
  )
}
