// =============================================================================
// New Frame screen + Master Data screens (Regions & Towns, Site Types,
// Formats, External ID Systems)
// =============================================================================

/* -------------------------------------------------------------------------- */
/* New Frame                                                                  */
/* -------------------------------------------------------------------------- */
function NewFrameScreen({ onCancel, onCreate }) {
  const { REGIONS, SITE_TYPES, TECHS } = window.FRAME_DATA;
  const [step, setStep] = React.useState(1);
  const [draft, setDraft] = React.useState({
    description: '',
    region: REGIONS[0], town: '', postcode: '', lat: '', lng: '',
    siteType: SITE_TYPES[0], siteName: '', position: '', closestSchoolM: '',
    tech: TECHS[0], orientation: 'Landscape', dimensions: '', resolution: '', illumination: 'Internal LED', slot: '10s · 6/min',
    status: 'draft',
    externalIds: [],
  });
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const steps = [
    { n: 1, label: 'Basics' },
    { n: 2, label: 'Location & site' },
    { n: 3, label: 'Format' },
    { n: 4, label: 'External IDs' },
    { n: 5, label: 'Review' },
  ];
  const next = () => setStep(Math.min(5, step + 1));
  const prev = () => setStep(Math.max(1, step - 1));

  return (
    <React.Fragment>
      <PageHead
        title={
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}>
            <button className="btn ghost sm icon-only" onClick={onCancel}><Icon.chevL /></button>
            <span style={{fontSize: 22, fontWeight: 600}}>New frame</span>
            <span className="chip neutral">Draft</span>
          </span>
        }
        meta="Add a new physical OOH frame to the inventory. It will receive an internal ID on save and can be linked to external systems."
      />

      {/* Stepper */}
      <div style={{background: 'white', borderBottom: '1px solid var(--border-subtle)', padding: '14px 24px'}}>
        <div style={{display: 'flex', gap: 0, alignItems: 'center', maxWidth: 880}}>
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}} onClick={() => setStep(s.n)}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  display: 'grid', placeItems: 'center',
                  fontSize: 11, fontWeight: 600,
                  background: step === s.n ? 'var(--primary-main)' : step > s.n ? 'var(--green-100)' : 'var(--gray-100)',
                  color: step === s.n ? 'white' : step > s.n ? 'var(--green-1200)' : 'var(--text-secondary)',
                }}>{step > s.n ? '✓' : s.n}</div>
                <span style={{fontSize: 12, fontWeight: step === s.n ? 600 : 500, color: step === s.n ? 'var(--text-primary)' : 'var(--text-secondary)'}}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div style={{flex: 1, height: 1, background: 'var(--border-subtle)', margin: '0 12px'}} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{maxWidth: 880, margin: '0 auto', padding: '20px 24px 0'}}>

        {step === 1 && (
          <div className="surface">
            <div className="section-block">
              <h2>Description</h2>
              <div className="lead">A short human-readable summary. Appears in search results.</div>
              <div className="field">
                <textarea value={draft.description} onChange={e => set('description', e.target.value)} placeholder="e.g. D6 landscape unit above eastern concourse — high dwell-time positioning, faces ticket gates."></textarea>
              </div>
            </div>
            <div className="section-block">
              <h2>Initial status</h2>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                {['draft', 'pending', 'live'].map(s => (
                  <label key={s} style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid', borderRadius: 999, cursor: 'pointer', background: s === draft.status ? 'var(--blue-50)' : 'white', borderColor: s === draft.status ? 'var(--primary-main)' : 'var(--border-default)'}}>
                    <input type="radio" name="newstatus" checked={s === draft.status} onChange={() => set('status', s)} />
                    <StatusChip status={s} />
                  </label>
                ))}
              </div>
              <div className="lead" style={{marginTop: 10}}>Drafts skip downstream re-validation. Use <b>Pending</b> once details are confirmed.</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="surface">
            <div className="section-block">
              <h2>Location</h2>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                <div className="field"><label>Region <span className="req">*</span></label>
                  <select value={draft.region} onChange={e => set('region', e.target.value)}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select>
                  <span className="help">From master data · <a href="#" onClick={e => e.preventDefault()}>manage regions</a></span>
                </div>
                <div className="field"><label>Town / city <span className="req">*</span></label>
                  <input type="text" value={draft.town} onChange={e => set('town', e.target.value)} placeholder="London" />
                </div>
                <div className="field"><label>Postcode</label>
                  <input type="text" value={draft.postcode} onChange={e => set('postcode', e.target.value)} placeholder="SE1 8SW" />
                </div>
                <div className="field"><label>Coordinates (lat, lng)</label>
                  <input type="text" value={draft.lat ? `${draft.lat}, ${draft.lng}` : ''} onChange={e => { const [a, b] = e.target.value.split(',').map(s => s.trim()); set('lat', a); set('lng', b); }} placeholder="51.5036, -0.1143" />
                </div>
              </div>
            </div>
            <div className="section-block">
              <h2>Site & position</h2>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16}}>
                <div className="field"><label>Site type <span className="req">*</span></label>
                  <select value={draft.siteType} onChange={e => set('siteType', e.target.value)}>{SITE_TYPES.map(s => <option key={s}>{s}</option>)}</select>
                </div>
                <div className="field"><label>Site name <span className="req">*</span></label>
                  <input type="text" value={draft.siteName} onChange={e => set('siteName', e.target.value)} placeholder="London Waterloo" />
                </div>
              </div>
              <div className="field" style={{marginBottom: 16}}>
                <label>Position within site <span className="req">*</span></label>
                <input type="text" value={draft.position} onChange={e => set('position', e.target.value)} placeholder='e.g. "Concourse · Above escalator E2"' />
              </div>
              <div className="field" style={{maxWidth: 320}}>
                <label>Distance to closest school (m)</label>
                <input type="number" value={draft.closestSchoolM} onChange={e => set('closestSchoolM', e.target.value)} placeholder="412" />
                <span className={+draft.closestSchoolM > 0 && +draft.closestSchoolM < 400 ? 'err' : 'help'}>
                  {+draft.closestSchoolM > 0 && +draft.closestSchoolM < 400 ? '⚠ Under 400 m — category restrictions will apply.' : 'For category-restricted content filtering.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="surface">
            <div className="section-block">
              <h2>Format · tech specs</h2>
              <div className="lead">Pick values from master data. Need a new option? Open Master data → Formats.</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16}}>
                <div className="field"><label>Technology <span className="req">*</span></label><select value={draft.tech} onChange={e => set('tech', e.target.value)}>{TECHS.map(t => <option key={t}>{t}</option>)}</select></div>
                <div className="field"><label>Orientation</label><select value={draft.orientation} onChange={e => set('orientation', e.target.value)}><option>Landscape</option><option>Portrait</option></select></div>
                <div className="field"><label>Illumination</label><select value={draft.illumination} onChange={e => set('illumination', e.target.value)}><option>Internal LED</option><option>Backlit</option><option>Front-lit</option><option>None</option></select></div>
                <div className="field"><label>Dimensions (W × H mm)</label><input type="text" value={draft.dimensions} onChange={e => set('dimensions', e.target.value)} placeholder="1920 × 1080 mm" /></div>
                <div className="field"><label>Resolution (px)</label><input type="text" value={draft.resolution} onChange={e => set('resolution', e.target.value)} placeholder="1920 × 1080 px" /></div>
                <div className="field"><label>Slot length / share</label><input type="text" value={draft.slot} onChange={e => set('slot', e.target.value)} placeholder="10s · 6/min" /></div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="surface">
            <div className="section-block">
              <h2>Link external IDs (optional)</h2>
              <div className="lead">Add identifiers used by downstream systems to reference this frame. You can also link these later.</div>
              <ExternalIdsTable ids={draft.externalIds} editable />
              <div className="banner" style={{marginTop: 16}}>
                <Icon.info /> External ID systems are master data — add a new system via Master data → External ID Systems.
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="surface" style={{padding: 24}}>
            <h2 style={{fontSize: 16, fontWeight: 600, marginBottom: 14}}>Review & create</h2>
            <KVGrid entries={[
              ['Description', draft.description || '—', { muted: !draft.description }],
              ['Region · Town', `${draft.region} · ${draft.town || '—'}`],
              ['Postcode', draft.postcode || '—', { mono: true, muted: !draft.postcode }],
              ['Site', `${draft.siteType} · ${draft.siteName || '—'}`],
              ['Position', draft.position || '—'],
              ['Closest school', draft.closestSchoolM ? `${draft.closestSchoolM} m` : '—', { muted: !draft.closestSchoolM }],
              ['Tech', draft.tech],
              ['Dimensions', draft.dimensions || '—', { mono: true, muted: !draft.dimensions }],
              ['Resolution', draft.resolution || '—', { mono: true, muted: !draft.resolution }],
              ['Illumination', draft.illumination],
              ['Slot', draft.slot],
              ['Status', <StatusChip status={draft.status} />],
              ['External IDs', draft.externalIds.length ? `${draft.externalIds.length} linked` : 'None yet', { muted: !draft.externalIds.length }],
            ]} />
            <div className="banner" style={{marginTop: 18}}>
              <Icon.info /> A new internal ID will be assigned on create (next: <span className="mono">FRM-01210</span>).
            </div>
          </div>
        )}

        <div className="sticky-bar" style={{marginTop: 0}}>
          <span className="left">Step {step} of {steps.length} · {steps[step-1].label}</span>
          <span className="spacer" />
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          {step > 1 && <button className="btn outlined" onClick={prev}><Icon.chevL /> Back</button>}
          {step < 5
            ? <button className="btn primary" onClick={next}>Continue <Icon.chev /></button>
            : <button className="btn primary" onClick={() => onCreate(draft)}><Icon.check /> Create frame</button>
          }
        </div>
      </div>
    </React.Fragment>
  );
}

