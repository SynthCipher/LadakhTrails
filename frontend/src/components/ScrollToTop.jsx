import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'

const ScrollToTop = () => {
    const { pathname } = useLocation()
    const [showButton, setShowButton] = useState(false)

    // Scroll to top on route change (existing behavior)
    useEffect(() => {
        // 1️⃣ Force scroll to bottom first
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'auto',
        })

        // 2️⃣ Then smoothly scroll to top
        requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        })
    }, [pathname])

    // Show "back to top" button when user scrolls down more than one viewport height
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight) {
                setShowButton(true)
            } else {
                setShowButton(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTopSmooth = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            {showButton && (
                <button
                    onClick={scrollToTopSmooth}
                    aria-label="Scroll to top"
                    className="fixed bottom-6 right-6 z-2 rounded-full bg-blue-600 text-white shadow-lg p-3 md:p-3.5 hover:bg-blue-700 transition flex items-center justify-center"
                >
                    <ArrowUp size={22} />
                </button>
            )}
        </>
    )
}

export default ScrollToTop
