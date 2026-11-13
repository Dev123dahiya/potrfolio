import Nav from './components/Nav';
import Hero from './components/Hero';
import Logos from './components/Logos';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Research from './components/Research';
import Education from './components/Education';
import About from './components/About';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="min-h-screen">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to projects
      </a>
      <Nav />
      <main>
        <Hero />
        <Logos />
        <Projects />
        <Experience />
        <Research />
        <Education />
        <About />
        <Contact />
      </main>
    </div>
  );
}
