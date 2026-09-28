import { useEffect, useState } from "react"
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Tag,
} from "@chakra-ui/react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import type { Font, Pairing } from "@/lib/types"
import { loadGoogleFont, fontFamilyCss, buildGoogleFontsLink } from "@/lib/font-utils"
import { contrastRatio, wcagRating } from "@/lib/color-utils"
import { EmptyState } from "@/components/ui/empty-state"
import { LuLink, LuHeart } from "react-icons/lu"
import { useAuth } from "@/context/AuthContext"
import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"

interface SharedPairing extends Pairing {
  primary_font: Font
  secondary_font: Font
}

export function ShareViewPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pairing, setPairing] = useState<SharedPairing | null>(null)
  const [loading, setLoading] = useState(true)
  const [alreadySaved, setAlreadySaved] = useState(false)

  useEffect(() => {
    if (!id) return
    async function fetchPairing() {
      const { data, error } = await supabase
        .from("pairings")
        .select(`
          *,
          primary_font:primary_font_id(*),
          secondary_font:secondary_font_id(*)
        `)
        .eq("share_id", id)
        .maybeSingle()

      if (error || !data) {
        setLoading(false)
        return
      }
      const p = data as SharedPairing
      setPairing(p)
      loadGoogleFont(p.primary_font.family, p.primary_font.weights)
      loadGoogleFont(p.secondary_font.family, p.secondary_font.weights)
      setLoading(false)

      if (user) {
        const { data: existing } = await supabase
          .from("pairings")
          .select("id")
          .eq("user_id", user.id)
          .eq("primary_font_id", p.primary_font_id)
          .eq("secondary_font_id", p.secondary_font_id)
          .maybeSingle()
        setAlreadySaved(!!existing)
      }
    }
    fetchPairing()
  }, [id, user])

  const handleSave = async () => {
    if (!user) {
      toaster.create({ title: "Sign in to save this pairing", type: "info" })
      navigate("/login")
      return
    }
    if (!pairing) return
    const { error } = await supabase
      .from("pairings")
      .insert({
        primary_font_id: pairing.primary_font_id,
        secondary_font_id: pairing.secondary_font_id,
        heading_size: pairing.heading_size,
        body_size: pairing.body_size,
        bg_color: pairing.bg_color,
        text_color: pairing.text_color,
      })
    if (error) {
      if (error.code === "23505") {
        toaster.create({ title: "Already in your collection", type: "info" })
      } else {
        toaster.create({ title: "Failed to save", type: "error" })
      }
      return
    }
    setAlreadySaved(true)
    toaster.create({ title: "Saved to your collection!", type: "success" })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toaster.create({ title: "Link copied!", type: "success" })
  }

  if (loading) {
    return (
      <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
        <Text color="fg.muted">Loading shared pairing...</Text>
      </Container>
    )
  }

  if (!pairing) {
    return (
      <Container maxW="7xl" px={{ base: 4, md: 6 }} py="16">
        <EmptyState
          title="Pairing not found"
          description="This share link may be invalid or the pairing was removed."
          icon={<LuLink />}
        >
          <Button as={Link} to="/" colorPalette="brand" mt="4">
            Back to Explore
          </Button>
        </EmptyState>
      </Container>
    )
  }

  const rating = wcagRating(contrastRatio(pairing.bg_color, pairing.text_color))
  const googleLink = buildGoogleFontsLink(
    [pairing.primary_font.family, pairing.secondary_font.family],
    { [pairing.primary_font.family]: pairing.primary_font.weights, [pairing.secondary_font.family]: pairing.secondary_font.weights },
  )

  return (
    <Container maxW="5xl" px={{ base: 4, md: 6 }} py="8">
      <VStack gap="6" align="stretch">
        <HStack justify="space-between" flexWrap="wrap" gap="3">
          <VStack align="flex-start" gap="1">
            <Heading size="xl">Shared Pairing</Heading>
            <Text fontSize="sm" color="fg.muted">
              {pairing.primary_font.family} + {pairing.secondary_font.family}
            </Text>
          </VStack>
          <HStack gap="2">
            <Button size="sm" variant="outline" onClick={copyLink} leftIcon={<LuLink />}>
              Copy Link
            </Button>
            {!alreadySaved ? (
              <Button size="sm" colorPalette="brand" onClick={handleSave} leftIcon={<LuHeart />}>
                Save to Collection
              </Button>
            ) : (
              <Tag.Root colorPalette="green" variant="subtle" size="md">
                <Tag.Label>Saved</Tag.Label>
              </Tag.Root>
            )}
          </HStack>
        </HStack>

        {/* Preview */}
        <Box
          rounded="xl"
          border="1px solid"
          borderColor="border.subtle"
          overflow="hidden"
          p={{ base: "6", md: "12" }}
          minH="400px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap="4"
          style={{
            backgroundColor: pairing.bg_color,
            color: pairing.text_color,
          }}
        >
          <Text
            fontFamily={fontFamilyCss(pairing.primary_font.family)}
            fontWeight={700}
            fontSize={`${pairing.heading_size}px`}
            lineHeight="1.15"
            letterSpacing="-0.02em"
          >
            {pairing.sample_text || "Beautiful Typography Matters"}
          </Text>
          <Text
            fontFamily={fontFamilyCss(pairing.secondary_font.family)}
            fontWeight={400}
            fontSize={`${pairing.body_size}px`}
            lineHeight="1.6"
          >
            The quick brown fox jumps over the lazy dog. Great design starts with great typography.
          </Text>
        </Box>

        {/* Metadata */}
        <HStack gap="4" flexWrap="wrap" justify="space-between">
          <HStack gap="3" flexWrap="wrap">
            <Tag.Root colorPalette="brand" variant="subtle" size="md">
              <Tag.Label>{pairing.primary_font.family}</Tag.Label>
            </Tag.Root>
            <Tag.Root colorPalette="purple" variant="subtle" size="md">
              <Tag.Label>{pairing.secondary_font.family}</Tag.Label>
            </Tag.Root>
            <Tag.Root colorPalette={rating.color} variant="subtle" size="md">
              <Tag.Label>Contrast: {rating.label}</Tag.Label>
            </Tag.Root>
          </HStack>
          <Button as="a" href={googleLink} target="_blank" size="xs" variant="ghost">
            Google Fonts Link
          </Button>
        </HStack>

        <Button as={Link} to={`/playground?primary=${pairing.primary_font_id}&secondary=${pairing.secondary_font_id}&bg=${encodeURIComponent(pairing.bg_color)}&tx=${encodeURIComponent(pairing.text_color)}`} variant="outline" size="md" alignSelf="center">
          Open in Playground
        </Button>
      </VStack>
    </Container>
  )
}
