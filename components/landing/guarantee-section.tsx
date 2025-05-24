"use client"

import React from "react";
import { Shield, Clock, Rocket, Star } from "lucide-react";
import { motion } from "framer-motion";

interface GuaranteeCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  gradient: string;
  bgGradient: string;
}

const GuaranteeCard = ({ title, description, icon: Icon, className, gradient, bgGradient }: GuaranteeCardProps) => {
  return (
    <motion.div
      className={`relative overflow-hidden h-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${bgGradient} backdrop-blur-sm border border-gray-700 shadow-xl h-full flex flex-col group cursor-pointer`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
        
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg text-white transform group-hover:scale-105 transition-all duration-300`}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-base leading-relaxed flex-1 group-hover:text-gray-300 transition-colors">
          {description}
        </p>
        
        <div className="mt-5">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-md bg-gray-700 text-yellow-400 font-medium text-xs shadow-sm`}>
            <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
            Our Commitment
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function GuaranteeSection() {
  const guarantees = [
    {
      title: "30-Day Viral Content Promise",
      description: "Launch at least one organically viral content piece in 30 days using our AI, or receive a full refund. No paid ads needed.",
      icon: Rocket,
      gradient: "from-slate-600 to-slate-800",
      bgGradient: "from-slate-800/30 to-slate-900/30"
    },
    {
      title: "15-Day No-Risk Trial",
      description: "Explore our AI for 15 days. If it's not for you, for any reason, we'll refund your payment. No questions asked.",
      icon: Clock,
      gradient: "from-slate-600 to-slate-800",
      bgGradient: "from-slate-800/30 to-slate-900/30"
    },
    {
      title: "Results & VIP Mentorship Assurance",
      description: "Use our AI consistently for 60 days. No measurable results? Get a full refund PLUS a complimentary $10,000 value VIP mentorship session.",
      icon: Shield,
      gradient: "from-slate-600 to-slate-800",
      bgGradient: "from-slate-800/30 to-slate-900/30"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Subtler Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, theme('colors.gray.700') 1px, transparent 1px), radial-gradient(circle at 80% 50%, theme('colors.gray.800') 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      {/* Subtler Floating particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gray-700 rounded-full opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🛡️ OUR TRIPLE GUARANTEE 🛡️
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We stand behind our product with <span className="text-yellow-500 font-semibold">unshakeable confidence</span>, offering you 
            <span className="text-yellow-500 font-semibold"> three powerful guarantees</span> to ensure your complete satisfaction and success.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guarantees.map((guarantee, index) => (
            <GuaranteeCard 
              key={index}
              title={guarantee.title}
              description={guarantee.description}
              icon={guarantee.icon}
              gradient={guarantee.gradient}
              bgGradient={guarantee.bgGradient}
            />
          ))}
        </div>

        <motion.div 
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 max-w-2xl mx-auto shadow-lg">
            <p className="text-white text-lg font-semibold mb-1">
              💎 <span className="text-yellow-400">Invest With Confidence</span>
            </p>
            <p className="text-gray-400 text-sm">
              Your success is our priority, backed by our comprehensive guarantees.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 