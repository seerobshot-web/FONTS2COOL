import { useRef, useCallback } from "react"
import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import { hexToHsl, hslToHex } from "@/lib/color-theory"
import { isValidHex } from "@/lib/color-utils"

interface ColorWheelProps {
  value: string
  onChange: (hex: string) => void
  size?: number
}

export function ColorWheel({ value, onChange, size = 200 }: ColorWheelProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const hsl = hexToHsl(isValidHex(value) ? value : "#ff0000")
  const currentHue = hsl?.h ?? 0
  const currentSat = hsl?.s ?? 100
  const currentLight = hsl?.l ?? 50

  const handleWheelClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const x = e.clientX - rect.left - cx
    const y = e.clientY - rect.top - cy
    const dist = Math.sqrt(x * x + y * y)
    const maxR = rect.width / 2 - 4
    if (dist > maxR) return

    let angle = Math.atan2(y, x) * 180 / Math.PI
    if (angle < 0) angle += 360
    const sat = Math.round((dist / maxR) * 100)

    onChange(hslToHex(Math.round(angle), sat, currentLight))
  }, [currentLight, onChange])

  const segments = 360
  const radius = size / 2 - 4
  const cx = size / 2
  const cy = size / 2

  const indicatorAngle = (currentHue * Math.PI) / 180
  const indicatorR = (currentSat / 100) * radius
  const indicatorX = cx + Math.cos(indicatorAngle) * indicatorR
  const indicatorY = cy + Math.sin(indicatorAngle) * indicatorR

  return (
    <VStack gap="2" align="center">
      <Box
        ref={svgRef}
        as="svg"
        width={size}
        height={size}
        cursor="crosshair"
        onClick={handleWheelClick}
        userSelect="none"
      >
        {Array.from({ length: segments }).map((_, i) => {
          const startAngle = (i / segments) * 2 * Math.PI - Math.PI / 2
          const endAngle = ((i + 1) / segments) * 2 * Math.PI - Math.PI / 2
          const x1 = cx + radius * Math.cos(startAngle)
          const y1 = cy + radius * Math.sin(startAngle)
          const x2 = cx + radius * Math.cos(endAngle)
          const y2 = cy + radius * Math.sin(endAngle)
          const hue = (i / segments) * 360
          const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={`hsl(${hue}, 100%, 50%)`}
              opacity={0.85}
            />
          )
        })}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
        <circle
          cx={indicatorX}
          cy={indicatorY}
          r="7"
          fill="white"
          stroke="black"
          strokeWidth="2"
          pointerEvents="none"
        />
      </Box>
      <HStack gap="2">
        <Box w="6" h="6" rounded="md" bg={value} border="2px solid" borderColor="white" shadow="sm" />
        <Text fontSize="sm" fontFamily="mono" color="fg">{value.toUpperCase()}</Text>
      </HStack>
    </VStack>
  )
}
