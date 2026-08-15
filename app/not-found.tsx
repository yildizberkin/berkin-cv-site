export default function NotFound() {
  return <main className="not-found">
    <div className="grain" />
    <header className="note-header"><a className="brand" href="/"><i /> BERKIN.YILDIZ</a><div className="system">EDGE-RTR // ROUTE FAILURE</div><nav><a href="/">← CONSOLE</a></nav></header>
    <section className="route-failure">
      <div className="route-code"><span>HTTP</span><strong>404</strong><i>DESTINATION UNREACHABLE</i></div>
      <div className="route-trace">
        <code>berkin@portfolio:~$ traceroute requested-path</code>
        <p>1&nbsp;&nbsp; HOME-GW <b>1 ms</b></p>
        <p>2&nbsp;&nbsp; EDGE-RTR <b>4 ms</b></p>
        <p>3&nbsp;&nbsp; * * * <em>request timed out</em></p>
        <hr/>
        <h1>Route not found.</h1>
        <p>The requested destination is not present in the routing table. Choose a known network below.</p>
        <div className="known-routes"><a href="/">/console</a><a href="/case-files">/case-files</a><a href="/certifications">/certifications</a><a href="/notes">/notes</a></div>
      </div>
    </section>
  </main>;
}
