// =============================================================================
// Shared UI: Icons + Shell components (top chrome, rail, page head, primitives)
// =============================================================================

/* ---------- Icons ---------- */
const Icon = {
  search:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  plus:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  pencil:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4v16h16v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg>,
  trash:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16l-2 12H6L4 7ZM9 7V4h6v3"/></svg>,
  chev:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="9 6 15 12 9 18"/></svg>,
  chevL:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="15 6 9 12 15 18"/></svg>,
  filter:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 5h18l-7 9v5l-4-2v-3L3 5Z"/></svg>,
  download:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 4v12m0 0 4-4m-4 4-4-4M4 20h16"/></svg>,
  upload:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20V8m0 0 4 4m-4-4-4 4M4 4h16"/></svg>,
  map:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>,
  list:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
  pin:     (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.4 7.35 11.65a1 1 0 0 0 1.3 0C12.95 21.4 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>,
  history: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></svg>,
  more:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>,
  link:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 14a5 5 0 0 1 0-7l3-3a5 5 0 0 1 7 7l-1.5 1.5"/><path d="M14 10a5 5 0 0 1 0 7l-3 3a5 5 0 0 1-7-7l1.5-1.5"/></svg>,
  warn:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>,
  info:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/></svg>,
  check:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>,
  x:       (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  // Domain glyphs
  station: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 3h16v14H4z"/><path d="M4 11h16M9 17v3M15 17v3"/></svg>,
  road:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 3v18M18 3v18M12 4v3M12 11v3M12 18v3"/></svg>,
  airport: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12 22 5l-3 8 3 8L2 12Z"/><path d="M5 12h17"/></svg>,
  mall:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 9h18l-1 12H4L3 9Z"/><path d="M8 9V5a4 4 0 0 1 8 0v4"/></svg>,
  bus:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="4" width="16" height="14" rx="2"/><path d="M4 11h16M7 21v-3M17 21v-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>,
  frame:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9h18"/></svg>,
  dash:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>,
  cog:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2.1-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6c-.7.3-1.4.7-2 1.2l-2.4-1-2 3.4 2.1 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2.1 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2L10 21h4l.6-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.4-2.1-1.6c.1-.4.1-.8.1-1.2Z"/></svg>,
  report:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 4h16v16H4z"/><path d="M8 16v-4M12 16V8M16 16v-6"/></svg>,
  school:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 10 12 5l9 5-9 5-9-5Z"/><path d="M7 12v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5"/><path d="M21 10v6"/></svg>,
  globe:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/></svg>,
};

/* ---------- Brand mark (Global G) ---------- */
function BrandMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M16.5 0C20.64 0 24 3.36 24 7.5v9c-.01 2.91-1.7 5.55-4.34 6.78.02-.24.03-.48.03-.72A8 8 0 0 0 17.3 17.38C19.88 14.87 20.44 10.92 18.66 7.79c-.1-.18-.2-.35-.32-.51 1.63-1.01 1.32-3.47 1.32-3.47h-7.65c-.07 0-.14 0-.21 0a7.91 7.91 0 1 0 1.02 15.82 4 4 0 0 1 3.2 5.86H10.18a3 3 0 0 1-.36-2.41l-3.54-1.6a13 13 0 0 0-.54 1.97 18 18 0 0 0-.08 1.13c0 .43.04.85.12 1.27C2.54 23.18 0 20.09 0 16.5v-9C0 3.36 3.36 0 7.5 0h9Z"/>
      <path d="M14.56 8.87c.18.18.34.38.49.6a3.95 3.95 0 0 1-.32 4.92 3.95 3.95 0 0 1-4.85 1 3.95 3.95 0 0 1-2.08-4.48 3.95 3.95 0 0 1 3.82-3.12h.31a3.97 3.97 0 0 1 2.64 1.08Z"/>
    </svg>
  );
}

/* ---------- Site type icon ---------- */
function SiteIcon({ type, ...rest }) {
  const map = { 'Station': Icon.station, 'Roadside': Icon.road, 'Airport': Icon.airport, 'Shopping Centre': Icon.mall, 'Bus Shelter': Icon.bus };
  const C = map[type] || Icon.frame;
  return <C {...rest} />;
}

