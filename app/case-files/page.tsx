import { caseFiles } from "../../content/case-files";

export default function CaseFilesPage() {
  return <main className="cases-page">
    <div className="grain" />
    <header className="note-header"><a className="brand" href="/"><i /> BERKIN.YILDIZ</a><div className="system">PROJECT-DB // SANITIZED RECORDS</div><nav><a href="/">← CONSOLE</a></nav></header>
    <section className="cases-hero"><code>berkin@portfolio:~$ query project_db --public</code><p>SELECTED INFRASTRUCTURE WORK</p><h1>Case<br/><span>Files</span></h1><div className="classification"><b>PUBLIC</b><span>All records are anonymized. Organization names, locations, addresses, device identities and topology details are excluded.</span></div></section>
    <section className="case-grid">{caseFiles.map((item,index) => <article className="case-file" key={item.id}><div className="case-file-head"><code>{item.id}</code><span>RECORD {String(index+1).padStart(2,"0")}</span></div><small>{item.domain}</small><h2>{item.title}</h2><p>{item.summary}</p><ul>{item.signals.map(signal => <li key={signal}>{signal}</li>)}</ul><div className="case-outcome"><b>OUTCOME</b><span>{item.outcome}</span></div></article>)}</section>
    <footer><span><i/> BERKIN.YILDIZ / PROJECT-DB</span><p>Operational detail without confidential exposure.</p><a href="/">← CONSOLE</a></footer>
  </main>;
}
