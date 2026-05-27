import { useEffect, useState } from 'react'
import './App.css'

type HealthResponse = {
  status: string
  service: string
  timestamp: string
}

type FetchState =
  | { kind: 'loading' }
  | { kind: 'ok'; data: HealthResponse }
  | { kind: 'error'; message: string }

function App() {
  const [state, setState] = useState<FetchState>({ kind: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/health', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return (await res.json()) as HealthResponse
      })
      .then((data) => setState({ kind: 'ok', data }))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        const message = err instanceof Error ? err.message : 'Unknown error'
        setState({ kind: 'error', message })
      })
    return () => controller.abort()
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>Take-home exercise</h1>
      <p>Frontend &harr; Backend smoke check</p>
      <section
        style={{
          padding: '1rem 1.25rem',
          border: '1px solid #ccc',
          borderRadius: 8,
          background: '#f7f7f7',
        }}
      >
        {state.kind === 'loading' && <span>Calling <code>/api/health</code>&hellip;</span>}
        {state.kind === 'error' && (
          <span style={{ color: '#b00020' }}>
            Backend unreachable: {state.message}
          </span>
        )}
        {state.kind === 'ok' && (
          <pre style={{ margin: 0 }}>{JSON.stringify(state.data, null, 2)}</pre>
        )}
      </section>
    </main>
  )
}

export default App
