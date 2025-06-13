"use client"

import React from "react"
import { Check, X, Sparkles, Zap, Crown, Flame, TrendingUp, Video, BarChart3, Users } from "lucide-react"
import { Button } from "../ui/button"
import { Section } from "./section"
import { motion } from "framer-motion"
import Link from "next/link"

export function PlanComparisonTable() {
  const features = [
    { name: "Content generation", free: true, standard: true, pro: true, aiPowered: true },
    { name: "Personalized scripts", free: true, standard: true, pro: true, aiPowered: true },
    { name: "Captions for posts", free: true, standard: true, pro: true, aiPowered: true },
    { name: "Content ideas", free: true, standard: true, pro: true, aiPowered: true },
    { name: "Tone customization", free: false, standard: true, pro: true, aiPowered: true },
    { name: "Priority support", free: false, standard: true, pro: true },
    { name: "Trends radar", free: false, standard: true, pro: true, aiPowered: true },
    { name: "Performance analysis", free: false, standard: true, pro: true, aiPowered: true },
    { name: "Carousels generation", free: false, standard: false, pro: true, aiPowered: true },
    { name: "Video IA generation", free: false, standard: false, pro: true, aiPowered: true },
    { name: "AI competitor analysis", free: false, standard: false, pro: true, aiPowered: true },
    { name: "Early access to features", free: false, standard: false, pro: true },
  ]

  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      frequency: "Forever",
      limit: "10 uses per day",
      featuresKey: "free",
      buttonText: "Start for Free",
      buttonVariant: "outlineWhite",
      gradient: "from-blue-900 to-blue-800",
      textColor: "text-cyan-400",
      borderColor: "border-blue-700",
      buttonClass: "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 underline"
    },
    {
      name: "Standard Plan",
      price: "$47",
      frequency: "per month",
      limit: "100 uses per day",
      featuresKey: "standard",
      buttonText: "Get Started",
      buttonVariant: "green",
      gradient: "from-green-900 to-emerald-800",
      textColor: "text-green-400",
      borderColor: "border-green-700",
      buttonClass: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
    },
    {
      name: "Pro Plan",
      price: "$97",
      frequency: "per month",
      limit: "Unlimited uses ∞",
      featuresKey: "pro",
      buttonText: "Go Pro",
      buttonVariant: "orange",
      gradient: "from-purple-900 to-pink-900",
      textColor: "text-yellow-400",
      borderColor: "border-purple-700",
      isPopular: true,
      buttonClass: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
    }
  ];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <Section background="none" className="py-16 sm:py-20 md:py-24">
      {/* Enhanced Section Header with improved contrast */}
      <div className="mb-10 md:mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Gradient background for the title */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-400/20 to-purple-600/20 blur-3xl opacity-30 rounded-full -z-10" />
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent pb-2">
            Compare Plans
          </h2>
          
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the ideal plan for your{" "}
            <span className="font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              content strategy needs
            </span>
          </p>
        </motion.div>
      </div>

      {/* Mobile View: Stacked Cards - hidden on md and larger screens */}
      <div className="md:hidden max-w-md mx-auto space-y-8">
        {plans.map((plan, planIndex) => (
          <motion.div 
            key={plan.name} 
            className={`rounded-2xl shadow-2xl p-6 border-2 ${plan.borderColor} bg-gradient-to-br ${plan.gradient} relative overflow-hidden`}
            custom={planIndex}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
          >
            {plan.isPopular && (
              <motion.div
                className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-white/20"
                variants={popularBadgeVariants}
                initial="hidden"
                animate="visible"
              >
                <Crown className="w-3 h-3 inline mr-1" />
                POPULAR
                <Flame className="w-3 h-3 inline ml-1" />
              </motion.div>
            )}
            <h4 className={`font-bold text-2xl mb-2 text-center ${plan.textColor}`}>{plan.name}</h4>
            <div className="mt-2 text-center">
              <div className={`text-4xl font-bold ${plan.textColor}`}>{plan.price}</div>
              <div className={`text-sm font-medium ${plan.textColor} opacity-80`}>{plan.frequency}</div>
            </div>
            <div className={`mt-3 text-sm text-white font-medium ${plan.textColor === 'text-cyan-400' ? 'bg-blue-700/50' : plan.textColor === 'text-green-400' ? 'bg-green-700/50' : 'bg-gradient-to-r from-purple-600 to-pink-600'} px-3 py-1.5 rounded-full text-center mb-6`}>
              {plan.limit}
            </div>
            
            <ul className="space-y-3 mb-6">
              {features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm text-gray-200">
                  {feature[plan.featuresKey as keyof typeof feature] ? (
                    <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                  )}
                  <span>{feature.name}</span>
                  {feature.aiPowered && feature[plan.featuresKey as keyof typeof feature] && (
                    <span className="ml-1.5 bg-gradient-to-r from-cyan-400 to-purple-500 p-0.5 rounded-full flex-shrink-0">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <Button 
              variant={plan.buttonVariant as any}
              size="lg"
              className={`w-full font-bold text-base py-3 ${plan.buttonClass}`}
              animationType="shine"
            >
              {plan.buttonText}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Desktop View: Table - hidden below md screens */}
      <div className="hidden md:block max-w-6xl mx-auto overflow-x-auto">
        <motion.div
          className="min-w-[800px] grid grid-cols-4 border-2 border-gray-700 rounded-2xl overflow-hidden shadow-2xl bg-black"
          variants={tableVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Header */}
          <motion.div className="p-6 border-r border-gray-700 border-b border-gray-600 bg-gradient-to-br from-gray-800 to-gray-900 sticky top-0 z-10" variants={rowVariants}>
            <span className="font-semibold text-lg text-white">Features</span>
          </motion.div>
          
          {plans.map(plan => (
            <motion.div 
              key={plan.name} 
              className={`p-6 border-b border-gray-600 text-center bg-gradient-to-br ${plan.gradient} relative sticky top-0 z-10 ${plan.name !== 'Pro Plan' ? 'border-r border-gray-700' : ''}`}
              variants={rowVariants}
            >
              {plan.isPopular && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-white/20"
                  variants={popularBadgeVariants}
                >
                  <Crown className="w-3 h-3 inline mr-1" />
                  POPULAR
                  <Flame className="w-3 h-3 inline ml-1" />
                </motion.div>
              )}
              <h4 className={`font-bold text-lg text-white mb-2`}>{plan.name}</h4>
              <div className="mt-3">
                <div className={`text-3xl font-bold ${plan.textColor}`}>{plan.price}</div>
                <div className={`text-sm ${plan.textColor} opacity-80 font-medium`}>{plan.frequency}</div>
              </div>
              <div className={`mt-3 text-sm text-white font-medium ${plan.textColor === 'text-cyan-400' ? 'bg-blue-700/50' : plan.textColor === 'text-green-400' ? 'bg-green-700/50' : 'bg-gradient-to-r from-purple-600 to-pink-600'} px-3 py-1 rounded-full`}>{plan.limit}</div>
            </motion.div>
          ))}

          {/* Features */}
          {features.map((feature, index) => (
            <React.Fragment key={`feature-${index}`}>
              <motion.div
                className="p-4 border-r border-gray-700 border-t border-gray-600 text-white flex items-center font-medium text-sm bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
                variants={rowVariants}
                custom={index}
              >
                {feature.name}
                {feature.aiPowered && (
                  <span className="ml-2 bg-gradient-to-r from-cyan-400 to-purple-500 p-1 rounded-full flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-white" />
                  </span>
                )}
              </motion.div>
              
              {plans.map(plan => (
                <motion.div
                  key={`${plan.name}-feature-${index}`}
                  className={`p-4 border-t border-gray-600 flex justify-center bg-gradient-to-r ${plan.gradient} hover:brightness-110 transition-all duration-300 ${plan.name !== 'Pro Plan' ? 'border-r border-gray-700' : ''}`}
                  variants={rowVariants}
                  custom={index}
                >
                  {feature[plan.featuresKey as keyof typeof feature] ? (
                    <motion.div variants={checkVariants} className="bg-green-500 rounded-full p-1">
                      <Check className="h-5 w-5 text-white font-bold" />
                    </motion.div>
                  ) : (
                    <div className="bg-red-500 rounded-full p-1">
                      <X className="h-5 w-5 text-white font-bold" />
                    </div>
                  )}
                </motion.div>
              ))}
            </React.Fragment>
          ))}

          {/* CTA Buttons */}
          <motion.div className="p-5 border-r border-gray-700 border-t border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700" variants={rowVariants}></motion.div>
          {plans.map(plan => (
            <motion.div 
              key={`${plan.name}-cta`}
              className={`p-5 border-t border-gray-600 flex justify-center items-center bg-gradient-to-br ${plan.gradient} ${plan.name !== 'Pro Plan' ? 'border-r border-gray-700' : ''}`}
              variants={rowVariants}
            >
              <Button 
                variant={plan.buttonVariant as any}
                size="lg"
                className={`w-full font-bold py-2.5 ${plan.buttonClass}`}
                animationType="shine"
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Legend for AI-powered features */}
      <motion.div 
        className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 p-1 rounded-full">
          <Sparkles className="h-3 w-3 text-white" />
        </span>
        <span>AI-powered feature</span>
      </motion.div>
    </Section>
  )
}
