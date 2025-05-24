"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, Sparkles, Zap, Brain, Shield, Clock, Users, Star, HelpCircle } from "lucide-react"
import { Section } from "./section"
import { SectionHeader } from "./section-header"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  isAIRelated?: boolean
  icon?: React.ReactNode
  category?: string
}

function FAQItem({ question, answer, isOpen, onClick, isAIRelated = false, icon, category }: FAQItemProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl mb-4 shadow-lg transition-all duration-300",
        isOpen 
          ? "shadow-xl transform scale-[1.01]" 
          : "shadow-md hover:shadow-lg hover:scale-[1.005]",
        isAIRelated 
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border border-blue-400/30" 
          : "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-gray-600/30"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      {/* Subtle glow effect */}
      <div className={cn(
        "absolute inset-0 opacity-10 blur-2xl",
        isAIRelated 
          ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
          : "bg-gradient-to-r from-slate-500 to-gray-600"
      )}></div>
      
      {/* Professional category badge */}
      {category && (
        <div className="absolute top-3 right-3 z-10">
          <span className={cn(
            "px-2 py-1 rounded-md text-xs font-medium border",
            isAIRelated 
              ? "bg-blue-500/20 text-blue-300 border-blue-400/30" 
              : "bg-gray-500/20 text-gray-300 border-gray-400/30"
          )}>
            {category}
          </span>
        </div>
      )}

      <button
        className="w-full p-5 text-left relative z-10 group"
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Professional icon */}
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-md transform group-hover:scale-105 transition-all duration-300",
              isAIRelated 
                ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
                : "bg-gradient-to-br from-slate-600 to-gray-700"
            )}>
              {icon || <HelpCircle className="w-5 h-5 text-white" />}
            </div>
            
            {/* Question */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">
                {question}
              </h3>
              {isAIRelated && (
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Technology
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Professional chevron */}
          <motion.div 
            initial={false} 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ml-3 transition-all duration-300",
              isOpen 
                ? "bg-blue-500 shadow-md" 
                : "bg-white/10 group-hover:bg-white/15"
            )}
          >
            <ChevronDown className={cn(
              "w-4 h-4 transition-colors duration-300",
              isOpen ? "text-white" : "text-gray-300"
            )} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden relative z-10"
          >
            <div className="px-5 pb-5">
              <div className={cn(
                "p-4 rounded-lg border backdrop-blur-sm",
                isAIRelated 
                  ? "bg-blue-500/5 border-blue-400/20" 
                  : "bg-gray-500/5 border-gray-400/20"
              )}>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqItems = [
    {
      question: "What makes Virallyzer's AI so effective?",
      answer:
        "Our AI was trained by marketing experts who collectively generated over 8 figures in revenue across 6 years of proven marketing experience. This isn't just another AI tool - it's the distilled knowledge of successful marketers who understand what actually converts and drives sales.",
      isAIRelated: true,
      icon: <Brain className="w-5 h-5 text-white" />,
      category: "AI Technology"
    },
    {
      question: "How quickly will I see results with my content?",
      answer:
        "Our data shows that 73% of users see measurable results after posting their very first AI-generated content. The remaining 27% notice a significant 20% increase in sales within the first 7 days of consistent use. This rapid success rate is due to our AI's deep understanding of viral content patterns.",
      icon: <Clock className="w-5 h-5 text-white" />,
      category: "Performance"
    },
    {
      question: "What specific results can I expect from using Virallyzer?",
      answer:
        "Based on real user data: 73% see immediate engagement improvements on their first post, while others experience an average 20% sales increase within 7 days. Our AI combines proven marketing psychology with viral content strategies that have generated millions in revenue.",
      isAIRelated: true,
      icon: <Star className="w-5 h-5 text-white" />,
      category: "Results"
    },
    {
      question: "Is my data and content secure with Virallyzer?",
      answer:
        "Absolutely. We operate with enterprise-grade security protocols. We never access, store, or process your visual content. Our AI works exclusively with text-based inputs, ensuring you maintain complete control over your media assets and sensitive business information.",
      icon: <Shield className="w-5 h-5 text-white" />,
      category: "Security"
    },
    {
      question: "How does the AI understand my specific business and audience?",
      answer:
        "Our AI analyzes your brand voice, industry context, and target audience to create highly personalized content. It's trained on successful marketing campaigns that generated 8+ figures, so it understands what works across different industries and audience types.",
      isAIRelated: true,
      icon: <Sparkles className="w-5 h-5 text-white" />,
      category: "Personalization"
    },
    {
      question: "Do I need marketing experience to use Virallyzer effectively?",
      answer:
        "Not at all! That's the beauty of our AI - it contains the marketing expertise of professionals who've generated 8 figures in revenue. You get access to their knowledge without needing years of experience. Most users start creating high-converting content within minutes.",
      icon: <Users className="w-5 h-5 text-white" />,
      category: "Usability"
    },
    {
      question: "What's your cancellation policy and subscription terms?",
      answer:
        "We offer complete flexibility with no long-term commitments. Cancel anytime without penalties, and you'll retain access to all features until your current billing period ends. We're confident in our results - 73% see success on their first post!",
      icon: <Zap className="w-5 h-5 text-white" />,
      category: "Billing"
    },
  ]

  return (
    <Section background="none" className="bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Minimal floating elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <SectionHeader
          title={
            <span className="bg-gradient-to-r from-slate-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          }
          subtitle={
            <span className="text-gray-300 text-lg leading-relaxed">
              Learn about our AI trained by <span className="text-green-400 font-bold">8-figure marketers</span> with <span className="text-blue-400 font-semibold">73% first-post success rate</span>
            </span>
          }
          className="mb-12"
        />

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={index === openIndex}
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
              isAIRelated={item.isAIRelated}
              icon={item.icon}
              category={item.category}
            />
          ))}
        </motion.div>

        {/* Professional call to action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">
              Need Additional Information?
            </h3>
            <p className="text-gray-300 mb-5 text-base">
              Our technical support team is available to discuss your specific requirements and help optimize your content strategy.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-500/30">
              <span className="flex items-center text-base">
                <HelpCircle className="mr-2 w-5 h-5" />
                Contact Support
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
