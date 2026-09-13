export interface CuratedPairing {
  primaryFamily: string
  secondaryFamily: string
  headingWeight: number
  bodyWeight: number
  headingText: string
  bodyText: string
  tags: string[]
}

export const curatedPairings: CuratedPairing[] = [
  { primaryFamily: "Playfair Display", secondaryFamily: "Source Sans 3", headingWeight: 700, bodyWeight: 400, headingText: "Elegant Editorial", bodyText: "A classic pairing of a high-contrast serif heading with a clean, readable sans-serif body. Perfect for magazines, blogs, and content-heavy sites.", tags: ["Serif + Sans", "Editorial"] },
  { primaryFamily: "Montserrat", secondaryFamily: "Lora", headingWeight: 600, bodyWeight: 400, headingText: "Modern Professional", bodyText: "Geometric sans-serif headlines paired with a readable serif body. Great for corporate sites, portfolios, and agency websites.", tags: ["Sans + Serif", "Corporate"] },
  { primaryFamily: "Oswald", secondaryFamily: "Open Sans", headingWeight: 500, bodyWeight: 400, headingText: "Bold Headlines", bodyText: "Condensed display font for impactful headings paired with a friendly, neutral body text. Ideal for news sites and landing pages.", tags: ["Display + Sans", "News"] },
  { primaryFamily: "Poppins", secondaryFamily: "Inter", headingWeight: 600, bodyWeight: 400, headingText: "Geometric Clean", bodyText: "Two sans-serifs working in harmony. Poppins adds geometric personality to headings while Inter keeps body text crisp and legible.", tags: ["Sans + Sans", "Tech"] },
  { primaryFamily: "Cormorant Garamond", secondaryFamily: "Proza Libre", headingWeight: 500, bodyWeight: 400, headingText: "Refined Luxury", bodyText: "An elegant Garamond-style serif paired with a humanist sans. Beautiful for fashion, beauty, and luxury brand sites.", tags: ["Serif + Sans", "Luxury"] },
  { primaryFamily: "Bebas Neue", secondaryFamily: "Roboto", headingWeight: 400, bodyWeight: 400, headingText: "STAND OUT", bodyText: "Bebas Neue brings tall, condensed caps for maximum impact. Paired with Roboto for clean, universal body text.", tags: ["Display + Sans", "Impact"] },
  { primaryFamily: "Merriweather", secondaryFamily: "Open Sans", headingWeight: 700, bodyWeight: 400, headingText: "Readability First", bodyText: "Merriweather was designed for on-screen readability. Paired with Open Sans, this combo is perfect for long-form articles.", tags: ["Serif + Sans", "Blog"] },
  { primaryFamily: "Abril Fatface", secondaryFamily: "Karla", headingWeight: 400, bodyWeight: 400, headingText: "Vintage Charm", bodyText: "Abril Fatface adds a retro display feel, while Karla keeps things grounded with a clean grotesque body. Great for creative portfolios.", tags: ["Display + Sans", "Retro"] },
  { primaryFamily: "Archivo Black", secondaryFamily: "Source Sans 3", headingWeight: 400, bodyWeight: 400, headingText: "Strong Statement", bodyText: "Heavy black sans for commanding headlines paired with a neutral body. Ideal for startups and product launches.", tags: ["Display + Sans", "Startup"] },
  { primaryFamily: "Lora", secondaryFamily: "Roboto", headingWeight: 600, bodyWeight: 400, headingText: "Warm & Welcoming", bodyText: "Lora's brushed serif curves bring warmth to headings. Roboto provides a neutral, reliable body text for any project.", tags: ["Serif + Sans", "Friendly"] },
  { primaryFamily: "Anton", secondaryFamily: "PT Sans", headingWeight: 400, bodyWeight: 400, headingText: "POWERFUL", bodyText: "Anton's single heavy weight creates undeniable impact. Balanced by PT Sans for comfortable reading at any size.", tags: ["Display + Sans", "Bold"] },
  { primaryFamily: "Caveat", secondaryFamily: "Lato", headingWeight: 600, bodyWeight: 400, headingText: "Personal Touch", bodyText: "A handwriting font adds personality to headings. Lato provides a clean, professional counterpoint for body text.", tags: ["Handwriting + Sans", "Creative"] },
]
