import Hero from '../components/Hero';
import About from '../components/About';
import ExecutiveShowcase from '../components/ExecutiveShowcase';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import ScrollReveal from '../components/ScrollReveal';

const Home = () => {
  return (
    <>
      <Hero />
      <ScrollReveal direction="up" delay={0.1}>
        <About />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <ExecutiveShowcase />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <Services />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <Testimonials />
      </ScrollReveal>
    </>
  );
};

export default Home;
