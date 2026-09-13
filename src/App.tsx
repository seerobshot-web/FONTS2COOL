import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Box } from "@chakra-ui/react"
import { AuthProvider } from "@/context/AuthContext"
import { Navbar, Footer } from "@/components/layout/Navbar"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { ExplorePage } from "@/pages/ExplorePage"
import { PlaygroundPage } from "@/pages/PlaygroundPage"
import { ColorsPage } from "@/pages/ColorsPage"
import { BrandThemePage } from "@/pages/BrandThemePage"
import { MyPairingsPage } from "@/pages/MyPairingsPage"
import { ShareViewPage } from "@/pages/ShareViewPage"
import { LoginPage } from "@/pages/LoginPage"
import { SignupPage } from "@/pages/SignupPage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box minH="100vh" display="flex" flexDirection="column" bg="bg">
          <Navbar />
          <Box flex="1">
            <Routes>
              <Route path="/" element={<ExplorePage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/colors" element={<ColorsPage />} />
              <Route path="/brand-theme" element={<BrandThemePage />} />
              <Route path="/share/:id" element={<ShareViewPage />} />
              <Route
                path="/my-pairings"
                element={
                  <ProtectedRoute>
                    <MyPairingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
