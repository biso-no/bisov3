"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 py-12 mb-8"
    >
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  )
}

