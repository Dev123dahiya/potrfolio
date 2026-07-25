import AnimatedBackground from './components/AnimatedBackground';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import { About, Skills, Research, Contact, Footer } from './components/Rest';

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Research />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
