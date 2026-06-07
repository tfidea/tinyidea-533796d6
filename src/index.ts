import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// API endpoint for calculations
app.post('/api/calculate', async (c) => {
  const { expression } = await c.req.json()
  
  try {
    // Safely evaluate the expression
    // Only allow numbers, operators, parentheses, and decimal points
    const sanitized = expression.replace(/[^0-9+\-*/.()]/g, '')
    
    if (!sanitized) {
      return c.json({ error: 'Invalid expression' }, 400)
    }
    
    // Use Function constructor for safe evaluation
    const result = new Function(`return (${sanitized})`)()
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return c.json({ error: 'Invalid calculation' }, 400)
    }
    
    return c.json({ result })
  } catch (e) {
    return c.json({ error: 'Calculation error' }, 400)
  }
})

// Serve static files from the frontend build
app.get('/*', serveStatic({ root: './frontend/dist' }))

export default app