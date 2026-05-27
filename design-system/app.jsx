// =============================================================================
// App root — direction toggle, screen routing, tweaks, boot
// =============================================================================

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "direction": "A",
  "density": "comfortable",
  "screen": "search"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);
  const direction = t.direction;
  const density   = t.density;
  const [screen, setScreenState] = React.useState(t.screen || 'search');
  const setScreen = (s) => { setScreenState(s); setTweak('screen', s); };
  const [section, setSection] = React.useState('frames');

  // when direction changes, reset to search
  const setDirection = (d) => { setTweak('direction', d); setScreen('search'); setSection('frames'); };

  const onNav = (id) => {
    if (id === 'frames') { setSection('frames'); }
    else if (id === 'new') { setSection('new'); }
    else if (id && id.startsWith('md-')) { setSection(id); }
  };

  // keyboard shortcuts 1..4 for screens, A/B for direction
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === '1') setScreen('search');
      if (e.key === '2') setScreen('detail');
      if (e.key === '3') setScreen('edit');
      if (e.key === '4') setScreen('history');
      if (e.key === 'a' || e.key === 'A') setDirection('A');
      if (e.key === 'b' || e.key === 'B') setDirection('B');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Render master data section
  if (section && section.startsWith('md-')) {
    return (
      <React.Fragment>
        <ConceptBar direction={direction} onChange={setDirection} />
        <MasterDataApp kind={section} onNav={onNav} density={density} />
        <TweaksPanel title="Tweaks">
          <TweakSection title="Direction"><TweakRadio value={direction} onChange={setDirection} options={[{value: 'A', label: 'A · Workspace'}, {value: 'B', label: 'B · Split'}]} /></TweakSection>
          <TweakSection title="Density"><TweakRadio value={density} onChange={v => setTweak('density', v)} options={[{value: 'comfortable', label: 'Comfortable'}, {value: 'compact', label: 'Compact'}]} /></TweakSection>
        </TweaksPanel>
      </React.Fragment>
    );
  }

  if (section === 'new') {
    return (
      <React.Fragment>
        <ConceptBar direction={direction} onChange={setDirection} />
        <NewFrameApp onNav={onNav} onCancel={() => setSection('frames')} onCreate={() => setSection('frames')} density={density} />
        <TweaksPanel title="Tweaks">
          <TweakSection title="Direction"><TweakRadio value={direction} onChange={setDirection} options={[{value: 'A', label: 'A · Workspace'}, {value: 'B', label: 'B · Split'}]} /></TweakSection>
          <TweakSection title="Density"><TweakRadio value={density} onChange={v => setTweak('density', v)} options={[{value: 'comfortable', label: 'Comfortable'}, {value: 'compact', label: 'Compact'}]} /></TweakSection>
        </TweaksPanel>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ConceptBar direction={direction} onChange={setDirection} />

      {/* Screen sub-nav (1..4) */}
      <div style={{background: 'white', padding: '8px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 12, alignItems: 'center', fontSize: 12}}>
        <span style={{color: 'var(--text-secondary)'}}>Screens:</span>
        {[
          { id: 'search',  label: '1 · Search & list',  icon: Icon.search },
          { id: 'detail',  label: '2 · Frame detail',   icon: Icon.info },
          { id: 'edit',    label: '3 · Edit form',      icon: Icon.pencil },
          { id: 'history', label: '4 · History',        icon: Icon.history },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setScreen(s.id)}
            className={"btn sm " + (screen === s.id ? 'primary' : 'ghost')}
            style={{height: 28}}>
            <s.icon width="13" height="13" /> {s.label}
          </button>
        ))}
        <div style={{flex: 1}} />
        <span style={{color: 'var(--text-secondary)'}}>Direction <b style={{color: 'var(--primary-main)'}}>{direction}</b> · {density}</span>
      </div>

      {direction === 'A'
        ? <DirA screen={screen} setScreen={setScreen} density={density} onNav={onNav} />
        : <DirB screen={screen} setScreen={setScreen} density={density} onNav={onNav} />
      }

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Direction">
          <TweakRadio
            value={direction}
            onChange={v => setDirection(v)}
            options={[{value: 'A', label: 'A · Workspace'}, {value: 'B', label: 'B · Split'}]}
          />
          <div style={{fontSize: 11, color: 'var(--text-secondary, #5B7082)', marginTop: 6, lineHeight: 1.4}}>
            <b>A</b> — classic dense table + filter sidebar; sub-pages for detail/edit/history.<br/>
            <b>B</b> — persistent left list; right pane swaps between detail, edit, history & map.
          </div>
        </TweakSection>

        <TweakSection title="Screen">
          <TweakSelect
            value={screen}
            onChange={setScreen}
            options={[
              {value: 'search',  label: '1 · Search & list'},
              {value: 'detail',  label: '2 · Frame detail'},
              {value: 'edit',    label: '3 · Edit form'},
              {value: 'history', label: '4 · History'},
            ]}
          />
        </TweakSection>

        <TweakSection title="Density">
          <TweakRadio
            value={density}
            onChange={v => setTweak('density', v)}
            options={[{value: 'comfortable', label: 'Comfortable'}, {value: 'compact', label: 'Compact'}]}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
