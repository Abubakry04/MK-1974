import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function ContactPage() {
  const { showToast } = useApp()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = e => {
    e.preventDefault()
    showToast('Message sent! We\'ll reply within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const contacts = [
    { label: 'WhatsApp', value: '+234 800 MK 1974', href: 'https://wa.me/2348001974', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z' },
    { label: 'Email', value: 'hello@mk1974.com', href: 'mailto:hello@mk1974.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Instagram', value: '@mk1974official', href: 'https://instagram.com', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' },
    { label: 'Phone', value: '+44 (0) 161 MK 1974', href: 'tel:+441611974', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  ]

  const faqs = [
    { q: 'How long does delivery take?', a: 'UK Standard delivery takes 3-5 business days. Express delivery is 1-2 days. International shipping varies by location (5-14 days).' },
    { q: 'Can I return or exchange my order?', a: 'Yes! We offer free returns within 30 days of delivery. Items must be unworn with original tags attached. Start a return from your customer profile.' },
    { q: 'What payment methods do you accept?', a: 'We accept bank transfer payments. After placing your order, you\'ll receive our bank details to complete payment. Upload your receipt to confirm.' },
    { q: 'How do I track my order?', a: 'Once your order is placed, log in to your account and visit the Orders section. Click Track on any order to view its live status.' },
    { q: 'Do you ship internationally?', a: 'Yes! We ship to Europe (₦12.99) and worldwide (₦18.99). Delivery times vary by location.' },
    { q: 'How do I find my size?', a: 'Check our Size Guide on any product page. We recommend going a size up if you prefer a relaxed fit, or staying true to size for our slim/tapered styles.' },
  ]

  return (
    <>
      <Nav />
      <main className="bg-dark min-h-screen pt-20">
        {/* Header */}
        <div className="bg-surface border-b border-black/[0.07] px-8 md:px-12 py-16">
          <div className="max-w-[1440px] mx-auto">
            <p className="eyebrow mb-3">Get in Touch</p>
            <h1 className="font-playfair font-black italic text-4xl md:text-5xl" style={{ color: '#1A1A1A' }}>Contact Us</h1>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-playfair font-black italic text-white text-3xl mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">Name</label>
                    <input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full bg-surface2 border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">Email</label>
                    <input name="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full bg-surface2 border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">Subject</label>
                  <select name="subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full bg-surface2 border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40 appearance-none">
                    <option value="">Select a topic</option>
                    <option>Order Issue</option>
                    <option>Returns & Exchanges</option>
                    <option>Sizing Help</option>
                    <option>Product Inquiry</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">Message</label>
                  <textarea name="message" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required className="w-full bg-surface border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40 transition-colors resize-none" />
                </div>
                <button type="submit" id="contact-submit-btn" className="btn-primary">
                  Send Message
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4z"/></svg>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-playfair font-black italic text-white text-3xl mb-8">Other Ways to Reach Us</h2>
              <div className="space-y-4 mb-12">
                {contacts.map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-5 bg-surface2 border border-black/[0.08] hover:border-lime/40 transition-all group">
                    <div className="w-11 h-11 bg-dark border border-white/10 group-hover:border-lime/40 flex items-center justify-center transition-all shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream/60 group-hover:text-lime transition-colors">
                        <path d={c.icon} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.65rem] tracking-[0.25em] uppercase mb-1" style={{ color: 'rgba(26,26,26,0.6)' }}>{c.label}</p>
                      <p className="text-[0.88rem] font-medium" style={{ color: '#1A1A1A' }}>{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-surface2 border border-black/[0.08] p-6">
                <p className="font-semibold text-[0.82rem] tracking-[0.2em] uppercase mb-2" style={{ color: '#1A1A1A' }}>Response Time</p>
                <p className="text-muted text-[0.82rem] leading-[1.7]">We respond to all enquiries within <span className="font-medium" style={{ color: '#1A1A1A' }}>24 hours</span>, Monday to Friday. For urgent matters, reach us via WhatsApp.</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">Common Questions</p>
              <h2 className="font-playfair font-black italic text-cream text-4xl">FAQs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-surface2 border border-black/[0.08]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="text-[0.88rem] font-medium pr-4" style={{ color: '#1A1A1A' }}>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-lime shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
      {open && <div className="px-5 pb-5 text-[0.82rem] font-light leading-[1.8]" style={{ color: 'rgba(26,26,26,0.6)' }}>{a}</div>}
    </div>
  )
}
