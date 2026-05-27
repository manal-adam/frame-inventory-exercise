// =============================================================================
// Direction A — "Workspace"
// Classic dense table + filter sidebar; sub-pages for detail / edit / history
// =============================================================================

function DirA({ screen, setScreen, density, onNav }) {
  const props = { onNav };
  const { FRAMES } = window.FRAME_DATA;
  const [selectedId, setSelectedId] = React.useState('FRM-00214');
  const frame = FRAMES.find(f => f.id === selectedId) || FRAMES[0];

  // Open detail and switch tab when row clicked
  const openFrame = (id) => { setSelectedId(id); setScreen('detail'); };

  let body, crumbs;
  if (screen === 'search') {
    crumbs = ['Inventory', 'Frames'];
    body = <DirA_Search frames={FRAMES} onOpen={openFrame} selectedId={selectedId} density={density} onNew={() => onNav && onNav('new')} />;
  } else if (screen === 'detail') {
    crumbs = ['Inventory', 'Frames', frame.id];
    body = <DirA_Detail frame={frame} setScreen={setScreen} />;
  } else if (screen === 'edit') {
    crumbs = ['Inventory', 'Frames', frame.id, 'Edit'];
    body = <DirA_Edit frame={frame} setScreen={setScreen} />;
  } else if (screen === 'history') {
    crumbs = ['Inventory', 'Frames', frame.id, 'History'];
    body = <DirA_Detail frame={frame} setScreen={setScreen} initialTab="history" />;
  }

  return (
    <div className={"app " + (density === 'compact' ? 'density-compact' : '')}>
      <Brand />
      <Topbar crumbs={crumbs} right={
        <div style={{display: 'flex', gap: 8}}>
          <input className="input search" placeholder="Search frames, sites, IDs…" style={{width: 280, height: 32, fontSize: 12}} />
        </div>
      } />
      <Rail active="frames" onNav={props.onNav} />
      <main className="content">{body}</main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Search screen — filters left, dense table right, with map toggle           */
/* -------------------------------------------------------------------------- */
function DirA_Search({ frames, onOpen, selectedId, density, onNew }) {
  const { REGIONS, SITE_TYPES, TECHS, STATUS_META } = window.FRAME_DATA;
  const [view, setView] = React.useState('table');
  const [filters, setFilters] = React.useState({
    region: new Set(),
    site:   new Set(['Station', 'Roadside', 'Airport', 'Shopping Centre', 'Bus Shelter']),
    status: new Set(['live','pending','maintenance','blocked']),
    tech:   new Set(),
    schoolMin: 0, schoolMax: 5000,
    query: '',
  });

  const toggle = (key, val) => {
    const next = new Set(filters[key]);
    next.has(val) ? next.delete(val) : next.add(val);
    setFilters({ ...filters, [key]: next });
  };

  const filtered = frames.filter(f => {
    if (filters.region.size > 0 && !filters.region.has(f.location.region)) return false;
    if (filters.site.size > 0 && !filters.site.has(f.site.type)) return false;
    if (filters.status.size > 0 && !filters.status.has(f.status)) return false;
    if (filters.tech.size > 0 && !filters.tech.has(f.format.tech)) return false;
    if (f.closestSchoolM < filters.schoolMin || f.closestSchoolM > filters.schoolMax) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const blob = [f.id, f.description, f.site.name, f.position, f.location.town, ...f.externalIds.map(e => e.value)].join(' ').toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });

  const activeChips = [
    ...[...filters.region].map(v => ['region', v]),
    ...(filters.site.size < 5 ? [...filters.site].map(v => ['site', v]) : []),
    ...(filters.status.size < 4 ? [...filters.status].map(v => ['status', STATUS_META[v].label]) : []),
    ...[...filters.tech].map(v => ['tech', v]),
  ];

  return (
    <React.Fragment>
      <PageHead
        title="Frames"
        meta={`${filtered.length} of ${frames.length} frames · last sync 2 min ago`}
        actions={
          <button className="btn primary" onClick={onNew}><Icon.plus /> New frame</button>
        }
      />

      <div style={{display: 'grid', gridTemplateColumns: '264px 1fr', minHeight: 'calc(100vh - 56px - 80px)'}}>
        {/* ---------- Filter sidebar ---------- */}
        <aside className="filters">
          <input
            className="input search"
            placeholder="Search in results…"
            value={filters.query}
            onChange={e => setFilters({ ...filters, query: e.target.value })}
            style={{ marginBottom: 6 }}
          />

          <div className="fg">
            <h3>Region</h3>
            {REGIONS.map(r => (
              <label key={r} className="opt">
                <input type="checkbox" checked={filters.region.has(r)} onChange={() => toggle('region', r)} />
                {r}
                <span className="count">{frames.filter(f => f.location.region === r).length}</span>
              </label>
            ))}
          </div>

          <div className="fg">
            <h3>Site type</h3>
            {SITE_TYPES.map(s => (
              <label key={s} className="opt">
                <input type="checkbox" checked={filters.site.has(s)} onChange={() => toggle('site', s)} />
                {s}
                <span className="count">{frames.filter(f => f.site.type === s).length}</span>
              </label>
            ))}
          </div>

          <div className="fg">
            <h3>Status</h3>
            {Object.entries(STATUS_META).filter(([k]) => k !== 'draft').map(([k, m]) => (
              <label key={k} className="opt">
                <input type="checkbox" checked={filters.status.has(k)} onChange={() => toggle('status', k)} />
                <span className={"chip " + m.tone} style={{height: 18, fontSize: 10}}>{m.label}</span>
                <span className="count">{frames.filter(f => f.status === k).length}</span>
              </label>
            ))}
          </div>

          <div className="fg">
            <h3>Format · tech</h3>
            {TECHS.map(t => (
              <label key={t} className="opt">
                <input type="checkbox" checked={filters.tech.has(t)} onChange={() => toggle('tech', t)} />
                {t}
                <span className="count">{frames.filter(f => f.format.tech === t).length}</span>
              </label>
            ))}
          </div>

          <div className="fg">
            <h3>Distance to closest school (m)</h3>
            <div className="range">
              <input value={filters.schoolMin} onChange={e => setFilters({...filters, schoolMin: +e.target.value || 0})} placeholder="Min" />
              <input value={filters.schoolMax} onChange={e => setFilters({...filters, schoolMax: +e.target.value || 0})} placeholder="Max" />
            </div>
            <div className="clear" style={{marginTop: 4}}>Watch-list: under 400m ({frames.filter(f => f.closestSchoolM < 400).length})</div>
          </div>

          <div className="fg">
            <h3>Saved searches</h3>
            <label className="opt"><Icon.check /> All LIVE in London</label>
            <label className="opt">Maintenance backlog</label>
            <label className="opt">Pending QA · Airports</label>
          </div>
        </aside>

        {/* ---------- Results ---------- */}
        <section style={{minWidth: 0, padding: '14px 20px 40px'}}>

          {/* Active filter chips + view toggle */}
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap'}}>
            {activeChips.length > 0 && <span style={{fontSize: 12, color: 'var(--text-secondary)'}}>Filters:</span>}
            {activeChips.map(([k, v], i) => (
              <span key={i} className="chip removable">{v}<span className="x" onClick={() => toggle(k, v)}><Icon.x width="10" height="10" /></span></span>
            ))}
            {activeChips.length > 0 && (
              <a className="clear" onClick={() => setFilters({ region: new Set(), site: new Set(SITE_TYPES), status: new Set(['live','pending','maintenance','blocked']), tech: new Set(), schoolMin: 0, schoolMax: 5000, query: '' })}>Clear all</a>
            )}
            <div style={{flex: 1}} />

            <div className="view-toggle">
              <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}><Icon.list /> Table</button>
              <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}><Icon.map /> Map</button>
            </div>
            <button className="btn outlined sm"><Icon.filter /> Columns</button>
          </div>

          {/* Results body */}
          {view === 'table' ? (
            <div className="surface" style={{padding: 0, overflow: 'hidden'}}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{width: 36}}><input type="checkbox" /></th>
                    <th style={{width: 110}}>Frame ID</th>
                    <th>Description</th>
                    <th>Site · Position</th>
                    <th>Location</th>
                    <th>Format</th>
                    <th style={{width: 110}}>School</th>
                    <th style={{width: 120}}>Status</th>
                    <th style={{width: 100}}>Updated</th>
                    <th style={{width: 40}}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.id} className={f.id === selectedId ? 'selected' : ''} onClick={() => onOpen(f.id)}>
                      <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                      <td><span className="id">{f.id}</span></td>
                      <td><div className="truncate" title={f.description}>{f.description}</div>
                          <div style={{fontSize: 11, color: 'var(--text-secondary)', marginTop: 2}}>
                            {f.externalIds.length > 0 ? `${f.externalIds.length} ext · ${f.externalIds[0].value}` : 'No external IDs'}
                          </div>
                      </td>
                      <td>
                        <div className="stack">
                          <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                            <SiteIcon type={f.site.type} width="14" height="14" style={{color: 'var(--text-secondary)'}} />
                            <span>{f.site.name}</span>
                          </span>
                          <span className="sub">{f.position}</span>
                        </div>
                      </td>
                      <td>
                        <div className="stack">
                          <span>{f.location.town}</span>
                          <span className="sub">{f.location.region}</span>
                        </div>
                      </td>
                      <td>
                        <div className="stack">
                          <span>{f.format.tech}</span>
                          <span className="sub">{f.format.dimensions}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, color: f.closestSchoolM < 400 ? 'var(--error-dark)' : 'var(--text-primary)'}}>
                          {f.closestSchoolM < 400 && <Icon.warn width="13" height="13" />}
                          {f.closestSchoolM} m
                        </span>
                      </td>
                      <td><StatusChip status={f.status} /></td>
                      <td><span className="mono">{f.updated}</span></td>
                      <td onClick={e => e.stopPropagation()}><button className="btn ghost sm icon-only"><Icon.more /></button></td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan="10" className="empty">No frames match your filters.</td></tr>}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{display: 'flex', alignItems: 'center', padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-secondary)', background: 'var(--gray-50)'}}>
                <span>Showing 1 – {filtered.length} of {filtered.length}</span>
                <div style={{flex: 1}} />
                <span>Rows per page:</span>
                <select className="input" style={{height: 28, width: 64, marginLeft: 8, fontSize: 12}}><option>25</option><option>50</option><option>100</option></select>
                <button className="btn ghost sm icon-only" disabled style={{marginLeft: 16}}><Icon.chevL /></button>
                <button className="btn ghost sm icon-only" disabled><Icon.chev /></button>
              </div>
            </div>
          ) : (
            <div className="surface" style={{height: 'calc(100vh - 240px)', padding: 0, overflow: 'hidden'}}>
              <FrameMap frames={filtered} activeId={selectedId} onPick={onOpen} />
            </div>
          )}
        </section>
      </div>
    </React.Fragment>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail screen — tabs: Overview · External IDs · History                    */
