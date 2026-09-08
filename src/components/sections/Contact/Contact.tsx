import type { ReactElement } from 'react'
import { serviceOptions, budgetOptions, contactMethods } from '../../../content/contact'
import { SectionHeader } from '../../ui/SectionHeader'
import { Card } from '../../ui/Card'
import { useContactForm } from '../../../hooks/useContactForm'

const METHOD_ICONS: Record<string, ReactElement> = {
  'Email Correspondence': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  'WhatsApp / Voice': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  'LinkedIn Network': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  'GitHub Codebase': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  ),
}

export function Contact() {
  const { values, setField, submitting, handleSubmit } = useContactForm()

  return (
    <section id="contact" className="section contact-section bg-secondary">
      <div className="container">
        <SectionHeader label="10 // ENGAGEMENT" title="Start a Consultation" />

        <div className="contact-grid">
          <Card className="contact-left">
            <h3>Request Infrastructure Analysis</h3>
            <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="form-name">Full Name *</label>
                <input
                  type="text"
                  id="form-name"
                  placeholder="John Doe"
                  required
                  value={values.name}
                  onChange={(e) => setField('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="form-email">Email Address *</label>
                <input
                  type="email"
                  id="form-email"
                  placeholder="john@company.com"
                  required
                  value={values.email}
                  onChange={(e) => setField('email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="form-service">Service Needed *</label>
                <select
                  id="form-service"
                  required
                  value={values.service}
                  onChange={(e) => setField('service', e.target.value)}
                >
                  <option value="" disabled>
                    Select a primary service
                  </option>
                  {serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="form-budget">Project Budget (Optional)</label>
                <select
                  id="form-budget"
                  value={values.budget}
                  onChange={(e) => setField('budget', e.target.value)}
                >
                  <option value="" disabled>
                    Select estimated budget
                  </option>
                  {budgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="form-message">Project Scope Details *</label>
                <textarea
                  id="form-message"
                  rows={5}
                  placeholder="Please describe your current cloud stack, infrastructure challenges, or optimization goals..."
                  required
                  value={values.message}
                  onChange={(e) => setField('message', e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="pulse-dot"></span> Sending Request...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </Card>

          <div className="contact-right">
            <Card className="contact-info-card">
              <h3>Direct Contact Channels</h3>
              {contactMethods.map((method) => (
                <div className="contact-method" key={method.title}>
                  <div className="method-icon">{METHOD_ICONS[method.title]}</div>
                  <div>
                    <div className="method-title">{method.title}</div>
                    <a
                      href={method.href}
                      className="method-link text-accent"
                      {...(method.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {method.label}
                    </a>
                  </div>
                </div>
              ))}
            </Card>

            <Card className="availability-card">
              <div className="avail-header">
                <span className="pulse-dot"></span>
                <h4>Available for Consulting</h4>
              </div>
              <p className="avail-text">
                Currently accepting select cloud migrations, performance auditing, and
                infrastructure projects.
              </p>
              <span className="response-time-note">🕒 Typically responds within 24 hours</span>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
