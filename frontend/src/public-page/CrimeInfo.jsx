import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// ── data ──────────────────────────────────────────────────────────────────────
const crimeTypes = [
  {
    icon: '🎣',
    name: 'Phishing Attacks',
    desc: 'Fake emails or messages pretending to be banks, companies, or government bodies to steal your credentials.',
    how: 'Attacker sends a fake email with an urgent message and a link to a fake website that looks real.',
    warnings: ['Urgent tone — "Your account will be blocked!"', 'Unknown or misspelled links', 'Fake sender email addresses', 'Asks for OTP or password'],
    color: 'red',
  },
  {
    icon: '🪪',
    name: 'Identity Theft',
    desc: 'Someone steals your personal information (Aadhar, PAN, name) to commit fraud or open accounts in your name.',
    how: 'Obtained through data leaks, phishing, or stealing physical documents.',
    warnings: ['Unknown transactions in your name', 'Accounts opened without your knowledge', 'Credit score drops unexpectedly'],
    color: 'orange',
  },
  {
    icon: '🏦',
    name: 'Online Banking Fraud',
    desc: 'Fake banking apps, UPI scams, and OTP tricks used to drain your bank account.',
    how: 'Fraudster calls pretending to be a bank officer and asks you to share OTP or install a screen-sharing app.',
    warnings: ['Anyone asking for OTP over call', 'Screen-sharing requests', 'Fake KYC update links'],
    color: 'yellow',
  },
  {
    icon: '📱',
    name: 'Social Media Hacking',
    desc: 'Accounts hacked using weak passwords, phishing links, or SIM swapping.',
    how: 'Attacker tricks you into clicking a fake login page or resets your account via your phone number.',
    warnings: ['Login alerts from unknown devices', 'Unknown posts or messages sent from your account', 'Friends receiving strange links from you'],
    color: 'violet',
  },
  {
    icon: '🦠',
    name: 'Malware & Virus Attacks',
    desc: 'Malicious software secretly installed on your device to steal data or hold files for ransom.',
    how: 'Downloaded via unknown links, fake apps, or email attachments.',
    warnings: ['System becomes unusually slow', 'Unknown apps installed automatically', 'Files get encrypted or locked'],
    color: 'fuchsia',
  },
  {
    icon: '💸',
    name: 'Online Job / Investment Scams',
    desc: 'Fake job offers or investment schemes that promise high returns to steal money.',
    how: 'Victims are asked to pay a "registration fee" or invest money, then the fraudster disappears.',
    warnings: ['Too-good-to-be-true returns', 'Asking for upfront payment', 'No verifiable company details'],
    color: 'sky',
  },
]

