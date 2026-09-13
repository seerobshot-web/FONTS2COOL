import { useMemo } from "react"
import {
  Box,
  HStack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react"
import { NativeSelectRoot, NativeSelectField } from "@/components/ui/native-select"
import type { Font } from "@/lib/types"
import { loadGoogleFont, fontFamilyCss, categoryColor, categoryLabel } from "@/lib/font-utils"

interface FontSelectorProps {
  fonts: Font[]
  value: string | null
  onChange: (fontId: string) => void
  label: string
  weight: number
  onWeightChange: (weight: number) => void
}

export function FontSelector({ fonts, value, onChange, label, weight, onWeightChange }: FontSelectorProps) {
  const selectedFont = fonts.find((f) => f.id === value)

  const sortedFonts = useMemo(
    () => [...fonts].sort((a, b) => a.family.localeCompare(b.family)),
    [fonts],
  )

  const items = useMemo(
    () =>
      sortedFonts.map((f) => ({
        value: f.id,
        label: f.family,
      })),
    [sortedFonts],
  )

  const weightItems = useMemo(() => {
    if (!selectedFont) return [{ value: "400", label: "400" }]
    return selectedFont.weights.map((w) => ({ value: String(w), label: String(w) }))
  }, [selectedFont])

  return (
    <VStack align="stretch" gap="2">
      <Text fontSize="sm" fontWeight="medium" color="fg.muted">
        {label}
      </Text>
      <NativeSelectRoot size="sm">
        <NativeSelectField
          value={value ?? ""}
          onChange={(e) => {
            onChange(e.target.value)
            const font = fonts.find((f) => f.id === e.target.value)
            if (font) loadGoogleFont(font.family, font.weights)
          }}
          items={items}
          placeholder="Select a font"
        />
      </NativeSelectRoot>
      <HStack gap="2">
        <Text fontSize="xs" color="fg.subtle" minW="3rem">Weight</Text>
        <NativeSelectRoot size="xs" flex="1">
          <NativeSelectField
            value={String(weight)}
            onChange={(e) => onWeightChange(Number(e.target.value))}
            items={weightItems}
          />
        </NativeSelectRoot>
      </HStack>
      {selectedFont && (
        <HStack gap="2" flexWrap="wrap">
          <Tag.Root colorPalette={categoryColor(selectedFont.category)} size="sm" variant="subtle">
            <Tag.Label>{categoryLabel(selectedFont.category)}</Tag.Label>
          </Tag.Root>
          <Text fontSize="xs" color="fg.subtle">
            {selectedFont.glyph_count} glyphs
          </Text>
          {selectedFont.x_height && (
            <Text fontSize="xs" color="fg.subtle">
              x-height: {selectedFont.x_height}
            </Text>
          )}
        </HStack>
      )}
      {selectedFont && (
        <Box
          p="2"
          rounded="md"
          bg="bg.subtle"
          fontSize="lg"
          fontFamily={fontFamilyCss(selectedFont.family)}
          fontWeight={weight}
          color="fg"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {selectedFont.family}
        </Box>
      )}
    </VStack>
  )
}
