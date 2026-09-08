import { useState, type FormEvent } from 'react'
import { useToast } from './useToast'

export interface ContactFormState {
  name: string
  email: string
  service: string
  budget: string
  message: string
}

const initialState: ContactFormState = { name: '', email: '', service: '', budget: '', message: '' }

/** Contact form stays simulated (no Lambda wiring) per the site owner's
 * decision — same behavior as the legacy site, which never had a configured
 * Function URL either: validate, show a success toast, reset. Wiring a real
 * backend is deferred to a later engagement. */
export function useContactForm() {
  const [values, setValues] = useState<ContactFormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const setField = <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!values.name.trim() || !values.email.trim() || !values.service || !values.message.trim()) {
      showToast('Please fill in all required fields.', 'error')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      showToast('Lambda URL not configured yet. Form simulation successful.', 'success')
      setValues(initialState)
      setSubmitting(false)
    }, 1500)
  }

  return { values, setField, submitting, handleSubmit }
}
