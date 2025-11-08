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
        {/* Dancing Ferris */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          {/* Ferris the Crab SVG */}
          <svg
            width="200"
            height="200"
            viewBox="0 0 512 512"
            className="mx-auto drop-shadow-2xl"
          >
            {/* Main body */}
            <motion.ellipse
              cx="256"
              cy="300"
              rx="140"
              ry="120"
              fill="#FF6B35"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            
            {/* Eyes */}
            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            >
              <ellipse cx="210" cy="270" rx="25" ry="30" fill="white" />
              <ellipse cx="302" cy="270" rx="25" ry="30" fill="white" />
              <circle cx="210" cy="275" r="12" fill="#2D3748" />
              <circle cx="302" cy="275" r="12" fill="#2D3748" />
              <circle cx="215" cy="270" r="6" fill="white" />
              <circle cx="307" cy="270" r="6" fill="white" />
            </motion.g>

            {/* Smile */}
            <motion.path
              d="M 220 310 Q 256 330 292 310"
              stroke="#2D3748"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              animate={{ d: ["M 220 310 Q 256 330 292 310", "M 220 310 Q 256 340 292 310"] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />

            {/* Left claw */}
            <motion.g
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ originX: '180px', originY: '280px' }}
            >
              <ellipse cx="130" cy="280" rx="40" ry="25" fill="#FF6B35" transform="rotate(-30 130 280)" />
              <path d="M 110 270 L 90 260 L 95 275 Z" fill="#FF6B35" />
              <path d="M 110 285 L 90 295 L 95 280 Z" fill="#FF6B35" />
            </motion.g>

            {/* Right claw */}
            <motion.g
              animate={{ rotate: [10, -10, 10] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ originX: '332px', originY: '280px' }}
            >
              <ellipse cx="382" cy="280" rx="40" ry="25" fill="#FF6B35" transform="rotate(30 382 280)" />
              <path d="M 402 270 L 422 260 L 417 275 Z" fill="#FF6B35" />
              <path d="M 402 285 L 422 295 L 417 280 Z" fill="#FF6B35" />
            </motion.g>

            {/* Legs */}
            <motion.g
              animate={{ scaleY: [1, 0.9, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <rect x="190" y="390" width="20" height="40" rx="10" fill="#FF6B35" />
              <rect x="250" y="390" width="20" height="40" rx="10" fill="#FF6B35" />
              <rect x="310" y="390" width="20" height="40" rx="10" fill="#FF6B35" />
            </motion.g>

            {/* Antenna */}
            <motion.g
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ originX: '256px', originY: '180px' }}
            >
              <line x1="230" y1="190" x2="220" y2="160" stroke="#FF6B35" strokeWidth="8" strokeLinecap="round" />
              <line x1="282" y1="190" x2="292" y2="160" stroke="#FF6B35" strokeWidth="8" strokeLinecap="round" />
              <circle cx="220" cy="155" r="12" fill="#FFD700" />
              <circle cx="292" cy="155" r="12" fill="#FFD700" />
            </motion.g>
          </svg>
        </motion.div>

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
