import { profile } from '../data/resume'
import { useHuman } from './useHuman'

const mask = (value: string) => '•'.repeat(value.length)

// Until a real person moves the mouse, taps or types, the page shows placeholders instead of
// the email and phone, so scrapers that only load the page and read it get nothing.
export function useContact() {
  const human = useHuman()
  return {
    human,
    email: human ? profile.email : mask(profile.email),
    phone: human ? profile.phone : mask(profile.phone),
    mailto: human ? `mailto:${profile.email}` : '#contact',
    tel: human ? `tel:${profile.phone.replace(/\s+/g, '')}` : '#contact',
  }
}
