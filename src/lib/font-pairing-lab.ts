import { supabase } from "@/lib/supabase"

export interface FontPairingLabRequest {
  headingFont: string
  headingWeight: number
  bodyFont: string
  bodyWeight: number
  bodySize: number
  lineHeight: number
  headingSample: string
  bodySample: string
}

export async function runFontPairingLab(input: FontPairingLabRequest): Promise<unknown> {
  const { data, error } = await supabase.functions.invoke("font-pairing-lab", {
    body: {
      ...input,
      headingSample: input.headingSample.slice(0, 240),
      bodySample: input.bodySample.slice(0, 800),
    },
  })

  if (error) throw new Error(error.message || "Pairing Lab request failed")
  if (!data || typeof data !== "object" || !("result" in data)) {
    throw new Error("Pairing Lab returned an unreadable response")
  }

  return data.result
}
