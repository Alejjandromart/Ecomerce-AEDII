import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

// Páginas
import { Home } from "./pages/Home"
import { ProdutosPage } from "./pages/ProdutosPage"
import { ArvorePage } from "./pages/ArvorePage"
import { EstatisticasPage } from "./pages/EstatisticasPage"

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/arvore" element={<ArvorePage />} />
        <Route path="/estatisticas" element={<EstatisticasPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
