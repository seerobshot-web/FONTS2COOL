import { useEffect, useMemo, useState, useCallback } from "react"
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
  Textarea,
  Tag,
  Code,
  IconButton,
} from "@chakra-ui/react"
import { Slider } from "@/components/ui/slider"
import { FontSelector } from "@/components/shared/FontSelector"
import { ColorInput } from "@/components/shared/ColorInput"
import { supabase } from "@/lib/supabase"
import type { Font, PlaygroundState } from "@/lib/types"
import { loadGoogleFont, fontFamilyCss, buildGoogleFontsLink } from "@/lib/font-utils"
import { runFontPairingLab } from "@/lib/font-pairing-lab"
import { generateShareId } from "@/lib/color-utils"
import { useAuth } from "@/context/AuthContext"
import { toaster } from "@/components/ui/toaster"
import { useNavigate, useSearchParams } from "react-router-dom"
import { LuCopy, LuShare2, LuHeart, LuCode, LuDownload } from "react-icons/lu"

const defaultState: PlaygroundState = {
  primaryFontId: null,
  secondaryFontId: null,
  headingWeight: 700,
  bodyWeight: 400,
  headingSize: 48,
  bodySize: 18,
  lineHeight: 1.6,
  letterSpacing: 0,
  gap: 16,
  bgColor: "#ffffff",
  textColor: "#1a1a1a",
  headingText: "Beautiful Typography Matters",
  bodyText: "The quick brown fox jumps over the lazy dog. Great design starts with great typography. Click anywhere in this text to edit it and see how your fonts look with real content. Adjust the sliders to fine-tune sizes, spacing, and colors until everything feels just right.",
}