/* -------------------------------------------------------------------------- */
/* Master data: shared shell + 4 sections                                     */
/* -------------------------------------------------------------------------- */
const MD_CONTENT = {
  'md-regions': {
    title: 'Regions & Towns',
    lead: 'Hierarchical master data used in every frame\u2019s location. Towns belong to regions; both are validated when adding a frame.',
    addLabel: 'New region',
    cols: [
      { k: 'name',  label: 'Region',       w: '28%' },
      { k: 'towns', label: 'Towns',        w: 'auto' },
      { k: 'count', label: 'Frames',       w: '90px', align: 'right' },
      { k: 'upd',   label: 'Last updated', w: '130px' },
    ],
    rows: () => {
      const { FRAMES, REGIONS } = window.FRAME_DATA;
      return REGIONS.map(r => {
        const fs = FRAMES.filter(f => f.location.region === r);
        const towns = [...new Set(fs.map(f => f.location.town))];
        return {
          _row: { name: r, towns },
          name: r,
          towns: <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>{towns.map(t => <span key={t} className="chip">{t}</span>)}</div>,
          count: fs.length,
          upd: '2026-04-12',
        };
      });
    },
  },
  'md-sites': {
    title: 'Site Types',
    lead: 'The kinds of places a frame can live. Add new types as the inventory expands (e.g. petrol forecourt, gym).',
    addLabel: 'New site type',
    cols: [
      { k: 'icon', label: '', w: '40px' },
      { k: 'name',  label: 'Site type', w: '28%' },
      { k: 'desc',  label: 'Description', w: 'auto' },
      { k: 'count', label: 'Frames', w: '90px', align: 'right' },
    ],
    rows: () => {
      const { FRAMES, SITE_TYPES } = window.FRAME_DATA;
      const descriptions = {
        'Station': 'Rail / tube stations — concourses, platforms, ticket halls',
        'Roadside': 'Roadside billboards, gateway and arterial routes',
        'Airport': 'Airport terminals — departures, arrivals, retail',
        'Shopping Centre': 'Mall corridors, anchor entrances, escalator landings',
        'Bus Shelter': 'On-street bus stop and shelter inventory',
      };
      return SITE_TYPES.map(s => ({
        _row: { name: s, desc: descriptions[s] || '' },
        icon: <div style={{width: 28, height: 28, borderRadius: 6, background: 'var(--blue-50)', color: 'var(--primary-main)', display: 'grid', placeItems: 'center'}}><SiteIcon type={s} width="16" height="16" /></div>,
        name: <b>{s}</b>,
        desc: <span style={{color: 'var(--text-secondary)'}}>{descriptions[s] || '—'}</span>,
        count: FRAMES.filter(f => f.site.type === s).length,
      }));
    },
  },
  'md-formats': {
    title: 'Formats',
    lead: 'The allowable values for tech specs across all frames. Grouped by attribute so you can curate each list independently.',
    addLabel: 'New value',
    custom: true,
  },
  'md-extids': {
    title: 'External ID Systems',
    lead: 'Downstream systems that maintain their own identifier for our frames. Each system has a name, validator pattern, and integration owner.',
    addLabel: 'New system',
    cols: [
      { k: 'name', label: 'System', w: '22%' },
      { k: 'desc', label: 'Purpose', w: 'auto' },
      { k: 'patt', label: 'ID pattern', w: '180px' },
      { k: 'owner', label: 'Owner', w: '160px' },
      { k: 'count', label: 'Linked', w: '80px', align: 'right' },
    ],
    rows: () => {
      const { FRAMES } = window.FRAME_DATA;
      const systems = [
        { name: 'Route OCS',     desc: 'UK out-of-home audience measurement body — official frame registry.', patt: 'RTE-OOH-#####', owner: 'Tom Reuter' },
        { name: 'Broadsign CMS', desc: 'Digital signage playback CMS — used for ad scheduling on digital frames.', patt: 'BS-AAA-#####', owner: 'Maya Patel' },
        { name: 'AdSquare DSP',  desc: 'Programmatic demand-side platform — inventory exposed for bidding.', patt: 'AS-####', owner: 'Maya Patel' },
      ];
      return systems.map(s => {
        const count = FRAMES.reduce((n, f) => n + f.externalIds.filter(e => e.system === s.name).length, 0);
        return {
          _row: s,
          name: <div style={{display: 'flex', alignItems: 'center', gap: 8}}><div style={{width: 24, height: 24, borderRadius: 4, background: 'var(--blue-100)', color: 'var(--primary-dark)', display: 'grid', placeItems: 'center'}}><Icon.link width="14" height="14" /></div><b>{s.name}</b></div>,
          desc: <span style={{color: 'var(--text-secondary)', fontSize: 13}}>{s.desc}</span>,
          patt: <span className="mono" style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, color: 'var(--text-secondary)'}}>{s.patt}</span>,
          owner: s.owner,
          count: count + ' frames',
        };
      });
    },
  },
};

