import { useEffect, useState } from "react"
import {
  Box,
  Container,
  HStack,
  Heading,
  Text,
  VStack,
  Button,
  Input,
  Tag,
  SimpleGrid,
  IconButton,
  Grid,
} from "@chakra-ui/react"
import { Tabs } from "@chakra-ui/react"
import { ColorInput } from "@/components/shared/ColorInput"
import { ColorWheel } from "@/components/shared/ColorWheel"
import { supabase } from "@/lib/supabase"
import type { ColorPalette } from "@/lib/types"
import { contrastRatio, wcagRating } from "@/lib/color-utils"
import {
  generateScheme,
  generatePalette,
  generateMonoScale,
  generateRandomSeed,
  apcaScore,
  schemeModes,
  paletteStyles,
  type SchemeMode,
  type PaletteStyle,
} from "@/lib/color-theory"
import { useAuth } from "@/context/AuthContext"
import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"
import { LuPlus, LuTrash2, LuCopy, LuSave, LuArrowRight, LuShuffle, LuArrowLeftRight } from "react-icons/lu"

const curatedPalettes: { name: string; colors: string[] }[] = [
  { name: "Ocean Breeze", colors: ["#0d9488", "#14b8a6", "#5eead4", "#ccfbf1", "#f0fdfa"] },
  { name: "Sunset Glow", colors: ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#fff7ed"] },
  { name: "Royal Purple", colors: ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ede9fe"] },
  { name: "Forest Green", colors: ["#166534", "#15803d", "#22c55e", "#86efac", "#f0fdf4"] },
  { name: "Midnight", colors: ["#0f172a", "#1e293b", "#334155", "#94a3b8", "#f1f5f9"] },
  { name: "Coral Reef", colors: ["#e11d48", "#fb7185", "#fda4af", "#fecdd3", "#fff1f2"] },
  { name: "Golden Hour", colors: ["#ca8a04", "#eab308", "#fde047", "#fef9c3", "#fefce8"] },
  { name: "Slate Pro", colors: ["#1e293b", "#475569", "#64748b", "#cbd5e1", "#f8fafc"] },
  { name: "Berry Mix", colors: ["#a21caf", "#c026d3", "#d946ef", "#f0abfc", "#fdf4ff"] },
  { name: "Earth Tones", colors: ["#78350f", "#a16207", "#ca8a04", "#fde68a", "#fffbeb"] },
  { name: "Ice Blue", colors: ["#0c4a6e", "#0284c7", "#38bdf8", "#bae6fd", "#f0f9ff"] },
  { name: "Mono Dark", colors: ["#000000", "#262626", "#525252", "#a3a3a3", "#e5e5e5"] },
]

export function ColorsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([])
  const [paletteName, setPaletteName] = useState("")
  const [customColors, setCustomColors] = useState<string[]>(["#3b82f6", "#f3f4f6", "#1e293b"])
  const [activeColorIndex, setActiveColorIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<string>("builder")

  // Color wheel state
  const [wheelSeed, setWheelSeed] = useState("#3b82f6")
  const [wheelMode, setWheelMode] = useState<SchemeMode>("analogic")
  const [wheelColors, setWheelColors] = useState<string[]>([])

  // Palette generator state
  const [genSeed, setGenSeed] = useState("#3b82f6")
  const [genStyle, setGenStyle] = useState<PaletteStyle>("vibrant")
  const [genResult, setGenResult] = useState<ReturnType<typeof generatePalette> | null>(null)

  // Mono scale state
  const [monoSeed, setMonoSeed] = useState("#3b82f6")
  const [monoScale, setMonoScale] = useState<ReturnType<typeof generateMonoScale>>([])

  // Contrast checker state
  const [contrastFg, setContrastFg] = useState("#1a1a1a")
  const [contrastBg, setContrastBg] = useState("#ffffff")

  useEffect(() => {
    setWheelColors(generateScheme(wheelSeed, wheelMode, 5))
  }, [wheelSeed, wheelMode])

  useEffect(() => {
    setGenResult(generatePalette(genSeed, genStyle))
  }, [genSeed, genStyle])

  useEffect(() => {
    setMonoScale(generateMonoScale(monoSeed))
  }, [monoSeed])

  useEffect(() => {
    if (!user) return
    async function fetchPalettes() {
      const { data } = await supabase
        .from("color_palettes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (data) setSavedPalettes(data)
    }
    fetchPalettes()
  }, [user])

  const activeColor = customColors[activeColorIndex] || "#000000"

  const addColor = () => {
    if (customColors.length >= 6) {
      toaster.create({ title: "Maximum 6 colors per palette", type: "info" })
      return
    }
    setCustomColors([...customColors, "#ffffff"])
  }

  const removeColor = (index: number) => {
    if (customColors.length <= 2) return
    const next = customColors.filter((_, i) => i !== index)
    setCustomColors(next)
    if (activeColorIndex >= next.length) setActiveColorIndex(next.length - 1)
  }

  const updateColor = (index: number, color: string) => {
    const next = [...customColors]
    next[index] = color
    setCustomColors(next)
  }

  const handleSavePalette = async () => {
    if (!user) {
      toaster.create({ title: "Please sign in to save palettes", type: "info" })
      navigate("/login")
      return
    }
    if (!paletteName.trim()) {
      toaster.create({ title: "Please name your palette", type: "warning" })
      return
    }
    const { data, error } = await supabase
      .from("color_palettes")
      .insert({ name: paletteName.trim(), colors: customColors })
      .select()
      .single()

    if (error) {
      toaster.create({ title: "Failed to save palette", type: "error" })
      return
    }
    setSavedPalettes([data, ...savedPalettes])
    setPaletteName("")
    toaster.create({ title: "Palette saved!", type: "success" })
  }

  const handleDeletePalette = async (id: string) => {
    const { error } = await supabase.from("color_palettes").delete().eq("id", id)
    if (error) {
      toaster.create({ title: "Failed to delete palette", type: "error" })
      return
    }
    setSavedPalettes(savedPalettes.filter((p) => p.id !== id))
    toaster.create({ title: "Palette deleted", type: "info" })
  }

  const copyAsCSS = (colors: string[]) => {
    const css = colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")
    navigator.clipboard.writeText(`:root {\n${css}\n}`)
    toaster.create({ title: "CSS variables copied!", type: "success" })
  }

  const copyAsTailwind = (colors: string[]) => {
    const tw = colors.map((c, i) => `  '${(i + 1) * 100}': '${c}',`).join("\n")
    navigator.clipboard.writeText(`colors: {\n  brand: {\n${tw}\n  }\n}`)
    toaster.create({ title: "Tailwind config copied!", type: "success" })
  }

  const sendToPlayground = (colors: string[]) => {
    const bg = colors[0]
    const tx = colors[colors.length - 1]
    navigate(`/playground?bg=${encodeURIComponent(bg)}&tx=${encodeURIComponent(tx)}`)
  }

  const loadSchemeIntoBuilder = (colors: string[]) => {
    setCustomColors(colors.slice(0, 6))
    setActiveColorIndex(0)
    setActiveTab("builder")
    toaster.create({ title: "Scheme loaded into palette builder", type: "success" })
  }

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toaster.create({ title: `${label} copied!`, type: "success" })
  }

  // Contrast checker computed values
  const ratio = contrastRatio(contrastFg, contrastBg)
  const rating = wcagRating(ratio)
  const apca = apcaScore(contrastFg, contrastBg)

  return (
    <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
      <VStack gap="6" align="stretch">
        <Box>
          <Heading size="xl" mb="2">Color Palettes</Heading>
          <Text color="fg.muted">Browse curated palettes, generate color wheel schemes, create monochromatic scales, and check contrast.</Text>
        </Box>

        {/* Curated Palettes */}
        <Box>
          <Heading size="md" mb="4">Curated Palettes</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
            {curatedPalettes.map((palette) => {
              const cr = wcagRating(contrastRatio(palette.colors[0], palette.colors[palette.colors.length - 1]))
              return (
                <Box
                  key={palette.name}
                  rounded="lg"
                  border="1px solid"
                  borderColor="border.subtle"
                  bg="bg.panel"
                  overflow="hidden"
                  transition="all 0.15s"
                  _hover={{ shadow: "md" }}
                >
                  <HStack h="60px" gap="0">
                    {palette.colors.map((color, i) => (
                      <Box
                        key={i}
                        flex="1"
                        h="100%"
                        bg={color}
                        cursor="pointer"
                        onClick={() => copyText(color, color)}
                        title={`Copy ${color}`}
                      />
                    ))}
                  </HStack>
                  <Box p="3">
                    <HStack justify="space-between">
                      <Text fontSize="sm" fontWeight="medium">{palette.name}</Text>
                      <Tag.Root colorPalette={cr.color} size="sm" variant="subtle">
                        <Tag.Label>{cr.label}</Tag.Label>
                      </Tag.Root>
                    </HStack>
                    <HStack gap="1" mt="2">
                      <Button size="2xs" variant="ghost" onClick={() => copyAsCSS(palette.colors)}>CSS</Button>
                      <Button size="2xs" variant="ghost" onClick={() => copyAsTailwind(palette.colors)}>Tailwind</Button>
                      <Button size="2xs" variant="ghost" onClick={() => sendToPlayground(palette.colors)}>
                        <LuArrowRight /> Playground
                      </Button>
                    </HStack>
                  </Box>
                </Box>
              )
            })}
          </SimpleGrid>
        </Box>

        {/* Tabbed Color Tools */}
        <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value as string)}>
          <Tabs.List>
            <Tabs.Trigger value="builder">Palette Builder</Tabs.Trigger>
            <Tabs.Trigger value="wheel">Color Wheel</Tabs.Trigger>
            <Tabs.Trigger value="generate">Generate</Tabs.Trigger>
            <Tabs.Trigger value="mono">Mono Scale</Tabs.Trigger>
            <Tabs.Trigger value="contrast">Contrast Checker</Tabs.Trigger>
          </Tabs.List>

          {/* Palette Builder Tab */}
          <Tabs.Content value="builder">
            <Box p="5" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                <VStack gap="3" align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted">Pick a Color</Text>
                  <ColorInput
                    value={activeColor}
                    onChange={(c) => updateColor(activeColorIndex, c)}
                    swatches={["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#a855f7", "#ec4899", "#1a1a1a", "#ffffff"]}
                    showSliders
                    showFormats
                  />
                  <Text fontSize="xs" color="fg.subtle" mt="2">Your Palette</Text>
                  <HStack gap="2" flexWrap="wrap">
                    {customColors.map((color, i) => (
                      <Box
                        key={i}
                        position="relative"
                        rounded="md"
                        border={activeColorIndex === i ? "2px solid" : "1px solid"}
                        borderColor={activeColorIndex === i ? "blue.500" : "border.subtle"}
                        cursor="pointer"
                        onClick={() => setActiveColorIndex(i)}
                        overflow="hidden"
                      >
                        <Box bg={color} w="48px" h="48px" />
                        <Text fontSize="2xs" textAlign="center" py="1" color="fg.muted" fontFamily="mono">
                          {color.toUpperCase()}
                        </Text>
                        {customColors.length > 2 && (
                          <IconButton
                            aria-label="Remove color"
                            size="2xs"
                            variant="ghost"
                            position="absolute"
                            top="0"
                            right="0"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeColor(i)
                            }}
                          >
                            <LuTrash2 />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    <IconButton
                      aria-label="Add color"
                      variant="outline"
                      size="sm"
                      onClick={addColor}
                      h="48px"
                      w="48px"
                    >
                      <LuPlus />
                    </IconButton>
                  </HStack>
                </VStack>

                <VStack gap="3" align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted">WCAG Contrast</Text>
                  <VStack gap="2" align="stretch">
                    {customColors.map((color, i) => {
                      if (i === 0) return null
                      const cr = contrastRatio(customColors[i - 1], color)
                      const r = wcagRating(cr)
                      return (
                        <HStack key={i} justify="space-between" p="2" rounded="md" bg="bg.subtle">
                          <HStack gap="2">
                            <Box w="5" h="5" rounded="sm" bg={customColors[i - 1]} border="1px solid" borderColor="border.subtle" />
                            <Box w="5" h="5" rounded="sm" bg={color} border="1px solid" borderColor="border.subtle" />
                          </HStack>
                          <Text fontSize="xs" fontFamily="mono" color="fg.muted">
                            {cr.toFixed(2)}:1
                          </Text>
                          <Tag.Root colorPalette={r.color} size="sm" variant="subtle">
                            <Tag.Label>{r.label}</Tag.Label>
                          </Tag.Root>
                        </HStack>
                      )
                    })}
                  </VStack>
                  <Input
                    placeholder="Palette name"
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                    size="sm"
                  />
                  <HStack gap="2" flexWrap="wrap">
                    <Button size="sm" colorPalette="blue" onClick={handleSavePalette} leftIcon={<LuSave />}>
                      Save Palette
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => copyAsCSS(customColors)}>
                      <LuCopy /> CSS
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => copyAsTailwind(customColors)}>
                      <LuCopy /> Tailwind
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => sendToPlayground(customColors)}>
                      <LuArrowRight /> Playground
                    </Button>
                  </HStack>
                </VStack>
              </Grid>
            </Box>
          </Tabs.Content>

          {/* Color Wheel Tab */}
          <Tabs.Content value="wheel">
            <Box p="5" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <Grid templateColumns={{ base: "1fr", md: "auto 1fr" }} gap="6" alignItems="start">
                <VStack gap="4" align="center">
                  <ColorWheel value={wheelSeed} onChange={setWheelSeed} size={220} />
                  <ColorInput
                    value={wheelSeed}
                    onChange={setWheelSeed}
                    swatches={["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"]}
                  />
                </VStack>
                <VStack gap="4" align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted">Scheme Mode</Text>
                  <HStack gap="2" flexWrap="wrap">
                    {schemeModes.map((m) => (
                      <Button
                        key={m.value}
                        size="xs"
                        variant={wheelMode === m.value ? "solid" : "outline"}
                        colorPalette={wheelMode === m.value ? "blue" : undefined}
                        onClick={() => setWheelMode(m.value)}
                      >
                        {m.label}
                      </Button>
                    ))}
                  </HStack>
                  <Text fontSize="xs" color="fg.subtle">
                    {schemeModes.find((m) => m.value === wheelMode)?.description}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted" mt="2">Generated Scheme</Text>
                  <HStack h="56px" rounded="lg" overflow="hidden" border="1px solid" borderColor="border.subtle">
                    {wheelColors.map((c, i) => (
                      <Box
                        key={i}
                        flex="1"
                        h="100%"
                        bg={c}
                        cursor="pointer"
                        onClick={() => copyText(c, c)}
                        title={`Copy ${c}`}
                      />
                    ))}
                  </HStack>
                  <HStack gap="2">
                    {wheelColors.map((c) => (
                      <Text key={c} fontSize="2xs" fontFamily="mono" color="fg.muted">{c}</Text>
                    ))}
                  </HStack>
                  <HStack gap="2" flexWrap="wrap">
                    <Button size="sm" variant="outline" onClick={() => loadSchemeIntoBuilder(wheelColors)}>
                      <LuArrowRight /> Send to Builder
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => sendToPlayground(wheelColors)}>
                      <LuArrowRight /> Playground
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => copyAsCSS(wheelColors)}>
                      <LuCopy /> CSS
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setWheelSeed(generateRandomSeed())}>
                      <LuShuffle /> Random
                    </Button>
                  </HStack>
                </VStack>
              </Grid>
            </Box>
          </Tabs.Content>

          {/* Generate Tab */}
          <Tabs.Content value="generate">
            <Box p="5" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap="6">
                <VStack gap="4" align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted">Seed Color</Text>
                  <ColorInput
                    value={genSeed}
                    onChange={setGenSeed}
                    swatches={["#3b82f6", "#ef4444", "#f97316", "#eab308", "#22c55e", "#a855f7", "#ec4899", "#14b8a6"]}
                    showSliders
                  />
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted" mt="2">Style</Text>
                  <HStack gap="2" flexWrap="wrap">
                    {paletteStyles.map((s) => (
                      <Button
                        key={s.value}
                        size="xs"
                        variant={genStyle === s.value ? "solid" : "outline"}
                        colorPalette={genStyle === s.value ? "blue" : undefined}
                        onClick={() => setGenStyle(s.value)}
                      >
                        {s.label}
                      </Button>
                    ))}
                  </HStack>
                  <Button size="sm" variant="ghost" onClick={() => setGenSeed(generateRandomSeed())} leftIcon={<LuShuffle />}>
                    Random Seed
                  </Button>
                </VStack>

                {genResult && (
                  <VStack gap="3" align="stretch">
                    <Text fontSize="sm" fontWeight="medium" color="fg.muted">Generated Palette</Text>
                    <VStack gap="2" align="stretch">
                      {Object.entries(genResult).map(([role, color]) => (
                        <HStack key={role} p="2" rounded="md" bg="bg.subtle" justify="space-between">
                          <HStack gap="3">
                            <Box w="10" h="10" rounded="md" bg={color} border="1px solid" borderColor="border.subtle" cursor="pointer" onClick={() => copyText(color as string, color as string)} />
                            <VStack gap="0" align="flex-start">
                              <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">{role}</Text>
                              <Text fontSize="xs" fontFamily="mono" color="fg.muted">{color}</Text>
                            </VStack>
                          </HStack>
                          <Tag.Root size="sm" colorPalette={wcagRating(contrastRatio(color as string, role === "background" ? "#000000" : genResult.background)).color} variant="subtle">
                            <Tag.Label>{wcagRating(contrastRatio(color as string, role === "background" ? "#000000" : genResult.background)).label}</Tag.Label>
                          </Tag.Root>
                        </HStack>
                      ))}
                    </VStack>
                    <HStack gap="2" flexWrap="wrap">
                      <Button size="sm" variant="outline" onClick={() => loadSchemeIntoBuilder(Object.values(genResult))}>
                        <LuArrowRight /> Send to Builder
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copyAsCSS(Object.values(genResult))}>
                        <LuCopy /> CSS
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => sendToPlayground(Object.values(genResult))}>
                        <LuArrowRight /> Playground
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Grid>
            </Box>
          </Tabs.Content>

          {/* Mono Scale Tab */}
          <Tabs.Content value="mono">
            <Box p="5" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <VStack gap="4" align="stretch">
                <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap="6">
                  <VStack gap="3" align="stretch">
                    <Text fontSize="sm" fontWeight="medium" color="fg.muted">Base Color</Text>
                    <ColorInput
                      value={monoSeed}
                      onChange={setMonoSeed}
                      swatches={["#3b82f6", "#ef4444", "#f97316", "#22c55e", "#a855f7", "#14b8a6", "#ec4899", "#64748b"]}
                      showSliders
                    />
                  </VStack>
                  <VStack gap="3" align="stretch">
                    <Text fontSize="sm" fontWeight="medium" color="fg.muted">11-Shade Scale (50-950)</Text>
                    <Box rounded="lg" overflow="hidden" border="1px solid" borderColor="border.subtle">
                      <HStack h="60px" gap="0">
                        {monoScale.map((s) => (
                          <Box
                            key={s.shade}
                            flex="1"
                            h="100%"
                            bg={s.hex}
                            cursor="pointer"
                            onClick={() => copyText(s.hex, s.hex)}
                            title={`${s.shade}: ${s.hex}`}
                          />
                        ))}
                      </HStack>
                    </Box>
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 6 }} gap="2">
                      {monoScale.map((s) => (
                        <VStack key={s.shade} gap="0" p="2" rounded="md" bg="bg.subtle" cursor="pointer" onClick={() => copyText(s.hex, s.hex)}>
                          <Box w="8" h="8" rounded="sm" bg={s.hex} border="1px solid" borderColor="border.subtle" />
                          <Text fontSize="2xs" color="fg.muted">{s.shade}</Text>
                          <Text fontSize="2xs" fontFamily="mono" color="fg.subtle">{s.hex}</Text>
                        </VStack>
                      ))}
                    </SimpleGrid>
                    <HStack gap="2" flexWrap="wrap" mt="2">
                      <Button size="sm" variant="outline" onClick={() => {
                        const css = monoScale.map((s) => `  ${s.shade}: '${s.hex}',`).join("\n")
                        copyText(`colors: {\n  brand: {\n${css}\n  }\n}`, "Tailwind scale")
                      }}>
                        <LuCopy /> Tailwind Scale
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        const css = monoScale.map((s) => `  --brand-${s.shade}: ${s.hex};`).join("\n")
                        copyText(`:root {\n${css}\n}`, "CSS variables")
                      }}>
                        <LuCopy /> CSS Variables
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => sendToPlayground([monoScale[4].hex, monoScale[0].hex])}>
                        <LuArrowRight /> Playground
                      </Button>
                    </HStack>
                  </VStack>
                </Grid>
              </VStack>
            </Box>
          </Tabs.Content>

          {/* Contrast Checker Tab */}
          <Tabs.Content value="contrast">
            <Box p="5" rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                <VStack gap="4" align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted">Foreground (Text)</Text>
                  <ColorInput
                    value={contrastFg}
                    onChange={setContrastFg}
                    swatches={["#000000", "#333333", "#666666", "#ffffff", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b"]}
                    showSliders
                  />
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted" mt="2">Background</Text>
                  <ColorInput
                    value={contrastBg}
                    onChange={setContrastBg}
                    swatches={["#ffffff", "#f8fafc", "#e2e8f0", "#0f172a", "#fef3c7", "#dbeafe", "#fce7f3", "#d1fae5"]}
                    showSliders
                  />
                  <Button size="sm" variant="ghost" onClick={() => { const tmp = contrastFg; setContrastFg(contrastBg); setContrastBg(tmp) }} leftIcon={<LuArrowLeftRight />}>
                    Swap Colors
                  </Button>
                </VStack>

                <VStack gap="4" align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted">Accessibility Scores</Text>
                  <HStack p="4" rounded="lg" bg="bg.subtle" justify="space-between">
                    <VStack gap="0" align="flex-start">
                      <Text fontSize="2xl" fontFamily="mono" fontWeight="bold">{ratio.toFixed(2)}:1</Text>
                      <Text fontSize="xs" color="fg.muted">WCAG Contrast Ratio</Text>
                    </VStack>
                    <Tag.Root colorPalette={rating.color} size="lg" variant="subtle">
                      <Tag.Label>{rating.label}</Tag.Label>
                    </Tag.Root>
                  </HStack>
                  <HStack p="4" rounded="lg" bg="bg.subtle" justify="space-between">
                    <VStack gap="0" align="flex-start">
                      <Text fontSize="2xl" fontFamily="mono" fontWeight="bold">{Math.abs(apca)}</Text>
                      <Text fontSize="xs" color="fg.muted">APCA Score (Lc)</Text>
                    </VStack>
                    <Text fontSize="xs" color={Math.abs(apca) >= 75 ? "green.500" : Math.abs(apca) >= 45 ? "yellow.500" : "red.500"} fontWeight="medium">
                      {Math.abs(apca) >= 75 ? "Excellent" : Math.abs(apca) >= 45 ? "Adequate" : "Insufficient"}
                    </Text>
                  </HStack>
                  <Box p="4" rounded="lg" style={{ backgroundColor: contrastBg, color: contrastFg }}>
                    <VStack gap="3" align="stretch">
                      <Text fontSize="32px" fontWeight="bold">Heading Text 32px</Text>
                      <Text fontSize="24px" fontWeight="semibold">Subheading Text 24px</Text>
                      <Text fontSize="16px">Body text at 16px is the most common size for paragraphs. This preview shows real-world legibility.</Text>
                      <Text fontSize="12px" color={contrastFg}>Small text at 12px is the hardest to read. Make sure your contrast passes here.</Text>
                    </VStack>
                  </Box>
                  <HStack gap="2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/playground?bg=${encodeURIComponent(contrastBg)}&tx=${encodeURIComponent(contrastFg)}`)}>
                      <LuArrowRight /> Send to Playground
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => copyText(`${ratio.toFixed(2)}:1 (${rating.label})`, "Contrast result")}>
                      <LuCopy /> Copy Result
                    </Button>
                  </HStack>
                </VStack>
              </Grid>
            </Box>
          </Tabs.Content>
        </Tabs.Root>

        {/* Saved Palettes */}
        {user && (
          <Box>
            <Heading size="md" mb="4">Your Saved Palettes</Heading>
            {savedPalettes.length === 0 ? (
              <Text color="fg.muted" fontSize="sm">No saved palettes yet. Create one above!</Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
                {savedPalettes.map((palette) => {
                  const cr = wcagRating(contrastRatio(palette.colors[0], palette.colors[palette.colors.length - 1]))
                  return (
                    <Box key={palette.id} rounded="lg" border="1px solid" borderColor="border.subtle" bg="bg.panel" overflow="hidden">
                      <HStack h="50px" gap="0">
                        {palette.colors.map((color, i) => (
                          <Box key={i} flex="1" h="100%" bg={color} />
                        ))}
                      </HStack>
                      <Box p="3">
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium">{palette.name}</Text>
                          <HStack gap="1">
                            <Tag.Root colorPalette={cr.color} size="sm" variant="subtle">
                              <Tag.Label>{cr.label}</Tag.Label>
                            </Tag.Root>
                            <IconButton aria-label="Delete" size="2xs" variant="ghost" colorPalette="red" onClick={() => handleDeletePalette(palette.id)}>
                              <LuTrash2 />
                            </IconButton>
                          </HStack>
                        </HStack>
                      </Box>
                    </Box>
                  )
                })}
              </SimpleGrid>
            )}
          </Box>
        )}
      </VStack>
    </Container>
  )
}
