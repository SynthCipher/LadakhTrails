import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import General from './pages/General'
import Wildlife from './pages/Wildlife'
import WinterSports from './pages/WinterSports'
import Birding from './pages/Birding'
import AboutUs from './pages/AboutUs'
import FAQ from './pages/FAQ'
import TermsConditions from './pages/TermsConditions'
import AdminTours from './pages/AdminTours'
import './index.css'
import ScrollToTop from './components/ScrollToTop'

function App() {
    const location = useLocation()
    const isAdminRoute = location.pathname.startsWith('/admin')

    return (
        <div className="min-h-screen flex flex-col">
            {!isAdminRoute && <Navbar />}
            <main className="flex-grow">
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/general" element={<General />} />
                    <Route path="/wildlife" element={<Wildlife />} />
                    <Route path="/winter-sports" element={<WinterSports />} />
                    <Route path="/birding" element={<Birding />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/terms" element={<TermsConditions />} />
                    <Route path="/admin/tours" element={<AdminTours />} />
                </Routes>
            </main>
            {!isAdminRoute && <Footer />}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}

export default App
