import Nav from './components/Nav';
import Hero from './components/Hero';
import Logos from './components/Logos';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Research from './components/Research';
import Education from './components/Education';
import About from './components/About';
import Contact from './components/Contact';
import Palette from './components/Palette';
import Band from './components/Band';
import { profile } from './data';
import { SiteProvider } from './lib/site';

export default function App() {
  return (
    <SiteProvider>
    <div className="min-h-screen">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-onInk"
      >
        Skip to projects
      </a>
      <Nav />
      <main>
        <Hero />
        <Logos />
        <Projects />
        <Band
          action={
            <a href="#contact" className="btn-outline-light">
              Get in touch
            </a>
          }
        >
          {profile.openTo}
        </Band>
        <Experience />
        <Research />
        <Education />
        <About />
        <Contact />
      </main>
      <Palette />
    </div>
    </SiteProvider>
  );
}
