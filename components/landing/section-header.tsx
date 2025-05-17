import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  withLine?: boolean
  centered?: boolean
  titleClassName?: string
  subtitleClassName?: string
  descriptionClassName?: string
}

export function SectionHeader({
  title,
  subtitle,
  description,
  withLine = false,
  centered = true,
  titleClassName,
  subtitleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", centered && "text-center")}>
      {subtitle && (
        <h3
          className={cn(
            "text-sm md:text-base font-medium uppercase tracking-wider text-primary mb-2",
            subtitleClassName,
          )}
        >
          {subtitle}
        </h3>
      )}
      <div className="relative">
        <h2 className={cn("text-2xl md:text-3xl lg:text-4xl font-bold mb-4", titleClassName)}>
          {title}
        </h2>
        {withLine && <div className={cn("h-1 w-16 bg-primary rounded-full mb-6", centered ? "mx-auto" : "ml-0")} />}
      </div>
      {description && (
        <p className={cn("text-base md:text-lg max-w-3xl text-foreground", centered && "mx-auto", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  )
}
