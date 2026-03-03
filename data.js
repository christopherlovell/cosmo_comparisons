// Simulation suites - hierarchical structure
const simulationFamilies = {
    'EAGLE': {
        'EAGLE-Ref': {size: 100, m_g: 1.81e6, code: 'Gadget-2', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.446..521S'},
        'EAGLE-Recal': {size: 25, m_g: 2.26e5, code: 'Gadget-2', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.446..521S'}
    },
    'IllustrisTNG': {
        'TNG50': {size: 51.7, m_g: 8.5e4, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, mhd: true, year: 2019},
        'TNG100': {size: 110.7, m_g: 1.4e6, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, mhd: true, year: 2018},
        'TNG300': {size: 302.6, m_g: 1.1e7, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, mhd: true, year: 2018}
    },
    'Illustris': {
        // Original Illustris (pre-TNG); box is 75 h^-1 Mpc with h=0.704
        'Illustris-1': {size: 75/0.704, m_g: 1.26e6, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2014, ads: 'https://ui.adsabs.harvard.edu/abs/2014Natur.509..177V'}
    },
    'Simba': {
        'Simba-100': {size: 100/0.7, m_g: 1.82e7, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2019},
        'Simba-50': {size: 50/0.7, m_g: 2.28e6, 'radiative-transfer': false, complete: true, redshift_end: 1.0, periodic: true, year: 2019},
        'Simba-25': {size: 25/0.7, m_g: 2.85e5, 'radiative-transfer': false, complete: true, redshift_end: 2.0, periodic: true, year: 2019}
    },
    'THESAN': {
        'THESAN-1': {size: 95.5, m_g: 5.82e5, 'radiative-transfer': true, complete: true, redshift_end: 5.5, periodic: true, year: 2022},
        'THESAN-2': {size: 95.5, m_g: 4.66e6, 'radiative-transfer': true, complete: true, redshift_end: 5.5, periodic: true, year: 2022}
    },
    'FLAMINGO': {
        'FLAMINGO-L1_m8': {size: 1000, m_g: 1.34e8, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023},
        'FLAMINGO-L1_m9': {size: 1000, m_g: 1.07e9, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023},
        'FLAMINGO-L2p8_m9': {size: 2800, m_g: 1.07e9, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023}
    },
    'MillenniumTNG': {
        'MTNG740': {size: 740, m_g: 7.63e7, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023},
        'MTNG185': {size: 185, m_g: 2.98e6, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023}
    },
    'COLIBRE': {
        'COLIBRE-50': {size: 50, m_g: 2.3e5, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025},
        'COLIBRE-100': {size: 100, m_g: 1.84e6, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025},
        'COLIBRE-200': {size: 200, m_g: 1.84e6, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025},
        'COLIBRE-400': {size: 400, m_g: 1.47e7, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025}
    },
    'MassiveBlack': {
        // Masses in h^-1 M_sun converted with h=0.7; box in h^-1 Mpc / 0.7
        'MassiveBlack': {size: 533.3/0.7, m_g: 5.7e7/0.7, 'radiative-transfer': false, complete: true, redshift_end: 4.75, periodic: true, year: 2012, ads: 'https://ui.adsabs.harvard.edu/abs/2012MNRAS.424..605D'},
        'MassiveBlack-II': {size: 100/0.704, m_g: 2.2e6/0.704, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.450.1349K'}
    },
    'Magneticum': {
        // Magneticum Pathfinder suite; box sizes in h^-1 Mpc (h=0.704, WMAP7); masses in M_sun
        'Magneticum-Box0':   {size: 2688/0.704, m_g: 1.7e9,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box1':   {size: 896/0.704,  m_g: 1.7e9,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box2b':  {size: 640/0.704,  m_g: 2.0e8,  'radiative-transfer': false, complete: true, redshift_end: 0.2, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box2hr': {size: 352/0.704,  m_g: 2.0e8,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box3':   {size: 128/0.704,  m_g: 1.0e7,  'radiative-transfer': false, complete: true, redshift_end: 1.7, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box4':   {size: 48/0.704,   m_g: 1.0e7,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box5':   {size: 18/0.704,   m_g: 2.0e6,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'}
    },
    'CAMELS': {
        'CAMELS-1': {size: 25/0.7, m_g: 2e7, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, suite: true, year: 2021},
        'CAMELS-2': {size: 50/0.7, m_g: 2e7, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, suite: true, year: 2021}
    },
    'FLARES': {
        'FLARES': {size: 14.28, m_g: 1.81e6, 'radiative-transfer': false, complete: true, redshift_end: 5.0, periodic: false, suite: true, star: true, year: 2021},
    },
    'Individual': {
        'Horizon-AGN': {size: 120, m_g: 4e6, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2014, ads: 'https://ui.adsabs.harvard.edu/abs/2014MNRAS.444.1453D'},
        'BAHAMAS': {size: 560, m_g: 1.5e9, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2017},
        'SPHINX': {size: 20, m_g: 3.8e4, 'radiative-transfer': true, complete: true, redshift_end: 4.6, periodic: true, year: 2018},
        'FRONTIER-E': {size: 4700, m_g: 1e8, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025, ads: 'https://arxiv.org/abs/2510.03557'}
    },
    'FIREbox': {
        // Feldmann et al. (2023); FIRE-2 cosmological periodic volume; h=0.677 (Planck 2015)
        'FB1024': {size: 22.1, m_g: 6.26e4, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, ads: 'https://ui.adsabs.harvard.edu/abs/2023MNRAS.522.3831F'},
        'FB512':  {size: 22.1, m_g: 5.01e5, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, ads: 'https://ui.adsabs.harvard.edu/abs/2023MNRAS.522.3831F'},
        'FB256':  {size: 22.1, m_g: 4.01e6, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, ads: 'https://ui.adsabs.harvard.edu/abs/2023MNRAS.522.3831F'}
    },
    'OWLS': {
        // Schaye et al. (2010); box sizes in h^-1 Mpc and masses in h^-1 M_sun (h=0.73, WMAP3)
        'OWLS-L100': {size: 100/0.73, m_g: 8.66e7/0.73, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2010, ads: 'https://ui.adsabs.harvard.edu/abs/2010MNRAS.402.1536S'},
        'OWLS-L25':  {size: 25/0.73,  m_g: 1.35e6/0.73, 'radiative-transfer': false, complete: true, redshift_end: 2.0, periodic: true, year: 2010, ads: 'https://ui.adsabs.harvard.edu/abs/2010MNRAS.402.1536S'}
    },
    'Romulus': {
        // Tremmel et al. (2017); masses in M_sun
        'Romulus25': {size: 25, m_g: 2.12e5, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2017, ads: 'https://ui.adsabs.harvard.edu/abs/2017MNRAS.470.1121T'},
        'Romulus50': {size: 50, m_g: 2.12e5, 'radiative-transfer': false, complete: true, redshift_end: 2.0, periodic: true, year: 2017, ads: 'https://ui.adsabs.harvard.edu/abs/2017MNRAS.470.1121T'},
        'Romulus8':  {size: 8,  m_g: 2.12e5, 'radiative-transfer': false, complete: true, redshift_end: 0.5, periodic: true, year: 2017, ads: 'https://ui.adsabs.harvard.edu/abs/2017MNRAS.470.1121T'}
    },
    'SLOW': {
        // Dolag et al.; constrained simulation of local Universe; box = 500 h^-1 Mpc (h=0.6777, Planck)
        // Gas particle masses from Table 1 of respective papers (in h^-1 M_sun, converted to M_sun)
        'SLOW-AGN1536': {size: 500/0.6777, m_g: 4.6e8/0.6777, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, ads: 'https://arxiv.org/abs/2302.10960'},
        'SLOW-AGN3072': {size: 500/0.6777, m_g: 5.5e7/0.6777, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2024, ads: 'https://arxiv.org/abs/2402.01834'}
    },
    'Historical': {
        // Pre-2010 periodic hydrodynamical simulations.
        // Masses were reported as h^-1 M_sun; converted to M_sun using h≈0.5 for SCDM-era (1992-1996)
        // and h≈0.7 for later runs. Box sizes similarly converted from h^-1 Mpc.
        // Values sourced from Gemini summary — verify against original papers before citing.
        'Cen+Ostriker-1992':  {size: 10/0.5,   m_g: 1.21e6/0.5,  'radiative-transfer': false, complete: true, redshift_end: 2.75, periodic: true, year: 1992, ads: 'https://ui.adsabs.harvard.edu/abs/1992ApJ...393...22C'},
        'Scaramella-1993':    {size: 150/0.7,   m_g: 2.0e11/0.7,  'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 1993, ads: 'https://ui.adsabs.harvard.edu/abs/1993ApJ...409..487S'},
        'Katz-1996':          {size: 22.2/0.7,  m_g: 3.9e8/0.7,   'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 1996, ads: 'https://ui.adsabs.harvard.edu/abs/1996ApJS..105...19K'},
        'Hernquist-1996':     {size: 11.1/0.5,  m_g: 5.3e6/0.5,   'radiative-transfer': false, complete: true, redshift_end: 2.0,  periodic: true, year: 1996, ads: 'https://ui.adsabs.harvard.edu/abs/1996ApJ...457L..51H'},
        'Cen+Ostriker-1999':  {size: 100/0.7,   m_g: 2.3e9/0.7,   'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 1999, ads: 'https://ui.adsabs.harvard.edu/abs/1999ApJ...514....1C'},
        'Dave-1999':          {size: 50/0.67,   m_g: 1.5e9/0.67,  'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 1999, ads: 'https://ui.adsabs.harvard.edu/abs/1999ApJ...511..521D'},
        'Dave-2001':          {size: 100/0.7,   m_g: 2.1e8/0.7,   'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 2001, ads: 'https://ui.adsabs.harvard.edu/abs/2001ApJ...552..473D'},
        'MareNostrum-Univ':   {size: 500/0.7,   m_g: 1.5e9/0.7,   'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 2006, ads: 'https://arxiv.org/abs/astro-ph/0610622'},
        'Popping-2009':       {size: 32/0.7,    m_g: 3.35e6/0.7,  'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 2009, ads: 'https://ui.adsabs.harvard.edu/abs/2009A%26A...504...15P'}
    },
    'DMO': {
        'SMDPL':         {size: 400/0.6711,  m_dm: 9.6e7/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2016},
        'Chinchilla':    {size: 400/0.6711,  m_dm: 5.9e8/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2019},
        'MDPL2':         {size: 1000/0.6711, m_dm: 1.5e9/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2016},
        'Abacus Summit': {size: 2000/0.6711, m_dm: 2.1e9/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2021},
        'Outer Rim':     {size: 3000/0.6711, m_dm: 1.8e9/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2019},
        'Flagship':      {size: 3600/0.6711, m_dm: 1.0e9/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2017},
        'HalfDome':      {size: 3750/0.6711, m_dm: 2.0e10/0.6711, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2024}
    },
    'Quijote': {
        // m_dm = 2.775e11 * omega_m * L^3 / N^3 (Msun/h), divided by h to get Msun
        // omega_m=0.3175, h=0.6711, L=1000 Mpc/h
        'Quijote-512':  {size: 1000/0.6711, m_dm: 2.775e11 * 0.3175 * 1e9 / Math.pow(512,  3) / 0.6711, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, suite: true, year: 2020},
        'Quijote-1024': {size: 1000/0.6711, m_dm: 2.775e11 * 0.3175 * 1e9 / Math.pow(1024, 3) / 0.6711, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, suite: true, year: 2020}
    }
};

// Optional emoji per suite. Value is a Unicode emoji string, or a PNG filename
// loaded from the emoji/ folder (e.g. 'colibre.png'). Omit a suite to use default markers.
const familyEmoji = {
    'EAGLE':         '🦅',
    'IllustrisTNG':  'picard.png',
    'Illustris':     '🎆',
    'Simba':         '🦁',
    'FLAMINGO':      '🦩',
    'FLARES':        '👖',
    'MillenniumTNG': '🎆',
    'COLIBRE':       '🐦',
    'MassiveBlack':  '🖤',
    'Magneticum':    '🧲',
    'CAMELS':        '🐪',
    'FIREbox':       '🔥',
    'OWLS':          '🦉',
    'SLOW':          '🐌',
    'Quijote':       '🏇',
};

// Optional emoji per numerical code. Value is a Unicode emoji or PNG filename from emoji/ folder.
const codeEmoji = {
    'SWIFT': 'swift.png',
    'Arepo': '🅰️',
    'Gadget-2': '🇬',
};

// Flatten simulations for backward compatibility
const simulations = {};
Object.entries(simulationFamilies).forEach(([suite, sims]) => {
    Object.entries(sims).forEach(([name, data]) => {
        simulations[name] = data;
    });
});

// Default code to 'Other' for any simulation without one
Object.values(simulations).forEach(sim => { if (!sim.code) sim.code = 'Other'; });

// Survey data
const surveys = {
    'All Sky': {area: 4 * Math.PI * Math.pow(180 * 60 / Math.PI, 2), redshift: 7}, // Full sky in arcmin²
    'Euclid/Wide': {area: 15000 * 3600, redshift: 7},  // 15,000 deg² → arcmin²
    'Euclid/Deep': {area: 40 * 3600, redshift: 7},     // 40 deg² → arcmin²
    'Webb/COSMOS-Web': {area: 0.6 * 3600, redshift: 7}, // 0.6 deg² → arcmin²
    'Webb/NGDEEP': {area: 8, redshift: 7}              // Already in arcmin²
};

// Planck 2015 cosmology parameters
const cosmology = {
    H0: 67.74,           // km/s/Mpc
    Om0: 0.3089,         // Matter density
    Ode0: 0.6911,        // Dark energy density
    c: 299792.458        // Speed of light in km/s
};
