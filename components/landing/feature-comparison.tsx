"use client"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureComparison() {
  const plans = [
    {
      name: "Gratuito",
      description: "Para experimentar a plataforma.",
      price: "R$ 0",
      period: "para sempre",
      features: [
        { name: "Até 20 gerações por dia", included: true },
        { name: "Acesso à IA básica", included: true },
        { name: "Legendas simples", included: true },
        { name: "Suporte por email", included: false },
        { name: "Roteiros personalizados", included: false },
        { name: "Fórmulas de conversão", included: false },
      ],
      popular: false,
      ctaText: "Começar Grátis",
      ctaLink: "/chat",
    },
    {
      name: "Profissional",
      description: "Para criadoras que querem crescer.",
      price: "R$ 47",
      period: "por mês",
      features: [
        { name: "Gerações ilimitadas", included: true },
        { name: "Acesso à IA avançada", included: true },
        { name: "Legendas premium", included: true },
        { name: "Suporte prioritário", included: true },
        { name: "Roteiros personalizados", included: true },
        { name: "Fórmulas de conversão", included: false },
      ],
      popular: true,
      ctaText: "Assinar Agora",
      ctaLink: "/chat",
    },
    {
      name: "Empresarial",
      description: "Para agências e equipes.",
      price: "R$ 97",
      period: "por mês",
      features: [
        { name: "Tudo do plano Profissional", included: true },
        { name: "Múltiplos perfis", included: true },
        { name: "Acesso à IA especializada", included: true },
        { name: "Suporte 24/7", included: true },
        { name: "Roteiros avançados", included: true },
        { name: "Fórmulas de conversão", included: true },
      ],
      popular: false,
      ctaText: "Falar com Vendas",
      ctaLink: "/chat",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
          {plan.popular && (
            <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-blue-500 px-3 py-1 text-xs font-medium text-white">
              Popular
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              {plan.price}
              <span className="ml-1 text-2xl font-medium text-muted-foreground">{plan.period}</span>
            </div>
          </CardHeader>
          <CardContent className="grid flex-1 gap-4">
            <ul className="grid gap-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href={plan.ctaLink} className="w-full">
              <Button
                className={`w-full ${plan.popular ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.ctaText}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
