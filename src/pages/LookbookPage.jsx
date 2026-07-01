import Nav from '../components/Nav'
import Lookbook from '../components/Lookbook'
import Footer from '../components/Footer'

export default function LookbookPage() {
  return (
    <>
      <Nav />
      {/* Small spacer — Lookbook component has its own section header */}
      <div className="h-[68px] bg-dark" />
      <Lookbook />
      <Footer />
    </>
  )
}
