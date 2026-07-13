import Nav from './components/Nav'
import Hero from './components/Hero'
import AboutStudio from './components/AboutStudio'
import Founder from './components/Founder'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Process from './components/Process'
import BrandCollaborations from './components/BrandCollaborations'
import WhyChooseUs from './components/WhyChooseUs'
import Testimonials from './components/Testimonials'
import InquiryForm from './components/InquiryForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AboutStudio />
        <Founder />
        <Services />
        <Gallery />
        <Process />
        <BrandCollaborations />
        <WhyChooseUs />
        <Testimonials />
        <InquiryForm />
      </main>
      <Footer />
    </>
  )
}
