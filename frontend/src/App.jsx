import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import MapPage from './pages/MapPage'
import Navbar from './components/Navbar'
import WikiPage from './pages/WikiPage'
import MaterialPage from './pages/wiki/MaterialPage'
import FloraPage from './pages/wiki/FloraPage'
import FaunaPage from './pages/wiki/FaunaPage'
import LeviathanPage from './pages/wiki/LeviathanPage'
import PoiPage from './pages/wiki/PoiPage'
import BiomePage from './pages/wiki/BiomePage'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/wiki" element={<WikiPage />} />
          <Route path="/wiki/material" element={<MaterialPage />} />
          <Route path="/wiki/flora" element={<FloraPage />} />
          <Route path="/wiki/fauna" element={<FaunaPage />} />
          <Route path="/wiki/leviathan" element={<LeviathanPage />} />
          <Route path="/wiki/poi" element={<PoiPage />} />
          <Route path="/wiki/biomas" element={<BiomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App