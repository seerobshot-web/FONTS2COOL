import { useEffect, useState, useCallback } from "react"
import {
  Box,
  Container,
  Grid,
  HStack,
  Heading,
  Text,
  VStack,
  Button,
  Input,
  IconButton,
  Code,
  SimpleGrid,
  Tag,
} from "@chakra-ui/react"
import { ColorInput } from "@/components/shared/ColorInput"
import { supabase } from "@/lib/supabase"
import { loadGoogleFont, fontFamilyCss } from "@/lib/font-utils"
import { contrastRatio, wcagRating } from "@/lib/color-utils"
import { useAuth } from "@/context/AuthContext"
import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"
import { LuCopy, LuSave, LuTrash2, LuDownload, LuUpload } from "react-icons/lu"
import type { BrandTheme, BrandThemeTokens } from "@/lib/types"
import { defaultTokens } from "@/lib/types"

const colorTokenLabels: { key: keyof BrandThemeTokens["colors"]; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "neutral", label: "Neutral" },
  { key: "background", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "border", label: "Border" },
  { key: "error", label: "Error" },
  { key: "warning", label: "Warning" },
  { key: "success", label: "Success" },
]

const typographyLabels: { key: keyof BrandThemeTokens["typography"]; label: string }[] = [
  { key: "headingFont", label: "Heading Font" },
  { key: "bodyFont", label: "Body Font" },
  { key: "headingSize", label: "Heading Size (px)" },
  { key: "bodySize", label: "Body Size (px)" },
  { key: "headingWeight", label: "Heading Weight" },
  { key: "bodyWeight", label: "Body Weight" },
  { key: "lineHeight", label: "Line Height" },
  { key: "letterSpacing", label: "Letter Spacing (px)" },
]

