// The ekogroups directory, sourced from ekoparty.org/ekogroups/.
// Static on purpose: the list changes rarely and has no moderation flow.

export interface Ekogroup {
  slug: string
  name: string
  city: string
  country: string
  flag: string
  // Main public contact channel, if the group published one
  contact?: { type: 'whatsapp' | 'signal' | 'discord' | 'instagram' | 'email'; label: string; url: string }
}

export const EKOGROUPS: Ekogroup[] = [
  { slug: 'lima', name: 'Ekogroup Lima', city: 'Lima', country: 'Perú', flag: '🇵🇪' },
  { slug: 'arequipa', name: 'Ekogroup Arequipa', city: 'Arequipa', country: 'Perú', flag: '🇵🇪' },
  { slug: 'bogota', name: 'Ekogroup Bogotá', city: 'Bogotá', country: 'Colombia', flag: '🇨🇴' },
  { slug: 'barranquilla', name: 'Ekogroup Barranquilla', city: 'Barranquilla', country: 'Colombia', flag: '🇨🇴' },
  { slug: 'mexico', name: 'Ekogroup México', city: 'Ciudad de México', country: 'México', flag: '🇲🇽' },
  { slug: 'managua', name: 'Ekogroup Managua', city: 'Managua', country: 'Nicaragua', flag: '🇳🇮', contact: { type: 'email', label: 'ekogroupmanagua@gmail.com', url: 'mailto:ekogroupmanagua@gmail.com' } },
  { slug: 'panama', name: 'Ekogroup Panamá', city: 'Ciudad de Panamá', country: 'Panamá', flag: '🇵🇦' },
  { slug: 'costa-rica', name: 'Ekogroup Costa Rica', city: 'San José', country: 'Costa Rica', flag: '🇨🇷' },
  { slug: 'cochabamba', name: 'Ekogroup Cochabamba', city: 'Cochabamba', country: 'Bolivia', flag: '🇧🇴' },
  { slug: 'montevideo', name: 'Ekogroup Montevideo', city: 'Montevideo', country: 'Uruguay', flag: '🇺🇾' },
  { slug: 'san-luis', name: 'Ekogroup San Luis', city: 'San Luis', country: 'Argentina', flag: '🇦🇷' },
  { slug: 'mar-del-plata', name: 'Ekogroup Mar del Plata', city: 'Mar del Plata', country: 'Argentina', flag: '🇦🇷' },
  { slug: 'cordoba', name: 'Ekogroup Córdoba', city: 'Córdoba', country: 'Argentina', flag: '🇦🇷' },
  { slug: 'bahia-blanca', name: 'Ekogroup Bahía Blanca', city: 'Bahía Blanca', country: 'Argentina', flag: '🇦🇷' },
  { slug: 'salta', name: 'Ekogroup Salta', city: 'Salta', country: 'Argentina', flag: '🇦🇷' },
  { slug: 'mendoza', name: 'Ekogroup Mendoza', city: 'Mendoza', country: 'Argentina', flag: '🇦🇷' },
  { slug: 'neuquen-rio-negro', name: 'Ekogroup Neuquén-Río Negro', city: 'Neuquén', country: 'Argentina', flag: '🇦🇷', contact: { type: 'email', label: 'hbenja47@gmail.com', url: 'mailto:hbenja47@gmail.com' } },
]

export const EKOGROUPS_CONTACT_EMAIL = 'ekogroups@ekoparty.org'

export const EKOGROUPS_OFFICIAL_URL = 'https://ekoparty.org/ekogroups/'

export function getEkogroup(slug: string): Ekogroup | undefined {
  return EKOGROUPS.find(g => g.slug === slug)
}
