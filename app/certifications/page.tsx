import { certifications } from "../../content/certifications";

export default function CertificationsPage() {
  const completed = certifications.filter(item => item.status === "COMPLETED").length;

  return (
    <main className="cert-page">
      <div className="grain" />
      <header className="note-header">
        <a className="brand" href="/"><i /> BERKIN.YILDIZ</a>
        <div className="system">CERT-FW // CREDENTIAL REGISTRY</div>
        <nav><a href="/">← CONSOLE</a></nav>
      </header>

      <section className="cert-hero">
        <code>berkin@portfolio:~$ verify --all</code>
        <p>CREDENTIAL REGISTRY</p>
        <h1>Certificate<br/><span>Authority</span></h1>
        <div className="cert-stats">
          <div><small>TOTAL RECORDS</small><strong>{String(certifications.length).padStart(2, "0")}</strong></div>
          <div><small>COMPLETED</small><strong>{String(completed).padStart(2, "0")}</strong></div>
          <div><small>ACTIVE TRACK</small><strong>CCSK V5</strong></div>
        </div>
      </section>

      <section className="cert-registry">
        <div className="cert-registry-head"><span>RECORD</span><span>AUTHORITY / CREDENTIAL</span><span>TRACK</span><span>STATUS</span></div>
        {certifications.map((cert, index) => (
          <article className="cert-record" key={cert.credential}>
            <code>CERT-{String(index + 1).padStart(3, "0")}</code>
            <div><small>{cert.issuer}</small><h2>{cert.credential}</h2></div>
            <span>{cert.track}</span>
            <em className={cert.status === "COMPLETED" ? "done" : "progress"}>{cert.status === "COMPLETED" ? "✓ " : "◌ "}{cert.status}</em>
          </article>
        ))}
        <p className="cert-privacy">PUBLIC VIEW // Credential IDs and personal verification data are intentionally not exposed.</p>
      </section>

      <footer><span><i/> BERKIN.YILDIZ / CERT-FW</span><p>Registry updates as new credentials are earned.</p><a href="/">← CONSOLE</a></footer>
    </main>
  );
}
