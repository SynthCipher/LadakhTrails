import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
    const { pathname } = useLocation()

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

    return null
}

export default ScrollToTop
