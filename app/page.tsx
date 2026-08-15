"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { certifications } from "../content/certifications";
import { caseFiles } from "../content/case-files";

const nodes = [
  ["about", "▣", "PROFILE-SRV", "About"],
  ["experience", "◇", "CORE-RTR", "Experience"],
  ["projects", "⌘", "PROJECT-DB", "Case Files"],
  ["skills", "▤", "CORE-SW", "Skills"],
  ["certifications", "⬡", "CERT-FW", "Certificates"],
  ["notes", "☁", "PUBLIC-CLOUD", "Notes"],
  ["contact", "⌁", "SECURE-GW", "Contact"],
];

const skills = [
  ["NET", "Networking", "Routing · Switching · TCP/IP · VLAN · 802.1Q · OSPF · VRRP · MPLS · WAN · VPN/IPsec"],
  ["SEC", "Security", "Firewall · IPS · NAC · Proxy · Segmentation · Hardening · Vulnerability Remediation"],
  ["SYS", "Systems", "Windows Server · AD · DNS · DHCP · GPO · Virtualization · Clustering · Storage · Backup · DR"],
  ["OPS", "Operations", "Project · Vendor · ISP · Capacity · Risk · Incident · Problem · Change · ITIL · RCA"],
];

const terminalCommands = ["help", "whoami", "experience", "projects", "skills", "certifications", "notes", "contact", "github", "linkedin", "traceroute", "nmap", "man berkin", "sudo", "clear"];

