export type TalkType = 'session' | 'lightning' | 'workshop' | 'panel'
export interface AgendaItem {
  id: string
  time_start: string
  time_end: string
  title: string
  speakers: string[]
  type: TalkType
  language: 'es' | 'en'
  village?: string
}

export interface AgendaRoom {
  id: string
  name: string
  items: AgendaItem[]
}

export interface AgendaDay {
  id: string
  date: string
  label_es: string
  label_en: string
  label_pt: string
  rooms: AgendaRoom[]
}

// Agenda oficial sincronizada desde ekoparty.org/agenda-2026 (Sessionize 03kelhmp).
// Última sincronización: 2026-10-07.
export const agenda: AgendaDay[] = [
  {
    id: 'oct7',
    date: '2026-10-07',
    label_es: 'Miércoles 7',
    label_en: 'Wednesday 7',
    label_pt: 'Quarta 7',
    rooms: [
      {
        id: 'maintrack',
        name: "Maintrack",
        items: [
          { id: 'd1-maintrack-01', time_start: '09:10', time_end: '09:25', title: "Bienvenida", speakers: ["Leo Pigñer"], type: 'session', language: 'es' },
          { id: 'd1-maintrack-02', time_start: '09:25', time_end: '10:15', title: "LATAM-as-a-Service: How Latin American cybercrime industrialized Everything-as-a-Service", speakers: ["Anton Dolgalev"], type: 'session', language: 'en' },
          { id: 'd1-maintrack-03', time_start: '10:15', time_end: '11:05', title: "Zero-Knowledge cracking of a 1983 Apple II Hardware Copy Protection", speakers: ["Inbar Raz"], type: 'session', language: 'en' },
          { id: 'd1-maintrack-04', time_start: '11:05', time_end: '11:55', title: "MSIX'd Up: Weaponizing the Modern Windows App Packaging Ecosystem", speakers: ["Nick Powers"], type: 'session', language: 'en', village: "Red Team Space" },
          { id: 'd1-maintrack-05', time_start: '11:55', time_end: '12:35', title: "Nobody puts baby in a corner", speakers: ["Sammy Azdoufal"], type: 'lightning', language: 'en' },
          { id: 'd1-maintrack-06', time_start: '14:40', time_end: '15:30', title: "¡Atrápalos Ya! How To Capture 3.5 Billion WhatsApp Accounts", speakers: ["Gabriel Gegenhuber", "Max Guenther", "Philipp Frenzel"], type: 'session', language: 'en' },
          { id: 'd1-maintrack-07', time_start: '15:30', time_end: '16:20', title: "Prompt Critical: AI-driven Weaponization of a UniFi OS RCE Chain", speakers: ["Jon Williams"], type: 'session', language: 'en' },
          { id: 'd1-maintrack-08', time_start: '16:20', time_end: '17:10', title: "Dead.Letter y el exploit writing moderno", speakers: ["Andrés Luksenberg"], type: 'session', language: 'es' },
          { id: 'd1-maintrack-09', time_start: '17:10', time_end: '18:00', title: "Every ride you take - Hacking a City’s Public Transportation", speakers: ["Ignacio Navarro"], type: 'session', language: 'es' },
        ],
      },
      {
        id: 'd',
        name: "Sala D",
        items: [
          { id: 'd1-d-01', time_start: '09:45', time_end: '10:30', title: "From Tickets to Tokens: Weaponizing the Hybrid Identity Boundary with SATO", speakers: ["Edrian Miranda"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd1-d-02', time_start: '10:30', time_end: '11:15', title: "AImaru C2: La Nueva Era del Living off the Land (MCP AI-Driven C2 )", speakers: ["Mario Lobo"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd1-d-03', time_start: '11:15', time_end: '12:00', title: "Building Orion: Un framework para romper y defender modelos de IA", speakers: ["Christian Urcuqui"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd1-d-04', time_start: '12:00', time_end: '13:00', title: "“Hey Red Teamer, I’ve Got a Human EDR Bypass for You…”", speakers: ["Daniel Isler"], type: 'lightning', language: 'es', village: "Red Team Space" },
          { id: 'd1-d-05', time_start: '14:00', time_end: '14:45', title: "Bypass 101", speakers: ["Karen Ng"], type: 'session', language: 'en', village: "Physical Security Village" },
          { id: 'd1-d-06', time_start: '16:15', time_end: '17:00', title: "Resolviendo IoTGoat con Langchain y Unsloth", speakers: ["Mariano Marino"], type: 'session', language: 'es', village: "Hardware Hacking Village" },
          { id: 'd1-d-07', time_start: '17:00', time_end: '17:30', title: "Web distribuida y archivo comunitario", speakers: ["Agus Las Peñas"], type: 'session', language: 'es', village: "Peer2Peer" },
          { id: 'd1-d-08', time_start: '17:30', time_end: '18:00', title: "IDENTIDAD DIGITAL: Compartimentar, Minimizar y Securizar tu visibilidad online.", speakers: ["Sol Verniers"], type: 'session', language: 'es', village: "Peer2Peer" },
        ],
      },
      {
        id: 'c1',
        name: "Sala C1",
        items: [
          { id: 'd1-c1-01', time_start: '10:30', time_end: '11:15', title: "MCP y el problema que nadie está viendo: supply chain attacks en el ecosistema de herramientas IA", speakers: ["David Soto"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd1-c1-02', time_start: '11:15', time_end: '12:00', title: "Trust Me, I'm Your Boss", speakers: ["Luis Garay"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd1-c1-03', time_start: '12:00', time_end: '13:00', title: "Trident: Afilando la lanza de la defensa autónoma", speakers: ["Julian Ignacio Fernandez", "Juan Loncharich", "Rocio Baggio", "Diego Forni"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd1-c1-04', time_start: '14:00', time_end: '14:45', title: "Core bajo ataque: Anatomía del fraude transaccional con agentes de IA en Latinoamérica", speakers: ["David Bernal"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd1-c1-05', time_start: '14:45', time_end: '15:30', title: "Identidades Gobernarlas o Caer", speakers: ["Lucciano Campassi"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd1-c1-06', time_start: '15:30', time_end: '16:15', title: "De Honeypot a Pipeline de Detección: integrando Zeek y Machine Learning para identificar ataques", speakers: ["Leandro Estrella"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd1-c1-07', time_start: '16:15', time_end: '17:00', title: "Stranger Tactics Stranger Techniques Stranger Things by Threat Actors", speakers: ["Erivan Morales"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd1-c1-08', time_start: '17:00', time_end: '18:00', title: "Grupo Lazarus: Anatomía del cibercrimen organizado", speakers: ["Carlos A. Agrelo"], type: 'session', language: 'es', village: "Blue Space" },
        ],
      },
      {
        id: 'c2',
        name: "Sala C2",
        items: [
          { id: 'd1-c2-01', time_start: '09:45', time_end: '10:30', title: "Necesitamos a Sarah Connor (o al menos un protocolo) Cada prompt tiene consecuencias.", speakers: ["Matias Choren Ruiz", "Ivan Gawek"], type: 'session', language: 'es', village: "Social Engineering Village" },
          { id: 'd1-c2-02', time_start: '10:30', time_end: '11:15', title: "PCI-DSS real en arquitecturas AWS: Cumplir sin morir en el intento", speakers: ["Cloud Security Space"], type: 'session', language: 'es', village: "Cloud Security" },
          { id: 'd1-c2-03', time_start: '11:15', time_end: '12:00', title: "Quantum Gadgets: Finding Optimal ROP Chains on Real Quantum Computer Hardware", speakers: ["Carlos Benitez"], type: 'session', language: 'es', village: "Quantum" },
          { id: 'd1-c2-04', time_start: '12:00', time_end: '13:00', title: "Prompt injection en agentes con tools: permisos, aislamiento y auditoría", speakers: ["Valentín Torassa Colombero"], type: 'lightning', language: 'es', village: "AI Resilience Hub" },
          { id: 'd1-c2-05', time_start: '14:00', time_end: '14:45', title: "Hackers, reguladores y ejecutivos: sobrevivir siendo BISO", speakers: ["CyberFinance Village", "Nicolas Raus", "Mariano Pozzi", "Eliana Caballero"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd1-c2-06', time_start: '14:45', time_end: '15:30', title: "Autenticidad vs. deepfake: ¿quién valida qué es real?", speakers: ["CyberFinance Village", "Leonardo Fragola", "Fred Montezuma"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd1-c2-07', time_start: '16:15', time_end: '17:00', title: "De Industria 3.0 a Industria 4.0: Convergencia IT/OT, Ciberseguridad e Inteligencia Artificial", speakers: ["Omar Lozano"], type: 'session', language: 'es', village: "Secure OT" },
          { id: 'd1-c2-08', time_start: '17:00', time_end: '18:00', title: "Bypassing KYC SDKs in the AI Era", speakers: ["Juan Martinez Blanco", "Juan Urbano Stordeur"], type: 'session', language: 'es', village: "Mobile Hacking Space" },
        ],
      },
      {
        id: 'c3',
        name: "Sala C3",
        items: [
          { id: 'd1-c3-01', time_start: '09:45', time_end: '10:30', title: "The Flash Chip Doesn’t Lie: Firmware Supply-Chain Attacks and a CTF You Can Take Home", speakers: ["Daniel Schwendner"], type: 'session', language: 'en', village: "Hardware Hacking Village" },
          { id: 'd1-c3-02', time_start: '10:30', time_end: '11:15', title: "Como hackearía un protocolo DeFi", speakers: ["WebtrES Village", "Nóbel N/A"], type: 'session', language: 'es', village: "WebtrES" },
          { id: 'd1-c3-03', time_start: '11:15', time_end: '12:00', title: "Your CI/CD Is Lying to Your Face", speakers: ["Daniel Malvaceda"], type: 'session', language: 'es', village: "DevSecOps Space" },
          { id: 'd1-c3-04', time_start: '12:00', time_end: '12:30', title: "El Contexto es la Nueva Superficie de Ataque: Seguridad de Datos en GenAI con OWASP", speakers: ["OWASP Village LATAM N/A"], type: 'session', language: 'es', village: "OWASP" },
          { id: 'd1-c3-05', time_start: '12:30', time_end: '13:00', title: "Confiás en tu IA. El atacante cuenta con eso:", speakers: ["OWASP Village LATAM N/A"], type: 'session', language: 'es', village: "OWASP" },
          { id: 'd1-c3-06', time_start: '14:00', time_end: '14:45', title: "The Polite Path to RCE - Social Pressure and Real Exploits Against Production LLMs", speakers: ["Paulo Sarrin", "José Emiliano Pérez Garduño"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd1-c3-07', time_start: '14:45', time_end: '15:30', title: "The Silent Coup: cómo los ataques de cadena de suministro desestabilizan organizaciones modernas", speakers: ["Matias Ferreira"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd1-c3-08', time_start: '15:30', time_end: '16:15', title: "AI: Attacker with Claude, Defenders with Copilot", speakers: ["Facundo Lisotto"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd1-c3-09', time_start: '16:15', time_end: '17:00', title: "Ghost in the Cloud: Cómo Exfiltrar Credenciales Operando Solo con Servicios de Google", speakers: ["Ignacio Perez"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd1-c3-10', time_start: '17:00', time_end: '17:30', title: "Hack smarter,not harder: Integrando LLMs con C2 para crear agentes de IA en Red Team", speakers: ["Johan Robles Benites"], type: 'session', language: 'es', village: "Red Team Space" },
        ],
      },
      {
        id: 'a1',
        name: "Sala A1",
        items: [
          { id: 'd1-a1-01', time_start: '09:45', time_end: '10:30', title: "CRYPT - STEG DIA 1 - SALA \"A1\" ASCON en IoT", speakers: ["Aranda Diego Salvador", "German Bollmann"], type: 'session', language: 'es', village: "Crypt Steg" },
          { id: 'd1-a1-02', time_start: '10:30', time_end: '11:15', title: "SPACECAN: Para viajeros espaciales", speakers: ["Kevin Jahaziel"], type: 'lightning', language: 'es' },
          { id: 'd1-a1-03', time_start: '12:00', time_end: '13:00', title: "El código que compraste vino de yapa", speakers: ["Juan Romero"], type: 'session', language: 'es' },
          { id: 'd1-a1-04', time_start: '14:45', time_end: '15:15', title: "Trampas en tu código: una buena mentira para tu aplicación", speakers: ["OWASP Village LATAM N/A", "Diego Staino"], type: 'session', language: 'es', village: "OWASP" },
          { id: 'd1-a1-05', time_start: '15:30', time_end: '16:15', title: "Dónde se rompe OAuth cuando el que llama es un agente", speakers: ["OWASP Village LATAM N/A", "Valentín Torassa Colombero"], type: 'session', language: 'es', village: "OWASP" },
          { id: 'd1-a1-06', time_start: '16:15', time_end: '17:00', title: "Humano vs agentes de IA: Wallhack en android", speakers: ["Erick Maldonado", "Simon Uzcategui"], type: 'lightning', language: 'es' },
          { id: 'd1-a1-07', time_start: '17:00', time_end: '18:00', title: "El ransomware no avisa: cómo detectarlo y detenerlo antes del impacto", speakers: ["Brayan Steven Rodriguez Peña"], type: 'session', language: 'es' },
        ],
      },
      {
        id: 'a2',
        name: "Sala A2",
        items: [
          { id: 'd1-a2-01', time_start: '09:45', time_end: '10:30', title: "Todo contacto deja rastro: Criminalística para leer un incidente", speakers: ["Cyberintel Village", "Diego Staino"], type: 'session', language: 'es' },
          { id: 'd1-a2-02', time_start: '10:30', time_end: '11:15', title: "Parecia un proyecto sencillo", speakers: ["Lucia Pinilla", "Patricio San Martin"], type: 'lightning', language: 'es', village: "Hardware Hacking Village" },
          { id: 'd1-a2-03', time_start: '11:15', time_end: '12:00', title: "Cómo iniciar en RF", speakers: ["Eduardo Contreras"], type: 'session', language: 'es', village: "Hardware Hacking Village" },
          { id: 'd1-a2-04', time_start: '12:00', time_end: '13:00', title: "¿Quién le dio permiso a ese agente? Seguridad de identidades en la era de la IA", speakers: ["Bryan Nascimento", "Claudio Neiva"], type: 'session', language: 'es' },
          { id: 'd1-a2-05', time_start: '14:00', time_end: '14:45', title: "Cuando la orquestación ataca: detección comportamental en flotas de agentes IA", speakers: ["Cloud Security Space", "Javier Díaz", "Juan David Alvarez Builes"], type: 'session', language: 'es', village: "Cloud Security" },
          { id: 'd1-a2-06', time_start: '14:45', time_end: '15:45', title: "Android Bug Hunting: Build Your Lab & Find Your First Vulnerabilities", speakers: [], type: 'workshop', language: 'en', village: "Bug Bounty Girls Club" },
          { id: 'd1-a2-07', time_start: '16:15', time_end: '17:00', title: "24 millones de dólares", speakers: ["Sergio Cabrera"], type: 'session', language: 'es' },
          { id: 'd1-a2-08', time_start: '17:00', time_end: '18:00', title: "Secuestro de Sesiones mediante QRjacking y Extracción Automatizada de Chats", speakers: ["OWASP Village LATAM N/A", "Cristhian Nina M."], type: 'session', language: 'es', village: "OWASP" },
        ],
      },
      {
        id: 'a3',
        name: "Sala A3",
        items: [
          { id: 'd1-a3-01', time_start: '09:45', time_end: '10:30', title: "El detrás de escena del Sysadmin: Migraciones seguras, deuda técnica y resiliencia en infra.", speakers: ["Martin Rojas"], type: 'session', language: 'es' },
          { id: 'd1-a3-02', time_start: '10:30', time_end: '11:15', title: "The Good, the Bad and the Ugly: código, modelos, skills y el duelo por la precisión analítica.", speakers: ["Martin Cruz"], type: 'session', language: 'es', village: "DevSecOps Space" },
          { id: 'd1-a3-03', time_start: '11:15', time_end: '12:00', title: "There is No Right Way Into Security", speakers: ["Jill Moné-Corallo"], type: 'session', language: 'en', village: "Bug Bounty Girls Club" },
          { id: 'd1-a3-04', time_start: '12:00', time_end: '13:00', title: "Workshop Wardriving 2026", speakers: ["Matias Baghdassarian"], type: 'workshop', language: 'es' },
          { id: 'd1-a3-05', time_start: '14:00', time_end: '14:45', title: "“n” Hacks contra la Ingeniería Social", speakers: ["Matias Choren Ruiz", "Candela Rabec", "Candela Castaldo"], type: 'session', language: 'es', village: "Social Engineering Village" },
          { id: 'd1-a3-06', time_start: '14:45', time_end: '15:30', title: "Mover plata en cripto sin doxxearte", speakers: ["WebtrES Village", "Daffy Hellman"], type: 'lightning', language: 'es', village: "WebtrES" },
          { id: 'd1-a3-07', time_start: '16:15', time_end: '17:00', title: "Estándares de seguridad para Entidades Financieras", speakers: ["Francesco Gentile"], type: 'workshop', language: 'es', village: "Andes Tech" },
        ],
      },
      {
        id: 'a4',
        name: "Sala A4",
        items: [
          { id: 'd1-a4-01', time_start: '09:45', time_end: '10:30', title: "El colapso del CVE", speakers: ["Darío Rivas Quero"], type: 'session', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-a4-02', time_start: '10:30', time_end: '11:15', title: "La era de la IA: Inteligencia Artesanal", speakers: ["Matias Choren Ruiz"], type: 'session', language: 'es', village: "Social Engineering Village" },
          { id: 'd1-a4-03', time_start: '11:30', time_end: '12:00', title: "Every Cloud Attack Leaves a Trace", speakers: ["Cloud Security Space"], type: 'session', language: 'es', village: "Cloud Security" },
          { id: 'd1-a4-04', time_start: '14:00', time_end: '14:45', title: "De los espines a los datos: software y hardware detrás de un experimento cuántico", speakers: ["Giannina Zerr", "Marcos Guillermo Lammers"], type: 'session', language: 'es' },
          { id: 'd1-a4-05', time_start: '14:45', time_end: '15:30', title: "Pretexto Vs. Pretexting En Servicios De Ingeniería Social", speakers: ["Matias Choren Ruiz", "Carlos Ugarte"], type: 'session', language: 'es', village: "Social Engineering Village" },
          { id: 'd1-a4-06', time_start: '15:30', time_end: '16:15', title: "La IA ya juega en los dos bandos: ¿de cuál estás vos?", speakers: [], type: 'session', language: 'es' },
          { id: 'd1-a4-07', time_start: '16:15', time_end: '17:00', title: "Panel sobre Docker e Ia | Hackademy", speakers: [], type: 'session', language: 'es' },
          { id: 'd1-a4-08', time_start: '17:00', time_end: '18:00', title: "Setpoint, lazo y PID: lo que tenés que saber antes de hablar con OT", speakers: ["Carlos Bronzini"], type: 'session', language: 'es', village: "Secure OT" },
        ],
      },
      {
        id: 'e',
        name: "Sala E",
        items: [
          { id: 'd1-e-01', time_start: '10:10', time_end: '10:55', title: "Entender, Usar, Hackear, Repetir: hunting con LLMs", speakers: ["Benjamín Muñoz"], type: 'session', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-02', time_start: '10:55', time_end: '11:15', title: "Mi primera Eko: de reparar equipos a reportar a la NASA", speakers: ["Franco Andino"], type: 'lightning', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-03', time_start: '11:15', time_end: '11:35', title: "Scaling Under the Hood - Innovative Ways to Scale High-Impact Insights", speakers: ["Alex Board"], type: 'lightning', language: 'en', village: "Bug Bounty Argentina" },
          { id: 'd1-e-04', time_start: '11:35', time_end: '12:20', title: "5 years in 45 minutes Breaking E-Commerce, one bug at a time.", speakers: ["Adrián Pedrazzoli"], type: 'session', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-05', time_start: '12:20', time_end: '13:00', title: "La ilusión de la severidad", speakers: ["Alexis Albert"], type: 'lightning', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-06', time_start: '13:40', time_end: '14:00', title: "Monkey Patching aplicado al reversing de aplicaciones web", speakers: ["Mariano Marino"], type: 'lightning', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-07', time_start: '14:00', time_end: '14:45', title: "Bug Bounty at AI Speed from Both Sides of The Counter", speakers: ["Andrés Riancho", "Alan Levy"], type: 'session', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-08', time_start: '14:45', time_end: '15:05', title: "Desarmo mi hackbot en 20 minutos", speakers: ["Federico Letoile"], type: 'lightning', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-09', time_start: '15:05', time_end: '15:50', title: "Human Creativity at Machine Scale: Enabling Trusted, High-Impact Bug Bounty Research in the AI Era", speakers: ["Samuel Cohen"], type: 'session', language: 'en', village: "Bug Bounty Argentina" },
          { id: 'd1-e-10', time_start: '15:50', time_end: '16:10', title: "Mi primer LHE de Meta: como lo viví, qué encontré, qué aprendí y qué haría distinto", speakers: ["Joaquin Arena"], type: 'lightning', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-11', time_start: '16:10', time_end: '16:55', title: "Bypassing CSP por un bounty", speakers: ["Santos Gallegos"], type: 'session', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd1-e-12', time_start: '16:55', time_end: '17:40', title: "DevPUBdency Confusion: Weaponizing the Flutter Supply Chain", speakers: ["Pwnii ."], type: 'session', language: 'en', village: "Bug Bounty Argentina" },
        ],
      },
      {
        id: 'sponsorstrack',
        name: "Sponsors Track",
        items: [
          { id: 'd1-sponsorstrack-01', time_start: '10:00', time_end: '10:30', title: "Mobile Security for the Agentic Age", speakers: ["Alexandre Bento"], type: 'session', language: 'es' },
          { id: 'd1-sponsorstrack-02', time_start: '10:30', time_end: '11:00', title: "Defensa en Profundidad para IA: Gobernanza, Guardrails y Red Team", speakers: ["Andrés García"], type: 'session', language: 'es' },
          { id: 'd1-sponsorstrack-03', time_start: '11:00', time_end: '11:40', title: "Casos reales de incidentes de seguridad recientes en aplicaciones móviles", speakers: ["Gerardo Pinar Loriente"], type: 'session', language: 'es' },
          { id: 'd1-sponsorstrack-04', time_start: '11:40', time_end: '12:10', title: "Agentes de IA: Las aspiradoras de credenciales", speakers: ["Enzo Gaggero"], type: 'session', language: 'es' },
          { id: 'd1-sponsorstrack-05', time_start: '14:30', time_end: '15:00', title: "La Nueva Era de la Conectividad - Adopción segura de la IA", speakers: ["Sergio Munoz"], type: 'session', language: 'es' },
          { id: 'd1-sponsorstrack-06', time_start: '15:15', time_end: '15:45', title: "Blindá tu agente y sus tools con Strands", speakers: ["Hazel Sáenz"], type: 'session', language: 'es' },
          { id: 'd1-sponsorstrack-07', time_start: '15:45', time_end: '16:30', title: "Offensive and Defensive AI Agents, Governed", speakers: ["Carolina De Seta", "Rodrigo Hormazabal Rebolledo", "Charles Mendoza", "Agustin Oscar Mendez"], type: 'session', language: 'es' },
          { id: 'd1-sponsorstrack-08', time_start: '16:30', time_end: '17:15', title: "Grupos APT en LATAM: de la inteligencia a la acción", speakers: ["Leonardo Grandos", "Mario Micucci"], type: 'session', language: 'es' },
          { id: 'd1-sponsorstrack-09', time_start: '17:15', time_end: '18:00', title: "BINARY GECKO - CTF Challenge Binary Gecko - Gecko Academy", speakers: ["Nicolas Economou", "German Riera", "Ricardo Narvaja", "Daniel (Solid) Kazimirow"], type: 'session', language: 'es' },
        ],
      },
      {
        id: 'hackthetalentzone',
        name: "Hack the Talent Zone",
        items: [
          { id: 'd1-hackthetalentzone-01', time_start: '11:00', time_end: '11:50', title: "Mujeres en ciberseguridad: Distintas miradas, un mismo presente", speakers: ["Elisa Elías", "Paula Villegas", "Alejandra Leuno", "Cybelle Oliveira"], type: 'session', language: 'es' },
          { id: 'd1-hackthetalentzone-02', time_start: '15:00', time_end: '15:50', title: "¿Todavía existe el junior en ciberseguridad?", speakers: ["Elisa Elías", "Marcelo Felman", "Juan Mamani"], type: 'session', language: 'es' },
          { id: 'd1-hackthetalentzone-03', time_start: '16:00', time_end: '16:50', title: "De 8 horas a 22 segundos: trabajar en un SOC cuando todo pasa a velocidad máquina", speakers: ["Daniel Dieser"], type: 'session', language: 'es' },
        ],
      },
    ],
  },
  {
    id: 'oct8',
    date: '2026-10-08',
    label_es: 'Jueves 8',
    label_en: 'Thursday 8',
    label_pt: 'Quinta 8',
    rooms: [
      {
        id: 'maintrack',
        name: "Maintrack",
        items: [
          { id: 'd2-maintrack-01', time_start: '10:00', time_end: '10:50', title: "Hacking in the age of AI after Mythos, Fable, Sol and Astra.", speakers: ["Chema Alonso"], type: 'session', language: 'es' },
          { id: 'd2-maintrack-02', time_start: '10:50', time_end: '11:40', title: "Patriot Bait: How One Man and an AI Agent Ran a Five-Year Influence Operation and a Six-Minute Botne", speakers: ["Lucas Silva"], type: 'session', language: 'en' },
          { id: 'd2-maintrack-03', time_start: '11:40', time_end: '12:10', title: "VU#226679: rompiendo contraseñas UEFI mediante WinRE", speakers: ["Beatriz Fresno Naumova"], type: 'lightning', language: 'es', village: "Red Team Space" },
          { id: 'd2-maintrack-04', time_start: '12:10', time_end: '13:00', title: "Reversing el DRM de Netflix: anatomía de Widevine L1 en Windows", speakers: ["Jeremy Erazo"], type: 'session', language: 'es' },
          { id: 'd2-maintrack-05', time_start: '14:40', time_end: '15:30', title: "Breaking the Warehouse: From Bluetooth Devices to Operational Control", speakers: ["Sergey Sidorov", "Haidar Kabibo"], type: 'session', language: 'en' },
          { id: 'd2-maintrack-06', time_start: '15:30', time_end: '16:20', title: "It's a me! DOOM! A Homebrew Entry Point for LEGO Super Mario", speakers: ["Kevin Aguilar (A.K.A. cabr4)"], type: 'session', language: 'en' },
          { id: 'd2-maintrack-07', time_start: '16:20', time_end: '17:10', title: "Hardware in the loop: reverseando el link de un headset de VR", speakers: ["Matias Sebastian Soler"], type: 'session', language: 'es' },
          { id: 'd2-maintrack-08', time_start: '17:10', time_end: '18:00', title: "Hacking the KIA Real Time Operative System", speakers: ["Danilo Erazo"], type: 'session', language: 'en' },
        ],
      },
      {
        id: 'd',
        name: "Sala D",
        items: [
          { id: 'd2-d-01', time_start: '09:45', time_end: '10:30', title: "Un enfoque End-to-End a la ciberseguridad OT", speakers: ["Daniel Manrique", "Hernan Bottinelli", "Oscar Romero"], type: 'session', language: 'es', village: "Secure OT" },
          { id: 'd2-d-02', time_start: '10:30', time_end: '11:15', title: "SOC industrial: detección basada en riesgo, investigación y threat hunting en entornos IT/OT", speakers: ["Omar Lozano"], type: 'session', language: 'es', village: "Secure OT" },
          { id: 'd2-d-03', time_start: '11:15', time_end: '12:00', title: "De bits al efecto físico: ciberataques OT en el contexto de los conflictos contemporáneos", speakers: ["Manrique Gonzales", "César Cicerchia"], type: 'session', language: 'es', village: "Secure OT" },
          { id: 'd2-d-04', time_start: '17:00', time_end: '18:00', title: "Intro to Lockpicking", speakers: ["Bill Graydon"], type: 'session', language: 'en', village: "Physical Security Village" },
        ],
      },
      {
        id: 'c1',
        name: "Sala C1",
        items: [
          { id: 'd2-c1-01', time_start: '09:00', time_end: '09:45', title: "Cartoneando La Red", speakers: ["Roberto Focke"], type: 'session', language: 'es', village: "Bug Bounty Argentina" },
          { id: 'd2-c1-02', time_start: '09:45', time_end: '10:30', title: "Hackeando las Herramientas del Agente: Pentesting de Servidores MCP en el Mundo Real", speakers: ["Luis Diego Raga"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd2-c1-03', time_start: '10:30', time_end: '11:15', title: "Creating your very own AI pentest agent", speakers: ["Gabriel Franco"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd2-c1-04', time_start: '11:15', time_end: '12:00', title: "Offensive Lessons from Threat Actors", speakers: ["Erivan Morales"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd2-c1-05', time_start: '12:00', time_end: '13:00', title: "De la vulnerabilidad al riesgo real: seis capacidades para gestionar la exposición.", speakers: ["Nahuel Giliberto"], type: 'lightning', language: 'es', village: "Red Team Space" },
          { id: 'd2-c1-06', time_start: '14:00', time_end: '14:45', title: "Weaponizing Printers: A Red Team Journey to Active Directory", speakers: ["José Navarro"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd2-c1-07', time_start: '14:45', time_end: '15:30', title: "When Cash Runs on Windows: A Red Team Look at ATM Attack Surfaces", speakers: ["Gerardo Mejia"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd2-c1-08', time_start: '15:30', time_end: '16:15', title: "Beyond SCADA/ICS: Chaining Exploits, Malware and C2 in Industrial Environments", speakers: ["Fernando Mengali"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd2-c1-09', time_start: '16:15', time_end: '17:00', title: "Explotando GitHub actions: de PR a RCE", speakers: ["Santos Gallegos"], type: 'session', language: 'es', village: "Red Team Space" },
          { id: 'd2-c1-10', time_start: '17:00', time_end: '17:30', title: "N-days Weaponizer with a Multi-Agent AI Pipeline", speakers: ["Andrea Brosio"], type: 'session', language: 'es', village: "AI Resilience Hub" },
        ],
      },
      {
        id: 'c2',
        name: "Sala C2",
        items: [
          { id: 'd2-c2-01', time_start: '09:00', time_end: '09:45', title: "Más allá del Prompt Injection: Pentesting de Model Context Protocol (MCP)", speakers: ["Elisa Elias"], type: 'session', language: 'es', village: "Bug Bounty Girls Club" },
          { id: 'd2-c2-02', time_start: '09:45', time_end: '10:30', title: "Retrieval Augmented Gaslight", speakers: ["OWASP Village LATAM N/A", "Sebastián Passaro"], type: 'session', language: 'es', village: "OWASP" },
          { id: 'd2-c2-03', time_start: '10:30', time_end: '11:15', title: "When Agents Trust Too Much: Breaking AI Agents and MCP", speakers: [], type: 'session', language: 'es', village: "AI Resilience Hub" },
          { id: 'd2-c2-04', time_start: '11:15', time_end: '12:00', title: "Zero Trust for AI Ops: Securing LLMs, RAG, and Agents", speakers: ["Emilio Oropeza"], type: 'session', language: 'es', village: "AI Resilience Hub" },
          { id: 'd2-c2-05', time_start: '12:00', time_end: '13:00', title: "EKONONOS: respect your root", speakers: ["Daniel Isler"], type: 'session', language: 'es', village: "Ekokids" },
          { id: 'd2-c2-06', time_start: '14:00', time_end: '14:45', title: "iOS Game Hacking: From Zero to God Mode", speakers: ["Luis De la Rosa", "Steeven Rodríguez"], type: 'session', language: 'es', village: "Mobile Hacking Space" },
          { id: 'd2-c2-07', time_start: '14:45', time_end: '15:30', title: "AI Driven Development", speakers: ["Axel Labruna"], type: 'session', language: 'es', village: "DevSecOps Space" },
          { id: 'd2-c2-08', time_start: '15:30', time_end: '16:20', title: "Del CBU a la DeFi: Anatomía de un fraude híbrido y su rastro on-chain", speakers: ["WebtrES Village", "Thalía Gaona Vazquez"], type: 'session', language: 'es', village: "WebtrES" },
          { id: 'd2-c2-09', time_start: '16:15', time_end: '17:00', title: "Gobierno del uso de IA en la Nube", speakers: ["Cloud Security Space"], type: 'session', language: 'es', village: "Cloud Security" },
        ],
      },
      {
        id: 'c3',
        name: "Sala C3",
        items: [
          { id: 'd2-c3-01', time_start: '09:00', time_end: '09:45', title: "From Adversary Profiling to Behavior-Based Detection in Living-off-the-Land Attacks", speakers: ["Levi Reza", "Leslie Romero"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd2-c3-02', time_start: '09:45', time_end: '10:30', title: "DarkCloud Around the World: From Pixels to Credentials", speakers: ["Isabel Manjarrez"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd2-c3-03', time_start: '10:30', time_end: '11:15', title: "One Does Not Simply Resolve an Incident", speakers: ["Santiago Abastante"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd2-c3-04', time_start: '11:15', time_end: '12:00', title: "MATCHBOIL bajo la lupa: Un caso de atribución basada en la comparación y análisis de código", speakers: ["Fernando Tavella"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd2-c3-05', time_start: '12:00', time_end: '13:00', title: "Un agente de IA para triage que aprendió a decir \"no sé\"", speakers: ["Matias Federico Manassero"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd2-c3-06', time_start: '14:00', time_end: '14:45', title: "¿Cuándo vence tu tarjeta de crédito?", speakers: ["Santiago Barclay"], type: 'lightning', language: 'es', village: "Quantum" },
          { id: 'd2-c3-07', time_start: '14:45', time_end: '15:30', title: "Escapando de una Restricted Shell a los golpes: MIPS, Syscalls y Kernel Panics", speakers: ["Matias Ramirez"], type: 'session', language: 'es', village: "Hardware Hacking Village" },
          { id: 'd2-c3-08', time_start: '15:30', time_end: '16:15', title: "Resultados de tesis - A7724 y su impacto en el ecosistema financiero", speakers: ["CyberFinance Village", "Facundo Lisotto"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd2-c3-09', time_start: '16:15', time_end: '17:00', title: "Trust Is The Attack Surface", speakers: ["Matias Choren Ruiz", "Fabiana Ramirez Cuenca"], type: 'session', language: 'es', village: "Social Engineering Village" },
          { id: 'd2-c3-10', time_start: '17:00', time_end: '18:00', title: "CRYPT - STEG DIA 2 - SALA \"C3\" Breaking ECC with Short", speakers: ["Agustin Isoldi", "German Bollmann"], type: 'session', language: 'es', village: "Crypt Steg" },
        ],
      },
      {
        id: 'a1',
        name: "Sala A1",
        items: [
          { id: 'd2-a1-01', time_start: '10:00', time_end: '11:30', title: "Panel 1: Informática Forense: Del Bit a la Evidencia Digital", speakers: ["A 1 bit De ir en Cana"], type: 'session', language: 'es' },
          { id: 'd2-a1-02', time_start: '11:30', time_end: '13:00', title: "Panel 2: Cyber Risk & Compliance: Del SOC al Directorio", speakers: ["A 1 bit De ir en Cana"], type: 'session', language: 'es' },
          { id: 'd2-a1-03', time_start: '14:00', time_end: '15:30', title: "Panel 3: Cibercrimen 2026: Tras los bits del delito", speakers: ["A 1 bit De ir en Cana"], type: 'session', language: 'es' },
          { id: 'd2-a1-04', time_start: '15:30', time_end: '16:55', title: "Panel 4: Hacking y reporte coordinado de vulnerabilidades", speakers: ["A 1 bit De ir en Cana"], type: 'session', language: 'es' },
          { id: 'd2-a1-05', time_start: '17:00', time_end: '18:00', title: "LeapFix: Análisis Estático para Codebases de SCADA y HMI", speakers: ["Fernando Mengali"], type: 'session', language: 'es', village: "DevSecOps Space" },
        ],
      },
      {
        id: 'a2',
        name: "Sala A2",
        items: [
          { id: 'd2-a2-01', time_start: '09:00', time_end: '09:45', title: "Plug and pray", speakers: ["Anthony De La Paz", "Patricio Moraga"], type: 'session', language: 'es', village: "A 1 BIT de ir en CANA" },
          { id: 'd2-a2-02', time_start: '11:15', time_end: '11:55', title: "Zero Knowledge, Zero Privacy: Cómo de-anonimizar a alguien sin saber matemáticas", speakers: ["WebtrES Village", "Juan Bengala"], type: 'session', language: 'es', village: "WebtrES" },
          { id: 'd2-a2-03', time_start: '12:00', time_end: '12:30', title: "Del Shadow AI a la IA gobernada: una demo técnica con Cloudflare", speakers: ["Antony Jair Flores Bolaños"], type: 'session', language: 'es' },
          { id: 'd2-a2-04', time_start: '14:00', time_end: '14:45', title: "Breaking In: The Human and Physical Attack Surface", speakers: ["Nora Guevara"], type: 'session', language: 'es', village: "Bug Bounty Girls Club" },
          { id: 'd2-a2-05', time_start: '16:15', time_end: '17:00', title: "De la Intercepción al Insight: Integrando IA, MCP y Burp Suite para el análisis de ataques ofensivo", speakers: ["Johan Robles Benites"], type: 'session', language: 'es', village: "AI Resilience Hub" },
          { id: 'd2-a2-06', time_start: '17:00', time_end: '18:00', title: "Impro4Hackers Vol. II", speakers: ["Matias Choren Ruiz"], type: 'workshop', language: 'es', village: "Social Engineering Village" },
        ],
      },
      {
        id: 'a3',
        name: "Sala A3",
        items: [
          { id: 'd2-a3-01', time_start: '09:45', time_end: '10:30', title: "Low & Slow: Enterprise Initial Access Tradecraft Against Entra ID — Attack, Detect, Defend", speakers: ["Cloud Security Space", "Edrian Miranda"], type: 'session', language: 'es', village: "Cloud Security" },
          { id: 'd2-a3-02', time_start: '10:30', time_end: '11:15', title: "Comprometieron una cuenta AWS. ¿Comprometieron toda la organización?", speakers: ["Cloud Security Space"], type: 'session', language: 'es', village: "Cloud Security" },
          { id: 'd2-a3-03', time_start: '12:00', time_end: '13:00', title: "The Prompt Was Never Yours - Ways To Attack Your Mobile LLM Gateway", speakers: ["Roy Cohen"], type: 'session', language: 'es' },
          { id: 'd2-a3-04', time_start: '14:00', time_end: '14:45', title: "De la señal al patrón: rastreo de RF con memoria a largo plazo", speakers: ["Elisa Elias"], type: 'session', language: 'es', village: "Hardware Hacking Village" },
          { id: 'd2-a3-05', time_start: '14:45', time_end: '15:30', title: "Bioterrorismo hacker “El futuro de la ciberinteligencia biosintetica", speakers: ["Cyberintel Village", "Jorge Martín Vila"], type: 'session', language: 'es' },
          { id: 'd2-a3-06', time_start: '16:15', time_end: '16:30', title: "Explora ISA: Innovación, Conocimiento y Networking para Profesionales de la Automatización", speakers: ["Federico Walas"], type: 'session', language: 'es', village: "Secure OT" },
          { id: 'd2-a3-07', time_start: '16:30', time_end: '17:10', title: "Series de Estándares ISA / IEC62443 Asegurando los Sistemas de Control y Automatización Industrial", speakers: ["Diego Romero"], type: 'session', language: 'es', village: "Secure OT" },
          { id: 'd2-a3-08', time_start: '17:10', time_end: '18:00', title: "Analizando CiberRiesgos Basados en ISA 62443-3-2", speakers: ["Juan Lucagnoli"], type: 'session', language: 'es', village: "Secure OT" },
        ],
      },
      {
        id: 'a4',
        name: "Sala A4",
        items: [
          { id: 'd2-a4-01', time_start: '09:00', time_end: '09:45', title: "El dato también necesita un perímetro", speakers: ["Brayan Steven Rodriguez"], type: 'session', language: 'es' },
          { id: 'd2-a4-02', time_start: '09:45', time_end: '11:00', title: "AI Pentesting desde la nube", speakers: ["Dario Goldfarb", "Omner Barajas", "Fabian Serrano"], type: 'session', language: 'es', village: "Cloud Security" },
          { id: 'd2-a4-03', time_start: '12:00', time_end: '13:00', title: "Talk to Firmware - Introducción a Ingeniería Inversa en Hardware con JTAG", speakers: ["Estefanny Villalta", "José Fabio Ruiz Morales"], type: 'session', language: 'es', village: "Hardware Hacking Village" },
          { id: 'd2-a4-04', time_start: '14:45', time_end: '15:30', title: "Intrusos en el ciberespionaje: hackeando la narrativa", speakers: ["Santiago Ingold"], type: 'lightning', language: 'es', village: "Blue Space" },
          { id: 'd2-a4-05', time_start: '16:15', time_end: '17:00', title: "EMBUDO DE CAPTACIÓN ONLINE El patrón oculto detrás del reclutamiento digital", speakers: ["Rodrigo Alvarez"], type: 'session', language: 'es' },
        ],
      },
      {
        id: 'e',
        name: "Sala E",
        items: [
          { id: 'd2-e-01', time_start: '09:00', time_end: '09:45', title: "La infraestructura del phishing financiero: cómo los atacantes construyen, operan y monetizan", speakers: ["CyberFinance Village", "Julian Drangosch"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd2-e-02', time_start: '09:45', time_end: '10:30', title: "Sin armas ni rencores - Encadenando vulnerabilidades en un homebanking", speakers: ["CyberFinance Village", "Diego Ritunnano"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd2-e-03', time_start: '10:30', time_end: '11:15', title: "El manual de Lazarus llega a Brasil: Mikedor y OfDor contra el ecosistema financiero latinoamericano", speakers: ["CyberFinance Village", "Fabio Marenghi"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd2-e-04', time_start: '11:15', time_end: '12:00', title: "Cuando el webhook llega dos veces: estados imposibles en flujos de pago", speakers: ["CyberFinance Village", "Valentín Torassa Colombero"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd2-e-05', time_start: '14:00', time_end: '14:45', title: "Securing the Sale: construyendo y atacando un ecosistema POS", speakers: ["CyberFinance Village", "Vadim Vorochilov"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd2-e-06', time_start: '14:45', time_end: '15:30', title: "¿Cuánto cuesta realmente un ciberataque? Modelando riesgo financiero con FAIR y Monte Carlo", speakers: ["CyberFinance Village", "Joaquin Galermes"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd2-e-07', time_start: '15:30', time_end: '16:15', title: "FUCK AI — ¿Quién está pensando realmente?", speakers: ["CyberFinance Village", "Braian Arroyo"], type: 'workshop', language: 'es', village: "Cyber Finance" },
          { id: 'd2-e-08', time_start: '16:15', time_end: '17:00', title: "Seguridad en la Nueva Cadena de Creación del software", speakers: ["CyberFinance Village", "Oscar Eduardo Rodríguez Arias"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd2-e-09', time_start: '17:00', time_end: '18:00', title: "The Old-School RoadMap (Argentina, USA, Europe)", speakers: ["Thonhy ."], type: 'session', language: 'es', village: "Hardware Hacking Village" },
        ],
      },
      {
        id: 'v1',
        name: "Sala V1",
        items: [
          { id: 'd2-v1-01', time_start: '09:30', time_end: '11:00', title: "GAME OVER: Get Ready for Q-Day", speakers: [], type: 'workshop', language: 'es' },
        ],
      },
      {
        id: 'sponsorstrack',
        name: "Sponsors Track",
        items: [
          { id: 'd2-sponsorstrack-01', time_start: '10:00', time_end: '10:30', title: "Zero Trust que realmente detiene el ransomware​", speakers: ["Manuel Ortega"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-02', time_start: '10:30', time_end: '11:15', title: "Bug bounty desde cero: cómo dar tus primeros pasos", speakers: ["Gerard Martínez Guillamon"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-03', time_start: '11:15', time_end: '11:45', title: "MPT por AI y la revolución hacía el testing continuo.", speakers: ["Joost De Jong"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-04', time_start: '11:45', time_end: '12:15', title: "De los datos a la inteligencia: transformando la seguridad de endpoints con IA y analítica", speakers: ["Laura Parra"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-05', time_start: '12:15', time_end: '12:45', title: "Fraude en tiempos de IA", speakers: ["Carolina Lorenzo", "Daiana Skibicki"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-06', time_start: '14:15', time_end: '15:00', title: "Scanning GitHub Actions Workflows at Scale", speakers: ["Nahuel D. Sánchez"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-07', time_start: '15:00', time_end: '15:45', title: "Agents' Chaos: Cómo navegar el mar de vulnerabilidades y entregar un pentest de calidad", speakers: ["Francisco Garay"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-08', time_start: '16:00', time_end: '16:30', title: "Agentic AI y API: el punto ciego de las organizaciones", speakers: ["Martin Pablo Fuentes"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-09', time_start: '16:30', time_end: '17:00', title: "Tu codigo compila y pasa los tests. ¿Lo mandarías a producción?", speakers: ["Alejandro Menocal"], type: 'session', language: 'es' },
          { id: 'd2-sponsorstrack-10', time_start: '17:00', time_end: '17:30', title: "Black Box Risk, White Box Decisions.", speakers: ["Jorge Litvin"], type: 'session', language: 'es' },
        ],
      },
      {
        id: 'hackthetalentzone',
        name: "Hack the Talent Zone",
        items: [
          { id: 'd2-hackthetalentzone-01', time_start: '10:30', time_end: '11:15', title: "Cuando la voz que escuchás ya no es de quien dice ser", speakers: ["Cybelle Oliveira"], type: 'session', language: 'es' },
          { id: 'd2-hackthetalentzone-02', time_start: '11:15', time_end: '12:05', title: "No necesitás parecerte al hacker que imaginabas", speakers: ["Julieta Balcaza", "Loritza Grillasca", "Elisa Elías"], type: 'session', language: 'es' },
          { id: 'd2-hackthetalentzone-03', time_start: '12:00', time_end: '13:00', title: "IA para hackers: ¿qué cambió de verdad en nuestro trabajo?", speakers: ["Gabriel Franco"], type: 'session', language: 'es' },
          { id: 'd2-hackthetalentzone-04', time_start: '14:00', time_end: '14:50', title: "El hacker también crea", speakers: ["Flor Vilardel", "Gala Cacchione", "Felipe Alves", "Dan Borgogno"], type: 'session', language: 'es' },
          { id: 'd2-hackthetalentzone-05', time_start: '15:00', time_end: '15:50', title: "El ataque sin malware: ¿qué investigás cuando no hay un archivo malicioso?", speakers: ["Isabel Manjarrez", "Ashley Hiram Muñoz"], type: 'session', language: 'es' },
          { id: 'd2-hackthetalentzone-06', time_start: '16:00', time_end: '16:50', title: "Lack of Burnout Protection: Pensar como atacante para anticipar, detectar y recuperar el control", speakers: ["Juan Franco Picasso"], type: 'session', language: 'es' },
        ],
      },
    ],
  },
  {
    id: 'oct9',
    date: '2026-10-09',
    label_es: 'Viernes 9',
    label_en: 'Friday 9',
    label_pt: 'Sexta 9',
    rooms: [
      {
        id: 'maintrack',
        name: "Maintrack",
        items: [
          { id: 'd3-maintrack-01', time_start: '09:00', time_end: '09:50', title: "Un Palantir para gobernarlos a todos", speakers: ["Valentina Costa Gazcón"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd3-maintrack-02', time_start: '09:50', time_end: '10:20', title: "Contactless Under Attack: PIN Bypass, EMV and Apple Pay", speakers: ["Davi (Penegui) Mikael"], type: 'lightning', language: 'es' },
          { id: 'd3-maintrack-03', time_start: '10:20', time_end: '11:10', title: "Living Off Trusted Cloud: Provider Infrastructure as Phishing Delivery Channel", speakers: ["Rahul Vashisht"], type: 'session', language: 'en', village: "Social Engineering Village" },
          { id: 'd3-maintrack-04', time_start: '11:10', time_end: '12:00', title: "PleaseFix: Cómo navegadores con agentes de IA están deshaciendo décadas de ingeniería de seguridad", speakers: ["Inbar Raz"], type: 'session', language: 'es' },
          { id: 'd3-maintrack-05', time_start: '12:00', time_end: '12:50', title: "A Practical Approach to Post-Quantum Readiness at Scale!", speakers: ["Sheila Berta"], type: 'session', language: 'es' },
          { id: 'd3-maintrack-06', time_start: '12:50', time_end: '13:20', title: "HTTP2Crash and the Cicada Problem", speakers: ["Houston Hunt"], type: 'lightning', language: 'en' },
          { id: 'd3-maintrack-07', time_start: '14:40', time_end: '15:30', title: "The Glass Perimeter - Systematic Bypasses in Biometric Frameworks and the Rise of Synthetic Identity", speakers: ["Dan Borgogno", "Javier Bernardo"], type: 'session', language: 'es', village: "Mobile Hacking Space" },
          { id: 'd3-maintrack-08', time_start: '15:30', time_end: '16:20', title: "Root From Kilometers Away: Ubiquiti AirMax RCE", speakers: ["Gaston Aznarez", "Federico Kirschbaum"], type: 'session', language: 'es', village: "Hardware Hacking Village" },
        ],
      },
      {
        id: 'd',
        name: "Sala D",
        items: [
          { id: 'd3-d-01', time_start: '09:00', time_end: '09:45', title: "Logs Under Fire", speakers: ["Valentin Torassa Colombero"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd3-d-02', time_start: '09:45', time_end: '10:30', title: "La República Semántica Hacia una teoría tecnorrepublicana del Estado: ontología, soberanía y poder", speakers: ["Valentina Costa Gazcón"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd3-d-03', time_start: '10:30', time_end: '11:15', title: "Loading ClickFix.exe: please paste to continue", speakers: ["Maria Sol Gonzalez"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd3-d-04', time_start: '11:15', time_end: '12:00', title: "No Seat, No Shield: Gobernanza de Internet y la Infancia Olvidada", speakers: ["Florencia Vilardel"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd3-d-05', time_start: '12:00', time_end: '13:00', title: "La Nueva Ciberguerra No Lineal: De la Defensa Perimetral a la Inteligencia de Comportamiento", speakers: ["Mario Lobo Romero"], type: 'session', language: 'es', village: "Blue Space" },
          { id: 'd3-d-06', time_start: '14:00', time_end: '14:45', title: "XSS Weaponization: Advanced Techniques for Browser Exploitation on Red Team Operation", speakers: ["OWASP Village LATAM N/A", "Jessica Rampin"], type: 'session', language: 'es', village: "OWASP" },
          { id: 'd3-d-07', time_start: '14:45', time_end: '15:30', title: "Firmware Analysis 101: Lo que debes saber antes y después de abrir un binario", speakers: ["Mario Sebastián Micucci"], type: 'session', language: 'es', village: "Hardware Hacking Village" },
        ],
      },
      {
        id: 'c1',
        name: "Sala C1",
        items: [
          { id: 'd3-c1-01', time_start: '09:00', time_end: '09:45', title: "Ethereum: el futuro que estamos construyendo juntos", speakers: ["WebtrES Village", "Lengo S"], type: 'session', language: 'es', village: "WebtrES" },
          { id: 'd3-c1-02', time_start: '10:30', time_end: '11:15', title: "Rediseñando la seguridad: IA y la nueva frontera del fraude bancario", speakers: ["CyberFinance Village"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd3-c1-03', time_start: '11:15', time_end: '12:00', title: "Brainsomware | CVE-0000-HUM4N La vulnerabilidad cyber original. Sin parche disponible", speakers: ["CyberFinance Village", "Hernan Parada"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd3-c1-04', time_start: '12:00', time_end: '13:00', title: "Manual de CTI: dato, TTPs y atribución de una APT", speakers: ["CyberFinance Village", "Carlos Olguin"], type: 'session', language: 'es', village: "Cyber Finance" },
          { id: 'd3-c1-05', time_start: '14:00', time_end: '14:45', title: "Atacados por nuestro propio trabajo", speakers: ["Matias Choren Ruiz", "Neda Bertetti"], type: 'session', language: 'es', village: "Social Engineering Village" },
          { id: 'd3-c1-06', time_start: '14:45', time_end: '15:30', title: "Cazar con inteligencia — CTI como motor del Threat Hunting", speakers: ["Cyberintel Village"], type: 'session', language: 'es' },
          { id: 'd3-c1-07', time_start: '15:30', time_end: '16:15', title: "De los datos a la acción: argOS Ciberinteligencia v3 (y spoileamos argOS CIBERDEFENSA upss)", speakers: ["Cyberintel Village", "Emanuel DAmico"], type: 'session', language: 'es' },
        ],
      },
      {
        id: 'c2',
        name: "Sala C2",
        items: [
          { id: 'd3-c2-01', time_start: '09:00', time_end: '09:45', title: "Código roto, plata viva: de las buenas prácticas OWASP a la trazabilidad forense on-chain", speakers: ["OWASP Village LATAM N/A"], type: 'session', language: 'es', village: "OWASP" },
          { id: 'd3-c2-02', time_start: '09:45', time_end: '10:30', title: "A fondo con IA: DevSecOps en el Gran Premio del AI-SDLC", speakers: ["Matias Ferreira"], type: 'session', language: 'es', village: "DevSecOps Space" },
          { id: 'd3-c2-03', time_start: '10:30', time_end: '11:15', title: "Agentes Ofensivos(Hackbots)", speakers: ["Camila Casas"], type: 'session', language: 'es', village: "Bug Bounty Girls Club" },
          { id: 'd3-c2-04', time_start: '11:15', time_end: '12:00', title: "Call of Control: From Phone Call to Scooter Takeover", speakers: ["Omkar Mali"], type: 'lightning', language: 'en' },
          { id: 'd3-c2-05', time_start: '12:00', time_end: '13:00', title: "IA Ofensiva, Agentes Autónomos y Amenazas Emergentes en Entornos OT", speakers: ["Omar Lozano"], type: 'session', language: 'es', village: "Secure OT" },
          { id: 'd3-c2-06', time_start: '14:00', time_end: '14:45', title: "Dónde nos equivocamos en el prompt injection", speakers: ["Matias Armándola"], type: 'session', language: 'es', village: "AI Resilience Hub" },
          { id: 'd3-c2-07', time_start: '14:45', time_end: '15:30', title: "Explotando la lógica de Active Directory: Una revisión de CVEs críticos", speakers: ["Erick Maldonado", "Hugo Rodrigo Rivas Galindo"], type: 'lightning', language: 'es' },
          { id: 'd3-c2-08', time_start: '15:30', time_end: '16:15', title: "Inside the Hardware: Introducción en CTFs", speakers: ["Erick Maldonado", "Paola Gerig"], type: 'lightning', language: 'es' },
        ],
      },
      {
        id: 'c3',
        name: "Sala C3",
        items: [
          { id: 'd3-c3-01', time_start: '09:45', time_end: '10:30', title: "CRYPT - STEG DIA 3 - SALA \"C3\" Aplicando CRYSTALS-Dilithium o FIPS 204 (ML-DSA)", speakers: ["German Bollmann"], type: 'session', language: 'es', village: "Crypt Steg" },
          { id: 'd3-c3-02', time_start: '10:30', time_end: '11:15', title: "Root sin huellas: la carrera armamentista del rooteo en Android hasta llegar al fraude de identidad", speakers: ["Jaime Ramírez"], type: 'session', language: 'es', village: "Mobile Hacking Space" },
          { id: 'd3-c3-03', time_start: '11:15', time_end: '12:00', title: "Impactos de la computación cuántica en la optimización de portafolios", speakers: ["Javier Garcia Fronti"], type: 'session', language: 'es', village: "Quantum" },
          { id: 'd3-c3-04', time_start: '14:00', time_end: '14:45', title: "A una identidad del compromiso total", speakers: ["Cloud Security Space", "Sergio Santiago Matavos Galan"], type: 'session', language: 'es', village: "Cloud Security" },
          { id: 'd3-c3-05', time_start: '14:45', time_end: '15:30', title: "Bypass 102", speakers: ["Karen Ng"], type: 'session', language: 'en', village: "Physical Security Village" },
          { id: 'd3-c3-06', time_start: '16:15', time_end: '17:00', title: "Voltage Glitching in Automotive Microcontrollers", speakers: ["Danilo Erazo"], type: 'session', language: 'en', village: "Car Hacking Village" },
        ],
      },
      {
        id: 'a1',
        name: "Sala A1",
        items: [
          { id: 'd3-a1-01', time_start: '09:00', time_end: '09:45', title: "Runtime es la Nueva Verdad: Visibilidad y Control para Agentes de IA", speakers: ["Miguel De Los Santos"], type: 'session', language: 'es' },
          { id: 'd3-a1-02', time_start: '09:45', time_end: '10:30', title: "Cómo protegerse del uso adversario de LLMs", speakers: ["Dario Goldbarb", "Fabian Serrano"], type: 'session', language: 'es' },
          { id: 'd3-a1-03', time_start: '10:30', time_end: '11:15', title: "35 minutos en una computadora cuántica y tres meses solo, buscando.", speakers: ["Horacio Caceres"], type: 'session', language: 'es', village: "Quantum" },
          { id: 'd3-a1-04', time_start: '11:15', time_end: '12:00', title: "Estafas virtuales: ingenio sin fin", speakers: ["Matias Choren Ruiz"], type: 'session', language: 'es', village: "Social Engineering Village" },
          { id: 'd3-a1-05', time_start: '12:00', time_end: '13:00', title: "Anunciados para Estafar: La Industria del Malvertising que Nadie Detiene", speakers: ["Matias Choren Ruiz", "Leonardo Chiodin"], type: 'session', language: 'es', village: "Social Engineering Village" },
          { id: 'd3-a1-06', time_start: '14:00', time_end: '14:50', title: "Escondiendose en un libro abierto", speakers: ["WebtrES Village", "Moebius 0x"], type: 'lightning', language: 'es', village: "WebtrES" },
          { id: 'd3-a1-07', time_start: '14:45', time_end: '15:30', title: "Lo interesante de la computación cuantica", speakers: ["Julio Cella"], type: 'session', language: 'es', village: "Quantum" },
        ],
      },
      {
        id: 'a2',
        name: "Sala A2",
        items: [
          { id: 'd3-a2-01', time_start: '09:00', time_end: '09:45', title: "El prompt que nunca escribiste", speakers: ["Oscar Sierra"], type: 'session', language: 'es' },
          { id: 'd3-a2-02', time_start: '09:45', time_end: '10:30', title: "Hacking con IA: proceso y resultados.", speakers: ["Cristian Fernández Cornejo"], type: 'lightning', language: 'es' },
          { id: 'd3-a2-03', time_start: '14:45', time_end: '15:30', title: "Criptografía: Desde la Escítala a la Era Post Cuántica | Hackademy", speakers: [], type: 'workshop', language: 'es' },
          { id: 'd3-a2-04', time_start: '15:30', time_end: '16:15', title: "Desarrollo agéntico seguro: protege las apps que construyes con IA", speakers: ["Javier Sanchez Navarro"], type: 'session', language: 'es' },
        ],
      },
      {
        id: 'a3',
        name: "Sala A3",
        items: [
          { id: 'd3-a3-01', time_start: '09:00', time_end: '09:45', title: "Cazando Fantasmas en Entra ID: Neutralizando el Phishing AiTM y el Abuso de Tokens", speakers: ["Cloud Security Space", "Carlos Solís Salazar"], type: 'session', language: 'es', village: "Cloud Security" },
          { id: 'd3-a3-02', time_start: '10:30', time_end: '11:15', title: "GitOps: cuando la fuente de verdad también es el riesgo", speakers: ["Valentín Torassa Colombero"], type: 'session', language: 'es', village: "DevSecOps Space" },
          { id: 'd3-a3-03', time_start: '11:15', time_end: '12:00', title: "Protegiendo tus repositorios de GitHub a escala con Terraform", speakers: ["Missael Cortes"], type: 'session', language: 'es', village: "DevSecOps Space" },
          { id: 'd3-a3-04', time_start: '14:00', time_end: '14:45', title: "Prompt, Play, Learn: Cómo la IA revoluciona el juego en la educación", speakers: [], type: 'session', language: 'es', village: "AI Resilience Hub" },
          { id: 'd3-a3-05', time_start: '14:45', time_end: '15:30', title: "Threat Modeling con OWASP: tu app es insegura y te lo explico con dibujitos", speakers: ["OWASP Village LATAM N/A", "Axel Labruna", "Matias Armándola"], type: 'session', language: 'es', village: "OWASP" },
          { id: 'd3-a3-06', time_start: '15:30', time_end: '16:15', title: "Normas IRAM de Seguridad Funcional y de Ciberseguridad (series IRAM-IEC 61511 e IRAM-IEC 62443)", speakers: ["Gustavo Capo", "Cristian Caldeiro", "Guillermo Ranucci"], type: 'session', language: 'es', village: "Secure OT" },
        ],
      },
      {
        id: 'a4',
        name: "Sala A4",
        items: [
          { id: 'd3-a4-01', time_start: '09:00', time_end: '12:00', title: "Arquitectura y despliegue de estaciones base de telefonía móvil", speakers: ["Federico Barbero"], type: 'workshop', language: 'es', village: "Hardware Hacking Village" },
          { id: 'd3-a4-02', time_start: '12:00', time_end: '13:00', title: "LLM Red Teaming", speakers: ["Jean Paul Granados"], type: 'workshop', language: 'es', village: "Red Team Space" },
          { id: 'd3-a4-03', time_start: '14:00', time_end: '14:45', title: "¿Tu awareness no vale? Cuantificación del Riesgo Humano - Metodología FAIR", speakers: ["Joaquín Galermes"], type: 'lightning', language: 'es' },
        ],
      },
      {
        id: 'e',
        name: "Sala E",
        items: [
          { id: 'd3-e-01', time_start: '09:00', time_end: '09:30', title: "Prototipado Manhattan", speakers: ["Teno Ioti"], type: 'session', language: 'es', village: "Peer2Peer" },
          { id: 'd3-e-02', time_start: '09:30', time_end: '10:00', title: "Hacia un iPhone del Software Libre", speakers: ["Val Packett"], type: 'session', language: 'es', village: "Peer2Peer" },
          { id: 'd3-e-03', time_start: '10:00', time_end: '10:30', title: "Partido Intermimensional Pirata: Aaron Swartz, la IA y la Grog & Tor", speakers: [], type: 'session', language: 'es', village: "Peer2Peer" },
          { id: 'd3-e-04', time_start: '11:00', time_end: '12:15', title: "Entrega de diplomas de Hackademy", speakers: [], type: 'lightning', language: 'es' },
          { id: 'd3-e-05', time_start: '12:15', time_end: '13:00', title: "Perspectivas tecnológicas descentralizadas", speakers: ["Micaela Pèrez"], type: 'session', language: 'es', village: "Peer2Peer" },
          { id: 'd3-e-06', time_start: '14:00', time_end: '14:30', title: "¿Qué es Flashparty? historia y actualidad de la demoscene latinoamericana", speakers: ["Uctumi Uctumi"], type: 'session', language: 'es', village: "Peer2Peer" },
          { id: 'd3-e-07', time_start: '14:30', time_end: '15:00', title: "The Vault BBS: La terminal como galería de arte", speakers: ["Alejandro Filimonchuk"], type: 'session', language: 'es', village: "Peer2Peer" },
        ],
      },
      {
        id: 'sponsorstrack',
        name: "Sponsors Track",
        items: [
          { id: 'd3-sponsorstrack-01', time_start: '10:00', time_end: '10:30', title: "\"De ejercicios aislados a ofensiva continua con Nubax Red Team as a Service\"", speakers: ["Camila Ocampo", "Facundo Lestard"], type: 'session', language: 'es' },
          { id: 'd3-sponsorstrack-02', time_start: '10:30', time_end: '11:15', title: "El Efecto Mythos: Cómo Reducir el Ruido y Priorizar lo Que Realmente Importa", speakers: ["Miguel De Los Santos"], type: 'session', language: 'es' },
          { id: 'd3-sponsorstrack-03', time_start: '11:15', time_end: '11:45', title: "Como Integrar (IN) Seguramente IA en tu negocio", speakers: ["Carlos Castro", "Felipe Barbosa", "Cristian Pachares", "Joaquin Lanfranconi"], type: 'session', language: 'es' },
          { id: 'd3-sponsorstrack-04', time_start: '11:45', time_end: '12:15', title: "El nuevo ROI de la ciberseguridad: ¿cuánto cuesta llegar tarde?", speakers: ["Nicolas Grinberg"], type: 'session', language: 'es' },
          { id: 'd3-sponsorstrack-05', time_start: '12:15', time_end: '12:45', title: "\"Tu Pentest Llega Tarde\"", speakers: ["Marcos Carabajal"], type: 'session', language: 'es' },
          { id: 'd3-sponsorstrack-06', time_start: '14:30', time_end: '15:00', title: "El Arte de Pensar con IA: Entre la Automatización y la Responsabilidad", speakers: ["Gabriel Latorre"], type: 'session', language: 'es' },
          { id: 'd3-sponsorstrack-07', time_start: '15:00', time_end: '15:30', title: "Seis meses después de la Vulnerability Storm: lo que cambió para un CISO y lo que viene", speakers: ["Esteban Gabriel"], type: 'session', language: 'es' },
        ],
      },
      {
        id: 'hackthetalentzone',
        name: "Hack the Talent Zone",
        items: [
          { id: 'd3-hackthetalentzone-01', time_start: '10:30', time_end: '11:20', title: "Quién quiere ser CISO? Lo que cambia cuando dejás de resolver problemas y empezás a decidir riesgos", speakers: ["Maria Jose Ternavasio", "Betiana Gomez", "Cecilia Roa", "Mariana Segulín"], type: 'session', language: 'es' },
          { id: 'd3-hackthetalentzone-02', time_start: '12:00', time_end: '12:50', title: "Trabajando como Car Hacker", speakers: ["Danilo Erazo"], type: 'session', language: 'es' },
          { id: 'd3-hackthetalentzone-03', time_start: '14:00', time_end: '14:50', title: "Sin Sistema, Sin Excusas: Resistencia, Resiliencia y Comunidad Descripción", speakers: ["Loritza Grillasca"], type: 'session', language: 'es' },
          { id: 'd3-hackthetalentzone-04', time_start: '15:00', time_end: '15:50', title: "Si hoy tuviera que empezar de cero", speakers: ["Daniel Isler", "Juan Martínez Blanco"], type: 'session', language: 'es' },
        ],
      },
    ],
  },
]
