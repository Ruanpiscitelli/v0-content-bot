"use client"

import type React from "react"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { dateFnsLocalizer } from "react-big-calendar"
import Image from "next/image"
import { upload } from "@vercel/blob/client"
import { format, parse, startOfWeek, getDay, addMinutes, isSameMonth, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useDrag, useDrop } from "react-dnd"
import { useMediaQuery } from "usehooks-ts"

import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getMonth,
  getYear,
  setMonth,
  setYear,
} from "date-fns"

// shadcn components
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  ImageIcon,
  Loader2,
  X,
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Instagram,
  Twitter,
  FileText,
  Clock,
  Plus,
  Repeat,
  LayoutGrid,
  BarChart2,
} from "lucide-react"

// Import styles for react-big-calendar
import "react-big-calendar/lib/css/react-big-calendar.css"

// Tipos de eventos
interface CalendarEvent {
  id: number | string
  title: string
  start: Date
  end: Date
  desc?: string
  platform: "Instagram" | "X" | "Blog"
  status: "Rascunho" | "Aprovado" | "Publicado"
  allDay?: boolean
  imageUrl?: string
  recurrence?: RecurrenceRule
}

// Definição de regras de recorrência
interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly"
  interval: number
  weekdays?: number[]
  endType: "never" | "after" | "on"
  occurrences?: number
  endDate?: Date
}

// Setup date-fns localizer
const locales = {
  "pt-BR": ptBR,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Mensagens em português
const messages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Não há eventos neste período.",
  showMore: (total: number) => `+ ${total} evento(s)`,
}

// Helper function to format dates for datetime-local input
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Componente personalizado para renderizar células do mês
const CustomMonthDateHeader = ({ date, label }: { date: Date; label: string }) => {
  const isCurrentMonth = isSameMonth(date, new Date())
  const isCurrentDay = isToday(date)

  return (
    <div
      className={`text-center py-1 ${
        isCurrentMonth
          ? isCurrentDay
            ? "bg-[#01aef0] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
            : "text-gray-900"
          : "text-gray-400"
      }`}
    >
      {label}
    </div>
  )
}

// Componente personalizado para renderizar células do mês
const CustomMonthDateCell = ({ date, children }: { date: Date; children: React.ReactNode }) => {
  const isCurrentMonth = isSameMonth(date, new Date())
  const isCurrentDay = isToday(date)

  return (
    <div
      className={`h-full min-h-[100px] p-1 border border-gray-200 ${
        isCurrentMonth ? (isCurrentDay ? "bg-blue-50" : "bg-white") : "bg-gray-50"
      }`}
    >
      {children}
    </div>
  )
}

