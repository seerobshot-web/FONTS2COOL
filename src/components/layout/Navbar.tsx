import { Box, Container, Flex, Heading, HStack, IconButton, Link as ChakraLink, Menu, Portal, Text, useBreakpointValue } from "@chakra-ui/react"
import { ColorModeButton } from "@/components/ui/color-mode"
import { useAuth } from "@/context/AuthContext"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LuMenu, LuHeart, LuLogOut, LuUser } from "react-icons/lu"
import { toaster } from "@/components/ui/toaster"

const navLinks = [
  { label: "Explore", to: "/" },
  { label: "Playground", to: "/playground" },
  { label: "Colors", to: "/colors" },
  { label: "Brand Theme", to: "/brand-theme" },
  { label: "My Pairings", to: "/my-pairings" },
]

export function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const handleSignOut = async () => {
    await signOut()
    toaster.create({ title: "Signed out successfully", type: "info" })
    navigate("/")
  }

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="bg"
      borderBottom="1px solid"
      borderColor="border.subtle"
      backdropFilter="blur(8px)"
    >
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <Flex h="16" align="center" justify="space-between" gap="4">
          <Link to="/">
            <Heading size="md" color="fg" letterSpacing="tight" fontFamily="heading" fontWeight="700">
              Font2<Text as="span" color="brand.500">Color</Text>
            </Heading>
          </Link>

          {!isMobile && (
            <HStack gap="1">
              {navLinks.map((link) => {
                const isActive = link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to)
                return (
                  <ChakraLink
                    key={link.to}
                    as={Link}
                    to={link.to}
                    px="3"
                    py="2"
                    rounded="md"
                    fontSize="sm"
                    fontWeight="medium"
                    color={isActive ? "fg" : "fg.muted"}
                    bg={isActive ? "bg.muted" : "transparent"}
                    _hover={{ bg: "bg.muted", color: "fg" }}
                    transition="all 0.15s"
                  >
                    {link.label}
                  </ChakraLink>
                )
              })}
            </HStack>
          )}

          <HStack gap="2">
            <ColorModeButton />

            {isMobile ? (
              <Menu.Root>
                <Menu.Trigger asChild>
                  <IconButton aria-label="Menu" variant="ghost" size="sm">
                    <LuMenu />
                  </IconButton>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {navLinks.map((link) => (
                        <Menu.Item key={link.to} value={link.to} as={Link} to={link.to}>
                          {link.label}
                        </Menu.Item>
                      ))}
                      <Menu.Separator />
                      {user ? (
                        <>
                          <Menu.Item value="signout" onClick={handleSignOut}>
                            <LuLogOut /> Sign Out
                          </Menu.Item>
                        </>
                      ) : (
                        <>
                          <Menu.Item value="login" as={Link} to="/login">
                            <LuUser /> Sign In
                          </Menu.Item>
                          <Menu.Item value="signup" as={Link} to="/signup">
                            Sign Up
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ) : user ? (
              <Menu.Root>
                <Menu.Trigger asChild>
                  <IconButton aria-label="Account" variant="ghost" size="sm" colorPalette="brand">
                    <LuUser />
                  </IconButton>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="saved" as={Link} to="/my-pairings">
                        <LuHeart /> My Pairings
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item value="signout" onClick={handleSignOut}>
                        <LuLogOut /> Sign Out
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ) : (
              <HStack gap="2">
                <ChakraLink
                  as={Link}
                  to="/login"
                  fontSize="sm"
                  fontWeight="medium"
                  color="fg.muted"
                  _hover={{ color: "fg" }}
                >
                  Sign In
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/signup"
                  fontSize="sm"
                  fontWeight="semibold"
                  color="brand.500"
                  _hover={{ color: "brand.600" }}
                >
                  Sign Up
                </ChakraLink>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export function Footer() {
  return (
    <Box as="footer" borderTop="1px solid" borderColor="border.subtle" mt="16">
      <Container maxW="7xl" px={{ base: 4, md: 6 }} py="8">
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} gap="4">
          <Text fontSize="sm" color="fg.muted">
            Font2Color &mdash; Discover and test free font pairings using Google Fonts.
          </Text>
          <HStack gap="4" fontSize="sm" color="fg.muted">
            <ChakraLink as={Link} to="/" _hover={{ color: "fg" }}>Explore</ChakraLink>
            <ChakraLink as={Link} to="/playground" _hover={{ color: "fg" }}>Playground</ChakraLink>
            <ChakraLink as={Link} to="/colors" _hover={{ color: "fg" }}>Colors</ChakraLink>
            <ChakraLink as={Link} to="/brand-theme" _hover={{ color: "fg" }}>Brand Theme</ChakraLink>
          </HStack>
        </Flex>
        <Text fontSize="xs" color="fg.subtle" mt="4">
          Built with Google Fonts. Browse 1000+ curated combinations. Preview with your content and save favorites.
        </Text>
      </Container>
    </Box>
  )
}
