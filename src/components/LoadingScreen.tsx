import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // Complete loading after 5 seconds
    const timeout = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900"
    >
      <div className="text-center">
        {/* Helios Engine Logo with Rotating Rust Gear */}
        <div className="relative mb-8 flex items-center justify-center w-[300px] h-[300px] mx-auto">
          {/* Rotating Rust Gear Background */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg
              width="300"
              height="300"
              viewBox="0 0 500 500"
              className="absolute"
            >
              {/* Gear outer ring */}
              <circle cx="250" cy="250" r="220" fill="none" stroke="#CE412B" strokeWidth="10" opacity="0.3" />
              
              {/* Gear teeth */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180
                const x1 = 250 + 210 * Math.cos(angle)
                const y1 = 250 + 210 * Math.sin(angle)
                const x2 = 250 + 240 * Math.cos(angle)
                const y2 = 250 + 240 * Math.sin(angle)
                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#CE412B"
                      strokeWidth="25"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                  </g>
                )
              })}
              
              {/* Inner gear circle */}
              <circle cx="250" cy="250" r="180" fill="none" stroke="#E67E22" strokeWidth="8" opacity="0.2" />
            </svg>
          </motion.div>

          {/* Static Helios Engine Logo */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-52 h-52 rounded-full overflow-hidden bg-white dark:bg-gray-800 shadow-2xl border-4 border-orange-400 dark:border-orange-600">
              <img
                src="/helios-logo.png"
                alt="Helios Engine"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Helios Engine
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Initializing the future of AI...
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-mono"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {progress}% Complete
          </motion.p>
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default LoadingScreen
