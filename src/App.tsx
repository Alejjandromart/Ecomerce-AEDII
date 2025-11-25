import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

// Páginas
import { Home } from "./pages/Home"
import { ProdutosPage } from "./pages/ProdutosPage"
import { ArvorePage } from "./pages/ArvorePage"
import { EstatisticasPage } from "./pages/EstatisticasPage"
import { PerformancePage } from "./pages/PerformancePage"
import { Navbar } from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/arvore" element={<ArvorePage />} />
          <Route path="/estatisticas" element={<EstatisticasPage />} />
          <Route path="/performance" element={<PerformancePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
