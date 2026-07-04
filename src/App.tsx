import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import InquiryForm from './components/InquiryForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Process />
        <Testimonials />
        <InquiryForm />
      </main>
      <Footer />
    </>
  )
}
