import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS CSS
import { useEffect } from 'react';

export default function Getpaperexecutive() {
    useEffect(() => {
        AOS.init();
    }, [])
    return (
        <div data-aos="fade-zoom-in"
            data-aos-easing="ease-in-back"
            data-aos-delay="100"
            data-aos-offset="1" className="h-screen bg-yellow-500">
            s
        </div>
    )
}