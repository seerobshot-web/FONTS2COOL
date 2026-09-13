const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

const toolEndpoint = "https://api.elysiatools.com/v1/tools/webfont-pairing-lab"

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405)
    }

    const input = await req.json()
    if (!input || typeof input !== "object") {
      return jsonResponse({ error: "Invalid pairing request" }, 400)
    }

    const response = await fetch(toolEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })

    const rawBody = await response.text()
    let payload: unknown = null
    try {
      payload = JSON.parse(rawBody)
    } catch {
      payload = { message: rawBody.slice(0, 500) }
    }

    if (!response.ok) {
      return jsonResponse({ error: "Pairing Lab request failed", details: payload }, response.status)
    }

    return jsonResponse({ result: payload })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pairing Lab request failed"
    return jsonResponse({ error: message }, 500)
  }
})