// Componente MiniCalendar para navegação rápida
const MiniCalendar = ({
  currentDate,
  onDateChange,
}: {
  currentDate: Date
  onDateChange: (date: Date) => void
}) => {
  const [viewDate, setViewDate] = useState(currentDate)
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false)
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Gerar dias do mês atual
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Obter o primeiro dia da semana (0 = domingo, 1 = segunda, etc.)
  const startDay = monthStart.getDay()

  // Nomes dos dias da semana
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]

  // Nomes dos meses
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  // Navegar para o mês anterior
  const prevMonth = () => {
    setViewDate(subMonths(viewDate, 1))
  }

  // Navegar para o próximo mês
  const nextMonth = () => {
    setViewDate(addMonths(viewDate, 1))
  }

  // Selecionar uma data
  const selectDate = (date: Date) => {
    onDateChange(date)
    setViewDate(date)
  }

  // Selecionar um mês
  const selectMonth = (monthIndex: number) => {
    const newDate = setMonth(viewDate, monthIndex)
    setViewDate(newDate)
    setIsMonthPickerOpen(false)
  }

  // Selecionar um ano
  const selectYear = (year: number) => {
    const newDate = setYear(viewDate, year)
    setViewDate(newDate)
    setIsYearPickerOpen(false)
  }

  // Gerar lista de anos (10 anos antes e depois do ano atual)
  const currentYear = getYear(viewDate)
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 w-full ${isMobile ? "max-w-full" : ""}`}>
      {/* Cabeçalho com navegação de mês */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full" aria-label="Mês anterior">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center">
          {/* Seletor de mês */}
          <div className="relative">
            <button
              onClick={() => {
                setIsMonthPickerOpen(!isMonthPickerOpen)
                setIsYearPickerOpen(false)
              }}
              className="text-sm font-medium hover:text-[#01aef0] transition-colors"
            >
              {monthNames[getMonth(viewDate)]}
            </button>

            {isMonthPickerOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-2 z-10 grid grid-cols-3 gap-1 w-48">
                {monthNames.map((month, i) => (
                  <button
                    key={month}
                    onClick={() => selectMonth(i)}
                    className={`text-xs p-1 rounded ${
                      getMonth(viewDate) === i ? "bg-[#01aef0] text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seletor de ano */}
          <div className="relative">
            <button
              onClick={() => {
                setIsYearPickerOpen(!isYearPickerOpen)
                setIsMonthPickerOpen(false)
              }}
              className="text-xs text-gray-500 hover:text-[#01aef0] transition-colors"
            >
              {getYear(viewDate)}
            </button>

            {isYearPickerOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-2 z-10 grid grid-cols-3 gap-1 w-48 max-h-48 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`text-xs p-1 rounded ${
                      getYear(viewDate) === year ? "bg-[#01aef0] text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full" aria-label="Próximo mês">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-1">
        {/* Espaços vazios antes do primeiro dia do mês */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-start-${i}`} className="h-6"></div>
        ))}

        {/* Dias do mês */}
        {monthDays.map((day) => {
          const isCurrentDay = isSameDay(day, new Date())
          const isSelected = isSameDay(day, currentDate)
          const isCurrentMonth = isSameMonth(day, viewDate)

          return (
            <button
              key={day.toISOString()}
              onClick={() => selectDate(day)}
              className={`
                h-8 w-8 flex items-center justify-center text-xs rounded-full
                ${isCurrentDay ? "font-bold" : ""}
                ${isSelected ? "bg-[#01aef0] text-white" : isCurrentDay ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"}
                ${!isCurrentMonth && "text-gray-300"}
                ${isMobile ? "touch-manipulation" : ""}
              `}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Componente para evento arrastável
const DraggableEvent = ({
  event,
  children,
  onEventDrop,
}: {
  event: CalendarEvent
  children: React.ReactNode
  onEventDrop: (event: CalendarEvent, start: Date, end: Date) => void
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "EVENT",
      item: { event },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<{ date?: Date; slot?: { start: Date; end: Date } }>()
        if (item && dropResult) {
          if (dropResult.date) {
            // Caso de drop em uma data específica (célula do calendário)
            const newStart = new Date(dropResult.date)
            newStart.setHours(event.start.getHours(), event.start.getMinutes(), event.start.getSeconds())

            const duration = event.end.getTime() - event.start.getTime()
            const newEnd = new Date(newStart.getTime() + duration)

            onEventDrop(event, newStart, newEnd)
          } else if (dropResult.slot) {
            // Caso de drop em um slot de tempo específico
            onEventDrop(event, dropResult.slot.start, dropResult.slot.end)
          }
        }
      },
    }),
    [event, onEventDrop],
  )

  return (
    <div
      ref={drag}
      className={`${isDragging ? "opacity-50" : "opacity-100"} cursor-grab active:cursor-grabbing`}
      style={{ transform: "translate(0, 0)" }} // Necessário para o React DnD
    >
      {children}
    </div>
  )
}

// Componente para célula do calendário que aceita drops
const DroppableCell = ({ date, children }: { date: Date; children: React.ReactNode }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "EVENT",
      drop: () => ({ date }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [date],
  )

  return (
    <div ref={drop} className={`${isOver ? "bg-blue-100" : ""} h-full`}>
      {children}
    </div>
  )
}

// Componente para slot de tempo que aceita drops
const DroppableTimeSlot = ({
  slot,
  children,
}: {
  slot: { start: Date; end: Date }
  children: React.ReactNode
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "EVENT",
      drop: () => ({ slot }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [slot],
  )

  return (
    <div ref={drop} className={`${isOver ? "bg-blue-100" : ""} h-full`}>
      {children}
    </div>
  )
}

export default function ContentCalendar() {
  // Estado para eventos
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Post Instagram - Carrossel",
      start: new Date(2025, 4, 5, 10, 0),
      end: new Date(2025, 4, 5, 10, 30),
      desc: "Carrossel sobre dicas de produtividade",
      platform: "Instagram",
      status: "Aprovado",
      imageUrl: "/instagram-post-lifestyle.png",
    },
    {
      id: 2,
      title: "Tweet sobre lançamento",
      start: new Date(2025, 4, 7, 14, 0),
      end: new Date(2025, 4, 7, 14, 15),
      desc: "Anúncio do novo recurso da plataforma",
      platform: "X",
      status: "Rascunho",
    },
    {
      id: 3,
      title: "Artigo do Blog - SEO",
      start: new Date(2025, 4, 10, 9, 0),
      end: new Date(2025, 4, 10, 11, 0),
      desc: "Artigo detalhado sobre técnicas de SEO para 2025",
      platform: "Blog",
      status: "Publicado",
      imageUrl: "/blog-post-concept.png",
    },
    // Adicionar mais eventos para demonstrar a densidade do calendário
    {
      id: 4,
      title: "Post Instagram - Reels",
      start: new Date(2025, 4, 12, 15, 0),
      end: new Date(2025, 4, 12, 15, 30),
      desc: "Reels mostrando bastidores",
      platform: "Instagram",
      status: "Rascunho",
    },
    {
      id: 5,
      title: "Thread no X",
      start: new Date(2025, 4, 15, 9, 0),
      end: new Date(2025, 4, 15, 9, 30),
      desc: "Thread sobre tendências de marketing",
      platform: "X",
      status: "Aprovado",
    },
    {
      id: 6,
      title: "Post Instagram - Carrossel",
      start: new Date(2025, 4, 18, 11, 0),
      end: new Date(2025, 4, 18, 11, 30),
      desc: "Carrossel com dicas de produtividade",
      platform: "Instagram",
      status: "Aprovado",
      recurrence: {
        frequency: "weekly",
        interval: 1,
        weekdays: [1], // Segunda-feira
        endType: "after",
        occurrences: 4,
      },
    },
    {
      id: 7,
      title: "Artigo do Blog - Marketing",
      start: new Date(2025, 4, 20, 10, 0),
      end: new Date(2025, 4, 20, 12, 0),
      desc: "Artigo sobre estratégias de marketing digital",
      platform: "Blog",
      status: "Rascunho",
    },
  ])

  // Estado para filtros
  const [filters, setFilters] = useState({
    platforms: {
      Instagram: true,
      X: true,
      Blog: true,
    },
    statuses: {
      Rascunho: true,
      Aprovado: true,
      Publicado: true,
    },
  })

  // Estado para pesquisa
  const [searchTerm, setSearchTerm] = useState("")

  // Estado para o formulário de evento
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent> | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estado para a data atual do calendário
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState("month")

  // Estado para controlar a visualização (calendário ou timeline)
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar")

  // Referência para o calendário
  const calendarRef = useRef<any>(null)

  // Estado para controlar a visibilidade do mini-calendário em dispositivos móveis
  const [isMiniCalendarVisible, setIsMiniCalendarVisible] = useState(false)

  // Detectar se é dispositivo móvel
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => filters.platforms[event.platform] && filters.statuses[event.status])

    // Aplicar pesquisa se houver um termo
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          (event.desc && event.desc.toLowerCase().includes(term)) ||
          event.platform.toLowerCase().includes(term) ||
          event.status.toLowerCase().includes(term),
      )
    }

    return filtered
  }, [events, filters, searchTerm])

  // Manipulador para selecionar um slot (criar novo evento)
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setCurrentEvent({
      start,
      end,
      title: "",
      platform: "Instagram",
      status: "Rascunho",
      desc: "",
    })
    setFormErrors({})
    setImagePreview(null)
    setIsFormOpen(true)
  }, [])

  // Manipulador para selecionar um evento (editar evento existente)
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setCurrentEvent(event)
    setFormErrors({})
    setImagePreview(event.imageUrl || null)
    setIsFormOpen(true)
  }, [])

  // Manipulador para mover um evento (implementação melhorada)
  const handleMoveEvent = useCallback((event: CalendarEvent, newStart: Date, newEnd: Date) => {
    setEvents((prev) => {
      // Encontrar o evento que foi movido
      const idx = prev.findIndex((e) => e.id === event.id)

      // Se o evento não for encontrado, retornar o estado anterior
      if (idx === -1) return prev

      // Criar uma cópia do array de eventos
      const updatedEvents = [...prev]

      // Atualizar o evento com as novas datas
      updatedEvents[idx] = { ...event, start: newStart, end: newEnd }

      // Mostrar notificação de sucesso
      toast({
        title: "Evento reagendado",
        description: `"${event.title}" foi movido para ${format(newStart, "dd/MM/yyyy HH:mm")}`,
      })

      return updatedEvents
    })
  }, [])

  // Componente para opções de recorrência
  const RecurrenceOptions = ({
    currentEvent,
    setCurrentEvent,
  }: {
    currentEvent: Partial<CalendarEvent> | null
    setCurrentEvent: React.Dispatch<React.SetStateAction<Partial<CalendarEvent> | null>>
  }) => {
    const [isRecurring, setIsRecurring] = useState(!!currentEvent?.recurrence)
    const recurrence = currentEvent?.recurrence || {
      frequency: "weekly" as const,
      interval: 1,
      weekdays: [new Date().getDay()],
      endType: "after" as const,
      occurrences: 10,
    }

    const updateRecurrence = (updates: Partial<RecurrenceRule>) => {
      if (!currentEvent) return

      setCurrentEvent({
        ...currentEvent,
        recurrence: {
          ...recurrence,
          ...updates,
        },
      })
    }

    const toggleRecurring = (value: boolean) => {
      setIsRecurring(value)
      if (value && currentEvent) {
        setCurrentEvent({
          ...currentEvent,
          recurrence: recurrence,
        })
      } else if (currentEvent) {
        const { recurrence, ...rest } = currentEvent
        setCurrentEvent(rest)
      }
    }

    if (!isRecurring) {
      return (
        <div className="mt-4">
          <Button variant="outline" onClick={() => toggleRecurring(true)} type="button" className="text-sm">
            <Repeat className="w-4 h-4 mr-2" />
            Tornar este evento recorrente
          </Button>
        </div>
      )
    }

    return (
      <div className="mt-4 p-4 border rounded-md bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Configurações de Recorrência</h4>
          <Button variant="ghost" size="sm" type="button" onClick={() => toggleRecurring(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recurrence-type">Repete</Label>
              <Select value={recurrence.frequency} onValueChange={(v) => updateRecurrence({ frequency: v as any })}>
                <SelectTrigger id="recurrence-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interval">A cada</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="interval"
                  type="number"
                  min={1}
                  value={recurrence.interval}
                  onChange={(e) => updateRecurrence({ interval: Number.parseInt(e.target.value) || 1 })}
                  className="w-20"
                />
                <span>
                  {recurrence.frequency === "daily" ? "dias" : recurrence.frequency === "weekly" ? "semanas" : "meses"}
                </span>
              </div>
            </div>
          </div>

          {recurrence.frequency === "weekly" && (
            <div>
              <Label className="mb-2 block">Repetir em</Label>
              <div className="flex gap-2">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => {
                  const isSelected = recurrence.weekdays?.includes(i) || false
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center
                              ${isSelected ? "bg-[#01aef0] text-white" : "border border-gray-300 hover:bg-gray-100"}`}
                      onClick={() => {
                        const weekdays = recurrence.weekdays || []
                        const newWeekdays = isSelected ? weekdays.filter((d) => d !== i) : [...weekdays, i]
                        updateRecurrence({ weekdays: newWeekdays.length ? newWeekdays : [new Date().getDay()] })
                      }}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <Label className="mb-2 block">Termina</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="end-never"
                  checked={recurrence.endType === "never"}
                  onChange={() => updateRecurrence({ endType: "never" })}
                />
                <Label htmlFor="end-never">Nunca</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="end-after"
                  checked={recurrence.endType === "after"}
                  onChange={() => updateRecurrence({ endType: "after" })}
                />
                <Label htmlFor="end-after">Após</Label>
                <Input
                  type="number"
                  min={1}
                  value={recurrence.occurrences || 10}
                  onChange={(e) => updateRecurrence({ occurrences: Number.parseInt(e.target.value) || 10 })}
                  className="w-20"
                  disabled={recurrence.endType !== "after"}
                />
                <span>ocorrências</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="end-on"
                  checked={recurrence.endType === "on"}
                  onChange={() => updateRecurrence({ endType: "on" })}
                />
                <Label htmlFor="end-on">Em</Label>
                <Input
                  type="date"
                  value={recurrence.endDate ? formatDateForInput(recurrence.endDate).split("T")[0] : ""}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    if (!isNaN(date.getTime())) {
                      updateRecurrence({ endDate: date })
                    }
                  }}
                  disabled={recurrence.endType !== "on"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Manipulador para salvar evento
  const handleSaveEvent = () => {
    // Validação do formulário
    const errors: Record<string, string> = {}

    if (!currentEvent?.title?.trim()) {
      errors.title = "O título é obrigatório"
    }

    if (!currentEvent?.platform) {
      errors.platform = "A plataforma é obrigatória"
    }

    if (!currentEvent?.status) {
      errors.status = "O status é obrigatório"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (currentEvent) {
      if (currentEvent.recurrence) {
        // Processar evento recorrente
        const { recurrence } = currentEvent
        const baseEvent = { ...currentEvent }

        // Determinar quantas instâncias criar
        let occurrences = recurrence.endType === "after" ? recurrence.occurrences || 10 : 10

        // Limitar a 100 ocorrências para evitar problemas de desempenho
        occurrences = Math.min(occurrences, 100)

        // Criar array de eventos
        const recurringEvents: CalendarEvent[] = []

        // Adicionar o evento base
        if (currentEvent.id) {
          // Atualizar evento existente
          setEvents((prev) => prev.map((ev) => (ev.id === currentEvent.id ? ({ ...baseEvent } as CalendarEvent) : ev)))
        } else {
          // Adicionar novo evento base
          const newEvent = {
            ...baseEvent,
            id: Date.now(),
          } as CalendarEvent

          recurringEvents.push(newEvent)
        }

        // Gerar eventos recorrentes
        for (let i = 1; i < occurrences; i++) {
          const newStart = new Date(baseEvent.start as Date)
          const newEnd = new Date(baseEvent.end as Date)
          const duration = (baseEvent.end as Date).getTime() - (baseEvent.start as Date).getTime()

          // Calcular a próxima data com base na frequência
          if (recurrence.frequency === "daily") {
            newStart.setDate(newStart.getDate() + i * recurrence.interval)
          } else if (recurrence.frequency === "weekly") {
            newStart.setDate(newStart.getDate() + i * 7 * recurrence.interval)

            // Ajustar para o dia da semana correto se especificado
            if (recurrence.weekdays && recurrence.weekdays.length) {
              // Implementação simplificada - em uma versão completa,
              // precisaríamos de uma lógica mais complexa para lidar com múltiplos dias da semana
            }
          } else if (recurrence.frequency === "monthly") {
            newStart.setMonth(newStart.getMonth() + i * recurrence.interval)
          }

          // Verificar se ultrapassou a data final
          if (recurrence.endType === "on" && recurrence.endDate && newStart > recurrence.endDate) {
            break
          }

          // Calcular a data de término com base na duração
          newEnd.setTime(newStart.getTime() + duration)

          // Criar o evento recorrente
          const recurringEvent: CalendarEvent = {
            ...baseEvent,
            id: Date.now() + i,
            start: new Date(newStart),
            end: new Date(newEnd),
            title: `${baseEvent.title} (${i + 1})`, // Adicionar número da ocorrência ao título
          }

          recurringEvents.push(recurringEvent)
        }

        // Adicionar todos os eventos recorrentes ao estado
        if (recurringEvents.length > 0) {
          setEvents((prev) => [...prev, ...recurringEvents])
        }

        toast({
          title: "Eventos recorrentes criados",
          description: `Foram criados ${recurringEvents.length} eventos recorrentes.`,
        })
      } else {
        // Processar evento único (código existente)
        if (currentEvent.id) {
          // Atualizar evento existente
          setEvents((prev) =>
            prev.map((ev) => (ev.id === currentEvent.id ? ({ ...ev, ...currentEvent } as CalendarEvent) : ev)),
          )
        } else {
          // Adicionar novo evento
          const newEvent = {
            ...currentEvent,
            id: Date.now(),
          } as CalendarEvent

          setEvents((prev) => [...prev, newEvent])
        }

        toast({
          title: currentEvent.id ? "Evento atualizado" : "Evento criado",
          description: `O evento "${currentEvent.title}" foi ${currentEvent.id ? "atualizado" : "criado"} com sucesso.`,
        })
      }

      setIsFormOpen(false)
      setCurrentEvent(null)
      setImagePreview(null)
    }
  }

  // Manipulador para excluir evento
  const handleDeleteEvent = () => {
    if (currentEvent?.id) {
      setEvents((prev) => prev.filter((ev) => ev.id !== currentEvent.id))
      setIsFormOpen(false)
      setCurrentEvent(null)
      setImagePreview(null)
      toast({
        title: "Evento excluído",
        description: `O evento "${currentEvent.title}" foi excluído com sucesso.`,
      })
    }
  }

  // Manipulador para alterações no formulário
  const handleFormChange = (field: keyof CalendarEvent, value: string | Date) => {
    if (currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        [field]: value,
      })

      // Limpar erro do campo quando o usuário digita
      if (formErrors[field]) {
        setFormErrors({
          ...formErrors,
          [field]: "",
        })
      }
    }
  }

  // Manipulador para upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (JPEG, PNG, GIF ou WEBP).",
        variant: "destructive",
      })
      return
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // Criar URL temporária para preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      // Upload para o Vercel Blob
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload-image",
      })

      // Atualizar o evento com a URL da imagem
      if (currentEvent) {
        setCurrentEvent({
          ...currentEvent,
          imageUrl: newBlob.url,
        })
      }

      toast({
        title: "Imagem enviada",
        description: "A imagem foi enviada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      toast({
        title: "Erro ao enviar imagem",
        description: "Ocorreu um erro ao enviar a imagem. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Manipulador para remover imagem
  const handleRemoveImage = () => {
    if (currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        imageUrl: undefined,
      })
      setImagePreview(null)
    }
  }

  // Estilo personalizado para eventos baseado na plataforma
  const eventPropGetter = useCallback((event: CalendarEvent) => {
    let backgroundColor = ""
    let borderColor = ""
    let gradientClass = ""

    switch (event.platform) {
      case "Instagram":
        backgroundColor = "bg-gradient-to-r from-rose-500 to-pink-500"
        borderColor = "border-rose-600"
        gradientClass = "from-rose-500 to-pink-500"
        break
      case "X":
        backgroundColor = "bg-gradient-to-r from-sky-500 to-blue-500"
        borderColor = "border-sky-600"
        gradientClass = "from-sky-500 to-blue-500"
        break
      case "Blog":
        backgroundColor = "bg-gradient-to-r from-emerald-500 to-green-500"
        borderColor = "border-emerald-600"
        gradientClass = "from-emerald-500 to-green-500"
        break
      default:
        backgroundColor = "bg-gray-500"
        borderColor = "border-gray-600"
        gradientClass = "from-gray-500 to-gray-600"
    }

    let statusClass = ""
    switch (event.status) {
      case "Rascunho":
        statusClass = "opacity-70"
        break
      case "Aprovado":
        statusClass = "opacity-90"
        break
      case "Publicado":
        statusClass = "opacity-100"
        break
      default:
        statusClass = "opacity-80"
    }

    return {
      className: `${backgroundColor} ${statusClass} text-white rounded-md shadow-sm border-l-4 ${borderColor} hover:ring-2 hover:ring-white hover:ring-opacity-50`,
      style: {
        background: `linear-gradient(to right, var(--${gradientClass.split(" ")[0].replace("from-", "")}), var(--${gradientClass.split(" ")[1].replace("to-", "")}))`,
      },
    }
  }, [])

  // Componente personalizado para renderizar eventos
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const isMobile = useMediaQuery("(max-width: 640px)")

    // Ícone da plataforma
    const PlatformIcon = () => {
      switch (event.platform) {
        case "Instagram":
          return <Instagram className="w-3 h-3" />
        case "X":
          return <Twitter className="w-3 h-3" />
        case "Blog":
          return <FileText className="w-3 h-3" />
        default:
          return null
      }
    }

    return (
      <DraggableEvent event={event} onEventDrop={handleMoveEvent}>
        <div className={`p-1.5 overflow-hidden text-sm h-full ${isMobile ? "touch-manipulation" : ""}`}>
          <div className="font-medium truncate flex items-center gap-1">
            <PlatformIcon />
            <span className="truncate">{event.title}</span>
            {event.recurrence && <Repeat className="w-3 h-3 ml-1" />}
          </div>
          <div className="flex items-center text-xs gap-1 mt-0.5 opacity-90">
            <Clock className="w-2.5 h-2.5" />
            <span>{format(event.start, "HH:mm")}</span>
            {event.imageUrl && <ImageIcon className="w-2.5 h-2.5 ml-1" />}
          </div>
        </div>
      </DraggableEvent>
    )
  }

  // Componente personalizado para a barra de ferramentas
  const CustomToolbar = ({ label, onNavigate, onView }: any) => {
    // Extrair o mês e ano do label
    const [month, year] = label.split(" ")
    const isMobile = useMediaQuery("(max-width: 640px)")

    return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-white border rounded-lg shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("TODAY")}
                className="border-r rounded-none h-9"
                aria-label="Ir para hoje"
              >
                {isMobile ? "Hoje" : "Hoje"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("PREV")}
                className="border-r rounded-none px-2 h-9"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("NEXT")}
                className="rounded-none px-2 h-9"
                aria-label="Próximo"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#01aef0]" />
              <h2 className="text-xl font-semibold">
                {month} <span className="text-gray-500">{year}</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>

            {/* Botões para alternar entre visualizações */}
            <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto justify-between sm:justify-start">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Calendário</span>
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </Button>

              {viewMode === "calendar" && !isMobile && (
                <Tabs
                  defaultValue="month"
                  value={currentView}
                  onValueChange={(value) => {
                    setCurrentView(value)
                    onView(value)
                  }}
                  className="w-auto ml-2"
                >
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="month" className="data-[state=active]:bg-white">
                      Mês
                    </TabsTrigger>
                    <TabsTrigger value="week" className="data-[state=active]:bg-white">
                      Semana
                    </TabsTrigger>
                    <TabsTrigger value="day" className="data-[state=active]:bg-white">
                      Dia
                    </TabsTrigger>
                    <TabsTrigger value="agenda" className="data-[state=active]:bg-white">
                      Agenda
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
          </div>
        </div>

        {viewMode === "calendar" && isMobile && (
          <div className="px-4 pb-2">
            <Tabs
              defaultValue="month"
              value={currentView}
              onValueChange={(value) => {
                setCurrentView(value)
                onView(value)
              }}
              className="w-full"
            >
              <TabsList className="bg-gray-100 w-full grid grid-cols-4">
                <TabsTrigger value="month" className="data-[state=active]:bg-white">
                  Mês
                </TabsTrigger>
                <TabsTrigger value="week" className="data-[state=active]:bg-white">
                  Semana
                </TabsTrigger>
                <TabsTrigger value="day" className="data-[state=active]:bg-white">
                  Dia
                </TabsTrigger>
                <TabsTrigger value="agenda" className="data-[state=active]:bg-white">
                  Agenda
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2 bg-gray-50 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-full sm:w-auto">
                  Plataformas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filtrar por plataforma</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.platforms.Instagram}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      platforms: {
                        ...filters.platforms,
                        Instagram: !!checked,
                      },
                    })
                  }
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.platforms.X}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      platforms: {
                        ...filters.platforms,
                        X: !!checked,
                      },
                    })
                  }
                >
                  <Twitter className="w-4 h-4 mr-2" />X (Twitter)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.platforms.Blog}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      platforms: {
                        ...filters.platforms,
                        Blog: !!checked,
                      },
                    })
                  }
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Blog
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-full sm:w-auto">
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.statuses.Rascunho}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      statuses: {
                        ...filters.statuses,
                        Rascunho: !!checked,
                      },
                    })
                  }
                >
                  Rascunho
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.statuses.Aprovado}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      statuses: {
                        ...filters.statuses,
                        Aprovado: !!checked,
                      },
                    })
                  }
                >
                  Aprovado
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.statuses.Publicado}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      statuses: {
                        ...filters.statuses,
                        Publicado: !!checked,
                      },
                    })
                  }
                >
                  Publicado
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            onClick={() => {
              const now = new Date()
              const thirtyMinutesLater = addMinutes(now, 30)
              handleSelectSlot({
                start: now,
                end: thirtyMinutesLater,
              })
            }}
            size="sm"
            className="bg-[#01aef0] hover:bg-[#0099d6] h-8 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Novo Evento
          </Button>
        </div>
      </div>
    )
  }

  // Componente de formulário para adicionar/editar eventos
  const EventFormDialog = () => {
    const isMobile = useMediaQuery("(max-width: 640px)")

    return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className={`${isMobile ? "w-[95vw] max-w-[95vw] p-4" : "sm:max-w-[600px]"}`}>
          <DialogHeader>
            <DialogTitle>{currentEvent?.id ? "Editar Evento" : "Novo Evento"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="required">
                Título
              </Label>
              <Input
                id="title"
                value={currentEvent?.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                aria-invalid={!!formErrors.title}
                aria-describedby={formErrors.title ? "title-error" : undefined}
              />
              {formErrors.title && (
                <p id="title-error" className="text-sm text-red-500">
                  {formErrors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="platform" className="required">
                  Plataforma
                </Label>
                <Select
                  value={currentEvent?.platform}
                  onValueChange={(value) => handleFormChange("platform", value as "Instagram" | "X" | "Blog")}
                >
                  <SelectTrigger
                    id="platform"
                    aria-invalid={!!formErrors.platform}
                    aria-describedby={formErrors.platform ? "platform-error" : undefined}
                  >
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">
                      <div className="flex items-center">
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </div>
                    </SelectItem>
                    <SelectItem value="X">
                      <div className="flex items-center">
                        <Twitter className="w-4 h-4 mr-2" />X (Twitter)
                      </div>
                    </SelectItem>
                    <SelectItem value="Blog">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Blog
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.platform && (
                  <p id="platform-error" className="text-sm text-red-500">
                    {formErrors.platform}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status" className="required">
                  Status
                </Label>
                <Select
                  value={currentEvent?.status}
                  onValueChange={(value) => handleFormChange("status", value as "Rascunho" | "Aprovado" | "Publicado")}
                >
                  <SelectTrigger
                    id="status"
                    aria-invalid={!!formErrors.status}
                    aria-describedby={formErrors.status ? "status-error" : undefined}
                  >
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Publicado">Publicado</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.status && (
                  <p id="status-error" className="text-sm text-red-500">
                    {formErrors.status}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Data de Início</Label>
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={currentEvent?.start ? formatDateForInput(currentEvent.start) : ""}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    if (!isNaN(date.getTime())) {
                      handleFormChange("start", date)
                    }
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end-date">Data de Término</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={currentEvent?.end ? formatDateForInput(currentEvent.end) : ""}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    if (!isNaN(date.getTime())) {
                      handleFormChange("end", date)
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={currentEvent?.desc || ""}
                onChange={(e) => handleFormChange("desc", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Imagem</Label>
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview da imagem"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      aria-label="Remover imagem"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded-md border-2 border-dashed border-gray-300">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500 text-center px-2">
                        {isMobile ? "Toque para adicionar imagem" : "Clique para fazer upload de uma imagem"}
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </div>
                )}

                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando imagem...</span>
                  </div>
                )}

                <p className="text-xs text-gray-500">Formatos aceitos: JPEG, PNG, GIF, WEBP. Tamanho máximo: 5MB.</p>
              </div>
            </div>

            {/* Adicione o componente de recorrência aqui */}
            <RecurrenceOptions currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} />
          </div>

          <DialogFooter className={`${isMobile ? "flex-col space-y-2" : "flex justify-between sm:justify-between"}`}>
            {currentEvent?.id && (
              <Button
                variant="destructive"
                onClick={handleDeleteEvent}
                type="button"
                className={isMobile ? "w-full" : ""}
              >
                Excluir
              </Button>
            )}
            <div className={`flex gap-2 ${isMobile ? "w-full" : ""}`}>
              <Button
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false)
                  setCurrentEvent(null)
                  setImagePreview(null)
                }}
                type="button"
                className={isMobile ? "flex-1" : ""}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEvent}
                type="button"
                disabled={isUploading}
                className={isMobile ? "flex-1" : ""}
              >
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Componente personalizado para células do mês
  const CustomMonthCell = ({ date }: { date: Date }) => {
    return (
      <DroppableCell date={date}>
        <div className="h-full">{/* Conteúdo da célula */}</div>
      </DroppableCell>
    )
  }

  // Componente personalizado para slots de tempo
  const CustomTimeSlot = ({ value }: { value: Date }) => {
    const end = addMinutes(value, 30) // Assumindo slots de 30 minutos
    const slot = { start: value, end }

    return (
      <DroppableTimeSlot slot={slot}>
        <div className="h-full">{/* Conteúdo do slot */}</div>
      </DroppableTimeSlot>
    )
  }

  // Aplicar estilos personalizados ao calendário
  useEffect(() => {
    // Adicionar estilos personalizados para o calendário
    const style = document.createElement("style")
    style.innerHTML = `
    .rbc-calendar {
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    .rbc-header {
      padding: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      background-color: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }
    .rbc-month-view {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .rbc-month-row {
      overflow: visible;
    }
    
    /* Estilos específicos para dispositivos móveis */
    @media (max-width: 640px) {
      .rbc-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      
      .rbc-toolbar-label {
        margin: 8px 0;
      }
      
      .rbc-header {
        padding: 4px;
        font-size: 0.8rem;
      }
      
      .rbc-event {
        padding: 2px 4px !important;
      }
      
      .rbc-day-bg {
        min-height: 60px;
      }
      
      .rbc-month-view, .rbc-time-view {
        font-size: 0.9rem;
      }
      
      .rbc-agenda-view table.rbc-agenda-table {
        font-size: 0.9rem;
      }
      
      .rbc-time-view .rbc-time-content {
        overflow-x: auto;
      }
      
      /* Melhorar a experiência de toque */
      .rbc-event {
        touch-action: none;
      }
      
      /* Aumentar área de toque para botões */
      .rbc-toolbar button {
        min-height: 40px;
      }
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Renderizar o componente de formulário */}
      <EventFormDialog />

      {/* Renderizar o calendário ou a timeline com base no viewMode */}
      {viewMode === "calendar" ? (
        <div className="flex flex-col md:flex-row h-full">
          {/* Mini-calendário (visível apenas em telas maiores ou quando ativado em dispositivos móveis) */}
          <div className={`md:w-64 md:mr-4 md:block ${isMiniCalendarVisible ? "block" : "hidden"}`}>
            <MiniCalendar
              currentDate={currentDate}
              onDateChange={(date) => {
                setCurrentDate(date)
                // Se estiver em dispositivo móvel, esconder o mini-calendário após a seleção
                if (isMobile) {
                  setIsMiniCalendarVisible(false)
                }
              }}
            />
          </div>

          {/* Botão para mostrar/ocultar o mini-calendário em dispositivos móveis */}
          <button
            className="md:hidden flex items-center justify-center p-2 bg-white border border-gray-200 rounded-md shadow-sm mb-4 w-full"
            onClick={() => setIsMiniCalendarVisible(!isMiniCalendarVisible)}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{isMiniCalendarVisible ? "Ocultar calendário" : "Mostrar calendário"}</span>
          </button>

          {/* Calendário principal */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Aqui você pode adicionar o componente Calendar da biblioteca react-big-calendar */}
            {/* Este é um exemplo simplificado */}
            <div className="h-full">
              {/* Conteúdo do calendário */}
              <CustomToolbar />
              <div className="p-4">
                <h3 className="text-lg font-medium mb-4">Calendário de Conteúdo</h3>
                <p className="text-gray-500">
                  Visualize e gerencie seu calendário de conteúdo para diferentes plataformas.
                </p>

                {/* Adicionar instruções específicas para dispositivos móveis */}
                {isMobile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                    <p className="font-medium text-blue-700">Dicas para dispositivos móveis:</p>
                    <ul className="list-disc pl-5 mt-2 text-blue-600 space-y-1">
                      <li>Toque em um evento para editá-lo</li>
                      <li>Pressione e segure para arrastar eventos</li>
                      <li>Use o botão acima para mostrar o mini-calendário</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Timeline view */}
          <CustomToolbar />
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Timeline de Conteúdo</h3>
            <p className="text-gray-500">Visualize seu conteúdo em uma linha do tempo para melhor planejamento.</p>

            {/* Adicionar instruções específicas para dispositivos móveis */}
            {isMobile && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                <p className="font-medium text-blue-700">Dicas para dispositivos móveis:</p>
                <ul className="list-disc pl-5 mt-2 text-blue-600 space-y-1">
                  <li>Deslize horizontalmente para navegar na timeline</li>
                  <li>Toque em um evento para ver detalhes</li>
                  <li>Use o botão de filtro para refinar sua visualização</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botão flutuante para adicionar evento em dispositivos móveis */}
      {isMobile && (
        <button
          onClick={() => {
            const now = new Date()
            const thirtyMinutesLater = addMinutes(now, 30)
            handleSelectSlot({
              start: now,
              end: thirtyMinutesLater,
            })
          }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#01aef0] text-white shadow-lg flex items-center justify-center z-10"
          aria-label="Adicionar novo evento"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
