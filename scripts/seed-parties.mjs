// Seed mock approved parties for visual testing
const SUPABASE_URL = 'https://xoyklzqycjgwlmspmjdi.supabase.co'
const SUPABASE_KEY = 'sb_publishable_5kLgKgcVfJqsxleOU0eICw_oivAxDYk'

const parties = [
  // ── Miércoles 7 de octubre ─────────────────────────────────────────────────
  {
    edition: 'ekoparty-ba-2026',
    name: 'Hacker Welcome Cocktail',
    host: 'EkoParty',
    venue: 'La Cigale',
    address: 'Av. 25 de Mayo 722, San Nicolás, Buenos Aires',
    description: 'Drinks de bienvenida antes de que empiece el caos. La mejor forma de romper el hielo con la comunidad.',
    starts_at: '2026-10-07T19:00:00-03:00',
    ends_at: '2026-10-07T23:00:00-03:00',
    rsvp_url: 'https://ekoparty.org',
    tags: ['open-invite'],
    submitter_name: 'EkoParty Team',
    submitter_email: 'hello@ekoparty.org',
    status: 'approved',
  },
  {
    edition: 'ekoparty-ba-2026',
    name: 'Red Team Social Night',
    host: 'Faraday Security',
    venue: 'Milion',
    address: 'Paraná 1048, Recoleta, Buenos Aires',
    description: 'Reunión exclusiva para practicantes de seguridad ofensiva. Drinks cortesía de Faraday.',
    starts_at: '2026-10-07T21:00:00-03:00',
    ends_at: '2026-10-08T01:00:00-03:00',
    rsvp_url: 'https://faradaysec.com',
    tags: ['approval-required'],
    submitter_name: 'Faraday Team',
    submitter_email: 'events@faradaysec.com',
    status: 'approved',
  },
  // ── Jueves 8 de octubre ────────────────────────────────────────────────────
  {
    edition: 'ekoparty-ba-2026',
    name: 'Bug Bounty Brunch',
    host: 'HackerOne LATAM',
    venue: 'Café Tortoni',
    address: 'Av. de Mayo 825, Monserrat, Buenos Aires',
    description: 'Café y medialunes con los mejores hunters de LATAM. Compartí historias y encontrá equipo.',
    starts_at: '2026-10-08T09:00:00-03:00',
    ends_at: '2026-10-08T12:00:00-03:00',
    rsvp_url: 'https://hackerone.com',
    tags: ['open-invite'],
    submitter_name: 'HackerOne',
    submitter_email: 'events@hackerone.com',
    status: 'approved',
  },
  {
    edition: 'ekoparty-ba-2026',
    name: 'CISO Executive Lunch',
    host: 'Trend Micro',
    venue: 'Nectarine Resto',
    address: 'Uruguay 1324, Recoleta, Buenos Aires',
    description: 'Almuerzo privado para líderes de seguridad. Conversación íntima sobre el panorama de amenazas 2026.',
    starts_at: '2026-10-08T13:00:00-03:00',
    ends_at: '2026-10-08T15:30:00-03:00',
    rsvp_url: 'https://trendmicro.com/latam',
    tags: ['approval-required'],
    submitter_name: 'Trend Micro LATAM',
    submitter_email: 'latam@trendmicro.com',
    status: 'approved',
  },
  {
    edition: 'ekoparty-ba-2026',
    name: 'Open Source Security Meetup',
    host: 'OWASP Argentina',
    venue: 'Centro Cultural San Martín',
    address: 'Sarmiento 1551, Centro, Buenos Aires',
    description: 'Charlas + hackaton abierta. Todos los niveles bienvenidos, traé tu laptop.',
    starts_at: '2026-10-08T17:00:00-03:00',
    ends_at: '2026-10-08T20:00:00-03:00',
    rsvp_url: 'https://owasp.org/local-chapters/argentina',
    tags: ['open-invite'],
    submitter_name: 'OWASP Argentina Chapter',
    submitter_email: 'argentina@owasp.org',
    status: 'approved',
  },
  {
    edition: 'ekoparty-ba-2026',
    name: 'EkoParty Official Party 🎉',
    host: 'EkoParty',
    venue: 'Niceto Club',
    address: 'Niceto Vega 5510, Palermo, Buenos Aires',
    description: 'La fiesta del año. Música en vivo, barra libre, ambiente hacker. No te la podés perder.',
    starts_at: '2026-10-08T22:00:00-03:00',
    ends_at: '2026-10-09T03:00:00-03:00',
    rsvp_url: 'https://ekoparty.org',
    tags: ['open-invite'],
    submitter_name: 'EkoParty',
    submitter_email: 'hello@ekoparty.org',
    status: 'approved',
  },
  // ── Viernes 9 de octubre ───────────────────────────────────────────────────
  {
    edition: 'ekoparty-ba-2026',
    name: 'Malware Research Breakfast',
    host: 'ESET LATAM',
    venue: 'Hotel Madero',
    address: 'Rosario Vera Peñaloza 360, Puerto Madero, Buenos Aires',
    description: 'Desayuno con investigadores de ESET. Últimas tendencias en malware + buffet.',
    starts_at: '2026-10-09T08:30:00-03:00',
    ends_at: '2026-10-09T11:00:00-03:00',
    rsvp_url: 'https://eset.com/latam',
    tags: ['open-invite'],
    submitter_name: 'ESET LATAM',
    submitter_email: 'eventos@eset.com',
    status: 'approved',
  },
  {
    edition: 'ekoparty-ba-2026',
    name: 'Women in Cybersecurity Lunch',
    host: 'WiCyS Argentina',
    venue: 'El Preferido de Palermo',
    address: 'Jorge Luis Borges 2108, Palermo, Buenos Aires',
    description: 'Almuerzo de networking para mujeres en seguridad informática. Mentorías y conexiones.',
    starts_at: '2026-10-09T12:30:00-03:00',
    ends_at: '2026-10-09T15:00:00-03:00',
    rsvp_url: 'https://wicys.org',
    tags: ['open-invite'],
    submitter_name: 'WiCyS Argentina',
    submitter_email: 'argentina@wicys.org',
    status: 'approved',
  },
  {
    edition: 'ekoparty-ba-2026',
    name: 'CTF Award Ceremony & After',
    host: 'EkoParty CTF',
    venue: 'The Loft Buenos Aires',
    address: 'Arroyo 872, Retiro, Buenos Aires',
    description: 'Cierre del EkoParty CTF 2026. Premios, reconocimientos y barra libre para todos los participantes.',
    starts_at: '2026-10-09T18:00:00-03:00',
    ends_at: '2026-10-09T22:00:00-03:00',
    rsvp_url: 'https://ekoparty.org/ctf',
    tags: ['open-invite'],
    submitter_name: 'CTF Team',
    submitter_email: 'ctf@ekoparty.org',
    status: 'approved',
  },
  {
    edition: 'ekoparty-ba-2026',
    name: 'Closing Drinks at El Federal',
    host: 'Comunidad EkoParty',
    venue: 'El Federal',
    address: 'Carlos Calvo 599, San Telmo, Buenos Aires',
    description: '¿Ya terminó? Nos vemos en El Federal. Asado, cervezas y hasta el año que viene.',
    starts_at: '2026-10-09T20:00:00-03:00',
    ends_at: '2026-10-10T00:00:00-03:00',
    rsvp_url: 'https://ekoparty.org',
    tags: ['open-invite'],
    submitter_name: 'Comunidad',
    submitter_email: 'comunidad@ekoparty.org',
    status: 'approved',
  },
]

async function seed() {
  console.log(`Inserting ${parties.length} mock parties into Supabase...`)

  const res = await fetch(`${SUPABASE_URL}/rest/v1/parties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(parties),
  })

  const body = await res.json()

  if (!res.ok) {
    console.error('❌ Error:', JSON.stringify(body, null, 2))
    process.exit(1)
  }

  console.log(`✅ Inserted ${body.length} parties`)
  body.forEach(p => console.log(`  · [${p.id}] ${p.name}`))
}

seed()