export function BrandThemePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tokens, setTokens] = useState<BrandThemeTokens>(defaultTokens)
  const [name, setName] = useState("My Brand Theme")
  const [savedThemes, setSavedThemes] = useState<BrandTheme[]>([])
  const [presets, setPresets] = useState<BrandTheme[]>([])
  const [activeExport, setActiveExport] = useState<string>("css")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGoogleFont(tokens.typography.headingFont, [400, 700])
    loadGoogleFont(tokens.typography.bodyFont, [400, 700])
  }, [tokens.typography.headingFont, tokens.typography.bodyFont])

  useEffect(() => {
    async function fetchThemes() {
      const { data: presetData } = await supabase
        .from("brand_themes")
        .select("*")
        .eq("is_preset", true)
        .order("name")

      if (presetData) setPresets(presetData as BrandTheme[])

      if (user) {
        const { data: userThemes } = await supabase
          .from("brand_themes")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_preset", false)
          .order("created_at", { ascending: false })
        if (userThemes) setSavedThemes(userThemes as BrandTheme[])
      }
      setLoading(false)
    }
    fetchThemes()
  }, [user])

  const updateToken = useCallback((category: "colors" | "typography" | "spacing", key: string, value: string) => {
    setTokens((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }))
  }, [])

  const loadTheme = (theme: BrandTheme) => {
    setTokens(theme.tokens)
    setName(theme.name)
    toaster.create({ title: `Loaded theme: ${theme.name}`, type: "success" })
  }

  const handleSave = async () => {
    if (!user) {
      toaster.create({ title: "Please sign in to save themes", type: "info" })
      navigate("/login")
      return
    }
    if (!name.trim()) {
      toaster.create({ title: "Please name your theme", type: "warning" })
      return
    }
    const { data, error } = await supabase
      .from("brand_themes")
      .insert({ name: name.trim(), tokens })
      .select()
      .single()

    if (error) {
      toaster.create({ title: "Failed to save theme", type: "error" })
      return
    }
    setSavedThemes([data as BrandTheme, ...savedThemes])
    toaster.create({ title: "Theme saved!", type: "success" })
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("brand_themes").delete().eq("id", id)
    if (error) {
      toaster.create({ title: "Failed to delete theme", type: "error" })
      return
    }
    setSavedThemes(savedThemes.filter((t) => t.id !== id))
    toaster.create({ title: "Theme deleted", type: "info" })
  }

  const exportCss = () => {
    const lines: string[] = [":root {"]
    Object.entries(tokens.colors).forEach(([k, v]) => lines.push(`  --color-${k}: ${v};`))
    lines.push(`  --font-heading: ${fontFamilyCss(tokens.typography.headingFont)};`)
    lines.push(`  --font-body: ${fontFamilyCss(tokens.typography.bodyFont)};`)
    lines.push(`  --font-heading-size: ${tokens.typography.headingSize}px;`)
    lines.push(`  --font-body-size: ${tokens.typography.bodySize}px;`)
    lines.push(`  --font-heading-weight: ${tokens.typography.headingWeight};`)
    lines.push(`  --font-body-weight: ${tokens.typography.bodyWeight};`)
    lines.push(`  --line-height: ${tokens.typography.lineHeight};`)
    lines.push(`  --letter-spacing: ${tokens.typography.letterSpacing}px;`)
    lines.push(`  --spacing-base: ${tokens.spacing.baseUnit}px;`)
    lines.push(`  --radius: ${tokens.spacing.radius}px;`)
    lines.push(`  --shadow: ${tokens.spacing.shadow};`)
    lines.push("}")
    return lines.join("\n")
  }

  const exportTailwind = () => {
    const lines: string[] = ["module.exports = {"]
    lines.push("  theme: {")
    lines.push("    colors: {")
    Object.entries(tokens.colors).forEach(([k, v]) => lines.push(`      ${k}: '${v}',`))
    lines.push("    },")
    lines.push("    fontFamily: {")
    lines.push(`      heading: ${fontFamilyCss(tokens.typography.headingFont)},`)
    lines.push(`      body: ${fontFamilyCss(tokens.typography.bodyFont)},`)
    lines.push("    },")
    lines.push(`    fontSize: { heading: '${tokens.typography.headingSize}px', body: '${tokens.typography.bodySize}px' },`)
    lines.push(`    borderRadius: { DEFAULT: '${tokens.spacing.radius}px' },`)
    lines.push(`    boxShadow: { DEFAULT: '${tokens.spacing.shadow}' },`)
    lines.push("  },")
    lines.push("}")
    return lines.join("\n")
  }

  const exportJson = () => JSON.stringify({ name, tokens }, null, 2)

  const exportFigma = () => {
    const figma: Record<string, unknown> = { name }
    const colorStyles: Record<string, { value: string; type: string }> = {}
    Object.entries(tokens.colors).forEach(([k, v]) => { colorStyles[k] = { value: v, type: "color" } })
    figma["colors"] = colorStyles
    const textStyles: Record<string, { value: string; type: string }> = {}
    textStyles["heading"] = { value: `${tokens.typography.headingFont} ${tokens.typography.headingWeight} ${tokens.typography.headingSize}px`, type: "text" }
    textStyles["body"] = { value: `${tokens.typography.bodyFont} ${tokens.typography.bodyWeight} ${tokens.typography.bodySize}px`, type: "text" }
    figma["typography"] = textStyles
    return JSON.stringify(figma, null, 2)
  }

  const exportContent = activeExport === "css" ? exportCss() : activeExport === "tailwind" ? exportTailwind() : activeExport === "json" ? exportJson() : exportFigma()

  const copyExport = () => {
    navigator.clipboard.writeText(exportContent)
    toaster.create({ title: `${activeExport.toUpperCase()} exported!`, type: "success" })
  }

  const downloadExport = () => {
    const ext = activeExport === "css" ? "css" : activeExport === "tailwind" ? "js" : "json"
    const blob = new Blob([exportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `brand-theme.${ext}`
    a.click()
    URL.revokeObjectURL(url)
    toaster.create({ title: "File downloaded!", type: "success" })
  }

  if (loading) {
    return (
      <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
        <Text color="fg.muted">Loading brand theme editor...</Text>
      </Container>
    )
  }

  return (
    <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
      <VStack gap="6" align="stretch">
        <Box>
          <Heading size="xl" mb="2">Brand Theme Builder</Heading>
          <Text color="fg.muted">Design a complete branded UI system with color tokens, typography, spacing, and live preview. Export to CSS, Tailwind, JSON, or Figma tokens.</Text>
        </Box>

        {/* Preset Themes */}
        <Box>
          <Heading size="md" mb="3">Preset Themes</Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap="3">
            {presets.map((preset) => (
              <Box
                key={preset.id}
                p="3"
                rounded="lg"
                border="1px solid"
                borderColor="border.subtle"
                bg="bg.panel"
                cursor="pointer"
                onClick={() => loadTheme(preset)}
                _hover={{ shadow: "md", borderColor: "border.emphasized" }}
                transition="all 0.15s"
              >
                <HStack h="24px" gap="0" rounded="sm" overflow="hidden" mb="2">
                  {[preset.tokens.colors.primary, preset.tokens.colors.secondary, preset.tokens.colors.accent, preset.tokens.colors.background].map((c, i) => (
                    <Box key={i} flex="1" h="100%" bg={c} />
                  ))}
                </HStack>
                <Text fontSize="sm" fontWeight="medium">{preset.name}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "380px 1fr" }} gap="6" alignItems="start">
          {/* Token Editor */}
          <VStack gap="4" align="stretch">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Theme name" size="sm" />

            {/* Color Tokens */}
            <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <Text fontSize="sm" fontWeight="semibold" mb="3">Color Tokens</Text>
              <VStack gap="3" align="stretch">
                {colorTokenLabels.map(({ key, label }) => (
                  <HStack key={key} gap="2" justify="space-between">
                    <Text fontSize="xs" color="fg.subtle" minW="5rem">{label}</Text>
                    <ColorInput
                      value={tokens.colors[key]}
                      onChange={(c) => updateToken("colors", key, c)}
                    />
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Typography Tokens */}
            <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <Text fontSize="sm" fontWeight="semibold" mb="3">Typography Tokens</Text>
              <VStack gap="3" align="stretch">
                <HStack gap="2" justify="space-between">
                  <Text fontSize="xs" color="fg.subtle" minW="5rem">Heading Font</Text>
                  <Input
                    value={tokens.typography.headingFont}
                    onChange={(e) => updateToken("typography", "headingFont", e.target.value)}
                    size="sm"
                    maxW="180px"
                    fontSize="xs"
                  />
                </HStack>
                <HStack gap="2" justify="space-between">
                  <Text fontSize="xs" color="fg.subtle" minW="5rem">Body Font</Text>
                  <Input
                    value={tokens.typography.bodyFont}
                    onChange={(e) => updateToken("typography", "bodyFont", e.target.value)}
                    size="sm"
                    maxW="180px"
                    fontSize="xs"
                  />
                </HStack>
                {typographyLabels.slice(2).map(({ key, label }) => (
                  <HStack key={key} gap="2" justify="space-between">
                    <Text fontSize="xs" color="fg.subtle" minW="5rem">{label}</Text>
                    <Input
                      value={tokens.typography[key]}
                      onChange={(e) => updateToken("typography", key, e.target.value)}
                      size="sm"
                      maxW="80px"
                      fontSize="xs"
                      fontFamily="mono"
                    />
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Spacing Tokens */}
            <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <Text fontSize="sm" fontWeight="semibold" mb="3">Spacing & Effects</Text>
              <VStack gap="3" align="stretch">
                <HStack gap="2" justify="space-between">
                  <Text fontSize="xs" color="fg.subtle" minW="5rem">Base Unit (px)</Text>
                  <Input value={tokens.spacing.baseUnit} onChange={(e) => updateToken("spacing", "baseUnit", e.target.value)} size="sm" maxW="80px" fontSize="xs" fontFamily="mono" />
                </HStack>
                <HStack gap="2" justify="space-between">
                  <Text fontSize="xs" color="fg.subtle" minW="5rem">Radius (px)</Text>
                  <Input value={tokens.spacing.radius} onChange={(e) => updateToken("spacing", "radius", e.target.value)} size="sm" maxW="80px" fontSize="xs" fontFamily="mono" />
                </HStack>
                <VStack gap="1" align="stretch">
                  <Text fontSize="xs" color="fg.subtle">Shadow</Text>
                  <Input value={tokens.spacing.shadow} onChange={(e) => updateToken("spacing", "shadow", e.target.value)} size="sm" fontSize="xs" fontFamily="mono" />
                </VStack>
              </VStack>
            </Box>

            <Button colorPalette="blue" onClick={handleSave} leftIcon={<LuSave />}>Save Theme</Button>
          </VStack>

          {/* Live Preview & Export */}
          <VStack gap="4" align="stretch">
            <Box>
              <Heading size="md" mb="3">Live Preview</Heading>
              <Box
                rounded="xl"
                border="1px solid"
                borderColor={tokens.colors.border}
                bg={tokens.colors.surface}
                overflow="hidden"
                style={{ boxShadow: tokens.spacing.shadow }}
              >
                {/* Card Header */}
                <Box p="5" bg={tokens.colors.primary} color={tokens.colors.background}>
                  <Text
                    fontSize={`${tokens.typography.headingSize}px`}
                    fontWeight={tokens.typography.headingWeight}
                    fontFamily={fontFamilyCss(tokens.typography.headingFont)}
                    lineHeight="1.15"
                  >
                    Brand Preview
                  </Text>
                </Box>

                {/* Card Body */}
                <VStack gap="4" align="stretch" p="5" bg={tokens.colors.surface}>
                  <Text
                    fontSize={`${tokens.typography.bodySize}px`}
                    fontWeight={tokens.typography.bodyWeight}
                    fontFamily={fontFamilyCss(tokens.typography.bodyFont)}
                    lineHeight={tokens.typography.lineHeight}
                    letterSpacing={`${tokens.typography.letterSpacing}px`}
                    color={tokens.colors.neutral}
                  >
                    This is how your body text will look. The quick brown fox jumps over the lazy dog. Every element on this page uses your brand tokens.
                  </Text>

                  {/* Buttons */}
                  <HStack gap="3" flexWrap="wrap">
                    <Box
                      as="button"
                      px="4"
                      py="2"
                      rounded="md"
                      bg={tokens.colors.primary}
                      color={tokens.colors.background}
                      fontSize="sm"
                      fontWeight="600"
                      cursor="pointer"
                      border="none"
                      style={{ borderRadius: `${tokens.spacing.radius}px` }}
                      _hover={{ opacity: 0.9 }}
                    >
                      Primary Button
                    </Box>
                    <Box
                      as="button"
                      px="4"
                      py="2"
                      rounded="md"
                      bg="transparent"
                      border="1px solid"
                      borderColor={tokens.colors.primary}
                      color={tokens.colors.primary}
                      fontSize="sm"
                      fontWeight="600"
                      cursor="pointer"
                      style={{ borderRadius: `${tokens.spacing.radius}px` }}
                      _hover={{ bg: tokens.colors.primary, color: tokens.colors.background }}
                    >
                      Outline Button
                    </Box>
                  </HStack>

                  {/* Tags */}
                  <HStack gap="2" flexWrap="wrap">
                    {(["success", "warning", "error", "accent"] as const).map((role) => {
                      const colorVal = tokens.colors[role]
                      const cr = wcagRating(contrastRatio(colorVal, tokens.colors.surface))
                      return (
                        <Tag.Root key={role} size="sm" variant="solid" colorPalette={cr.color}>
                          <Tag.Label textTransform="capitalize">{role}</Tag.Label>
                        </Tag.Root>
                      )
                    })}
                  </HStack>

                  {/* Form field preview */}
                  <VStack gap="2" align="stretch">
                    <Text fontSize="xs" color={tokens.colors.neutral} fontWeight="medium">Email Address</Text>
                    <Input
                      placeholder="user@example.com"
                      size="sm"
                      bg={tokens.colors.background}
                      borderColor={tokens.colors.border}
                      color={tokens.colors.neutral}
                      style={{ borderRadius: `${tokens.spacing.radius}px` }}
                    />
                  </VStack>

                  {/* Color palette strip */}
                  <HStack h="32px" rounded="md" overflow="hidden" border="1px solid" borderColor={tokens.colors.border}>
                    {Object.values(tokens.colors).slice(0, 6).map((c, i) => (
                      <Box key={i} flex="1" h="100%" bg={c} />
                    ))}
                  </HStack>
                </VStack>
              </Box>
            </Box>

            {/* Export */}
            <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <HStack justify="space-between" mb="3">
                <Text fontSize="sm" fontWeight="semibold">Export Theme</Text>
                <HStack gap="2">
                  {(["css", "tailwind", "json", "figma"] as const).map((fmt) => (
                    <Box
                      key={fmt}
                      as="button"
                      px="2"
                      py="1"
                      rounded="sm"
                      fontSize="2xs"
                      fontWeight="medium"
                      textTransform="uppercase"
                      bg={activeExport === fmt ? "bg.muted" : "transparent"}
                      color={activeExport === fmt ? "fg" : "fg.subtle"}
                      onClick={() => setActiveExport(fmt)}
                    >
                      {fmt}
                    </Box>
                  ))}
                </HStack>
              </HStack>
              <Box maxH="240px" overflow="auto" p="3" rounded="md" bg="bg.subtle">
                <Code display="block" whiteSpace="pre-wrap" fontSize="xs" color="fg">
                  {exportContent}
                </Code>
              </Box>
              <HStack gap="2" mt="3">
                <Button size="sm" variant="outline" onClick={copyExport} leftIcon={<LuCopy />}>
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={downloadExport} leftIcon={<LuDownload />}>
                  Download
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Grid>

        {/* Saved Themes */}
        {user && savedThemes.length > 0 && (
          <Box>
            <Heading size="md" mb="3">Your Saved Themes</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="3">
              {savedThemes.map((theme) => (
                <Box key={theme.id} p="3" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
                  <HStack h="24px" gap="0" rounded="sm" overflow="hidden" mb="2">
                    {[theme.tokens.colors.primary, theme.tokens.colors.secondary, theme.tokens.colors.accent, theme.tokens.colors.background].map((c, i) => (
                      <Box key={i} flex="1" h="100%" bg={c} />
                    ))}
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="medium">{theme.name}</Text>
                    <HStack gap="1">
                      <IconButton aria-label="Load" size="2xs" variant="ghost" onClick={() => loadTheme(theme)}>
                        <LuUpload />
                      </IconButton>
                      <IconButton aria-label="Delete" size="2xs" variant="ghost" colorPalette="red" onClick={() => handleDelete(theme.id)}>
                        <LuTrash2 />
                      </IconButton>
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </VStack>
    </Container>
  )
}
