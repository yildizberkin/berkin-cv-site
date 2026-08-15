"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Entry = { id:number; type:"note"|"certification"; slug:string; title:string; summary:string; body:string; metadata:string; status:"draft"|"published"; sortOrder:number };
const empty: Omit<Entry,"id"> = { type:"note", slug:"", title:"", summary:"", body:"", metadata:"{}", status:"draft", sortOrder:0 };

export default function AdminConsole() {
  const [entries,setEntries] = useState<Entry[]>([]);
  const [draft,setDraft] = useState<Partial<Entry>>(empty);
  const [message,setMessage] = useState("loading secure registry...");

  async function load() {
    const response = await fetch("/api/admin/content", { cache:"no-store" });
    if (!response.ok) { setMessage("ACCESS DENIED — Cloudflare Access or ADMIN_EMAIL is not configured."); return; }
    const result = await response.json() as { entries:Entry[] };
    setEntries(result.entries); setMessage(`${result.entries.length} records loaded`);
  }
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);

  async function save(event:FormEvent) {
    event.preventDefault(); setMessage("writing record...");
    const response = await fetch("/api/admin/content", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(draft) });
    const result = await response.json() as {ok:boolean;code?:string};
    if (!result.ok) { setMessage(`WRITE FAILED — ${result.code ?? response.status}`); return; }
    setDraft(empty); setMessage("record committed"); await load();
  }
  async function remove(id:number) {
    if (!confirm("Delete this record permanently?")) return;
    const response = await fetch(`/api/admin/content?id=${id}`, { method:"DELETE" });
    setMessage(response.ok ? "record deleted" : "delete failed"); if (response.ok) await load();
  }

  return <main className="admin-page">
    <header className="admin-header"><div><code>CONTROL-PLANE / PRIVATE</code><h1>Content Admin</h1></div><Link href="/">← PUBLIC CONSOLE</Link></header>
    <div className="admin-status">● {message}</div>
    <div className="admin-grid">
      <section className="admin-list"><h2>Registry</h2>{entries.map(entry=><article key={entry.id}><div><code>{entry.type.toUpperCase()} · {entry.status.toUpperCase()}</code><h3>{entry.title}</h3><small>/{entry.slug}</small></div><div><button onClick={()=>setDraft(entry)}>EDIT</button><button className="danger" onClick={()=>void remove(entry.id)}>DELETE</button></div></article>)}</section>
      <form className="admin-editor" onSubmit={save}><h2>{draft.id ? "Edit record" : "New record"}</h2>
        <div className="admin-row"><label>TYPE<select value={draft.type} onChange={e=>setDraft({...draft,type:e.target.value as Entry["type"]})}><option value="note">Note</option><option value="certification">Certification</option></select></label><label>STATUS<select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value as Entry["status"]})}><option value="draft">Draft</option><option value="published">Published</option></select></label></div>
        <label>TITLE<input required minLength={2} maxLength={180} value={draft.title ?? ""} onChange={e=>setDraft({...draft,title:e.target.value})}/></label>
        <label>SLUG<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug ?? ""} onChange={e=>setDraft({...draft,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"-").replace(/-+/g,"-")})}/></label>
        <label>SUMMARY<textarea rows={3} maxLength={500} value={draft.summary ?? ""} onChange={e=>setDraft({...draft,summary:e.target.value})}/></label>
        <label>BODY<textarea rows={16} maxLength={50000} value={draft.body ?? ""} onChange={e=>setDraft({...draft,body:e.target.value})}/></label>
        <label>METADATA (JSON)<textarea rows={5} value={draft.metadata ?? "{}"} onChange={e=>setDraft({...draft,metadata:e.target.value})}/></label>
        <label>SORT ORDER<input type="number" min={0} max={9999} value={draft.sortOrder ?? 0} onChange={e=>setDraft({...draft,sortOrder:Number(e.target.value)})}/></label>
        <div className="admin-actions"><button type="button" onClick={()=>setDraft(empty)}>NEW / CLEAR</button><button type="submit">SAVE RECORD</button></div>
      </form>
    </div>
  </main>
}
