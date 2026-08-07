import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

export default function ContactPage() {
  const { showToast } = useApp()
  usePageMeta('Contact — MK 1974', 'Get in touch with the MK 1974 team.')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = e => {
    e.preventDefault()
    showToast("Message sent. We'll reply within 24 hours.")
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const faqs = [
    { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days within Nigeria. Express delivery is 1–2 days.' },
    { q: 'Can I return or exchange my order?', a: 'Yes — free returns within 30 days of delivery. Items must be unworn with original tags attached.' },
    { q: 'What payment methods do you accept?', a: 'We accept bank transfer. After placing your order, you\'ll receive our bank details to complete payment and upload a receipt.' },
    { q: 'How do I track my order?', a: 'Log in to your account and go to the Orders section. Click "Track" on any order to see its status.' },
    { q: 'Do you ship internationally?', a: 'Yes — we ship internationally. Delivery times and rates vary by location.' },
    { q: 'How do I find my size?', a: 'Check the Size Guide on any product page. We recommend going a size up if you prefer a relaxed fit.' },
  ]

  return (
    <>
      <Nav />
      <main className="bg-surface min-h-screen pt-[70px]">
        {/* Page header */}
        <div className="px-8 md:px-12 py-12 border-b border-black/[0.06] bg-surface2">
          <div className="max-w-[1440px] mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-dark">Contact us</h1>
            <p className="text-muted text-sm mt-2">We're here Monday to Friday, 9am–6pm WAT.</p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Send a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                      className="w-full bg-white border border-black/10 text-dark text-sm px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                      className="w-full bg-white border border-black/10 text-dark text-sm px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-white border border-black/10 text-dark text-sm px-4 py-3 focus:outline-none focus:border-accent appearance-none"
                  >
                    <option value="">Select a topic</option>
                    <option>Order issue</option>
                    <option>Returns & exchanges</option>
                    <option>Sizing help</option>
                    <option>Product enquiry</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                    className="w-full bg-white border border-black/10 text-dark text-sm px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>
                <button type="submit" id="contact-submit-btn" className="btn-primary">
                  Send message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Other ways to reach us</h2>
              <div className="space-y-3 mb-10">
                {[
                  { label: 'Email', value: 'hello@mk1974.com', href: 'mailto:hello@mk1974.com' },
                  { label: 'WhatsApp', value: '+234 800 MK 1974', href: 'https://wa.me/2348001974' },
                  { label: 'Instagram', value: '@mk1974official', href: 'https://instagram.com' },
                ].map(c => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border border-black/10 bg-white hover:border-accent/40 transition-colors group"
                  >
                    <div>
                      <p className="text-xs text-muted">{c.label}</p>
                      <p className="text-sm font-medium text-dark mt-0.5">{c.value}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted group-hover:text-dark transition-colors">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                ))}
              </div>

              {/* FAQs */}
              <h2 className="text-xl font-bold text-dark mb-5">Frequently asked questions</h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
              </div>
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
    <div className="border border-black/10 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-dark pr-4">{q}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-muted shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && <div className="px-5 pb-4 text-sm text-dark/60 leading-relaxed">{a}</div>}
    </div>
  )
}
