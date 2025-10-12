export interface Link {
  id: string
  title: string
  url: string
  favicon?: string
  order: number
}

export interface Group {
  id: string
  name: string
  color: string
  icon?: string
  links: Link[]
  isFavorite: boolean
  order: number
  createdAt: Date
  lastOpened?: Date
}

export const GROUP_COLORS = [
  { name: "Purple", value: "oklch(0.55 0.22 264)", light: "oklch(0.95 0.05 264)" },
  { name: "Pink", value: "oklch(0.65 0.25 330)", light: "oklch(0.95 0.05 330)" },
  { name: "Blue", value: "oklch(0.55 0.2 240)", light: "oklch(0.95 0.05 240)" },
  { name: "Teal", value: "oklch(0.6 0.2 180)", light: "oklch(0.95 0.05 180)" },
  { name: "Green", value: "oklch(0.6 0.18 140)", light: "oklch(0.95 0.05 140)" },
  { name: "Orange", value: "oklch(0.65 0.22 45)", light: "oklch(0.95 0.05 45)" },
  { name: "Red", value: "oklch(0.55 0.22 25)", light: "oklch(0.95 0.05 25)" },
]