export function PlaygroundPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [fonts, setFonts] = useState<Font[]>([])
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<PlaygroundState>(defaultState)
  const [savedPairingKeys, setSavedPairingKeys] = useState<Set<string>>(new Set())
  const [showCss, setShowCss] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [labResult, setLabResult] = useState<unknown>(null)
  const [labLoading, setLabLoading] = useState(false)
  const [labError, setLabError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFonts() {
      const { data, error } = await supabase.from("fonts").select("*").order("family")
      if (error) {
        toaster.create({ title: "Failed to load fonts", type: "error" })
        setLoading(false)
        return
      }
      setFonts(data || [])
      setLoading(false)

      const primaryParam = searchParams.get("primary")
      const secondaryParam = searchParams.get("secondary")
      const firstSans = data?.find((f) => f.category === "sans-serif")
      const firstSerif = data?.find((f) => f.category === "serif")

      setState((prev) => ({
        ...prev,
        primaryFontId: primaryParam || prev.primaryFontId || firstSans?.id || data?.[0]?.id || null,
        secondaryFontId: secondaryParam || prev.secondaryFontId || firstSerif?.id || data?.[1]?.id || null,
        headingWeight: searchParams.get("hw") ? Number(searchParams.get("hw")) : prev.headingWeight,
        bodyWeight: searchParams.get("bw") ? Number(searchParams.get("bw")) : prev.bodyWeight,
        headingSize: searchParams.get("hs") ? Number(searchParams.get("hs")) : prev.headingSize,
        bodySize: searchParams.get("bs") ? Number(searchParams.get("bs")) : prev.bodySize,
        bgColor: searchParams.get("bg") ? decodeURIComponent(searchParams.get("bg")!) : prev.bgColor,
        textColor: searchParams.get("tx") ? decodeURIComponent(searchParams.get("tx")!) : prev.textColor,
        headingText: searchParams.get("ht") ? decodeURIComponent(searchParams.get("ht")!) : prev.headingText,
        bodyText: searchParams.get("bt") ? decodeURIComponent(searchParams.get("bt")!) : prev.bodyText,
      }))
    }
    fetchFonts()
  }, [])

  useEffect(() => {
    if (!user) return
    async function fetchSaved() {
      const { data } = await supabase
        .from("pairings")
        .select("primary_font_id, secondary_font_id")
        .eq("user_id", user.id)
      if (data) {
        setSavedPairingKeys(new Set(data.map((p) => `${p.primary_font_id}-${p.secondary_font_id}`)))
      }
    }
    fetchSaved()
  }, [user])

  const primaryFont = fonts.find((f) => f.id === state.primaryFontId)
  const secondaryFont = fonts.find((f) => f.id === state.secondaryFontId)

  useEffect(() => {
    if (primaryFont) loadGoogleFont(primaryFont.family, primaryFont.weights)
  }, [primaryFont])

  useEffect(() => {
    if (secondaryFont) loadGoogleFont(secondaryFont.family, secondaryFont.weights)
  }, [secondaryFont])

  const updateState = useCallback((partial: Partial<PlaygroundState>) => {
    setState((prev) => ({ ...prev, ...partial }))
  }, [])

  const pairingKey = state.primaryFontId && state.secondaryFontId
    ? `${state.primaryFontId}-${state.secondaryFontId}`
    : null
  const isSaved = pairingKey ? savedPairingKeys.has(pairingKey) : false

  const handleSave = async () => {
    if (!user) {
      toaster.create({ title: "Please sign in to save pairings", type: "info" })
      navigate("/login")
      return
    }
    if (!state.primaryFontId || !state.secondaryFontId) return

    if (isSaved && pairingKey) {
      const { error } = await supabase
        .from("pairings")
        .delete()
        .eq("user_id", user.id)
        .eq("primary_font_id", state.primaryFontId)
        .eq("secondary_font_id", state.secondaryFontId)
      if (error) {
        toaster.create({ title: "Failed to remove pairing", type: "error" })
        return
      }
      setSavedPairingKeys((prev) => {
        const next = new Set(prev)
        next.delete(pairingKey)
        return next
      })
      toaster.create({ title: "Pairing removed", type: "info" })
    } else {
      const { error } = await supabase
        .from("pairings")
        .insert({
          primary_font_id: state.primaryFontId,
          secondary_font_id: state.secondaryFontId,
          heading_size: state.headingSize,
          body_size: state.bodySize,
          line_height: state.lineHeight,
          letter_spacing: state.letterSpacing,
          bg_color: state.bgColor,
          text_color: state.textColor,
          sample_text: state.headingText,
        })
      if (error) {
        if (error.code === "23505") {
          toaster.create({ title: "This pairing is already saved", type: "info" })
        } else {
          toaster.create({ title: "Failed to save pairing", type: "error" })
        }
        return
      }
      if (pairingKey) {
        setSavedPairingKeys((prev) => new Set(prev).add(pairingKey))
      }
      toaster.create({ title: "Pairing saved!", type: "success" })
    }
  }

  const handleShare = async () => {
    if (!user || !state.primaryFontId || !state.secondaryFontId) {
      if (!user) {
        toaster.create({ title: "Please sign in to share pairings", type: "info" })
        navigate("/login")
        return
      }
      return
    }

    const shareId = generateShareId()
    const { error } = await supabase
      .from("pairings")
      .update({ share_id: shareId })
      .eq("user_id", user.id)
      .eq("primary_font_id", state.primaryFontId)
      .eq("secondary_font_id", state.secondaryFontId)

    if (error) {
      toaster.create({ title: "Failed to create share link", type: "error" })
      return
    }

    const url = `${window.location.origin}/share/${shareId}`
    setShareUrl(url)
    await navigator.clipboard.writeText(url)
    toaster.create({ title: "Share link copied to clipboard!", type: "success" })
  }

  const cssCode = useMemo(() => {
    const lines: string[] = []
    if (primaryFont && secondaryFont) {
      lines.push(`/* Google Fonts */`)
      lines.push(`@import url('${buildGoogleFontsLink(
        [primaryFont.family, secondaryFont.family],
        { [primaryFont.family]: primaryFont.weights, [secondaryFont.family]: secondaryFont.weights },
      )}');`)
      lines.push("")
      lines.push(`/* Heading */`)
      lines.push(`.heading {`)
      lines.push(`  font-family: ${fontFamilyCss(primaryFont.family)};`)
      lines.push(`  font-weight: ${state.headingWeight};`)
      lines.push(`  font-size: ${state.headingSize}px;`)
      lines.push(`  line-height: 1.15;`)
      lines.push(`  letter-spacing: -0.02em;`)
      lines.push(`  color: ${state.textColor};`)
      lines.push(`}`)
      lines.push("")
      lines.push(`/* Body */`)
      lines.push(`.body {`)
      lines.push(`  font-family: ${fontFamilyCss(secondaryFont.family)};`)
      lines.push(`  font-weight: ${state.bodyWeight};`)
      lines.push(`  font-size: ${state.bodySize}px;`)
      lines.push(`  line-height: ${state.lineHeight};`)
      lines.push(`  letter-spacing: ${state.letterSpacing}px;`)
      lines.push(`  color: ${state.textColor};`)
      lines.push(`}`)
      lines.push("")
      lines.push(`/* Container */`)
      lines.push(`.container {`)
      lines.push(`  background-color: ${state.bgColor};`)
      lines.push(`  padding: 2rem;`)
      lines.push(`  gap: ${state.gap}px;`)
      lines.push(`}`)
    }
    return lines.join("\n")
  }, [primaryFont, secondaryFont, state])

  const googleFontsLink = useMemo(() => {
    if (!primaryFont || !secondaryFont) return ""
    return buildGoogleFontsLink(
      [primaryFont.family, secondaryFont.family],
      { [primaryFont.family]: primaryFont.weights, [secondaryFont.family]: secondaryFont.weights },
    )
  }, [primaryFont, secondaryFont])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toaster.create({ title: `${label} copied!`, type: "success" })
  }

  const handlePairingLab = async () => {
    if (!primaryFont || !secondaryFont) return
    setLabLoading(true)
    setLabError(null)
    try {
      const result = await runFontPairingLab({
        headingFont: primaryFont.family,
        headingWeight: state.headingWeight,
        bodyFont: secondaryFont.family,
        bodyWeight: state.bodyWeight,
        bodySize: state.bodySize,
        lineHeight: state.lineHeight,
        headingSample: state.headingText,
        bodySample: state.bodyText,
      })
      setLabResult(result)
      toaster.create({ title: "Pairing Lab analysis ready", type: "success" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Pairing Lab is unavailable right now"
      setLabError(message)
      setLabResult(null)
      toaster.create({ title: "Pairing Lab could not respond", description: message, type: "error" })
    } finally {
      setLabLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
        <Text color="fg.muted">Loading playground...</Text>
      </Container>
    )
  }

  return (
    <Container maxW="7xl" px={{ base: 4, md: 6 }} py="6">
      <VStack gap="4" align="stretch">
        <HStack justify="space-between" flexWrap="wrap" gap="3">
          <Heading size="xl">Playground</Heading>
          <HStack gap="2" flexWrap="wrap">
            <Button
              size="sm"
              variant={isSaved ? "solid" : "outline"}
              colorPalette={isSaved ? "red" : "blue"}
              onClick={handleSave}
              leftIcon={<LuHeart fill={isSaved ? "currentColor" : "none"} />}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare} leftIcon={<LuShare2 />}>
              Share
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowCss(!showCss)} leftIcon={<LuCode />}>
              {showCss ? "Hide CSS" : "Get CSS"}
            </Button>
          </HStack>
        </HStack>

        <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
          <HStack justify="space-between" align={{ base: "flex-start", md: "center" }} gap="4" flexWrap="wrap">
            <VStack align="flex-start" gap="1">
              <HStack gap="2">
                <Text fontSize="sm" fontWeight="semibold">Pairing Lab</Text>
                <Tag.Root size="sm" colorPalette="purple" variant="subtle">
                  <Tag.Label>MCP</Tag.Label>
                </Tag.Root>
              </HStack>
              <Text fontSize="xs" color="fg.muted">
                Analyze this pairing with the webfont-pairing-lab tool.
              </Text>
            </VStack>
            <Button
              size="sm"
              colorPalette="purple"
              variant="outline"
              onClick={handlePairingLab}
              loading={labLoading}
              disabled={!primaryFont || !secondaryFont}
            >
              Analyze pairing
            </Button>
          </HStack>
          {labError && (
            <Text mt="3" fontSize="sm" color="fg.error">{labError}</Text>
          )}
          {labResult && (
            <Box mt="3" p="3" rounded="md" bg="bg.subtle" maxH="240px" overflow="auto">
              <Code display="block" whiteSpace="pre-wrap" fontSize="xs" color="fg">
                {JSON.stringify(labResult, null, 2)}
              </Code>
            </Box>
          )}
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "340px 1fr" }} gap="6">
          {/* Controls Panel */}
          <VStack gap="5" align="stretch">
            <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <VStack gap="4" align="stretch">
                <FontSelector
                  fonts={fonts}
                  value={state.primaryFontId}
                  onChange={(id) => updateState({ primaryFontId: id })}
                  label="Primary Font (Heading)"
                  weight={state.headingWeight}
                  onWeightChange={(w) => updateState({ headingWeight: w })}
                />
                <FontSelector
                  fonts={fonts}
                  value={state.secondaryFontId}
                  onChange={(id) => updateState({ secondaryFontId: id })}
                  label="Secondary Font (Body)"
                  weight={state.bodyWeight}
                  onWeightChange={(w) => updateState({ bodyWeight: w })}
                />
              </VStack>
            </Box>

            {/* Spacing Controls */}
            <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <VStack gap="3" align="stretch">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted">Typography Controls</Text>
                <Slider
                  label="Heading Size"
                  showValue
                  value={[state.headingSize]}
                  onValueChange={(v) => updateState({ headingSize: v.value[0] })}
                  min={16}
                  max={96}
                  step={1}
                />
                <Slider
                  label="Body Size"
                  showValue
                  value={[state.bodySize]}
                  onValueChange={(v) => updateState({ bodySize: v.value[0] })}
                  min={10}
                  max={32}
                  step={1}
                />
                <Slider
                  label="Line Height"
                  showValue
                  value={[state.lineHeight]}
                  onValueChange={(v) => updateState({ lineHeight: v.value[0] })}
                  min={1}
                  max={2.5}
                  step={0.05}
                />
                <Slider
                  label="Letter Spacing"
                  showValue
                  value={[state.letterSpacing]}
                  onValueChange={(v) => updateState({ letterSpacing: v.value[0] })}
                  min={-2}
                  max={5}
                  step={0.1}
                />
                <Slider
                  label="Gap"
                  showValue
                  value={[state.gap]}
                  onValueChange={(v) => updateState({ gap: v.value[0] })}
                  min={0}
                  max={64}
                  step={1}
                />
              </VStack>
            </Box>

            {/* Color Controls */}
            <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <VStack gap="3" align="stretch">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted">Colors</Text>
                <HStack gap="3" flexWrap="wrap">
                  <Text fontSize="xs" color="fg.subtle" minW="5rem">Background</Text>
                  <ColorInput
                    value={state.bgColor}
                    onChange={(c) => updateState({ bgColor: c })}
                    swatches={["#ffffff", "#f5f5f5", "#1a1a1a", "#0f172a", "#fef3c7", "#dbeafe", "#fce7f3", "#d1fae5"]}
                  />
                </HStack>
                <HStack gap="3" flexWrap="wrap">
                  <Text fontSize="xs" color="fg.subtle" minW="5rem">Text Color</Text>
                  <ColorInput
                    value={state.textColor}
                    onChange={(c) => updateState({ textColor: c })}
                    swatches={["#1a1a1a", "#333333", "#ffffff", "#6b7280", "#ef4444", "#3b82f6", "#a855f7", "#22c55e"]}
                  />
                </HStack>
              </VStack>
            </Box>

            {/* Sample Text Controls */}
            <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <VStack gap="3" align="stretch">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted">Sample Content</Text>
                <VStack gap="1" align="stretch">
                  <Text fontSize="xs" color="fg.subtle">Heading Text</Text>
                  <Input
                    value={state.headingText}
                    onChange={(e) => updateState({ headingText: e.target.value })}
                    size="sm"
                  />
                </VStack>
                <VStack gap="1" align="stretch">
                  <Text fontSize="xs" color="fg.subtle">Body Text</Text>
                  <Textarea
                    value={state.bodyText}
                    onChange={(e) => updateState({ bodyText: e.target.value })}
                    size="sm"
                    rows={4}
                  />
                </VStack>
              </VStack>
            </Box>
          </VStack>

          {/* Preview Area */}
          <VStack gap="4" align="stretch">
            <Box
              rounded="xl"
              border="1px solid"
              borderColor="border.subtle"
              overflow="hidden"
              flex="1"
              minH="500px"
              display="flex"
              flexDirection="column"
            >
              <Box
                p={{ base: "4", md: "8" }}
                flex="1"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap={`${state.gap}px`}
                style={{
                  backgroundColor: state.bgColor,
                  color: state.textColor,
                }}
              >
                {primaryFont && (
                  <Box
                    contentEditable
                    suppressContentEditableWarning
                    style={{
                      fontFamily: fontFamilyCss(primaryFont.family),
                      fontWeight: state.headingWeight,
                      fontSize: `${state.headingSize}px`,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      outline: "none",
                    }}
                    onBlur={(e) => updateState({ headingText: e.currentTarget.textContent || "" })}
                  >
                    {state.headingText}
                  </Box>
                )}
                {secondaryFont && (
                  <Box
                    contentEditable
                    suppressContentEditableWarning
                    style={{
                      fontFamily: fontFamilyCss(secondaryFont.family),
                      fontWeight: state.bodyWeight,
                      fontSize: `${state.bodySize}px`,
                      lineHeight: state.lineHeight,
                      letterSpacing: `${state.letterSpacing}px`,
                      outline: "none",
                    }}
                    onBlur={(e) => updateState({ bodyText: e.currentTarget.textContent || "" })}
                  >
                    {state.bodyText}
                  </Box>
                )}
                {!primaryFont && !secondaryFont && (
                  <Text color={state.textColor} textAlign="center" opacity="0.5">
                    Select fonts to start previewing
                  </Text>
                )}
              </Box>
            </Box>

            <Text fontSize="xs" color="fg.subtle" textAlign="center">
              Click on the heading or body text above to edit it directly.
            </Text>

            {/* CSS Export */}
            {showCss && (
              <Box p="4" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
                <VStack gap="3" align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="medium">CSS Code</Text>
                    <HStack gap="2">
                      <IconButton aria-label="Copy CSS" size="xs" variant="ghost" onClick={() => copyToClipboard(cssCode, "CSS")}>
                        <LuCopy />
                      </IconButton>
                    </HStack>
                  </HStack>
                  <Box
                    p="3"
                    rounded="md"
                    bg="bg.subtle"
                    maxH="300px"
                    overflow="auto"
                    fontFamily="mono"
                    fontSize="xs"
                    whiteSpace="pre-wrap"
                    color="fg"
                  >
                    {cssCode}
                  </Box>
                  <HStack gap="2">
                    <Button size="xs" variant="outline" onClick={() => copyToClipboard(googleFontsLink, "Google Fonts link")}>
                      <LuDownload /> Copy Google Fonts Link
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            )}

            {shareUrl && (
              <Box p="3" rounded="lg" border="1px solid" borderColor="green.300" bg="green.50" _dark={{ bg: "green.950", borderColor: "green.700" }}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="green.700" _dark={{ color: "green.300" }} fontFamily="mono" truncate>
                    {shareUrl}
                  </Text>
                  <IconButton aria-label="Copy share link" size="xs" variant="ghost" onClick={() => copyToClipboard(shareUrl, "Share link")}>
                    <LuCopy />
                  </IconButton>
                </HStack>
              </Box>
            )}
          </VStack>
        </Grid>
      </VStack>
    </Container>
  )
}
