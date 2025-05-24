"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles } from "lucide-react";

interface ComingSoonProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export const ComingSoonPlaceholder = ({
  className,
  title = "Coming Soon",
  subtitle = "We're working hard to bring you this new feature! Stay tuned.", // Adjusted subtitle
}: ComingSoonProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-6 rounded-lg border-none bg-background p-8 text-center shadow-none", // Adjusted to be more full-page like, removed border and shadow for cleaner integration within existing layout
        className
      )}
    >
      <Badge
        variant="outline"
        className="max-w-full gap-2 rounded-full bg-card px-4 py-2 font-semibold text-sm shadow-sm transition-all hover:shadow-md border-border"
      >
        <div className="flex items-center gap-2 py-1">
          <Clock size={16} className="text-muted-foreground" />
          <span>In Development</span>
        </div>
      </Badge>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl text-foreground">{title}</h2>
          <motion.div
            className="absolute -right-10 -top-8 md:-right-12 md:-top-10"
            initial={{ rotate: -15, scale: 0.8 }}
            animate={{ rotate: 5, scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
              delay: 0.5,
            }}
          >
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </motion.div>
        </div>
        <p className="max-w-lg text-lg text-muted-foreground md:text-xl">{subtitle}</p>
      </motion.div>

      <motion.div
        className="mt-6 h-2.5 w-72 overflow-hidden rounded-full bg-muted"
        initial={{ width: 0 }}
        animate={{ width: "18rem" }} // 288px
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "40%" }} // Pulsating effect width
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </div>
  );
}; 