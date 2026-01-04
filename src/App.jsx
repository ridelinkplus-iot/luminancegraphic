import { useState, useEffect, useRef } from "react"; // Import useRef for accessibility focus
import "./index.css";
import Header from "./Components/Header";
import Home from "./Components/Home";
import AboutMe from "./Components/AboutMe";
import Content from "./Components/Content";
import SocialMediaPosts from "./Components/SocialMediaPosts";
import Logo from "./Components/Logo";
import YoutubeThumbnails from "./Components/YoutubeThumbnails";
import SocialMediaCover from "./Components/SocialMediaCover";
import BookCover from "./Components/BookCover";
import Contact from "./Components/Contact";
import Skills from "./Components/Skills";
import Copyright from "./Components/Copyright";
import TempHome from "./Components/TempHome";
import Tdesigns from "./Components/TDesigns";
import BusinessCarddesigns from "./Components/Businesscard";
import CV from "./Components/CVdesigns";
import Bookmark from "./Components/Bookmark";
import Banner from "./Components/Banner";
import Preloader from "./Components/Preloader";
import Testimonials from "./Components/Testimonials";
import Pricing from "./Components/Pricing";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "./Components/AuthContext";

import Image1 from "./assets/Home Section/main post.jpg";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null); // Ref for accessibility

  useEffect(() => {
    if (!isLoading) {
      const seen = sessionStorage.getItem("welcomePopupShown");
      if (!seen) {
        setShowPopup(true);
        sessionStorage.setItem("welcomePopupShown", "1");
      }
    }
  }, [isLoading]);

  const closePopup = () => setShowPopup(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });

    // Simulate loading time and ensure minimum display duration
    const minLoadTime = 2500; // Minimum 2.5 seconds
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    if (showPopup) {
      document.addEventListener("keydown", handleEscape);
      if (popupRef.current) {
        const closeButton = popupRef.current.querySelector(
          'button[aria-label="Close"]'
        );
        if (closeButton) closeButton.focus();
      }
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showPopup]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Preloader */}
      <Preloader isVisible={isLoading} />

      {/* Welcome Popup */}
      {showPopup && (
        <div
          role="dialog"
          aria-modal="true"
          className="flex items-center justify-center fixed inset-0 z-[9999] bg-black/70"
          onClick={closePopup}
        >
          <div
            ref={popupRef}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button on top-right of the image */}
            <button
              onClick={closePopup}
              aria-label="Close"
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 text-black shadow-md 
                         hover:bg-white hover:scale-105 transition flex items-center justify-center text-lg"
            >
              ✕
            </button>

            {/* Image centered */}
            <img
              src={Image1}
              alt="Welcome"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
              draggable="false"
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={`transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Header />

        <div id="home">
          <Home />
        </div>

        <div id="about">
          <AboutMe />
        </div>

        <div id="content">
          <Content />
        </div>

        <div id="Pricing">
          <Pricing />
        </div>

        <div id="socialMediaPosts">
          <SocialMediaPosts />
        </div>

        <div id="logo">
          <Logo />
        </div>

        <div id="youtubeThumbnails">
          <YoutubeThumbnails />
        </div>

        <div id="socialMediaCover">
          <SocialMediaCover />
        </div>

        <div id="bookCover">
          <BookCover />
        </div>

        <div id="Tdesigns">
          <Tdesigns />
        </div>

        <div id="BusinessCarddesigns">
          <BusinessCarddesigns />
        </div>

        <div id="CV">
          <CV />
        </div>

        <div id="Bookmark">
          <Bookmark />
        </div>

        <div id="Banner">
          <Banner />
        </div>

        <AuthProvider>
          <Testimonials id="Testimonials" />
        </AuthProvider>

        <div id="contact">
          <Contact />
        </div>

        <div id="copyright">
          <Copyright />
        </div>
      </div>
    </>
  );
}

export default App;
