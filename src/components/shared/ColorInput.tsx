import { useState } from "react"
import { Box, HStack, Input, VStack, Text, Slider as ChakraSlider } from "@chakra-ui/react"
import { hexToHsl, hslToHex, rgbToString, hslToString } from "@/lib/color-theory"
import { isValidHex } from "@/lib/color-utils"

interface ColorInputProps {
  value: string
  onChange: (color: string) => void
  swatches?: string[]
  showSliders?: boolean
  showFormats?: boolean
}

export function ColorInput({ value, onChange, swatches = [], showSliders = false, showFormats = false }: ColorInputProps) {
  const safeValue = isValidHex(value) ? value : "#000000"
  const hsl = hexToHsl(safeValue)
  const [formatTab, setFormatTab] = useState<"hex" | "rgb" | "hsl">("hex")

  const updateFromHsl = (newHsl: Partial<{ h: number; s: number; l: number }>) => {
    if (!hsl) return
    const merged = { ...hsl, ...newHsl }
    onChange(hslToHex(merged.h, merged.s, merged.l))
  }

  return (
    <VStack gap="3" align="stretch">
      <HStack gap="2">
        <Box
          position="relative"
          w="36px"
          h="36px"
          rounded="md"
          border="1px solid"
          borderColor="border.emphasized"
          overflow="hidden"
          cursor="pointer"
          flexShrink="0"
        >
          <Box
            as="input"
            type="color"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            border="none"
            cursor="pointer"
            opacity="0"
          />
          <Box w="100%" h="100%" bg={safeValue} pointerEvents="none" />
        </Box>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="sm"
          maxW="110px"
          fontFamily="mono"
          fontSize="xs"
          borderColor={isValidHex(value) ? "border.subtle" : "red.400"}
        />
        {swatches.length > 0 && (
          <HStack gap="1" flexWrap="wrap">
            {swatches.map((c) => (
              <Box
                key={c}
                w="5"
                h="5"
                rounded="sm"
                bg={c}
                border="1px solid"
                borderColor="border.subtle"
                cursor="pointer"
                onClick={() => onChange(c)}
                _hover={{ borderColor: "border.emphasized", transform: "scale(1.1)" }}
                transition="all 0.1s"
              />
            ))}
          </HStack>
        )}
      </HStack>

      {showSliders && hsl && (
        <VStack gap="2" align="stretch">
          <HStack gap="2">
            <Text fontSize="xs" color="fg.subtle" minW="2.5rem">Hue</Text>
          </HStack>
          <ChakraSlider.Root
            value={[hsl.h]}
            onValueChange={(e) => updateFromHsl({ h: e.value[0] })}
            min={0}
            max={360}
          >
            <ChakraSlider.Control>
              <ChakraSlider.Track>
                <ChakraSlider.Range />
              </ChakraSlider.Track>
              <ChakraSlider.Thumb index={0} />
            </ChakraSlider.Control>
          </ChakraSlider.Root>
          <HStack gap="2">
            <Text fontSize="xs" color="fg.subtle" minW="2.5rem">Sat</Text>
            <Text fontSize="xs" color="fg.muted" ml="auto">{hsl.s}%</Text>
          </HStack>
          <ChakraSlider.Root
            value={[hsl.s]}
            onValueChange={(e) => updateFromHsl({ s: e.value[0] })}
            min={0}
            max={100}
          >
            <ChakraSlider.Control>
              <ChakraSlider.Track>
                <ChakraSlider.Range />
              </ChakraSlider.Track>
              <ChakraSlider.Thumb index={0} />
            </ChakraSlider.Control>
          </ChakraSlider.Root>
          <HStack gap="2">
            <Text fontSize="xs" color="fg.subtle" minW="2.5rem">Light</Text>
            <Text fontSize="xs" color="fg.muted" ml="auto">{hsl.l}%</Text>
          </HStack>
          <ChakraSlider.Root
            value={[hsl.l]}
            onValueChange={(e) => updateFromHsl({ l: e.value[0] })}
            min={0}
            max={100}
          >
            <ChakraSlider.Control>
              <ChakraSlider.Track>
                <ChakraSlider.Range />
              </ChakraSlider.Track>
              <ChakraSlider.Thumb index={0} />
            </ChakraSlider.Control>
          </ChakraSlider.Root>
        </VStack>
      )}

      {showFormats && (
        <VStack gap="1" align="stretch">
          <HStack gap="1">
            {(["hex", "rgb", "hsl"] as const).map((fmt) => (
              <Box
                key={fmt}
                as="button"
                px="2"
                py="1"
                rounded="sm"
                fontSize="2xs"
                fontWeight="medium"
                textTransform="uppercase"
                bg={formatTab === fmt ? "bg.muted" : "transparent"}
                color={formatTab === fmt ? "fg" : "fg.subtle"}
                onClick={() => setFormatTab(fmt)}
              >
                {fmt}
              </Box>
            ))}
          </HStack>
          <HStack
            gap="2"
            p="2"
            rounded="md"
            bg="bg.subtle"
            cursor="pointer"
            onClick={() => {
              const text = formatTab === "hex" ? safeValue : formatTab === "rgb" ? rgbToString(safeValue) : hslToString(safeValue)
              navigator.clipboard.writeText(text)
            }}
          >
            <Text fontSize="xs" fontFamily="mono" color="fg">
              {formatTab === "hex" ? safeValue : formatTab === "rgb" ? rgbToString(safeValue) : hslToString(safeValue)}
            </Text>
          </HStack>
        </VStack>
      )}
    </VStack>
  )
}