function MasterDataScreen({ kind }) {
  const conf = MD_CONTENT[kind];
  const [drawer, setDrawer] = React.useState(null); // {mode:'add'|'edit', item, group?}
  if (!conf) return null;

  const openAdd  = (group) => setDrawer({ mode: 'add',  item: null, group });
  const openEdit = (item, group) => setDrawer({ mode: 'edit', item, group });
  const close    = () => setDrawer(null);

  const cols = conf.cols
    ? [...conf.cols, { k: '_act', label: '', w: '70px', align: 'right' }]
    : null;

  return (
    <React.Fragment>
      <PageHead
        title={conf.title}
        meta={conf.lead}
        actions={
          <button className="btn primary" onClick={() => openAdd()}><Icon.plus /> {conf.addLabel}</button>
        }
      />
      <div style={{padding: '20px 24px 60px', maxWidth: 1280}}>
        <div className="banner" style={{marginBottom: 18}}>
          <Icon.info />
          <div>Changes to master data take effect immediately and apply to every form that picks from this list. Existing frames are not modified — only future selections.</div>
        </div>

        {kind === 'md-formats'
          ? <FormatsMasterData onAdd={openAdd} onEdit={openEdit} />
          : <MDTable cols={cols} rows={conf.rows()} onEdit={openEdit} />
        }
      </div>
      {drawer && (
        <MDDrawer kind={kind} mode={drawer.mode} item={drawer.item} group={drawer.group} onClose={close} />
      )}
    </React.Fragment>
  );
}

