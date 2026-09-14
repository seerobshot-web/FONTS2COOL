import { useState, type FormEvent } from "react"
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react"
import { Input } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { Field } from "@/components/ui/field"
import { useAuth } from "@/context/AuthContext"
import { toaster } from "@/components/ui/toaster"
import { Link, useNavigate, useLocation } from "react-router-dom"
import type { LocationState } from "./types"

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await signIn(email, password)
    setLoading(false)

    if (signInError) {
      setError(signInError)
      return
    }

    toaster.create({ title: "Welcome back!", type: "success" })
    const from = (location.state as LocationState)?.from?.pathname || "/"
    navigate(from)
  }

  return (
    <Container maxW="md" px={{ base: 4, md: 6 }} py="16">
      <VStack gap="6" align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb="2" fontFamily="heading">Welcome Back</Heading>
          <Text color="fg.muted">Sign in to save and manage your font pairings.</Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap="4" align="stretch">
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                size="lg"
                autoComplete="email"
              />
            </Field>

            <Field label="Password">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                size="lg"
                autoComplete="current-password"
              />
            </Field>

            {error && (
              <Box p="3" rounded="md" bg="red.50" _dark={{ bg: "red.950" }} borderWidth="1px" borderColor="red.200" _dark={{ borderColor: "red.800" }}>
                <Text fontSize="sm" color="red.700" _dark={{ color: "red.300" }}>{error}</Text>
              </Box>
            )}

            <Button type="submit" colorPalette="brand" size="lg" loading={loading}>
              Sign In
            </Button>
          </VStack>
        </Box>

        <HStack justify="center">
          <Text fontSize="sm" color="fg.muted">Don't have an account?</Text>
          <Text fontSize="sm" color="brand.500" as={Link} to="/signup" _hover={{ color: "brand.600" }} fontWeight="medium">
            Sign Up
          </Text>
        </HStack>
      </VStack>
    </Container>
  )
}