/* -------------------------------------------------------------------------- */
function DirA_Detail({ frame, setScreen, initialTab }) {
  const [tab, setTab] = React.useState(initialTab || 'overview');
  const tabs = [
    { id: 'overview',   label: 'Overview' },
    { id: 'external',   label: 'External IDs', count: frame.externalIds.length },
    { id: 'history',    label: 'History',      count: frame.history.length },
  ];

  return (
    <React.Fragment>
      <PageHead
        title={
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}>
            <button className="btn ghost sm icon-only" onClick={() => setScreen('search')}><Icon.chevL /></button>
            <span className="id" style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500}}>{frame.id}</span>
            <span style={{fontSize: 22, fontWeight: 600}}>{frame.site.name}</span>
            <StatusChip status={frame.status} />
          </span>
        }
        meta={frame.description}
        actions={
          <React.Fragment>
            <button className="btn outlined"><Icon.history /> History</button>
            <button className="btn outlined"><Icon.more /></button>
            <button className="btn primary" onClick={() => setScreen('edit')}><Icon.pencil /> Edit frame</button>
          </React.Fragment>
        }
        tabs={tabs}
        activeTab={tab}
        onTab={(id) => id === 'history' ? setScreen('history') || setTab(id) : setTab(id)}
      />

      <div style={{padding: '20px 24px 60px', maxWidth: 1320}}>
        {tab === 'overview' && <DirA_Overview frame={frame} />}
        {tab === 'external' && (
          <div className="surface" style={{padding: 20}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 16}}>
              <div>
                <h2 style={{fontSize: 16, fontWeight: 600, marginBottom: 2}}>External IDs</h2>
                <div style={{fontSize: 12, color: 'var(--text-secondary)'}}>
                  This frame is referenced in {frame.externalIds.length} downstream {frame.externalIds.length === 1 ? 'system' : 'systems'}. Adding an external ID lets that system look up this frame by its own identifier.
                </div>
              </div>
            </div>
            <ExternalIdsTable ids={frame.externalIds} editable />
            <div className="banner" style={{marginTop: 16}}>
              <Icon.info /> External IDs are case-sensitive and validated against each system's pattern. Conflicts are surfaced before save.
            </div>
          </div>
        )}
        {tab === 'history' && (
          <div className="surface" style={{padding: 24}}>
            <div style={{display: 'flex', alignItems: 'flex-end', marginBottom: 18}}>
              <div>
                <h2 style={{fontSize: 16, fontWeight: 600, marginBottom: 2}}>Change history</h2>
                <div style={{fontSize: 12, color: 'var(--text-secondary)'}}>Every edit to this frame and its external IDs. Showing latest first.</div>
              </div>
              <div style={{flex: 1}} />
              <select className="input" style={{height: 32, width: 160, fontSize: 12}}>
                <option>All changes</option>
                <option>Mine only</option>
                <option>Created / deleted</option>
              </select>
            </div>
            <Timeline items={frame.history} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

function DirA_Overview({ frame }) {
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 24}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <div className="surface" style={{padding: 24}}>
          <h2 style={{fontSize: 14, fontWeight: 600, marginBottom: 14}}>Location</h2>
          <KVGrid entries={[
            ['Region', frame.location.region],
            ['Town', frame.location.town],
            ['Postcode', frame.location.postcode, {mono: true}],
            ['Coordinates', `${frame.location.lat}, ${frame.location.lng}`, {mono: true, muted: true}],
          ]} />
        </div>

        <div className="surface" style={{padding: 24}}>
          <h2 style={{fontSize: 14, fontWeight: 600, marginBottom: 14}}>Site & position</h2>
          <KVGrid entries={[
            ['Site type', frame.site.type],
            ['Site name', frame.site.name],
            ['Position', frame.position],
            ['Distance to closest school',
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, color: frame.closestSchoolM < 400 ? 'var(--error-dark)' : 'inherit'}}>
                {frame.closestSchoolM < 400 && <Icon.warn width="14" height="14" />}
                {frame.closestSchoolM} m
                {frame.closestSchoolM < 400 && <span className="chip error" style={{height: 18, fontSize: 10}}>Watch-list</span>}
              </span>
            ],
          ]} />
        </div>

        <div className="surface" style={{padding: 24}}>
          <h2 style={{fontSize: 14, fontWeight: 600, marginBottom: 14}}>Format · tech specs</h2>
          <KVGrid entries={[
            ['Technology', frame.format.tech],
            ['Orientation', frame.format.orientation],
            ['Dimensions', frame.format.dimensions, {mono: true}],
            ['Resolution', frame.format.resolution, {mono: true}],
            ['Illumination', frame.format.illumination],
            ['Slot length / share', frame.format.slot],
          ]} />
        </div>

        <div className="surface" style={{padding: 24}}>
          <div style={{display: 'flex', alignItems: 'baseline', marginBottom: 14}}>
            <h2 style={{fontSize: 14, fontWeight: 600}}>External IDs</h2>
            <div style={{flex: 1}} />
            <a style={{fontSize: 12}}>Manage all →</a>
          </div>
          <ExternalIdsTable ids={frame.externalIds.slice(0, 3)} />
        </div>
      </div>

      <aside style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <div className="surface" style={{padding: 0, overflow: 'hidden'}}>
          <div style={{height: 220}}>
            <FrameMap frames={[frame]} activeId={frame.id} />
          </div>
          <div style={{padding: 14}}>
            <div style={{fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 4}}>On the map</div>
            <div style={{fontSize: 13}}>{frame.location.town} · {frame.location.region}</div>
            <a style={{fontSize: 12, marginTop: 6, display: 'inline-block'}}>Open in map view →</a>
          </div>
        </div>

        <div className="surface" style={{padding: 20}}>
          <div style={{fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 10}}>Recent activity</div>
          {frame.history.slice(0, 3).map((h, i) => (
            <div key={i} style={{display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'flex-start'}}>
              <div style={{width: 28, height: 28, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--primary-dark)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0}}>{h.initials}</div>
              <div style={{minWidth: 0, flex: 1}}>
                <div style={{fontSize: 12}}><b>{h.user}</b> {h.verb}</div>
                <div style={{fontSize: 11, color: 'var(--text-secondary)'}}>{h.ts}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Edit screen — long sectioned form with sticky save bar                     */
/* -------------------------------------------------------------------------- */
function DirA_Edit({ frame, setScreen }) {
  return (
    <React.Fragment>
      <PageHead
        title={
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}>
            <button className="btn ghost sm icon-only" onClick={() => setScreen('detail')}><Icon.chevL /></button>
            <span style={{fontSize: 22, fontWeight: 600}}>Edit frame</span>
            <span className="id" style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500}}>{frame.id}</span>
          </span>
        }
        meta="Editing affects this frame in all downstream systems. Changes are logged in history."
      />

      <div style={{maxWidth: 920, margin: '0 auto', padding: '20px 24px 0'}}>

        <div className="banner" style={{marginBottom: 20, background: 'var(--orange-50)', borderColor: 'var(--orange-200)', borderLeftColor: 'var(--warning-main)', color: 'var(--orange-1400)'}}>
          <Icon.warn />
          <div>
            <b>This frame is live</b> — changes to dimensions or status will trigger re-validation in Broadsign CMS. Drafts can be safely saved without re-validation.
          </div>
        </div>

        <div className="surface">
          <div className="section-block">
            <h2>Description</h2>
            <div className="lead">A human-readable summary that shows up in search.</div>
            <div className="field">
              <textarea defaultValue={frame.description}></textarea>
            </div>
          </div>

          <div className="section-block">
            <h2>Location</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
              <div className="field">
                <label>Region <span className="req">*</span></label>
                <select defaultValue={frame.location.region}>
                  {window.FRAME_DATA.REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Town / city <span className="req">*</span></label>
                <input type="text" defaultValue={frame.location.town} />
              </div>
              <div className="field">
                <label>Postcode</label>
                <input type="text" defaultValue={frame.location.postcode} />
              </div>
              <div className="field">
                <label>Coordinates (lat, lng)</label>
                <input type="text" defaultValue={`${frame.location.lat}, ${frame.location.lng}`} />
                <span className="help">Used by the map view & nearest-school calculation.</span>
              </div>
            </div>
          </div>

          <div className="section-block">
            <h2>Site & position</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16}}>
              <div className="field">
                <label>Site type <span className="req">*</span></label>
                <select defaultValue={frame.site.type}>
                  {window.FRAME_DATA.SITE_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field" style={{gridColumn: 'span 2'}}>
                <label>Site name <span className="req">*</span></label>
                <input type="text" defaultValue={frame.site.name} />
              </div>
              <div className="field" style={{gridColumn: 'span 3'}}>
                <label>Position within site <span className="req">*</span></label>
                <input type="text" defaultValue={frame.position} />
                <span className="help">e.g. "Concourse · Above escalator E2", "Platform 12 · Northbound"</span>
              </div>
              <div className="field">
                <label>Distance to closest school (m)</label>
                <input type="number" defaultValue={frame.closestSchoolM} />
                <span className={frame.closestSchoolM < 400 ? 'err' : 'help'}>
                  {frame.closestSchoolM < 400 ? '⚠ Under 400 m · subject to category restrictions.' : 'Used for category-restricted content filtering.'}
                </span>
              </div>
            </div>
          </div>

          <div className="section-block">
            <h2>Format · tech specs</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16}}>
              <div className="field">
                <label>Technology <span className="req">*</span></label>
                <select defaultValue={frame.format.tech}>
                  {window.FRAME_DATA.TECHS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Orientation</label>
                <select defaultValue={frame.format.orientation}><option>Landscape</option><option>Portrait</option></select>
              </div>
              <div className="field">
                <label>Illumination</label>
                <select defaultValue={frame.format.illumination}><option>Internal LED</option><option>Backlit</option><option>Front-lit</option><option>None</option></select>
              </div>
              <div className="field">
                <label>Dimensions (W × H mm)</label>
                <input type="text" defaultValue={frame.format.dimensions} />
              </div>
              <div className="field">
                <label>Resolution (px)</label>
                <input type="text" defaultValue={frame.format.resolution} />
              </div>
              <div className="field">
                <label>Slot length / share</label>
                <input type="text" defaultValue={frame.format.slot} />
              </div>
            </div>
          </div>

          <div className="section-block">
            <div style={{display: 'flex', alignItems: 'flex-end', marginBottom: 8}}>
              <div>
                <h2>External IDs</h2>
                <div className="lead">Identifiers that downstream systems use to reference this frame.</div>
              </div>
            </div>
            <ExternalIdsTable ids={frame.externalIds} editable />
          </div>

          <div className="section-block">
            <h2>Status</h2>
            <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
              {['live', 'pending', 'maintenance', 'blocked', 'draft'].map(s => (
                <label key={s} style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid var(--border-default)', borderRadius: 999, cursor: 'pointer', background: s === frame.status ? 'var(--blue-50)' : 'white', borderColor: s === frame.status ? 'var(--primary-main)' : 'var(--border-default)'}}>
                  <input type="radio" name="status" defaultChecked={s === frame.status} />
                  <StatusChip status={s} />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky-bar" style={{marginTop: 0, borderRadius: 0}}>
          <span className="left">Last saved 2 minutes ago · auto-save off</span>
          <span className="spacer" />
          <button className="btn ghost" onClick={() => setScreen('detail')}>Cancel</button>
          <button className="btn outlined">Save as draft</button>
          <button className="btn primary" onClick={() => setScreen('detail')}><Icon.check /> Save changes</button>
        </div>
      </div>
    </React.Fragment>
  );
}

window.DirA = DirA;
