"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 text-secondary"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsOpen(false)} className="p-2 text-secondary">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-6 p-4">
            <Link href="#features" onClick={() => setIsOpen(false)} className="text-lg font-medium">
              Como Funciona
            </Link>
            <Link href="#testimonials" onClick={() => setIsOpen(false)} className="text-lg font-medium">
              Depoimentos
            </Link>
            <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium">
              Preços
            </Link>
            <div className="mt-4 flex flex-col gap-4 w-full">
              <Link href="/chat" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full border-primary text-primary">
                  Entrar
                </Button>
              </Link>
              <Link href="/chat" onClick={() => setIsOpen(false)} className="w-full">
                <Button className="w-full bg-primary text-white">Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