/* ---------- Status chip ---------- */
function StatusChip({ status }) {
  const meta = window.FRAME_DATA.STATUS_META[status] || { label: status, tone: 'neutral' };
  return (
    <span className={"chip " + meta.tone}>
      <span className="dot"></span>
      {meta.label}
    </span>
  );
}

/* ---------- Top chrome ---------- */
function Brand() {
  return (
    <div className="brand">
      <div className="mark"><BrandMark /></div>
      <div className="title">
        Global Inventory
        <small>Frames · OOH</small>
      </div>
    </div>
  );
}

function Topbar({ crumbs, right }) {
  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? 'here' : ''}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="spacer" />
      {right}
      <div className="user">
        <div className="avatar">MP</div>
        <div>
          <div className="who" style={{fontSize: 13}}>Maya Patel</div>
          <div className="role">Inventory ops</div>
        </div>
      </div>
    </div>
  );
}

function Rail({ active, onNav }) {
  const inv  = [{ id: 'frames', label: 'Frames', icon: Icon.frame }];
  const md   = [
    { id: 'md-regions',  label: 'Regions & Towns',      icon: Icon.globe },
    { id: 'md-sites',    label: 'Site Types',           icon: Icon.station },
    { id: 'md-formats',  label: 'Formats',              icon: Icon.frame },
    { id: 'md-extids',   label: 'External ID Systems',  icon: Icon.link },
  ];
  const handle = (e, id) => { e.preventDefault(); onNav && onNav(id); };
  return (
    <nav className="rail">
      <div className="group">Inventory</div>
      {inv.map(it => (
        <a key={it.id} href="#" onClick={e => handle(e, it.id)} className={"nav" + (active === it.id ? ' active' : '')}>
          <it.icon /> {it.label}
        </a>
      ))}
      <div className="group">Master data</div>
      {md.map(it => (
        <a key={it.id} href="#" onClick={e => handle(e, it.id)} className={"nav" + (active === it.id ? ' active' : '')}>
          <it.icon /> {it.label}
        </a>
      ))}
      <div className="spacer" />
      <div className="footer">
        Frame Inventory v0.4.2<br/>
        Last sync · 2 min ago
      </div>
    </nav>
  );
}

/* ---------- Concept bar (the "this is a design exploration" header) ---------- */
function ConceptBar({ direction, onChange }) {
  return (
    <div className="concept-bar">
      <span className="label"><b>Frame Inventory</b> · take-home design exploration</span>
      <span className="label">Compare directions:</span>
      <div className="dir-toggle">
        <button className={direction === 'A' ? 'active' : ''} onClick={() => onChange('A')}>
          <span className="dot"></span> A · Workspace
        </button>
        <button className={direction === 'B' ? 'active' : ''} onClick={() => onChange('B')}>
          <span className="dot"></span> B · Split workspace
        </button>
      </div>
      <span className="spacer" />
      <span className="label">Press <span className="key">1</span><span className="key">2</span><span className="key">3</span><span className="key">4</span> to jump screens</span>
    </div>
  );
}

