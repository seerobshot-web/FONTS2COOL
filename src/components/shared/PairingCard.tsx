import { Box, HStack, Text, VStack, Tag, IconButton, Tooltip } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { LuArrowRight, LuHeart, LuShare2 } from "react-icons/lu"
import type { Font } from "@/lib/types"
import { loadGoogleFont, fontFamilyCss, categoryColor, categoryLabel } from "@/lib/font-utils"

interface PairingCardProps {
  primaryFont: Font
  secondaryFont: Font
  headingWeight?: number
  bodyWeight?: number
  headingText?: string
  bodyText?: string
  bgColor?: string
  textColor?: string
  headingSize?: number
  bodySize?: number
  tags?: string[]
  shareId?: string | null
  onUnsave?: () => void
  onSave?: () => void
  isSaved?: boolean
}

export function PairingCard({
  primaryFont,
  secondaryFont,
  headingWeight = 700,
  bodyWeight = 400,
  headingText = "Beautiful Typography",
  bodyText = "The quick brown fox jumps over the lazy dog. Discover font pairings that work perfectly together for your next design project.",
  bgColor = "#ffffff",
  textColor = "#1a1a1a",
  headingSize = 32,
  bodySize = 15,
  tags = [],
  onUnsave,
  onSave,
  isSaved,
}: PairingCardProps) {
  loadGoogleFont(primaryFont.family, primaryFont.weights)
  loadGoogleFont(secondaryFont.family, secondaryFont.weights)

  const isDark = bgColor.toLowerCase() === "#1a1a1a" || bgColor.toLowerCase() === "#000000"

  return (
    <Box
      rounded="xl"
      overflow="hidden"
      border="1px solid"
      borderColor="border.subtle"
      bg="bg.panel"
      transition="all 0.2s"
      _hover={{ shadow: "lg", borderColor: "border.emphasized" }}
    >
      <Box
        p="6"
        minH="220px"
        bg={bgColor}
        color={textColor}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="3"
      >
        <Text
          fontFamily={fontFamilyCss(primaryFont.family)}
          fontWeight={headingWeight}
          fontSize={`${headingSize}px`}
          lineHeight="1.15"
          letterSpacing="-0.02em"
        >
          {headingText}
        </Text>
        <Text
          fontFamily={fontFamilyCss(secondaryFont.family)}
          fontWeight={bodyWeight}
          fontSize={`${bodySize}px`}
          lineHeight="1.6"
        >
          {bodyText}
        </Text>
      </Box>

      <Box p="3" borderTop="1px solid" borderColor="border.subtle">
        <HStack justify="space-between" align="flex-start">
          <VStack align="flex-start" gap="1" flex="1" minW="0">
            <Text fontSize="xs" fontWeight="medium" color="fg" truncate>
              {primaryFont.family} + {secondaryFont.family}
            </Text>
            <HStack gap="1" flexWrap="wrap">
              <Tag.Root colorPalette={categoryColor(primaryFont.category)} size="sm" variant="subtle">
                <Tag.Label>{categoryLabel(primaryFont.category)}</Tag.Label>
              </Tag.Root>
              <Tag.Root colorPalette={categoryColor(secondaryFont.category)} size="sm" variant="subtle">
                <Tag.Label>{categoryLabel(secondaryFont.category)}</Tag.Label>
              </Tag.Root>
              {tags.map((tag) => (
                <Tag.Root key={tag} size="sm" variant="outline" colorPalette="gray">
                  <Tag.Label>{tag}</Tag.Label>
                </Tag.Root>
              ))}
            </HStack>
          </VStack>
          <HStack gap="1">
            {onSave && (
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <IconButton
                    aria-label={isSaved ? "Unsave" : "Save"}
                    size="xs"
                    variant="ghost"
                    colorPalette={isSaved ? "red" : "gray"}
                    onClick={isSaved ? onUnsave : onSave}
                  >
                    <LuHeart fill={isSaved ? "currentColor" : "none"} />
                  </IconButton>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content>{isSaved ? "Unsave" : "Save pairing"}</Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>
            )}
            {onUnsave && !onSave && (
              <IconButton
                aria-label="Remove"
                size="xs"
                variant="ghost"
                colorPalette="red"
                onClick={onUnsave}
              >
                <LuHeart fill="currentColor" />
              </IconButton>
            )}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <IconButton
                  aria-label="Open in playground"
                  size="xs"
                  variant="ghost"
                  as={Link}
                  to={`/playground?primary=${primaryFont.id}&secondary=${secondaryFont.id}&hw=${headingWeight}&bw=${bodyWeight}&bg=${encodeURIComponent(bgColor)}&tx=${encodeURIComponent(textColor)}&ht=${encodeURIComponent(headingText)}&bt=${encodeURIComponent(bodyText)}`}
                >
                  <LuArrowRight />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Positioner>
                <Tooltip.Content>Open in Playground</Tooltip.Content>
              </Tooltip.Positioner>
            </Tooltip.Root>
          </HStack>
        </HStack>
      </Box>
    </Box>
  )
}
