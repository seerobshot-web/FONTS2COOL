import { useEffect, useMemo, useState } from "react"
import {
  Box,
  Container,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
  Tag,
  Button,
  IconButton,
  Skeleton,
  SimpleGrid,
} from "@chakra-ui/react"
import { LuSearch, LuShuffle, LuX } from "react-icons/lu"
import { supabase } from "@/lib/supabase"
import type { Font } from "@/lib/types"
import { PairingCard } from "@/components/shared/PairingCard"
import { EmptyState } from "@/components/ui/empty-state"
import { curatedPairings } from "@/lib/curated-pairings"
import { loadGoogleFont, loadFontsForPreview, categoryLabel } from "@/lib/font-utils"
import { useAuth } from "@/context/AuthContext"
import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"

const categories = ["All", "Serif", "Sans-Serif", "Display", "Handwriting", "Monospace"]

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  let state = seed >>> 0 || 1
  const nextRandom = () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return ((state >>> 0) / 0xffffffff)
  }
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const categoryMap: Record<string, string> = {
  "Serif": "serif",
  "Sans-Serif": "sans-serif",
  "Display": "display",
  "Handwriting": "handwriting",
  "Monospace": "monospace",
}

export function ExplorePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [fonts, setFonts] = useState<Font[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [shuffleKey, setShuffleKey] = useState(0)
  const [savedPairingKeys, setSavedPairingKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchFonts() {
      const { data, error } = await supabase.from("fonts").select("*").order("family")
      if (error) {
        toaster.create({ title: "Failed to load fonts", type: "error" })
        setLoading(false)
        return
      }
      setFonts(data || [])
      loadFontsForPreview(data || [])
      setLoading(false)
    }
    fetchFonts()
  }, [])

  useEffect(() => {
    if (!user) return
    async function fetchSavedPairings() {
      const { data } = await supabase
        .from("pairings")
        .select("primary_font_id, secondary_font_id")
        .eq("user_id", user.id)
      if (data) {
        const keys = new Set(data.map((p) => `${p.primary_font_id}-${p.secondary_font_id}`))
        setSavedPairingKeys(keys)
      }
    }
    fetchSavedPairings()
  }, [user])

  const familyMap = useMemo(() => {
    const map: Record<string, Font> = {}
    fonts.forEach((f) => { map[f.family] = f })
    return map
  }, [fonts])

  const filteredCurated = useMemo(() => {
    let result = curatedPairings.map((cp, idx) => ({ ...cp, _idx: idx }))

    if (activeCategory !== "All") {
      const cat = categoryMap[activeCategory]
      result = result.filter((cp) => {
        const pf = familyMap[cp.primaryFamily]
        const sf = familyMap[cp.secondaryFamily]
        return (pf?.category === cat || sf?.category === cat)
      })
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((cp) =>
        cp.primaryFamily.toLowerCase().includes(q) ||
        cp.secondaryFamily.toLowerCase().includes(q) ||
        cp.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    return result
  }, [search, activeCategory, familyMap])

  const shuffledCurated = useMemo(() => {
    if (shuffleKey === 0) return filteredCurated
    return shuffleWithSeed(filteredCurated, shuffleKey)
  }, [filteredCurated, shuffleKey])

  const handleSave = async (primaryFamily: string, secondaryFamily: string) => {
    if (!user) {
      toaster.create({ title: "Please sign in to save pairings", type: "info" })
      navigate("/login")
      return
    }
    const pf = familyMap[primaryFamily]
    const sf = familyMap[secondaryFamily]
    if (!pf || !sf) return

    const key = `${pf.id}-${sf.id}`
    if (savedPairingKeys.has(key)) {
      const { error } = await supabase
        .from("pairings")
        .delete()
        .eq("user_id", user.id)
        .eq("primary_font_id", pf.id)
        .eq("secondary_font_id", sf.id)
      if (error) {
        toaster.create({ title: "Failed to unsave pairing", type: "error" })
        return
      }
      setSavedPairingKeys((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
      toaster.create({ title: "Pairing removed", type: "info" })
    } else {
      const { error } = await supabase
        .from("pairings")
        .insert({
          primary_font_id: pf.id,
          secondary_font_id: sf.id,
        })
      if (error) {
        if (error.code === "23505") {
          toaster.create({ title: "This pairing is already saved", type: "info" })
        } else {
          toaster.create({ title: "Failed to save pairing", type: "error" })
        }
        return
      }
      setSavedPairingKeys((prev) => new Set(prev).add(key))
      toaster.create({ title: "Pairing saved!", type: "success" })
    }
  }

  return (
    <Box>
      {/* Hero */}
      <Box
        bg="bg.subtle"
        borderBottom="1px solid"
        borderColor="border.subtle"
        pt="16"
        pb="12"
      >
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <VStack gap="4" textAlign="center" align="center">
            <Tag.Root colorPalette="brand" variant="subtle" size="md">
              <Tag.Label>1000+ curated combinations</Tag.Label>
            </Tag.Root>
            <Heading
              size="3xl"
              fontFamily="heading"
              fontWeight="700"
              maxW="3xl"
              lineHeight="1.1"
            >
              Discover and test free font pairings
            </Heading>
            <Text fontSize="lg" color="fg.muted" maxW="2xl">
              Browse curated Google Fonts combinations. Preview with your own content, adjust colors and spacing, and save your favorites.
            </Text>
            <HStack gap="3" mt="2">
              <Button colorPalette="brand" size="lg" onClick={() => navigate("/playground")}>
                Open Playground
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/colors")}>
                Browse Colors
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Search & Filters */}
      <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
        <VStack gap="4" align="stretch">
          <HStack gap="3" flexWrap={{ base: "wrap", md: "nowrap" }}>
            <Box position="relative" flex="1" minW="200px">
              <Input
                placeholder="Search by font name, category, or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="lg"
                pl="10"
                bg="bg.panel"
              />
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.muted">
                <LuSearch />
              </Box>
              {search && (
                <IconButton
                  aria-label="Clear search"
                  size="xs"
                  variant="ghost"
                  position="absolute"
                  right="2"
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={() => setSearch("")}
                >
                  <LuX />
                </IconButton>
              )}
            </Box>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<LuShuffle />}
              onClick={() => setShuffleKey((k) => k + 1)}
            >
              Shuffle
            </Button>
          </HStack>

          <HStack gap="2" flexWrap="wrap">
            {categories.map((cat) => (
              <Tag.Root
                key={cat}
                colorPalette={activeCategory === cat ? "brand" : "gray"}
                variant={activeCategory === cat ? "solid" : "subtle"}
                size="md"
                cursor="pointer"
                onClick={() => setActiveCategory(cat)}
              >
                <Tag.Label>{cat}</Tag.Label>
              </Tag.Root>
            ))}
          </HStack>
        </VStack>

        {/* Results */}
        <Box mt="8">
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height="300px" rounded="xl" />
              ))}
            </SimpleGrid>
          ) : shuffledCurated.length === 0 ? (
            <EmptyState
              title="No pairings found"
              description="Try a different search term or category filter."
              icon={<LuSearch />}
            />
          ) : (
            <>
              <Text fontSize="sm" color="fg.muted" mb="4">
                {shuffledCurated.length} {shuffledCurated.length === 1 ? "pairing" : "pairings"} found
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="5">
                {shuffledCurated.map((cp) => {
                  const pf = familyMap[cp.primaryFamily]
                  const sf = familyMap[cp.secondaryFamily]
                  if (!pf || !sf) return null
                  const key = `${pf.id}-${sf.id}`
                  return (
                    <PairingCard
                      key={`${cp.primaryFamily}-${cp.secondaryFamily}-${cp._idx}`}
                      primaryFont={pf}
                      secondaryFont={sf}
                      headingWeight={cp.headingWeight}
                      bodyWeight={cp.bodyWeight}
                      headingText={cp.headingText}
                      bodyText={cp.bodyText}
                      tags={cp.tags}
                      onSave={() => handleSave(cp.primaryFamily, cp.secondaryFamily)}
                      onUnsave={() => handleSave(cp.primaryFamily, cp.secondaryFamily)}
                      isSaved={savedPairingKeys.has(key)}
                    />
                  )
                })}
              </SimpleGrid>
            </>
          )}
        </Box>

        {/* Browse All Fonts */}
        <Box mt="12">
          <Heading size="lg" mb="4">
            Browse All Fonts
          </Heading>
          {loading ? (
            <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} gap="3">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} height="80px" rounded="lg" />
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} gap="3">
              {fonts
                .filter((f) => {
                  if (activeCategory !== "All") return f.category === categoryMap[activeCategory]
                  return true
                })
                .filter((f) => {
                  if (!search.trim()) return true
                  const q = search.toLowerCase()
                  return f.family.toLowerCase().includes(q) || f.category.includes(q)
                })
                .slice(0, 24)
                .map((font) => (
                  <Box
                    key={font.id}
                    p="3"
                    rounded="lg"
                    border="1px solid"
                    borderColor="border.subtle"
                    bg="bg.panel"
                    cursor="pointer"
                    transition="all 0.15s"
                    _hover={{ borderColor: "border.emphasized", shadow: "sm" }}
                    onClick={() => navigate(`/playground?primary=${font.id}`)}
                  >
                    {loadGoogleFont(font.family, font.weights)}
                    <Text
                      fontFamily={`"${font.family}", sans-serif`}
                      fontSize="xl"
                      fontWeight="500"
                      color="fg"
                      truncate
                    >
                      {font.family}
                    </Text>
                    <Text fontSize="xs" color="fg.muted" mt="1">
                      {categoryLabel(font.category)}
                    </Text>
                  </Box>
                ))}
            </SimpleGrid>
          )}
        </Box>
      </Container>
    </Box>
  )
}
