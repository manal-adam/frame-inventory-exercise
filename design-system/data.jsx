// =============================================================================
// Sample frame inventory dataset
// =============================================================================

const FRAME_TYPES = ['Digital · 6-sheet', 'Digital · 96-sheet', 'Classic · 48-sheet', 'Digital · Portrait', 'Digital · Landscape', 'Classic · 6-sheet'];

const STATUS_META = {
  live:        { label: 'Live',         tone: 'success' },
  pending:     { label: 'Pending QA',   tone: 'warning' },
  maintenance: { label: 'Maintenance',  tone: 'warning' },
  blocked:     { label: 'Blocked',      tone: 'error' },
  draft:       { label: 'Draft',        tone: 'neutral' },
};

const FRAMES = [
  {
    id: 'FRM-00214',
    description: 'D6 landscape unit above eastern concourse — high dwell-time positioning, faces ticket gates.',
    location: { region: 'Greater London', town: 'London', postcode: 'SE1 8SW', lat: 51.5036, lng: -0.1143 },
    site:     { type: 'Station', name: 'London Waterloo' },
    position: 'Concourse · Above escalator E2',
    format:   { tech: 'Digital LED', dimensions: '1920 × 1080 mm', resolution: '1920 × 1080 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Landscape' },
    closestSchoolM: 412,
    status: 'live',
    updated: '2026-05-09',
    externalIds: [
      { system: 'Route OCS',     value: 'RTE-OOH-91283', linked: '2025-08-12' },
      { system: 'Broadsign CMS', value: 'BS-LDN-21987',  linked: '2025-08-12' },
      { system: 'AdSquare DSP',  value: 'AS-9182',       linked: '2026-01-04' },
    ],
    history: [
      { ts: '2026-05-09 14:22', user: 'Maya Patel',  initials: 'MP', verb: 'updated frame',     changes: [
        { field: 'Illumination', from: 'Backlit', to: 'Internal LED' },
        { field: 'Slot length',  from: '8s',      to: '10s' },
      ]},
      { ts: '2026-04-23 09:15', user: 'Tom Reuter',  initials: 'TR', verb: 'added external ID',  changes: [
        { field: 'AdSquare DSP', from: '—', to: 'AS-9182' },
      ]},
      { ts: '2026-03-02 11:48', user: 'Maya Patel',  initials: 'MP', verb: 'updated location',   changes: [
        { field: 'Position', from: 'Concourse · West side', to: 'Concourse · Above escalator E2' },
      ]},
      { ts: '2025-08-12 17:02', user: 'System',      initials: 'SY', verb: 'created frame',      kind: 'create', changes: [
        { full: 'Imported from Route OCS · RTE-OOH-91283' },
      ]},
    ],
  },
  {
    id: 'FRM-00215',
    description: 'D48 portrait unit on northbound platform — eye-level facing waiting passengers.',
    location: { region: 'Greater London', town: 'London', postcode: 'SE1 8SW', lat: 51.5031, lng: -0.1136 },
    site:     { type: 'Station', name: 'London Waterloo' },
    position: 'Platform 12 · Northbound · Mid-platform',
    format:   { tech: 'Digital LCD', dimensions: '1080 × 1920 mm', resolution: '1080 × 1920 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Portrait' },
    closestSchoolM: 412,
    status: 'live',
    updated: '2026-05-04',
    externalIds: [
      { system: 'Route OCS',     value: 'RTE-OOH-91284', linked: '2025-08-12' },
      { system: 'Broadsign CMS', value: 'BS-LDN-21988',  linked: '2025-08-12' },
    ],
    history: [],
  },
  {
    id: 'FRM-00301',
    description: 'Roadside 48-sheet classic on A40 westbound — facing London-bound commuter traffic.',
    location: { region: 'South East', town: 'Slough', postcode: 'SL1 2DH', lat: 51.5105, lng: -0.5950 },
    site:     { type: 'Roadside', name: 'A40 · Slough Junction' },
    position: 'Westbound carriageway · 25m post-junction',
    format:   { tech: 'Classic Paper', dimensions: '6096 × 3048 mm', resolution: '—', illumination: 'Backlit', slot: '14 days', orientation: 'Landscape' },
    closestSchoolM: 1850,
    status: 'live',
    updated: '2026-04-30',
    externalIds: [
      { system: 'Route OCS', value: 'RTE-OOH-44820', linked: '2024-11-03' },
    ],
    history: [],
  },
  {
    id: 'FRM-00422',
    description: 'D6 portrait unit · Terminal 5 departures escalator landing.',
    location: { region: 'Greater London', town: 'Hounslow', postcode: 'TW6 2GA', lat: 51.4700, lng: -0.4543 },
    site:     { type: 'Airport', name: 'Heathrow · Terminal 5' },
    position: 'Departures · Escalator landing · Level 2',
    format:   { tech: 'Digital LED', dimensions: '1080 × 1920 mm', resolution: '1080 × 1920 px', illumination: 'Internal LED', slot: '8s · 7/min', orientation: 'Portrait' },
    closestSchoolM: 920,
    status: 'pending',
    updated: '2026-05-08',
    externalIds: [
      { system: 'Route OCS',     value: 'RTE-OOH-77140', linked: '2026-05-08' },
      { system: 'Broadsign CMS', value: 'BS-LHR-T5-007', linked: '2026-05-08' },
    ],
    history: [],
  },
  {
    id: 'FRM-00505',
    description: 'Mall corridor digital portrait — anchor store flow towards food court.',
    location: { region: 'North West', town: 'Manchester', postcode: 'M3 1SH', lat: 53.4848, lng: -2.2438 },
    site:     { type: 'Shopping Centre', name: 'Manchester Arndale' },
    position: 'Level 1 · Corridor C2 · Near John Lewis entrance',
    format:   { tech: 'Digital LCD', dimensions: '1080 × 1920 mm', resolution: '1080 × 1920 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Portrait' },
    closestSchoolM: 380,
    status: 'maintenance',
    updated: '2026-05-11',
    externalIds: [
      { system: 'Route OCS', value: 'RTE-OOH-12044', linked: '2024-02-19' },
    ],
    history: [],
  },
  {
    id: 'FRM-00506',
    description: 'Mall digital 6-sheet · escalator landing zone, dwell traffic.',
    location: { region: 'North West', town: 'Manchester', postcode: 'M3 1SH', lat: 53.4844, lng: -2.2430 },
    site:     { type: 'Shopping Centre', name: 'Manchester Arndale' },
    position: 'Ground floor · Escalator E1 landing',
    format:   { tech: 'Digital LED', dimensions: '1190 × 1750 mm', resolution: '1080 × 1920 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Portrait' },
    closestSchoolM: 380,
    status: 'live',
    updated: '2026-05-02',
    externalIds: [{ system: 'Route OCS', value: 'RTE-OOH-12045', linked: '2024-02-19' }],
    history: [],
  },
  {
    id: 'FRM-00708',
    description: 'Roadside D48 LED at Hammersmith flyover · gateway position into central London.',
    location: { region: 'Greater London', town: 'London', postcode: 'W6 9DH', lat: 51.4920, lng: -0.2229 },
    site:     { type: 'Roadside', name: 'Hammersmith Flyover' },
    position: 'Eastbound · 60m post-roundabout',
    format:   { tech: 'Digital LED', dimensions: '6096 × 3048 mm', resolution: '1920 × 960 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Landscape' },
    closestSchoolM: 220,
    status: 'blocked',
    updated: '2026-05-10',
    externalIds: [
      { system: 'Route OCS',     value: 'RTE-OOH-58820', linked: '2023-09-04' },
      { system: 'Broadsign CMS', value: 'BS-LDN-91244',  linked: '2023-09-04' },
    ],
    history: [],
  },
  {
    id: 'FRM-00811',
    description: 'King\u2019s Cross concourse · curved LED above retail bridge.',
    location: { region: 'Greater London', town: 'London', postcode: 'N1C 4AL', lat: 51.5320, lng: -0.1233 },
    site:     { type: 'Station', name: 'London King\u2019s Cross' },
    position: 'Western concourse · Retail bridge',
    format:   { tech: 'Digital LED', dimensions: '4800 × 1200 mm', resolution: '3840 × 960 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Landscape' },
    closestSchoolM: 540,
    status: 'live',
    updated: '2026-05-07',
    externalIds: [{ system: 'Route OCS', value: 'RTE-OOH-90111', linked: '2025-01-20' }],
    history: [],
  },
  {
    id: 'FRM-00912',
    description: 'Edinburgh Waverley · platform-end totem unit, southbound.',
    location: { region: 'Scotland', town: 'Edinburgh', postcode: 'EH1 1BB', lat: 55.9522, lng: -3.1898 },
    site:     { type: 'Station', name: 'Edinburgh Waverley' },
    position: 'Platform 2 · Southbound end',
    format:   { tech: 'Digital LCD', dimensions: '1080 × 1920 mm', resolution: '1080 × 1920 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Portrait' },
    closestSchoolM: 720,
    status: 'pending',
    updated: '2026-05-11',
    externalIds: [],
    history: [],
  },
  {
    id: 'FRM-01024',
    description: 'Birmingham New Street · Grand Central retail bridge digital landscape.',
    location: { region: 'West Midlands', town: 'Birmingham', postcode: 'B2 4QA', lat: 52.4775, lng: -1.8989 },
    site:     { type: 'Station', name: 'Birmingham New Street' },
    position: 'Grand Central · Retail bridge level',
    format:   { tech: 'Digital LED', dimensions: '2400 × 1200 mm', resolution: '1920 × 960 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Landscape' },
    closestSchoolM: 880,
    status: 'live',
    updated: '2026-05-01',
    externalIds: [
      { system: 'Route OCS',     value: 'RTE-OOH-30414', linked: '2024-07-11' },
      { system: 'Broadsign CMS', value: 'BS-BHM-44022',  linked: '2024-07-11' },
    ],
    history: [],
  },
  {
    id: 'FRM-01108',
    description: 'Heathrow T2 baggage reclaim · welcome unit landscape.',
    location: { region: 'Greater London', town: 'Hounslow', postcode: 'TW6 1EW', lat: 51.4720, lng: -0.4517 },
    site:     { type: 'Airport', name: 'Heathrow · Terminal 2' },
    position: 'Baggage reclaim · Belt 3 facing welcome',
    format:   { tech: 'Digital LED', dimensions: '2400 × 1350 mm', resolution: '1920 × 1080 px', illumination: 'Internal LED', slot: '15s · 4/min', orientation: 'Landscape' },
    closestSchoolM: 1200,
    status: 'live',
    updated: '2026-04-28',
    externalIds: [{ system: 'Route OCS', value: 'RTE-OOH-66020', linked: '2024-04-04' }],
    history: [],
  },
  {
    id: 'FRM-01209',
    description: 'Bus shelter 6-sheet digital · high-street, north-facing.',
    location: { region: 'Greater London', town: 'London', postcode: 'NW1 7HJ', lat: 51.5360, lng: -0.1431 },
    site:     { type: 'Bus Shelter', name: 'Camden High Street · Stop S' },
    position: 'North-facing · Shelter elevation',
    format:   { tech: 'Digital LED', dimensions: '1190 × 1750 mm', resolution: '1080 × 1920 px', illumination: 'Internal LED', slot: '10s · 6/min', orientation: 'Portrait' },
    closestSchoolM: 95,
    status: 'live',
    updated: '2026-05-05',
    externalIds: [{ system: 'Route OCS', value: 'RTE-OOH-71001', linked: '2025-02-14' }],
    history: [],
  },
];

