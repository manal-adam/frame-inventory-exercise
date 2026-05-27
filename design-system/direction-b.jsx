// =============================================================================
// Direction B — "Split workspace"
// Persistent list on left; right pane swaps between detail / edit / history / map
// =============================================================================

function DirB({ screen, setScreen, density, onNav }) {
  const props = { onNav };
  const { FRAMES } = window.FRAME_DATA;
  const [selectedId, setSelectedId] = React.useState('FRM-00214');
  const [query, setQuery] = React.useState('');
  const [siteFilter, setSiteFilter] = React.useState('All');
  // right pane modes — independent from list
  const [right, setRight] = React.useState('detail'); // detail | edit | history | map
  const frame = FRAMES.find(f => f.id === selectedId) || FRAMES[0];

  // sync screen→right and right→screen
  React.useEffect(() => {
    if (screen === 'search')  setRight('map');
    if (screen === 'detail')  setRight('detail');
    if (screen === 'edit')    setRight('edit');
    if (screen === 'history') setRight('history');
  }, [screen]);

  const filteredList = FRAMES.filter(f => {
    if (siteFilter !== 'All' && f.site.type !== siteFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return [f.id, f.description, f.site.name, f.position, f.location.town].join(' ').toLowerCase().includes(q);
    }
    return true;
  });

  const crumbs = right === 'map'
    ? ['Inventory', 'Frames', 'Map view']
    : ['Inventory', 'Frames', frame.id, right === 'detail' ? '' : right.charAt(0).toUpperCase() + right.slice(1)].filter(Boolean);

  return (
    <div className={"app " + (density === 'compact' ? 'density-compact' : '')}>
      <Brand />
      <Topbar crumbs={crumbs} right={
        <button className="btn primary sm" onClick={() => props.onNav && props.onNav('new')}><Icon.plus width="14" height="14" /> New frame</button>
      } />
      <Rail active="frames" onNav={props.onNav} />
      <main className="content" style={{padding: 0, background: 'var(--white)'}}>
        <div className="split">
          {/* ---------- Left: persistent list ---------- */}
          <aside className="list">
            <div className="list-head">
              <div style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
                <div>
                  <div style={{fontSize: 16, fontWeight: 600}}>Frames</div>
                  <div style={{fontSize: 11, color: 'var(--text-secondary)'}}>{filteredList.length} of {FRAMES.length} · {FRAMES.filter(f => f.status === 'live').length} live</div>
                </div>
                <div style={{flex: 1}} />
                <button className="btn ghost sm icon-only"><Icon.filter /></button>
              </div>
              <input className="input search" placeholder="Search frames, IDs…" value={query} onChange={e => setQuery(e.target.value)} style={{height: 34, fontSize: 12, marginBottom: 8}} />
              <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
                {['All', 'Station', 'Roadside', 'Airport', 'Shopping Centre', 'Bus Shelter'].map(s => (
                  <button key={s} onClick={() => setSiteFilter(s)} className={"chip " + (siteFilter === s ? 'primary' : '')} style={{cursor: 'pointer', border: 'none'}}>{s}</button>
                ))}
              </div>
            </div>
            {filteredList.map(f => (
              <div key={f.id} className={"row" + (f.id === selectedId ? ' active' : '')} onClick={() => { setSelectedId(f.id); setScreen('detail'); }}>
                <div className="head">
                  <span className="id">{f.id}</span>
                  <StatusChip status={f.status} />
                </div>
                <div className="title">{f.site.name}</div>
                <div className="sub" style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                  <SiteIcon type={f.site.type} width="12" height="12" />
                  {f.position}
                </div>
                <div className="sub" style={{fontSize: 11, display: 'flex', gap: 10, marginTop: 2, color: 'var(--text-secondary)'}}>
                  <span>{f.location.town}</span>
                  <span>·</span>
                  <span>{f.format.tech.replace(/^Digital |^Classic /,'')}</span>
                  {f.closestSchoolM < 400 && <span style={{color: 'var(--error-dark)', display: 'inline-flex', alignItems: 'center', gap: 2}}><Icon.school width="10" height="10" />{f.closestSchoolM}m</span>}
                </div>
              </div>
            ))}
            {filteredList.length === 0 && <div className="empty">No frames match.</div>}
          </aside>

          {/* ---------- Right: detail pane (or map / edit / history) ---------- */}
          <section className="detail">
            {/* Pane header */}
            <div style={{background: 'white', borderBottom: '1px solid var(--border-subtle)', padding: '14px 24px', position: 'sticky', top: 0, zIndex: 1}}>
              {right !== 'map' ? (
                <div style={{display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'}}>
                  <span className="id" style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, background: 'var(--gray-100)', padding: '3px 8px', borderRadius: 3}}>{frame.id}</span>
                  <h1 style={{fontSize: 18, fontWeight: 600}}>{frame.site.name}</h1>
                  <StatusChip status={frame.status} />
                  <span style={{fontSize: 12, color: 'var(--text-secondary)'}}>·</span>
                  <span style={{fontSize: 12, color: 'var(--text-secondary)'}}>{frame.position}</span>
                  <div style={{flex: 1}} />

                  {/* right-pane mode switcher */}
                  <div className="view-toggle" style={{height: 32}}>
                    <button className={right === 'detail'  ? 'active' : ''} onClick={() => { setRight('detail');  setScreen('detail');  }}><Icon.info width="14" height="14" /> Detail</button>
                    <button className={right === 'edit'    ? 'active' : ''} onClick={() => { setRight('edit');    setScreen('edit');    }}><Icon.pencil width="14" height="14" /> Edit</button>
                    <button className={right === 'history' ? 'active' : ''} onClick={() => { setRight('history'); setScreen('history'); }}><Icon.history width="14" height="14" /> History</button>
                    <button className={right === 'map'     ? 'active' : ''} onClick={() => { setRight('map');     setScreen('search');  }}><Icon.map width="14" height="14" /> Map</button>
                  </div>
                </div>
              ) : (
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <h1 style={{fontSize: 18, fontWeight: 600}}>Map view</h1>
                  <span style={{fontSize: 12, color: 'var(--text-secondary)'}}>{filteredList.length} frames plotted</span>
                  <div style={{flex: 1}} />
                  <div className="view-toggle" style={{height: 32}}>
                    <button onClick={() => { setRight('detail'); setScreen('detail'); }}><Icon.list width="14" height="14" /> Detail</button>
                    <button className="active"><Icon.map width="14" height="14" /> Map</button>
                  </div>
                </div>
              )}
            </div>

            {/* Pane body */}
            <div style={{padding: '20px 24px 60px'}}>
              {right === 'detail'  && <DirB_Detail  frame={frame} />}
              {right === 'edit'    && <DirB_Edit    frame={frame} onCancel={() => { setRight('detail'); setScreen('detail'); }} />}
              {right === 'history' && <DirB_History frame={frame} />}
              {right === 'map'     && <div style={{height: 'calc(100vh - 56px - 65px - 40px)'}}><FrameMap frames={filteredList} activeId={selectedId} onPick={(id) => { setSelectedId(id); setRight('detail'); setScreen('detail'); }} /></div>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail (read-only) — Overview + External IDs in one scrollable pane        */
/* -------------------------------------------------------------------------- */
function DirB_Detail({ frame }) {
  return (
    <div style={{maxWidth: 1080, display: 'flex', flexDirection: 'column', gap: 16}}>
      <p style={{margin: 0, color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.6}}>{frame.description}</p>

      {/* Hero stats row */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12}}>
        {[
          { k: 'Site type',    v: frame.site.type,         icon: <SiteIcon type={frame.site.type} width="20" height="20" /> },
          { k: 'Format',       v: frame.format.tech,       icon: <Icon.frame width="20" height="20" /> },
          { k: 'Closest school', v: frame.closestSchoolM + ' m', icon: <Icon.school width="20" height="20" />, warn: frame.closestSchoolM < 400 },
          { k: 'External IDs', v: frame.externalIds.length + ' linked', icon: <Icon.link width="20" height="20" /> },
        ].map((s, i) => (
          <div key={i} className="surface" style={{padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: s.warn ? 'var(--red-50)' : 'white', borderColor: s.warn ? 'var(--red-200)' : 'var(--border-subtle)'}}>
            <div style={{width: 36, height: 36, borderRadius: 8, background: s.warn ? 'var(--red-100)' : 'var(--blue-50)', color: s.warn ? 'var(--red-1000)' : 'var(--primary-main)', display: 'grid', placeItems: 'center'}}>{s.icon}</div>
            <div>
              <div style={{fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)'}}>{s.k}</div>
              <div style={{fontSize: 14, fontWeight: 500}}>{s.v}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 16}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div className="surface" style={{padding: 20}}>
            <h2 style={{fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)'}}>Location</h2>
            <KVGrid entries={[
              ['Region', frame.location.region],
              ['Town', frame.location.town],
              ['Postcode', frame.location.postcode, {mono: true}],
              ['Coordinates', `${frame.location.lat}, ${frame.location.lng}`, {mono: true, muted: true}],
            ]} />
          </div>

          <div className="surface" style={{padding: 20}}>
            <h2 style={{fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)'}}>Site & position</h2>
            <KVGrid entries={[
              ['Site type', frame.site.type],
              ['Site name', frame.site.name],
              ['Position', frame.position],
            ]} />
          </div>

          <div className="surface" style={{padding: 20}}>
            <h2 style={{fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)'}}>Format · tech specs</h2>
            <KVGrid entries={[
              ['Technology', frame.format.tech],
              ['Orientation', frame.format.orientation],
              ['Dimensions', frame.format.dimensions, {mono: true}],
              ['Resolution', frame.format.resolution, {mono: true}],
              ['Illumination', frame.format.illumination],
              ['Slot length', frame.format.slot],
            ]} />
          </div>

          <div className="surface" style={{padding: 20}}>
            <div style={{display: 'flex', alignItems: 'baseline', marginBottom: 14}}>
              <h2 style={{fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)'}}>External IDs</h2>
              <div style={{flex: 1}} />
              <span className="chip">{frame.externalIds.length}</span>
            </div>
            <ExternalIdsTable ids={frame.externalIds} />
          </div>
        </div>

        <aside style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div className="surface" style={{padding: 0, overflow: 'hidden'}}>
            <div style={{height: 200}}>
              <FrameMap frames={[frame]} activeId={frame.id} />
            </div>
            <div style={{padding: 14, fontSize: 12}}>
              <div style={{fontWeight: 600, marginBottom: 2}}>{frame.location.town}, {frame.location.region}</div>
              <div style={{color: 'var(--text-secondary)'}}>{frame.location.postcode}</div>
            </div>
          </div>

          <div className="surface" style={{padding: 20}}>
            <div style={{fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 12}}>Recent activity</div>
            {frame.history.slice(0, 3).map((h, i) => (
              <div key={i} style={{display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'flex-start'}}>
                <div style={{width: 26, height: 26, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--primary-dark)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0}}>{h.initials}</div>
                <div style={{minWidth: 0, flex: 1, fontSize: 12}}>
                  <div><b>{h.user}</b> {h.verb}</div>
                  <div style={{color: 'var(--text-secondary)', fontSize: 11}}>{h.ts}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Edit — compact form, still inside split pane                               */
/* -------------------------------------------------------------------------- */
function DirB_Edit({ frame, onCancel }) {
  return (
    <div style={{maxWidth: 820}}>
      <div className="banner" style={{marginBottom: 16}}>
        <Icon.info /> Editing in split-pane keeps the list visible. Changes here trigger re-validation downstream when saved.
      </div>

      <div className="surface">
        <div className="section-block">
          <h2>Description</h2>
          <textarea className="input" defaultValue={frame.description} style={{height: 'auto', padding: 8, minHeight: 64}}></textarea>
        </div>

        <div className="section-block">
          <h2>Location</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
            <div className="field"><label>Region</label>
              <select defaultValue={frame.location.region}>{window.FRAME_DATA.REGIONS.map(r => <option key={r}>{r}</option>)}</select>
            </div>
            <div className="field"><label>Town</label><input type="text" defaultValue={frame.location.town} /></div>
            <div className="field"><label>Postcode</label><input type="text" defaultValue={frame.location.postcode} /></div>
            <div className="field"><label>Lat, Lng</label><input type="text" defaultValue={`${frame.location.lat}, ${frame.location.lng}`} /></div>
          </div>
        </div>

        <div className="section-block">
          <h2>Site & position</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12}}>
            <div className="field"><label>Site type</label>
              <select defaultValue={frame.site.type}>{window.FRAME_DATA.SITE_TYPES.map(s => <option key={s}>{s}</option>)}</select>
            </div>
            <div className="field"><label>Site name</label><input type="text" defaultValue={frame.site.name} /></div>
          </div>
          <div className="field" style={{marginBottom: 12}}>
            <label>Position within site</label>
            <input type="text" defaultValue={frame.position} />
          </div>
          <div className="field" style={{maxWidth: 280}}>
            <label>Distance to closest school (m)</label>
            <input type="number" defaultValue={frame.closestSchoolM} />
            <span className={frame.closestSchoolM < 400 ? 'err' : 'help'}>
              {frame.closestSchoolM < 400 ? '⚠ Under 400 m — category restrictions apply.' : 'For category-restricted content filtering.'}
            </span>
          </div>
        </div>

        <div className="section-block">
          <h2>Format · tech specs</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12}}>
            <div className="field"><label>Tech</label><select defaultValue={frame.format.tech}>{window.FRAME_DATA.TECHS.map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="field"><label>Orientation</label><select defaultValue={frame.format.orientation}><option>Landscape</option><option>Portrait</option></select></div>
            <div className="field"><label>Illumination</label><select defaultValue={frame.format.illumination}><option>Internal LED</option><option>Backlit</option><option>Front-lit</option><option>None</option></select></div>
            <div className="field"><label>Dimensions (mm)</label><input type="text" defaultValue={frame.format.dimensions} /></div>
            <div className="field"><label>Resolution (px)</label><input type="text" defaultValue={frame.format.resolution} /></div>
            <div className="field"><label>Slot</label><input type="text" defaultValue={frame.format.slot} /></div>
          </div>
        </div>

        <div className="section-block">
          <h2>External IDs</h2>
          <ExternalIdsTable ids={frame.externalIds} editable />
        </div>
      </div>

      <div className="sticky-bar" style={{marginTop: 0}}>
        <span className="left">Last saved 2 min ago</span>
        <span className="spacer" />
        <button className="btn ghost" onClick={onCancel}>Cancel</button>
        <button className="btn outlined">Save as draft</button>
        <button className="btn primary" onClick={onCancel}><Icon.check /> Save changes</button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* History — same timeline component                                          */
/* -------------------------------------------------------------------------- */
function DirB_History({ frame }) {
  return (
    <div style={{maxWidth: 820}}>
      <div className="surface" style={{padding: 24}}>
        <div style={{display: 'flex', alignItems: 'flex-end', marginBottom: 18}}>
          <div>
            <h2 style={{fontSize: 15, fontWeight: 600, marginBottom: 2}}>Change history</h2>
            <div style={{fontSize: 12, color: 'var(--text-secondary)'}}>Every edit to this frame and its external IDs.</div>
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
    </div>
  );
}

window.DirB = DirB;
