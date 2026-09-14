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
import { Link, useNavigate } from "react-router-dom"

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const { error: signUpError } = await signUp(email, password)
    setLoading(false)

    if (signUpError) {
      setError(signUpError)
      return
    }

    toaster.create({ title: "Account created! Welcome to Font2Color.", type: "success" })
    navigate("/")
  }

  return (
    <Container maxW="md" px={{ base: 4, md: 6 }} py="16">
      <VStack gap="6" align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb="2" fontFamily="heading">Create Account</Heading>
          <Text color="fg.muted">Join Font2Color to save and share your favorite font pairings.</Text>
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
                placeholder="At least 6 characters"
                required
                size="lg"
                autoComplete="new-password"
              />
            </Field>

            <Field label="Confirm Password">
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                size="lg"
                autoComplete="new-password"
              />
            </Field>

            {error && (
              <Box p="3" rounded="md" bg="red.50" _dark={{ bg: "red.950" }} borderWidth="1px" borderColor="red.200" _dark={{ borderColor: "red.800" }}>
                <Text fontSize="sm" color="red.700" _dark={{ color: "red.300" }}>{error}</Text>
              </Box>
            )}

            <Button type="submit" colorPalette="brand" size="lg" loading={loading}>
              Create Account
            </Button>
          </VStack>
        </Box>

        <HStack justify="center">
          <Text fontSize="sm" color="fg.muted">Already have an account?</Text>
          <Text fontSize="sm" color="brand.500" as={Link} to="/login" _hover={{ color: "brand.600" }} fontWeight="medium">
            Sign In
          </Text>
        </HStack>
      </VStack>
    </Container>
  )
}
