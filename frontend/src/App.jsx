import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './index.css'
import ScrollToTop from './components/ScrollToTop'

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'))
const General = lazy(() => import('./pages/General'))
const Wildlife = lazy(() => import('./pages/Wildlife'))
const WinterSports = lazy(() => import('./pages/WinterSports'))
const Birding = lazy(() => import('./pages/Birding'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const FAQ = lazy(() => import('./pages/FAQ'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const AdminTours = lazy(() => import('./pages/AdminTours'))

function App() {
    const location = useLocation()
    const isAdminRoute = location.pathname.startsWith('/admin')

    return (
        <div className="min-h-screen flex flex-col">
            {!isAdminRoute && <Navbar />}
            <main className="flex-grow">
                <ScrollToTop />
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                }>
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
                </Suspense>
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