/* ---------- Page header with tabs ---------- */
function PageHead({ title, meta, actions, tabs, activeTab, onTab, children }) {
  return (
    <div className="page-head">
      <div className="row">
        <div>
          <h1>{title}</h1>
          {meta && <div className="meta" style={{marginTop: 2}}>{meta}</div>}
        </div>
        <div className="actions">{actions}</div>
      </div>
      {tabs && (
        <div className="tabs">
          {tabs.map(t => (
            <div key={t.id} className={"tab" + (activeTab === t.id ? ' active' : '')} onClick={() => onTab(t.id)}>
              {t.label}
              {t.count != null && <span className="count">{t.count}</span>}
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------- Map (shared between A & B) ---------- */
function FrameMap({ frames, activeId, onPick }) {
  return (
    <div className="fake-map" style={{ width: '100%', height: '100%', minHeight: 360 }}>
      <div className="pins">
        {frames.map(f => {
          const p = window.FRAME_DATA.PIN_LAYOUT[f.id] || { x: 50, y: 50 };
          return (
            <div
              key={f.id}
              className={"pin" + (f.id === activeId ? ' active' : '')}
              style={{ left: p.x + '%', top: p.y + '%' }}
              onClick={() => onPick && onPick(f.id)}
              title={f.id + ' · ' + f.site.name}>
              <Icon.pin />
            </div>
          );
        })}
      </div>
      <div className="legend">
        <span style={{color: 'var(--text-secondary)'}}>{frames.length} frames</span>
        <span className="item"><span className="dot" style={{background: 'var(--primary-main)'}}></span> Frame</span>
        <span className="item"><span className="dot" style={{background: 'var(--error-dark)'}}></span> Selected</span>
      </div>
    </div>
  );
}

/* ---------- Read-only key/value section ---------- */
function KVGrid({ entries }) {
  return (
    <div className="kv">
      {entries.map(([k, v, opts], i) => (
        <div key={i}>
          <div className="k">{k}</div>
          <div className={"v " + (opts?.muted ? 'muted ' : '') + (opts?.mono ? 'mono' : '')}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Timeline ---------- */
function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((it, i) => {
        const kind = it.kind || (it.verb.includes('added') ? 'add' : it.verb.includes('removed') ? 'remove' : '');
        return (
          <div key={i} className={"tl-item " + kind}>
            <div className="tl-meta">
              <span className="who">{it.user}</span>
              <span className="verb">{it.verb}</span>
              <span className="when">{it.ts}</span>
            </div>
            <div className="tl-body">
              {it.changes.map((c, j) => (
                <div key={j} className="diff-row">
                  {c.full ? (
                    <div className="full">{c.full}</div>
                  ) : (
                    <React.Fragment>
                      <span className="field-name">{c.field}</span>
                      <span className="from">{c.from}</span>
                      <span className="arrow">→</span>
                      <span className="to">{c.to}</span>
                    </React.Fragment>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- External IDs editor ---------- */
function ExternalIdsTable({ ids, editable }) {
  return (
    <div className="surface" style={{padding: 0, overflow: 'hidden'}}>
      <table className="tbl">
        <thead>
          <tr>
            <th style={{width: '34%'}}>System</th>
            <th>External ID</th>
            <th style={{width: '120px'}}>Linked</th>
            <th style={{width: editable ? '120px' : '60px'}}></th>
          </tr>
        </thead>
        <tbody>
          {ids.map((x, i) => (
            <tr key={i} style={{cursor: 'default'}}>
              <td><b>{x.system}</b></td>
              <td><span className="mono">{x.value}</span> <a style={{marginLeft: 6, fontSize: 11}}>↗ Open</a></td>
              <td><span style={{color: 'var(--text-secondary)'}}>{x.linked}</span></td>
              <td style={{textAlign: 'right'}}>
                {editable ? (
                  <React.Fragment>
                    <button className="btn ghost sm icon-only" title="Edit"><Icon.pencil /></button>
                    <button className="btn danger-ghost sm icon-only" title="Unlink"><Icon.trash /></button>
                  </React.Fragment>
                ) : (
                  <button className="btn ghost sm icon-only" title="Copy"><Icon.link /></button>
                )}
              </td>
            </tr>
          ))}
          {ids.length === 0 && (
            <tr><td colSpan="4" className="empty" style={{textAlign: 'center'}}>No external IDs linked yet.</td></tr>
          )}
        </tbody>
      </table>
      {editable && (
        <div style={{padding: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8, alignItems: 'center', background: 'var(--gray-50)'}}>
          <select className="input" style={{height: 32, width: 200, fontSize: 12}}>
            <option>Route OCS</option>
            <option>Broadsign CMS</option>
            <option>AdSquare DSP</option>
            <option>+ New system…</option>
          </select>
          <input className="input" placeholder="External ID" style={{height: 32, flex: 1, fontSize: 12}} />
          <button className="btn primary sm"><Icon.plus /> Link</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  Icon, BrandMark, SiteIcon, StatusChip,
  Brand, Topbar, Rail, ConceptBar, PageHead,
  FrameMap, KVGrid, Timeline, ExternalIdsTable,
});
