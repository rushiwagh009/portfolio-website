import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './hooks/useToast'
import { ThemeProvider } from './hooks/useTheme'
import { LightboxProvider } from './hooks/useLightbox'
import { RenderModeProvider } from './three/RenderModeProvider'
import { Preloader } from './components/layout/Preloader'
import { Home } from './routes/Home'
import { BlogPost } from './components/sections/Blog/BlogPost'

export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <RenderModeProvider>
          <LightboxProvider>
            <Preloader />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
              </Routes>
            </BrowserRouter>
          </LightboxProvider>
        </RenderModeProvider>
      </ThemeProvider>
    </ToastProvider>
  )
}
