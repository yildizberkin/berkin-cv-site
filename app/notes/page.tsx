import { notes } from "../../content/notes";

export const metadata = { title: "Field Notes — Berkin Yıldız", description: "Technical field notes on networking, infrastructure and security." };

export default function NotesPage() {
  return <main className="notes-page"><NoteHeader route="PUBLIC-CLOUD /notes"/><section className="notes-hero"><code>berkin@portfolio:~$ ls /notes</code><p>PUBLIC KNOWLEDGE BASE</p><h1>Field<br/><span>Notes</span></h1><div><b>{notes.length.toString().padStart(2,"0")}</b><span>PUBLISHED RECORDS</span></div></section><section className="notes-list"><div className="notes-list-head"><span>INDEX</span><span>NETWORK · INFRASTRUCTURE · SECURITY</span></div>{notes.map(note => <a className="note-row" href={`/notes/${note.slug}`} key={note.slug}><div><code>{note.number}</code><h2>{note.title}</h2><p>{note.excerpt}</p><div className="note-tags">{note.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><aside><span>{note.date}</span><span>{note.readingTime}</span><b>OPEN RECORD ↗</b></aside></a>)}</section><NoteFooter/></main>
}

function NoteHeader({route}:{route:string}) { return <header className="note-header"><a className="brand" href="/"><i/> BERKIN.YILDIZ</a><div className="system">SYSTEM ONLINE <b>//</b> {route}</div><nav><a href="/">← CONSOLE</a></nav></header> }
function NoteFooter() { return <footer><span><i/> BERKIN.YILDIZ / PUBLIC KNOWLEDGE BASE</span><p>Documentation is part of the infrastructure.</p><a href="/">← CONSOLE</a></footer> }
