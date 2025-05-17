"use client"
import { Section } from "./section"
import { SectionHeader } from "./section-header"

export function ResultsSection() {
  return (
    <Section background="light">
      <SectionHeader
        title="Resultados Reais em Números"
        subtitle="Dados coletados de mais de 5.000 criadoras que usam a Bebel.AI diariamente"
        withLine
      />

      <div className="bg-white rounded-xl p-8 shadow-custom">
        <h3 className="text-center font-bold text-xl mb-6 text-secondary">Crescimento de Engajamento</h3>

        {/* Graph visualization - make it responsive */}
        <div className="relative h-64 mb-8">
          {/* Graph background lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-gray-200 w-full h-0"></div>
            ))}
          </div>

          {/* Graph lines */}
          <div className="absolute inset-0 pt-4">
            {/* Blue line (Bebel) */}
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path d="M0,180 L80,150 L160,120 L240,80 L320,50 L400,20" fill="none" stroke="#018cf1" strokeWidth="3" />
              {/* Blue dots */}
              <circle cx="0" cy="180" r="4" fill="#018cf1" />
              <circle cx="80" cy="150" r="4" fill="#018cf1" />
              <circle cx="160" cy="120" r="4" fill="#018cf1" />
              <circle cx="240" cy="80" r="4" fill="#018cf1" />
              <circle cx="320" cy="50" r="4" fill="#018cf1" />
              <circle cx="400" cy="20" r="4" fill="#018cf1" />
            </svg>

            {/* Gray line (Antes) */}
            <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path
                d="M0,180 L80,170 L160,165 L240,160 L320,165 L400,170"
                fill="none"
                stroke="#8a96a3"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="absolute bottom-0 left-0 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-1 bg-accent"></div>
              <span>Antes da Bebel</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-1 bg-primary"></div>
              <span>Com a Bebel</span>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-6 left-0 w-full flex justify-between text-xs text-gray-500">
            <span>Jan</span>
            <span>Fev</span>
            <span>Mar</span>
            <span>Abr</span>
            <span>Mai</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Metrics - improve mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-card rounded-xl shadow-sm">
            <h4 className="text-primary text-3xl font-bold mb-2">5h/semana</h4>
            <p className="text-sm text-accent">Média de tempo economizado por criadora</p>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-xl shadow-sm">
            <h4 className="text-primary text-3xl font-bold mb-2">37%</h4>
            <p className="text-sm text-accent">Crescimento médio após 30 dias de uso</p>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-xl shadow-sm">
            <h4 className="text-primary text-3xl font-bold mb-2">320%</h4>
            <p className="text-sm text-accent">Retorno sobre investimento médio</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
