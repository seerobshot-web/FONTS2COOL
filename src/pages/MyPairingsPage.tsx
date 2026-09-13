import { useEffect, useState } from "react"
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react"
import { supabase } from "@/lib/supabase"
import type { Font, Pairing } from "@/lib/types"
import { PairingCard } from "@/components/shared/PairingCard"
import { EmptyState } from "@/components/ui/empty-state"
import { useAuth } from "@/context/AuthContext"
import { toaster } from "@/components/ui/toaster"
import { LuHeart } from "react-icons/lu"
import { Link } from "react-router-dom"
import { Button } from "@chakra-ui/react"

interface PairingWithFonts extends Pairing {
  primary_font: Font
  secondary_font: Font
}

export function MyPairingsPage() {
  const { user } = useAuth()
  const [pairings, setPairings] = useState<PairingWithFonts[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function fetchPairings() {
      const { data, error } = await supabase
        .from("pairings")
        .select(`
          *,
          primary_font:primary_font_id(*),
          secondary_font:secondary_font_id(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        toaster.create({ title: "Failed to load pairings", type: "error" })
        setLoading(false)
        return
      }
      setPairings((data || []) as PairingWithFonts[])
      setLoading(false)
    }
    fetchPairings()
  }, [user])

  const handleUnsave = async (pairingId: string) => {
    const { error } = await supabase.from("pairings").delete().eq("id", pairingId)
    if (error) {
      toaster.create({ title: "Failed to remove pairing", type: "error" })
      return
    }
    setPairings(pairings.filter((p) => p.id !== pairingId))
    toaster.create({ title: "Pairing removed", type: "info" })
  }

  if (loading) {
    return (
      <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
        <Text color="fg.muted">Loading your pairings...</Text>
      </Container>
    )
  }

  return (
    <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
      <VStack gap="6" align="stretch">
        <Box>
          <Heading size="xl" mb="2">My Pairings</Heading>
          <Text color="fg.muted">Your saved font combinations. Click to open in the playground.</Text>
        </Box>

        {pairings.length === 0 ? (
          <EmptyState
            title="No saved pairings yet"
            description="Browse the Explore page to find font pairings you love, then save them here for later."
            icon={<LuHeart />}
          >
            <Button as={Link} to="/" colorPalette="blue" mt="4">
              Explore Pairings
            </Button>
          </EmptyState>
        ) : (
          <>
            <Text fontSize="sm" color="fg.muted">
              {pairings.length} saved {pairings.length === 1 ? "pairing" : "pairings"}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="5">
              {pairings.map((pairing) => (
                <PairingCard
                  key={pairing.id}
                  primaryFont={pairing.primary_font}
                  secondaryFont={pairing.secondary_font}
                  headingSize={pairing.heading_size}
                  bodySize={pairing.body_size}
                  bgColor={pairing.bg_color}
                  textColor={pairing.text_color}
                  headingText={pairing.sample_text || "Beautiful Typography"}
                  bodyText="The quick brown fox jumps over the lazy dog. A great font pairing makes all the difference."
                  onUnsave={() => handleUnsave(pairing.id)}
                />
              ))}
            </SimpleGrid>
          </>
        )}
      </VStack>
    </Container>
  )
}
