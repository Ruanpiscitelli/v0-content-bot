"use client"

import React from "react"
import { Check, X, Sparkles, Zap } from "lucide-react"
import { CustomButton } from "../ui/custom-button"
import { Section } from "./section"
import { SectionHeader } from "./section-header"
import { motion } from "framer-motion"

export function PlanComparisonTable() {
  const features = [
    { name: "Content generation", free: true, pro: true, aiPowered: true },
    { name: "Personalized scripts", free: true, pro: true, aiPowered: true },
    { name: "Captions for posts", free: true, pro: true, aiPowered: true },
    { name: "Content ideas", free: true, pro: true, aiPowered: true },
    { name: "Tone customization", free: false, pro: true, aiPowered: true },
    { name: "Priority support", free: false, pro: true },
    { name: "Performance analysis", free: false, pro: true, aiPowered: true },
    { name: "Early access to features", free: false, pro: true },
  ]

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const checkVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  }

  const popularBadgeVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  }

  return (
    <Section background="white">
      <SectionHeader title="Compare Plans" subtitle="Choose the ideal plan for your needs" withLine />

      <div className="max-w-4xl mx-auto overflow-x-auto">
        <motion.div
          className="min-w-[600px] grid grid-cols-3 border border-gray-200 rounded-xl overflow-hidden shadow-custom"
          variants={tableVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Header */}
          <motion.div className="p-5 border-r border-b bg-gray-50" variants={rowVariants}>
            <span className="font-medium text-secondary">Features</span>
          </motion.div>
          <motion.div className="p-5 border-r border-b text-center bg-gray-50" variants={rowVariants}>
            <h4 className="font-bold text-secondary">Free</h4>
            <div className="mt-2">
              <div className="text-2xl font-bold text-secondary">$0</div>
              <div className="text-xs text-accent">Forever</div>
            </div>
            <div className="mt-2 text-sm text-secondary">10 per day</div>
          </motion.div>
          <motion.div className="p-5 border-b text-center bg-gray-50 relative" variants={rowVariants}>
            <motion.div
              className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg"
              variants={popularBadgeVariants}
            >
              POPULAR
            </motion.div>
            <h4 className="font-bold text-secondary">Pro</h4>
            <div className="mt-2">
              <div className="text-2xl font-bold text-secondary">$97</div>
              <div className="text-xs text-accent">per month</div>
            </div>
            <div className="mt-2 text-sm text-secondary">Unlimited</div>
          </motion.div>

          {/* Features */}
          {features.map((feature, index) => (
            <React.Fragment key={`feature-${index}`}>
              <motion.div
                className="p-4 border-r border-t border-gray-200 text-secondary flex items-center"
                variants={rowVariants}
                custom={index}
              >
                {feature.name}
                {feature.aiPowered && (
                  <span className="ml-2">
                    <Sparkles className="h-3 w-3 text-primary inline" />
                  </span>
                )}
              </motion.div>
              <motion.div
                className="p-4 border-r border-t border-gray-200 flex justify-center"
                variants={rowVariants}
                custom={index}
              >
                {feature.free ? (
                  <motion.div variants={checkVariants}>
                    <Check className="h-5 w-5 text-green-500" />
                  </motion.div>
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </motion.div>
              <motion.div
                className="p-4 border-t border-gray-200 flex justify-center"
                variants={rowVariants}
                custom={index}
              >
                <motion.div variants={checkVariants}>
                  <Check className="h-5 w-5 text-green-500" />
                </motion.div>
              </motion.div>
            </React.Fragment>
          ))}

          {/* AI Power Indicator */}
          <motion.div className="p-4 border-r border-t border-gray-200 text-xs text-primary" variants={rowVariants}>
            <div className="flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-powered feature
            </div>
          </motion.div>
          <motion.div className="p-4 border-r border-t border-gray-200" variants={rowVariants}></motion.div>
          <motion.div className="p-4 border-t border-gray-200" variants={rowVariants}></motion.div>

          {/* CTA Buttons */}
          <motion.div className="p-5 border-r border-t border-gray-200" variants={rowVariants}></motion.div>
          <motion.div
            className="p-5 border-r border-t border-gray-200"
            variants={rowVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CustomButton variant="outline" fullWidth animationType="scale">
              Start Free
            </CustomButton>
          </motion.div>
          <motion.div
            className="p-5 border-t border-gray-200"
            variants={rowVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CustomButton variant="primary" fullWidth animationType="shine">
              <Zap className="h-4 w-4 mr-1" />
              Subscribe Pro
            </CustomButton>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  )
}