export default function Home() {
  const [lang, setLang] = useState<"en" | "tr">("en");
  const [command, setCommand] = useState("");
  const [route, setRoute] = useState("HOME");
  const [log, setLog] = useState(["network profile loaded [OK]", "type 'help' to list commands"]);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [incidentChoice, setIncidentChoice] = useState<string | null>(null);
  const [incidentSolved, setIncidentSolved] = useState(false);
  const [booting, setBooting] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const tr = lang === "tr";

  useEffect(() => {
    setUnlocked(localStorage.getItem("operator-access") === "granted");
    setIncidentSolved(localStorage.getItem("incident-100") === "resolved");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!sessionStorage.getItem("portfolio-booted") && !reduced) {
      setBooting(true);
      const timers = [420, 820, 1220, 1640].map((delay, index) => window.setTimeout(() => setBootStep(index + 1), delay));
      timers.push(window.setTimeout(() => { sessionStorage.setItem("portfolio-booted", "true"); setBooting(false); }, 2100));
      return () => timers.forEach(window.clearTimeout);
    }
  }, []);

  function skipBoot() {
    sessionStorage.setItem("portfolio-booted", "true");
    setBooting(false);
  }

  function diagnoseIncident(choice: string) {
    setIncidentChoice(choice);
    if (choice === "l2-bridge") {
      localStorage.setItem("incident-100", "resolved");
      setIncidentSolved(true);
      setLog(["INCIDENT #100 root cause confirmed", "segments isolated · ticket resolved [200 OK]"]);
    } else {
      setLog(["INCIDENT #100 diagnosis rejected", "evidence does not support selected root cause"]);
    }
  }

  function go(id: string, label?: string) {
    setRoute(label ?? id.toUpperCase());
    setLog([`route HOME → ${label ?? id.toUpperCase()}`, "packet delivered [200 OK]"]);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 160);
  }

  function run(e: FormEvent) {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;
    commandHistory.current = [cmd, ...commandHistory.current.filter(item => item !== cmd)].slice(0, 20);
    historyIndex.current = -1;
    if (cmd === "clear") setLog([]);
    else if (cmd === "github" || cmd === "linkedin") {
      setLog([`$ ${cmd}`, `external route → ${cmd}.com`]);
      window.open(cmd === "github" ? "https://github.com/yildizberkin" : "https://www.linkedin.com/in/berkin-yildiz/", "_blank", "noopener,noreferrer");
    } else if (cmd === "help") setLog(["whoami · experience · projects · skills · certifications · notes · contact", "github · linkedin · traceroute · nmap · man berkin · sudo · clear"]);
    else if (cmd === "sudo" || cmd === "challenge" || cmd === "sudo access hidden/") { setLog([`$ ${cmd}`, "CERT-FW authentication challenge requested..."]); setChallengeOpen(true); }
    else if (cmd === "nmap") setLog(["Starting BerkinMap 1.0", "22/tcp ssh · 80/tcp portfolio · 443/tcp secure-gw · 65000/tcp filtered"]);
    else if (cmd === "traceroute") setLog(["1  HOME-GW       1 ms", "2  CORE-RTR      4 ms", "3  PUBLIC-CLOUD  9 ms", "trace complete"]);
    else if (cmd === "man berkin") setLog(["BERKIN(1) — infrastructure operator", "SYNOPSIS: network · systems · security · operations", "BUGS: refuses undocumented cabling"]);
    else if (cmd === "whoami") { setLog(["Berkin Yıldız — born 04 September 1998 — Istanbul, Türkiye"]); go("about", "PROFILE-SRV"); }
    else if (["experience", "projects", "skills", "certifications", "notes", "contact"].includes(cmd)) { setLog([`$ ${cmd}`, "resolving destination..."]); go(cmd, nodes.find(n => n[0] === cmd)?.[2]); }
    else setLog([`$ ${cmd}`, `command not found: ${cmd}`]);
    setCommand("");
  }

  function terminalKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const typed = command.trim().toLowerCase();
      const matches = terminalCommands.filter(item => item.startsWith(typed));
      if (typed && matches.length) {
        setCommand(matches[0]);
        setLog(matches.length === 1 ? [`autocomplete → ${matches[0]}`] : [`matches: ${matches.join(" · ")}`]);
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!commandHistory.current.length) return;
      historyIndex.current = Math.min(historyIndex.current + 1, commandHistory.current.length - 1);
      setCommand(commandHistory.current[historyIndex.current]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      historyIndex.current = Math.max(historyIndex.current - 1, -1);
      setCommand(historyIndex.current === -1 ? "" : commandHistory.current[historyIndex.current]);
    }
  }

  return (
    <main>
      {booting && <BootSequence step={bootStep} onSkip={skipBoot}/>} 
      <div className="grain" />
      <header>
        <a className="brand" href="#home"><i /> BERKIN.YILDIZ</a>
        <div className="system">SYSTEM ONLINE <b>//</b> {route}</div>
        <nav><button onClick={() => setLang(tr ? "en" : "tr")}>{tr ? "EN" : "TR"}</button><a href="https://github.com/yildizberkin" target="_blank">GITHUB ↗</a><a href="https://www.linkedin.com/in/berkin-yildiz/" target="_blank">LINKEDIN ↗</a></nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="online"><i /> {tr ? "BAĞLANTILARA AÇIK" : "AVAILABLE FOR CONNECTIONS"}</p>
          <code>berkin@portfolio:~$ whoami</code>
          <h1>BERKIN<br/><span>YILDIZ</span></h1>
          <h2>{tr ? "IT Altyapı ve Network Uzmanı" : "IT Infrastructure & Network Specialist"}</h2>
          <p>{tr ? "Network, sistem ve güvenlik alanlarında dayanıklı kurumsal altyapılar tasarlıyor, işletiyor ve geliştiriyorum." : "I design, operate and improve resilient enterprise infrastructure across networking, systems and security."}</p>
          <div className="quick"><button onClick={() => go("about", "PROFILE-SRV")}>./about</button><button onClick={() => go("skills", "CORE-SW")}>./skills</button><button onClick={() => go("certifications", "CERT-FW")}>./certifications</button><button className="sudo-button" onClick={() => setChallengeOpen(true)}>sudo access hidden/</button></div>
        </div>
        <div className="terminal">
          <div className="terminal-bar"><span><i/><i/><i/></span><b>ssh — berkin@portfolio</b><em>● ENCRYPTED</em></div>
          <div className="terminal-body">
            <p>[<b>OK</b>] security context verified</p><p>[<b>OK</b>] portfolio interface mounted</p><hr/>
            <div className="log">{log.map((line, i) => <p key={i}>{line}</p>)}</div>
            <form onSubmit={run}><label>berkin@portfolio:<b>~</b>$</label><input value={command} onChange={e => setCommand(e.target.value)} onKeyDown={terminalKeyDown} autoComplete="off" autoCapitalize="off" aria-label="Terminal command"/></form>
            <small>{tr ? "Komut yazın · TAB tamamlar · ↑↓ geçmişi açar." : "Type a command · TAB completes · ↑↓ opens history."}</small>
          </div>
        </div>
      </section>

      <section className="wide map-section"><Title n="01" text={tr ? "NETWORK HARİTASI" : "NETWORK MAP"}/><div className="map"><div className="backbone"><i/></div>{nodes.map((n, i) => <button className="node" key={n[0]} onClick={() => go(n[0], n[2])}><small>GE0/0/{i + 1}</small><b>{n[1]}</b><strong>{n[2]}</strong><span>{n[3]}</span><i/></button>)}</div></section>

      <section className="wide" id="about"><Title n="02" text={tr ? "HAKKIMDA" : "ABOUT"}/><div className="about"><article className="panel"><div>PROFILE-SRV /etc/identity <b>READ ONLY</b></div><code>{tr ? "KİMLİK KAYDI" : "IDENTITY RECORD"}</code><p>{tr ? "İstanbul merkezli bir IT altyapı ve network uzmanıyım. Kurumsal ağlar, veri merkezi operasyonları, güvenlik, yüksek erişilebilirlik ve teknik proje yönetimi alanlarında çalışıyorum. Karmaşık ortamları anlaşılır, dayanıklı ve iyi dokümante edilmiş sistemlere dönüştürmeyi seviyorum." : "I am an Istanbul-based infrastructure and network specialist working across enterprise networking, data center operations, security, high availability and technical project delivery. I like turning complex environments into systems that are understandable, resilient and well documented."}</p></article><aside><Data k="ROLE" v={tr ? "IT Altyapı ve Network Uzmanı" : "IT Infrastructure & Network Specialist"}/><Data k="BORN" v="04 SEP 1998"/><Data k="LOCATION" v="ISTANBUL, TR"/><Data k="FOCUS" v="NETWORK · INFRA · SECURITY"/></aside></div></section>

      <section className="wide" id="experience"><Title n="03" text={tr ? "DENEYİM" : "EXPERIENCE"}/><div className="timeline"><Job date="08/2025 → NOW" event="EVENT 200" title="IT Infrastructure & Network Specialist" text={tr ? "Kurumsal network, altyapı ve güvenlik ortamları; WAN ve ISP bağlantıları; operasyonel süreklilik; altyapı projeleri; tedarikçi koordinasyonu; dokümantasyon, denetim hazırlığı ve felaket kurtarma testleri." : "Enterprise network, infrastructure and security environments; WAN and ISP connectivity; operational continuity; infrastructure projects; vendor coordination; documentation, audit readiness and disaster-recovery testing."}/><Job date="09/2024 → 08/2025" event="EVENT 101" title="IT Assistant Specialist" text={tr ? "L1/L2 operasyonla başlayıp switching, VLAN, NAC, veri merkezi operasyonları, yedekleme ve altyapı sağlık kontrollerine genişleyen sorumluluk alanı." : "Started with L1/L2 operations, then expanded into switching, VLAN, NAC, data center operations, backup verification and infrastructure health checks."}/></div></section>

      <section className="wide" id="projects"><Title n="04" text={tr ? "VAKA KAYITLARI" : "CASE FILES"}/><div className="section-head"><div><h2>{tr ? "Anonim operasyon kayıtları" : "Sanitized operations"}</h2><p>{tr ? "Hassas altyapı bilgisi vermeden gerçek sorumluluk alanları." : "Real areas of responsibility without exposing sensitive infrastructure details."}</p></div><code>PROJECT-DB: PUBLIC VIEW</code></div><div className="case-preview">{caseFiles.slice(0,3).map(item => <article key={item.id}><code>{item.id}</code><small>{item.domain}</small><h3>{item.title}</h3><p>{item.summary}</p><span>{item.signals.join(" · ")}</span></article>)}</div><a className="cert-open" href="/case-files">{tr ? "TÜM VAKA KAYITLARINI AÇ" : "OPEN ALL CASE FILES"} ↗</a></section>

      <section className="wide" id="skills"><Title n="05" text={tr ? "YETKİNLİKLER" : "SKILLS"}/><div className="section-head"><h2>{tr ? "Yetkinlik matrisi" : "Capability matrix"}</h2><code>4 ACTIVE MODULES</code></div><div className="skills">{skills.map((s,i) => <article key={s[0]}><em>0{i+1}</em><code>{s[0]}</code><h3>{s[1]}</h3><p>{s[2]}</p><small><i/> operational</small></article>)}</div></section>

      <section className="wide" id="certifications"><Title n="06" text={tr ? "SERTİFİKALAR" : "CERTIFICATIONS"}/><div className="section-head"><div><h2>{tr ? "Sertifika otoritesi" : "Certificate authority"}</h2><p>{tr ? "Yeni sertifikalar eklendikçe büyüyen kayıt alanı." : "A registry designed to grow as new credentials are earned."}</p></div><code>CERT-FW: ALLOW</code></div><div className="certs"><div className="cert cert-head"><span>ISSUER</span><span>CREDENTIAL</span><span>STATUS</span></div>{certifications.map(c => <div className="cert" key={c.credential}><span>{c.issuer}</span><strong>{c.credential}</strong><em className={c.status === "COMPLETED" ? "done" : "progress"}>{c.status}</em></div>)}</div><a className="cert-open" href="/certifications">{tr ? "TÜM KAYITLARI AÇ" : "OPEN FULL REGISTRY"} ↗</a></section>

      <section className="future"><article id="notes"><Title n="07" text={tr ? "NOTLAR" : "NOTES"}/><NotesPreview tr={tr}/></article><article id="contact"><Title n="08" text={tr ? "İLETİŞİM" : "CONTACT"}/><ContactForm tr={tr}/></article></section>

      {unlocked && <section className="operator-zone" id="operator"><Title n="08" text="OPERATOR ZONE"/><div className="operator-grid"><article><code>ACCESS LEVEL: L3 OPERATOR</code><h2>{tr ? "Gizli katman açıldı." : "Hidden layer unlocked."}</h2><p>{tr ? "Level 01 tamamlandı. Şimdi gerçek bir troubleshooting senaryosunda root cause belirle." : "Level 01 complete. Now identify the root cause in a real troubleshooting scenario."}</p><div className="operator-badge">✓ NETWORK OPERATOR / VERIFIED</div></article><article className={`incident ${incidentSolved ? "resolved" : ""}`}><div className="incident-title"><span>LEVEL 02 · INCIDENT #100</span><em>{incidentSolved ? "RESOLVED" : "ACTIVE"}</em></div><h3>Unexpected Internet Access</h3><div className={`incident-map ${incidentSolved ? "isolated" : ""}`}><b>INTERNAL-PC</b><i>→</i><b>ACCESS-SW</b><i>→</i><b>OPS-SW</b><em>{incidentSolved ? "✕ link physically removed" : "? unknown path ?"}</em><b>INTERNET-SW</b></div>{incidentSolved ? <div className="resolution"><b>✓ ROOT CAUSE CONFIRMED</b><p>Accidental Layer 2 bridge. Internal and Internet segments were joined through an unmanaged switch. Physical separation restored the security boundary.</p><button onClick={() => { localStorage.removeItem("incident-100"); setIncidentSolved(false); setIncidentChoice(null); }}>REPLAY INCIDENT</button></div> : <><div className="symptoms"><b>OBSERVED</b><ul><li>Internal workstation unexpectedly reaches the Internet.</li><li>No routing or firewall change was made.</li><li>Removing untagged VLAN 100 stops connectivity.</li></ul></div><p className="diagnose-label">SELECT THE MOST LIKELY ROOT CAUSE</p><div className="diagnoses"><button onClick={() => diagnoseIncident("ospf")}>01 · OSPF route leak</button><button onClick={() => diagnoseIncident("dns")}>02 · DNS poisoning</button><button onClick={() => diagnoseIncident("l2-bridge")}>03 · Accidental Layer 2 bridge</button><button onClick={() => diagnoseIncident("dhcp")}>04 · Expired DHCP lease</button></div>{incidentChoice && incidentChoice !== "l2-bridge" && <p className="incident-deny">DIAGNOSIS REJECTED — Review the Layer 2 evidence and VLAN behavior.</p>}</>}</article></div></section>}

      {challengeOpen && <div className="challenge-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setChallengeOpen(false); }}><section className="challenge" role="dialog" aria-modal="true" aria-labelledby="challenge-title"><div className="challenge-top"><span>CERT-FW / KNOWLEDGE VERIFICATION</span><button onClick={() => setChallengeOpen(false)} aria-label="Close challenge">×</button></div>{unlocked ? <div className="challenge-success"><b>✓</b><h2>ACCESS ALREADY GRANTED</h2><p>Operator session is active.</p><button onClick={() => { setChallengeOpen(false); document.getElementById("operator")?.scrollIntoView({behavior:"smooth"}); }}>ENTER OPERATOR ZONE</button></div> : <form onSubmit={e => { e.preventDefault(); const ok = answer.trim().replace(/^host\s+/i, "") === "192.168.10.30"; if (ok) { localStorage.setItem("operator-access", "granted"); setUnlocked(true); setLog(["knowledge verification [PASS]", "mounting /hidden/operator... access granted"]); setTimeout(() => { setChallengeOpen(false); document.getElementById("operator")?.scrollIntoView({behavior:"smooth"}); }, 650); } else { setAttempts(v => v + 1); setLog(["knowledge verification [DENY]", "hint: network and broadcast addresses are not usable"]); } }}><p className="challenge-level">LEVEL 01 — SUBNETTING</p><h2 id="challenge-title">192.168.10.0/27</h2><p>{tr ? "Bu ağdaki kullanılabilir son host adresi nedir?" : "What is the last usable host address in this network?"}</p><label>operator@cert-fw:~$ <input value={answer} onChange={e => setAnswer(e.target.value)} autoFocus spellCheck={false} placeholder="IPv4 address"/></label>{attempts > 0 && <p className="deny">ACCESS DENIED — ATTEMPT {attempts} · network/broadcast addresses are excluded</p>}<button type="submit">VERIFY KNOWLEDGE</button><small>This is an easter egg, not an authentication boundary.</small></form>}</section></div>}

      <footer><span><i/> BERKIN.YILDIZ / INFRASTRUCTURE CONSOLE</span><p>© 2026 — All systems nominal.</p><button onClick={() => scrollTo({top:0,behavior:"smooth"})}>↑ TOP</button></footer>
    </main>
  );
}

function Title({n,text}:{n:string,text:string}) { return <div className="title"><b>{text === "OPERATOR ZONE" ? "09" : n}</b><span>{text}</span><i/></div> }
function BootSequence({step,onSkip}:{step:number,onSkip:()=>void}) {
  const lines = ["loading kernel profile", "verifying security context", "mounting network map", "starting portfolio interface"];
  return <div className={`boot-screen step-${step}`} role="status" aria-live="polite">
    <div className="boot-core"><div className="boot-mark"><i/><span>BERKIN.YILDIZ</span></div><code>INFRASTRUCTURE CONSOLE / BOOT SEQUENCE</code><div className="boot-lines">{lines.map((line,index) => <p className={step > index ? "ready" : step === index ? "active" : ""} key={line}><span>[{step > index ? "OK" : step === index ? ".." : "  "}]</span> {line}</p>)}</div><div className="boot-progress"><i style={{width:`${Math.min(step,4)*25}%`}}/></div><small>{Math.min(step,4) * 25}%</small></div>
    <button onClick={onSkip}>SKIP BOOT →</button>
  </div>;
}
function Data({k,v}:{k:string,v:string}) { return <div><small>{k}</small><strong>{v}</strong></div> }
function Job({date,event,title,text}:{date:string,event:string,title:string,text:string}) { return <article><code>{date}</code><div><small>{event}</small><h3>{title}</h3><p>{text}</p></div></article> }
function Empty({icon,title,text}:{icon:string,title:string,text:string}) { return <div className="empty"><b>{icon}</b><h2>{title}</h2><p>{text}</p><code>HTTP/2 204 — NO CONTENT YET</code></div> }

function NotesPreview({tr}:{tr:boolean}) { return <div className="notes-preview"><div className="notes-preview-top"><span>☁</span><code>PUBLIC-CLOUD /notes</code></div><p className="notes-record">FIELD NOTE 001 · LAYER 2</p><h2>{tr ? "Internal bir network internete çıkarsa" : "When an Internal Network Finds the Internet"}</h2><p>{tr ? "Routing veya firewall değişikliği olmadan Internet erişimi kazanan bir workstation üzerinden anonimleştirilmiş Layer 2 troubleshooting vakası." : "An anonymized Layer 2 troubleshooting case: a workstation gained Internet access without a routing or firewall change."}</p><div className="note-tags"><span>Layer 2</span><span>VLAN</span><span>Troubleshooting</span></div><a href="/notes/when-an-internal-network-finds-the-internet">{tr ? "NOTU OKU" : "READ FIELD NOTE"} ↗</a><a className="all-notes" href="/notes">{tr ? "TÜM NOTLAR" : "ALL NOTES"} →</a></div> }

function ContactForm({tr}:{tr:boolean}) {
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"offline"|"limited"|"error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, startedAt }) });
      const result = await response.json() as {ok?:boolean;code?:string};
      if (result.ok) { setStatus("sent"); e.currentTarget.reset(); }
      else if (result.code === "GATEWAY_NOT_CONFIGURED") setStatus("offline");
      else if (result.code === "RATE_LIMITED" || result.code === "DUPLICATE") setStatus("limited");
      else setStatus("error");
    } catch { setStatus("error"); }
  }

  return <div className="contact-shell"><div className="contact-head"><span>SECURE-GW / TRANSMISSION CHANNEL</span><b>PRIVATE RELAY</b></div><div className="contact-copy"><span>⌁</span><div><h2>{tr ? "Güvenli bağlantı" : "Secure uplink"}</h2><p>{tr ? "Mesajın özel bir sunucu geçidi üzerinden iletilir. Alıcı e-posta adresi arayüzde, kaynak kodunda veya yanıtta bulunmaz." : "Your message is relayed through a private server gateway. The destination address is never present in the interface, source code or response."}</p></div></div><form className="contact-form" onSubmit={submit}><label>{tr ? "İSİM" : "NAME"}<input name="name" minLength={2} maxLength={80} required autoComplete="name"/></label><label>{tr ? "E-POSTA" : "YOUR EMAIL"}<input name="email" type="email" maxLength={160} required autoComplete="email"/></label><label className="full">{tr ? "KONU" : "SUBJECT"}<input name="subject" minLength={3} maxLength={120} required/></label><label className="full">{tr ? "MESAJ" : "MESSAGE"}<textarea name="message" minLength={20} maxLength={3000} required rows={6}/></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><div className="contact-submit"><button type="submit" disabled={status === "sending"}>{status === "sending" ? "TRANSMITTING..." : tr ? "MESAJI İLET" : "TRANSMIT MESSAGE"}</button><code>3/HOUR · 10/DAY · GLOBAL CAP 30</code></div>{status === "sent" && <p className="form-status success">✓ MESSAGE DELIVERED — SECURE-GW 200 OK</p>}{status === "offline" && <p className="form-status offline">GATEWAY STAGED — outbound delivery activates after domain verification.</p>}{status === "limited" && <p className="form-status error">TRANSMISSION BLOCKED — rate limit or duplicate content detected.</p>}{status === "error" && <p className="form-status error">TRANSMISSION FAILED — verify the fields and retry.</p>}</form></div>
}
