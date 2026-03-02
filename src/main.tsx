import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const cryptoQueryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={cryptoQueryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