function MDTable({ cols, rows, onEdit }) {
  return (
    <div className="surface" style={{padding: 0, overflow: 'hidden'}}>
      <table className="tbl">
        <thead>
          <tr>{cols.map(c => <th key={c.k} style={{width: c.w, textAlign: c.align || 'left'}}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{cursor: 'default'}}>
              {cols.map(c => c.k === '_act'
                ? <td key={c.k} style={{textAlign: 'right'}}><button className="btn ghost sm icon-only" onClick={() => onEdit(r._row)}><Icon.pencil /></button></td>
                : <td key={c.k} style={{textAlign: c.align || 'left'}}>{r[c.k]}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormatsMasterData({ onAdd, onEdit }) {
  const groups = [
    { key: 'tech',  title: 'Technology',          icon: Icon.frame,   help: 'Display technology. Determines whether the frame supports digital scheduling or paper-based posting.', values: ['Digital LED', 'Digital LCD', 'Classic Paper', 'Backlit Paper'], counts: { 'Digital LED': 8, 'Digital LCD': 3, 'Classic Paper': 1, 'Backlit Paper': 0 } },
    { key: 'orient',title: 'Orientation',         icon: Icon.frame,   help: 'Physical orientation of the displayable area.', values: ['Landscape', 'Portrait', 'Square'], counts: { 'Landscape': 7, 'Portrait': 5, 'Square': 0 } },
    { key: 'dim',   title: 'Dimensions',          icon: Icon.frame,   help: 'Pre-set physical sizes. Custom values are also allowed per frame.', values: ['1920 × 1080 mm', '1080 × 1920 mm', '1190 × 1750 mm', '2400 × 1200 mm', '6096 × 3048 mm', '4800 × 1200 mm'], counts: {} },
    { key: 'illum', title: 'Illumination',        icon: Icon.frame,   help: 'How the frame is lit. Affects out-of-hours visibility.', values: ['Internal LED', 'Backlit', 'Front-lit', 'None'], counts: { 'Internal LED': 10, 'Backlit': 2, 'Front-lit': 0, 'None': 0 } },
    { key: 'slot',  title: 'Slot length / share', icon: Icon.history, help: 'Standard playout shares. Used for inventory yield calculations.', values: ['10s · 6/min', '8s · 7/min', '15s · 4/min', '14 days'], counts: {} },
  ];
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      {groups.map(g => (
        <div key={g.key} className="surface" style={{padding: 0, overflow: 'hidden'}}>
          <div style={{padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--gray-50)'}}>
            <div style={{width: 32, height: 32, borderRadius: 6, background: 'white', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', color: 'var(--primary-main)'}}><g.icon width="16" height="16" /></div>
            <div>
              <div style={{fontWeight: 600, fontSize: 14}}>{g.title}</div>
              <div style={{fontSize: 12, color: 'var(--text-secondary)'}}>{g.help}</div>
            </div>
            <div style={{flex: 1}} />
            <span className="chip">{g.values.length} values</span>
            <button className="btn outlined sm" onClick={() => onAdd && onAdd(g)}><Icon.plus width="13" height="13" /> Add value</button>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Value</th>
                <th style={{width: '120px', textAlign: 'right'}}>Used by</th>
                <th style={{width: '120px'}}>Status</th>
                <th style={{width: '80px', textAlign: 'right'}}></th>
              </tr>
            </thead>
            <tbody>
              {g.values.map(v => {
                const used = g.counts[v];
                return (
                  <tr key={v} style={{cursor: 'default'}}>
                    <td><b>{v}</b></td>
                    <td style={{textAlign: 'right'}}>{used != null ? <span style={{color: used === 0 ? 'var(--text-secondary)' : 'var(--text-primary)'}}>{used} frames</span> : <span style={{color: 'var(--text-secondary)'}}>—</span>}</td>
                    <td><span className="chip success">Active</span></td>
                    <td style={{textAlign: 'right'}}><button className="btn ghost sm icon-only" onClick={() => onEdit && onEdit({ value: v, attribute: g.title }, g)}><Icon.pencil /></button>{used === 0 && <button className="btn danger-ghost sm icon-only"><Icon.trash /></button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Wrapper: shows app shell with rail nav for non-frame sections              */
/* -------------------------------------------------------------------------- */
function MasterDataApp({ kind, onNav, density }) {
  const title = MD_CONTENT[kind].title;
  return (
    <div className={"app " + (density === 'compact' ? 'density-compact' : '')}>
      <Brand />
      <Topbar crumbs={['Master data', title]} right={null} />
      <Rail active={kind} onNav={onNav} />
      <main className="content">
        <MasterDataScreen kind={kind} />
      </main>
    </div>
  );
}

function NewFrameApp({ onNav, onCancel, onCreate, density }) {
  return (
    <div className={"app " + (density === 'compact' ? 'density-compact' : '')}>
      <Brand />
      <Topbar crumbs={['Inventory', 'Frames', 'New']} right={null} />
      <Rail active="frames" onNav={onNav} />
      <main className="content">
        <NewFrameScreen onCancel={onCancel} onCreate={onCreate} />
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Add / edit drawer — one component, swaps fields by kind                    */
/* -------------------------------------------------------------------------- */
function MDDrawer({ kind, mode, item, group, onClose }) {
  const isEdit = mode === 'edit';
  const titleMap = {
    'md-regions': isEdit ? 'Edit region' : 'New region',
    'md-sites':   isEdit ? 'Edit site type' : 'New site type',
    'md-formats': isEdit ? `Edit ${group ? group.title.toLowerCase() : 'value'}` : `New ${group ? group.title.toLowerCase() + ' value' : 'format value'}`,
    'md-extids':  isEdit ? 'Edit external ID system' : 'New external ID system',
  };

  return (
    <React.Fragment>
      <div onClick={onClose} style={{position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.32)', zIndex: 90}} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, zIndex: 91,
        background: 'white', borderLeft: '1px solid var(--border-subtle)',
        boxShadow: '-12px 0 32px rgba(15, 23, 42, 0.12)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12}}>
          <div>
            <div style={{fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em'}}>{isEdit ? 'Editing' : 'Adding'}</div>
            <div style={{fontSize: 17, fontWeight: 600}}>{titleMap[kind]}</div>
          </div>
          <div style={{flex: 1}} />
          <button className="btn ghost sm icon-only" onClick={onClose}><Icon.x /></button>
        </div>
        <div style={{flex: 1, overflow: 'auto', padding: '20px 22px'}}>
          {kind === 'md-regions' && <RegionForm item={item} />}
          {kind === 'md-sites'   && <SiteTypeForm item={item} />}
          {kind === 'md-formats' && <FormatValueForm item={item} group={group} />}
          {kind === 'md-extids'  && <ExtIdSystemForm item={item} />}
        </div>
        <div style={{padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--gray-50)'}}>
          {isEdit && <button className="btn danger-ghost"><Icon.trash /> Delete</button>}
          <div style={{flex: 1}} />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={onClose}><Icon.check /> {isEdit ? 'Save changes' : 'Create'}</button>
        </div>
      </div>
    </React.Fragment>
  );
}

function RegionForm({ item }) {
  const [name, setName] = React.useState(item?.name || '');
  const [towns, setTowns] = React.useState(item?.towns || []);
  const [draft, setDraft] = React.useState('');
  const addTown = () => { const v = draft.trim(); if (!v || towns.includes(v)) return; setTowns([...towns, v]); setDraft(''); };
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      <div className="field">
        <label>Region name <span className="req">*</span></label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. South West" />
        <span className="help">Used as the top-level grouping in every frame's location.</span>
      </div>
      <div className="field">
        <label>Towns / cities in this region</label>
        <div style={{display: 'flex', gap: 8}}>
          <input type="text" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTown(); } }} placeholder="Type and press Enter…" style={{flex: 1}} />
          <button className="btn outlined" onClick={addTown}><Icon.plus /> Add</button>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, minHeight: 32}}>
          {towns.length === 0 && <span style={{fontSize: 12, color: 'var(--text-secondary)'}}>No towns yet — towns can also be added inline when creating a frame.</span>}
          {towns.map(t => (
            <span key={t} className="chip" style={{paddingRight: 4, display: 'inline-flex', alignItems: 'center', gap: 4}}>
              {t}
              <button onClick={() => setTowns(towns.filter(x => x !== t))} style={{border: 'none', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 2, color: 'var(--text-secondary)'}}><Icon.x width="11" height="11" /></button>
            </span>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Notes (optional)</label>
        <textarea placeholder="Anything ops should know about this region…"></textarea>
      </div>
    </div>
  );
}

function SiteTypeForm({ item }) {
  const [name, setName] = React.useState(item?.name || '');
  const [desc, setDesc] = React.useState(item?.desc || '');
  const [icon, setIcon] = React.useState(item?.name || 'Station');
  const icons = ['Station', 'Roadside', 'Airport', 'Shopping Centre', 'Bus Shelter'];
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      <div className="field">
        <label>Site type name <span className="req">*</span></label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Petrol Forecourt" />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description of the kind of location this represents."></textarea>
      </div>
      <div className="field">
        <label>Icon</label>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
          {icons.map(i => (
            <button key={i} onClick={() => setIcon(i)} style={{
              width: 56, height: 56, borderRadius: 8, cursor: 'pointer',
              background: i === icon ? 'var(--blue-50)' : 'white',
              border: '1px solid ' + (i === icon ? 'var(--primary-main)' : 'var(--border-default)'),
              display: 'grid', placeItems: 'center', color: i === icon ? 'var(--primary-dark)' : 'var(--text-secondary)'
            }}><SiteIcon type={i} width="22" height="22" /></button>
          ))}
        </div>
        <span className="help">Pick the closest visual match. Used in lists, badges, and the map view.</span>
      </div>
      <div className="field">
        <label>Position keywords (for autocomplete)</label>
        <input type="text" placeholder="e.g. concourse, platform, escalator, ticket hall" />
        <span className="help">Comma-separated. Surfaced as suggestions when ops fills in Position within site.</span>
      </div>
    </div>
  );
}

function FormatValueForm({ item, group }) {
  const groups = ['Technology', 'Orientation', 'Dimensions', 'Illumination', 'Slot length / share'];
  const [attr, setAttr] = React.useState(item?.attribute || group?.title || 'Technology');
  const [value, setValue] = React.useState(item?.value || '');
  const [active, setActive] = React.useState(true);
  const placeholders = {
    'Technology': 'e.g. e-Paper',
    'Orientation': 'e.g. Diagonal',
    'Dimensions': 'e.g. 2400 × 1200 mm',
    'Illumination': 'e.g. Side-lit',
    'Slot length / share': 'e.g. 6s · 10/min',
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      <div className="field">
        <label>Attribute <span className="req">*</span></label>
        <select value={attr} onChange={e => setAttr(e.target.value)} disabled={!!group}>{groups.map(g => <option key={g}>{g}</option>)}</select>
        <span className="help">{group ? 'Locked because you opened this from a specific group.' : 'Which tech-spec list this value belongs to.'}</span>
      </div>
      <div className="field">
        <label>Value <span className="req">*</span></label>
        <input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholders[attr]} />
      </div>
      {attr === 'Dimensions' && (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          <div className="field"><label>Width (mm)</label><input type="number" placeholder="1920" /></div>
          <div className="field"><label>Height (mm)</label><input type="number" placeholder="1080" /></div>
        </div>
      )}
      {attr === 'Slot length / share' && (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          <div className="field"><label>Slot length (s)</label><input type="number" placeholder="10" /></div>
          <div className="field"><label>Loop share (slots / min)</label><input type="number" placeholder="6" /></div>
        </div>
      )}
      <div className="field">
        <label>Status</label>
        <div style={{display: 'inline-flex', gap: 6}}>
          {[{v: true, l: 'Active'}, {v: false, l: 'Retired'}].map(o => (
            <label key={o.l} style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid', borderRadius: 999, cursor: 'pointer', background: o.v === active ? 'var(--blue-50)' : 'white', borderColor: o.v === active ? 'var(--primary-main)' : 'var(--border-default)'}}>
              <input type="radio" checked={o.v === active} onChange={() => setActive(o.v)} />{o.l}
            </label>
          ))}
        </div>
        <span className="help">Retired values stay on existing frames but won't appear in pickers.</span>
      </div>
    </div>
  );
}

function ExtIdSystemForm({ item }) {
  const [name, setName] = React.useState(item?.name || '');
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      <div className="field">
        <label>System name <span className="req">*</span></label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Broadsign CMS" />
        <span className="help">Display name. Appears in pickers when linking IDs on a frame.</span>
      </div>
      <div className="field">
        <label>System key</label>
        <input type="text" defaultValue={item ? (item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_') : ''} placeholder="broadsign_cms" />
        <span className="help">Used in API payloads. Lowercase, no spaces.</span>
      </div>
      <div className="field">
        <label>Purpose</label>
        <textarea defaultValue={item?.desc || ''} placeholder="What is this system used for? Who consumes it?"></textarea>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
        <div className="field">
          <label>ID pattern</label>
          <input type="text" defaultValue={item?.patt || ''} placeholder="RTE-OOH-#####" />
          <span className="help">Hash # = digit, A = letter.</span>
        </div>
        <div className="field">
          <label>Validation regex</label>
          <input type="text" defaultValue="" placeholder="^[A-Z]{3}-\d{5}$" />
          <span className="help">Optional. Blocks invalid IDs on link.</span>
        </div>
      </div>
      <div className="field">
        <label>Integration owner</label>
        <input type="text" defaultValue={item?.owner || ''} placeholder="Person responsible for the integration" />
      </div>
      <div className="field">
        <label>Sync direction</label>
        <div style={{display: 'flex', gap: 6}}>
          {['Inbound', 'Outbound', 'Bidirectional', 'Manual'].map(d => (
            <label key={d} style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: '1px solid var(--border-default)', borderRadius: 999, cursor: 'pointer', background: 'white', fontSize: 12}}>
              <input type="radio" name="sync" defaultChecked={d === 'Bidirectional'} />{d}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NewFrameScreen, MasterDataScreen, MasterDataApp, NewFrameApp, MDDrawer });