const colorMap = {
  red:    { card: 'border-red-500/20 hover:border-red-500/40',     icon: 'bg-red-500/10 text-red-400',    strip: 'from-red-500',    badge: 'bg-red-500/10 text-red-400 border-red-500/20'    },
  orange: { card: 'border-orange-500/20 hover:border-orange-500/40', icon: 'bg-orange-500/10 text-orange-400', strip: 'from-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  yellow: { card: 'border-yellow-500/20 hover:border-yellow-500/40', icon: 'bg-yellow-500/10 text-yellow-400', strip: 'from-yellow-500', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  violet: { card: 'border-violet-500/20 hover:border-violet-500/40', icon: 'bg-violet-500/10 text-violet-400', strip: 'from-violet-500', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  fuchsia:{ card: 'border-fuchsia-500/20 hover:border-fuchsia-500/40', icon: 'bg-fuchsia-500/10 text-fuchsia-400', strip: 'from-fuchsia-500', badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' },
  sky:    { card: 'border-sky-500/20 hover:border-sky-500/40',     icon: 'bg-sky-500/10 text-sky-400',    strip: 'from-sky-500',    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20'    },
}

const attackSteps = [
  { step: '01', title: 'Bait is Set',       desc: 'Attacker crafts a fake message, email, or link designed to look legitimate.',  icon: '🎯' },
  { step: '02', title: 'User Clicks',        desc: 'Victim clicks the link or downloads an attachment without verifying.',           icon: '👆' },
  { step: '03', title: 'Data is Captured',   desc: 'Personal info, passwords, or OTPs are entered on a fake site or captured by malware.', icon: '📡' },
  { step: '04', title: 'Fraud is Committed', desc: 'Stolen data is used for financial fraud, identity theft, or account takeover.',  icon: '💀' },
]

const preventionGroups = [
  {
    icon: '🔐',
    title: 'General Safety',
    color: 'green',
    tips: ['Never share OTP or passwords with anyone', 'Use strong, unique passwords for every account', 'Enable 2-factor authentication everywhere', 'Log out from shared or public devices'],
  },
  {
    icon: '🌐',
    title: 'Online Safety',
    color: 'sky',
    tips: ['Check the URL before clicking any link', 'Avoid downloading from unknown sources', 'Use trusted, verified websites only', 'Look for HTTPS in website addresses'],
  },
  {
    icon: '📱',
    title: 'Mobile Safety',
    color: 'violet',
    tips: ['Install apps only from official stores', "Don't grant unnecessary app permissions", 'Keep your OS and apps updated', 'Avoid using public Wi-Fi for banking'],
  },
  {
    icon: '💳',
    title: 'Financial Safety',
    color: 'yellow',
    tips: ['Never share bank details over call or chat', 'Verify UPI requests before paying', 'Regularly check your bank statements', 'Report unknown transactions immediately'],
  },
]

const victimSteps = [
  { icon: '📢', title: 'Report Immediately',  desc: 'Report on the platform where the fraud happened (bank, social media, app).' },
  { icon: '🏦', title: 'Contact Your Bank',    desc: 'Call your bank helpline to freeze transactions if financial fraud occurred.' },
  { icon: '🔑', title: 'Change Passwords',     desc: 'Change passwords of all affected and related accounts immediately.' },
  { icon: '📸', title: 'Save Evidence',         desc: 'Screenshot all messages, links, and transaction details for your report.' },
  { icon: '🚨', title: 'File a Complaint',      desc: 'Report on cybercrime.gov.in or your nearest police cyber cell.' },
]

const faqs = [
  { q: 'What is phishing?',                          a: 'Phishing is when attackers send fake messages pretending to be trustworthy sources to steal your personal data like passwords or OTPs.' },
  { q: 'Can police track cyber criminals?',           a: 'Yes, cyber cells can trace IPs, devices, and transactions. Always report with evidence — it significantly helps the investigation.' },
  { q: 'What if I clicked a fake link?',              a: 'Disconnect from the internet, change your passwords immediately, scan your device for malware, and report the incident.' },
  { q: 'Is UPI safe to use?',                        a: 'UPI is safe when used correctly. Never share your UPI PIN, and verify the receiver before sending money.' },
  { q: 'How do I know if my phone has malware?',     a: 'Signs include sudden slowness, unknown apps, unusual data usage, or battery drain. Run a trusted antivirus scan.' },
]

const recentScams = [
  { tag: '⚠️ Alert', title: 'Fake KYC Update Calls',        desc: 'Fraudsters call posing as bank officers asking for KYC updates via link.' },
  { tag: '⚠️ Alert', title: 'Part-Time Job WhatsApp Scam',  desc: 'Fake job offers asking you to "like YouTube videos" for money — then steal your deposit.' },
  { tag: '⚠️ Alert', title: 'Digital Arrest Scam',          desc: 'Callers pose as CBI/police and threaten "digital arrest" to extort money.' },
]

// ── sub-components ────────────────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, highlight, subtitle }) => (
  <div className="mb-8">
    <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-red-400 mb-2">{eyebrow}</p>
    <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
      {title}{' '}
      <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">{highlight}</span>
    </h2>
    {subtitle && <p className="text-slate-500 text-sm mt-2 max-w-xl">{subtitle}</p>}
    <div className="h-0.5 w-10 mt-3 rounded-full bg-gradient-to-r from-red-500 to-transparent" />
  </div>
)

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-slate-900/80 border border-white/7 rounded-xl overflow-hidden transition-all">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
        <span className="text-slate-200 text-sm font-medium">{q}</span>
        <span className={`text-slate-400 text-lg transition-transform duration-200 flex-shrink-0 ml-4 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-white/5">
          <p className="text-slate-400 text-sm leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────
const CrimeInfo = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-20 flex flex-col items-center text-center">
        {/* background glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400 mb-4">// Cyber Awareness</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-2xl">
          Stay Safe from{' '}
          <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">
            Cyber Crime
          </span>
        </h1>
        <p className="text-slate-400 text-base max-w-xl mb-10">
          Learn how cyber attacks happen and how to protect yourself — not just theory, real-world awareness.
        </p>

        {/* stat pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { icon: '📈', text: 'Cybercrime increasing every year' },
            { icon: '🧠', text: 'Most attacks exploit lack of awareness' },
            { icon: '💰', text: 'Billions lost to online fraud annually' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-full px-4 py-2">
              <span>{icon}</span>
              <span className="text-slate-300 text-xs font-medium">{text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/home/crime-submit"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 shadow-lg shadow-red-500/20 transition-all">
            🚨 Report a Crime
          </Link>
          <a href="#prevention"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            🔐 Prevention Tips
          </a>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 flex flex-col gap-20">

        {/* ══ 2. WHAT IS CYBER CRIME ═══════════════════════════════════════ */}
        <section>
          <SectionHeader eyebrow="// Basics" title="What is" highlight="Cyber Crime?" />
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-slate-900/80 border border-white/7 rounded-2xl p-6">
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Cybercrime refers to illegal activities carried out using computers, mobile devices, or the internet.
                These crimes target personal data, money, or digital systems — and they are growing more sophisticated every day.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Anyone connected to the internet is a potential target. Understanding how these crimes work is the
                first step to staying safe.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {['Stealing bank details & money', 'Hacking personal accounts', 'Online fraud & scams', 'Identity theft', 'Ransomware & data lock'].map(ex => (
                <div key={ex} className="flex items-center gap-3 bg-red-500/6 border border-red-500/15 rounded-xl px-4 py-2.5">
                  <span className="text-red-400 text-xs">▸</span>
                  <span className="text-slate-300 text-xs">{ex}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 3. CRIME TYPES ═══════════════════════════════════════════════ */}
        <section>
          <SectionHeader eyebrow="// Types" title="Common" highlight="Cyber Crimes"
            subtitle="Each crime type explained with warning signs so you can recognise them quickly." />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {crimeTypes.map((crime) => {
              const c = colorMap[crime.color]
              return (
                <div key={crime.name}
                  className={`bg-slate-900/90 border rounded-2xl flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-200 ${c.card}`}>
                  <div className={`h-[3px] bg-gradient-to-r ${c.strip} to-transparent`} />
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${c.icon}`}>
                        {crime.icon}
                      </div>
                      <h3 className="text-slate-100 font-bold text-[15px]">{crime.name}</h3>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{crime.desc}</p>
                    <div className="bg-white/3 border border-white/6 rounded-xl p-3">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-1.5">How it happens</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{crime.how}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-2">⚠️ Warning Signs</p>
                      <div className="flex flex-col gap-1.5">
                        {crime.warnings.map(w => (
                          <div key={w} className={`flex items-start gap-2 text-xs px-2.5 py-1.5 rounded-lg border ${c.badge}`}>
                            <span className="mt-0.5 flex-shrink-0">•</span>{w}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ══ 4. HOW ATTACKS WORK ══════════════════════════════════════════ */}
        <section>
          <SectionHeader eyebrow="// Process" title="How Cyber" highlight="Attacks Work"
            subtitle="Every attack follows a similar pattern. Knowing this helps you stop it at step one." />
          <div className="grid md:grid-cols-4 gap-4">
            {attackSteps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-slate-900/80 border border-white/7 rounded-2xl p-5 flex flex-col gap-3 h-full">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-600">{s.step}</span>
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                  <h4 className="text-slate-100 font-bold text-sm">{s.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
                {i < attackSteps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center">
                    <span className="text-slate-600 text-xs">▶</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══ 5. PREVENTION ════════════════════════════════════════════════ */}
        <section id="prevention">
          <SectionHeader eyebrow="// Protection" title="Prevention" highlight="Tips"
            subtitle="Practical steps to protect yourself — follow these and you eliminate most risks." />
          <div className="grid md:grid-cols-2 gap-5">
            {preventionGroups.map(({ icon, title, color, tips }) => {
              const colors = {
                green:  { wrap: 'border-green-500/20',  head: 'bg-green-500/10 text-green-400',  bullet: 'text-green-400'  },
                sky:    { wrap: 'border-sky-500/20',    head: 'bg-sky-500/10 text-sky-400',      bullet: 'text-sky-400'    },
                violet: { wrap: 'border-violet-500/20', head: 'bg-violet-500/10 text-violet-400',bullet: 'text-violet-400' },
                yellow: { wrap: 'border-yellow-500/20', head: 'bg-yellow-500/10 text-yellow-400',bullet: 'text-yellow-400' },
              }
              const c = colors[color]
              return (
                <div key={title} className={`bg-slate-900/80 border rounded-2xl p-5 ${c.wrap}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${c.head}`}>{icon}</div>
                    <h3 className="text-slate-100 font-bold text-sm">{title}</h3>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {tips.map(tip => (
                      <div key={tip} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 flex-shrink-0 font-bold text-xs ${c.bullet}`}>✓</span>
                        <span className="text-slate-300 text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ══ 6. IF YOU ARE A VICTIM ═══════════════════════════════════════ */}
        <section>
          <SectionHeader eyebrow="// Action" title="If You Are" highlight="a Victim"
            subtitle="Act fast — the first few hours are critical to minimise damage." />
          <div className="grid md:grid-cols-5 gap-4">
            {victimSteps.map((s, i) => (
              <div key={s.title} className="bg-slate-900/80 border border-red-500/15 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="font-mono text-[10px] text-slate-600">0{i + 1}</span>
                </div>
                <h4 className="text-slate-100 font-bold text-sm">{s.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 7. RECENT SCAMS ══════════════════════════════════════════════ */}
        <section>
          <SectionHeader eyebrow="// Alerts" title="Recent" highlight="Scams"
            subtitle="Stay updated on the latest fraud tactics currently targeting people." />
          <div className="grid md:grid-cols-3 gap-4">
            {recentScams.map(({ tag, title, desc }) => (
              <div key={title} className="bg-slate-900/80 border border-yellow-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
                    {tag}
                  </span>
                </div>
                <h4 className="text-slate-100 font-bold text-sm">{title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 8. CTA — REPORT ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-500/8 to-orange-500/5 border border-red-500/20 rounded-2xl px-8 py-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-red-400 mb-3">// Take Action</p>
          <h2 className="text-2xl font-extrabold text-slate-100 mb-3">
            Witnessed or Experienced a{' '}
            <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">Cyber Crime?</span>
          </h2>
          <p className="text-slate-400 text-sm mb-7 max-w-md mx-auto">
            Don't stay silent. Report it now — your report can protect others and help authorities track criminals.
          </p>
          <Link to="/home/crime-submit"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 shadow-lg shadow-red-500/25 transition-all">
            🚨 Report Now
          </Link>
        </section>

        {/* ══ 9. FAQ ════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader eyebrow="// Help" title="Frequently" highlight="Asked Questions" />
          <div className="flex flex-col gap-3">
            {faqs.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
          </div>
        </section>

      </div>
    </div>
  )
}

export default CrimeInfo