// Fan out a generic history to the rest of the frames
FRAMES.forEach((f) => {
  if (f.history.length === 0) {
    f.history = [
      { ts: f.updated + ' 10:14', user: 'Maya Patel', initials: 'MP', verb: 'updated frame', changes: [
        { field: 'Status', from: 'Pending QA', to: STATUS_META[f.status].label },
      ]},
      { ts: '2025-09-18 16:30', user: 'Tom Reuter', initials: 'TR', verb: 'updated location', changes: [
        { field: 'Closest school', from: '—', to: f.closestSchoolM + ' m' },
      ]},
      { ts: '2025-08-12 09:00', user: 'System', initials: 'SY', verb: 'created frame', kind: 'create', changes: [
        { full: 'Imported from Route OCS · ' + (f.externalIds[0]?.value || 'manual entry') },
      ]},
    ];
  }
});

// Map pin positions for our fake map — distributed visually
const PIN_LAYOUT = {
  'FRM-00214': { x: 48, y: 56 },
  'FRM-00215': { x: 50, y: 58 },
  'FRM-00301': { x: 30, y: 62 },
  'FRM-00422': { x: 28, y: 70 },
  'FRM-00505': { x: 38, y: 30 },
  'FRM-00506': { x: 40, y: 32 },
  'FRM-00708': { x: 42, y: 60 },
  'FRM-00811': { x: 49, y: 54 },
  'FRM-00912': { x: 56, y: 12 },
  'FRM-01024': { x: 44, y: 42 },
  'FRM-01108': { x: 26, y: 68 },
  'FRM-01209': { x: 50, y: 52 },
};

const REGIONS = [...new Set(FRAMES.map(f => f.location.region))];
const SITE_TYPES = [...new Set(FRAMES.map(f => f.site.type))];
const TECHS = [...new Set(FRAMES.map(f => f.format.tech))];

window.FRAME_DATA = { FRAMES, STATUS_META, REGIONS, SITE_TYPES, TECHS, PIN_LAYOUT };
