import { Nav } from "./components/Nav"
import { Hero } from "./components/Hero"
import { Features } from "./components/Features"
import { ColorShowcase } from "./components/ColorShowcase"
import { Pricing } from "./components/Pricing"
import { Footer } from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Features />
        <ColorShowcase />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}

export default App
