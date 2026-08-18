import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Solutions from './pages/Solutions';
import Careers from './pages/Careers';
import Connect from './pages/Connect';
import OpenPositions from './pages/OpenPositions';
import AdminDashboard from './pages/AdminDashboard';

// About Us Sub-pages
import CoreValues from './pages/AboutUs/CoreValues';
import Quality from './pages/AboutUs/Quality';
import BoardOfDirectors from './pages/AboutUs/BoardOfDirectors';
import ClientsRecognition from './pages/AboutUs/ClientsRecognition';

// Solutions Sub-pages
import HumanResources from './pages/Solutions/HumanResources';
import SkillsLeadership from './pages/Solutions/SkillsLeadership';

import ScrollToTop from './components/ScrollToTop';
import ScrollReveal from './components/ScrollReveal';
import Preloader from './components/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>
      
      <Router>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* About Us Routes */}
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/about-us/core-values" element={<CoreValues />} />
              <Route path="/about-us/quality" element={<Quality />} />
              <Route path="/about-us/board-of-directors" element={<BoardOfDirectors />} />
              <Route path="/about-us/clients-recognition" element={<ClientsRecognition />} />

              {/* Solutions Routes */}
              <Route path="/solutions-services" element={<Solutions />} />
              <Route path="/solutions-services/human-resource" element={<HumanResources />} />
              <Route path="/solutions-services/skills-leadership" element={<SkillsLeadership />} />

              <Route path="/my-career" element={<Careers />} />
              <Route path="/open-positions" element={<OpenPositions />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/connect-with-us" element={<Connect />} />
            </Routes>
          </main>
          <ScrollReveal direction="up" delay={0.1}>
            <Footer />
          </ScrollReveal>
          <ScrollToTop />
        </div>
      </Router>
    </>
  );
}

export default App;
