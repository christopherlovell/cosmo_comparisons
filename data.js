// Simulation suites - hierarchical structure
const simulationFamilies = {
    'EAGLE': {
        'EAGLE-L100N1504': {size: 100, m_g: 1.81e6, m_dm: 9.7e6, n_g_part: 1504, n_dm_part: 1504, code: 'Gadget-3', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: 'January', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.446..521S'},
        'EAGLE-L025N0752': {size: 25, m_g: 2.26e5, m_dm: 1.21e6, n_g_part: 752, n_dm_part: 752, code: 'Gadget-3', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: 'January', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.446..521S'},
        'EAGLE-L050N0752': {size: 50, m_g: 1.81e6, m_dm: 9.7e6, n_g_part: 752, n_dm_part: 752, code: 'Gadget-3', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: 'January', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.446..521S'},
        'EAGLE-L025N0376': {size: 25, m_g: 1.81e6, m_dm: 9.7e6, n_g_part: 376, n_dm_part: 376, code: 'Gadget-3', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: 'January', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.446..521S'}
    },
    'IllustrisTNG': {
        'TNG50': {size: 51.7, m_g: 8.5e4, m_dm: 3.1e5, n_g_part: 2160, n_dm_part: 2160, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, mhd: true, year: 2019, month: '', ads: 'https://arxiv.org/abs/1902.05553'},
        'TNG100': {size: 110.7, m_g: 1.4e6, m_dm: 5.1e6, n_g_part: 1820, n_dm_part: 1820, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, mhd: true, year: 2018, month: '', ads: 'https://arxiv.org/abs/1707.03406'},
        'TNG300': {size: 302.6, m_g: 1.1e7, m_dm: 4e7, n_g_part: 2500, n_dm_part: 2500, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, mhd: true, year: 2018, month: '', ads: 'https://arxiv.org/abs/1707.03406'}
    },
    'Illustris': {
        'Illustris-1': {size: 106.5, m_g: 1.3e6, m_dm: 6.3e6, n_g_part: 1820, n_dm_part: 1820, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2014, month: 'May', ads: 'https://ui.adsabs.harvard.edu/abs/2014Natur.509..177V'},
        'Illustris-2': {size: 106.5, m_g: 1.e7, m_dm: 5e7, n_g_part: 910, n_dm_part: 910, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2014, month: 'May', ads: 'https://ui.adsabs.harvard.edu/abs/2014Natur.509..177V'},
        'Illustris-3': {size: 106.5, m_g: 8.1e7, m_dm: 4e8, n_g_part: 455, n_dm_part: 455, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2014, month: 'May', ads: 'https://ui.adsabs.harvard.edu/abs/2014Natur.509..177V'}
    },
    'SIMBA': {
        'SIMBA-m100n1024': {size: 100/0.7, m_g: 1.82e7, m_dm: 9.6e7, n_g_part: 1024, n_dm_part: 1024, code: 'GIZMO', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2019, month: 'June', ads: 'https://arxiv.org/abs/1901.10203', dust: true},
        'SIMBA-m50n1024': {size: 50/0.7, m_g: 2.28e6, m_dm: 1.2e7, n_g_part: 1024, n_dm_part: 1024, code: 'GIZMO', 'radiative-transfer': false, complete: true, redshift_end: 1.0, periodic: true, year: 2019, month: 'June', ads: 'https://arxiv.org/abs/1901.10203', dust: true},
        'SIMBA-m25n1024': {size: 25/0.7, m_g: 2.85e5, m_dm: 1.5e6, n_g_part: 1024, n_dm_part: 1024, code: 'GIZMO', 'radiative-transfer': false, complete: true, redshift_end: 2.0, periodic: true, year: 2019, month: 'June', ads: 'https://arxiv.org/abs/1901.10203', dust: true}
    },
    'MUFASA': {
        'MUFASA-m50n512': {size: 50/0.7, m_g: 1.82e7, m_dm: 9.6e7, n_g_part: 512, n_dm_part: 512, code: 'GIZMO', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2019, month: 'June', ads: 'https://arxiv.org/abs/1604.01418'},
        'MUFASA-m25n512': {size: 25/0.7, m_g: 2.28e6, m_dm: 1.2e7, n_g_part: 512, n_dm_part: 512, code: 'GIZMO', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2019, month: 'June', ads: 'https://arxiv.org/abs/1604.01418'},
        'MUFASA-m12.5n512': {size: 12.5/0.7, m_g: 2.85e5, m_dm: 1.5e6, n_g_part: 512, n_dm_part: 512, code: 'GIZMO', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2019, month: 'June', ads: 'https://arxiv.org/abs/1604.01418'}
    },
    'THESAN': {
        'THESAN-1': {size: 95.5, m_g: 5.82e5, m_dm: 3.12e6, n_g_part: 2100, n_dm_part: 2100, code: 'Arepo', 'radiative-transfer': true, complete: true, redshift_end: 5.5, periodic: true, year: 2022, month: 'April', dust: true, ads: 'https://ui.adsabs.harvard.edu/abs/2022MNRAS.511.4005K/abstract'},
        'THESAN-2': {size: 95.5, m_g: 4.66e6, m_dm: 2.49e7, n_g_part: 1050, n_dm_part: 1050, code: 'Arepo', 'radiative-transfer': true, complete: true, redshift_end: 5.5, periodic: true, year: 2022, month: 'April', dust: true, ads: 'https://ui.adsabs.harvard.edu/abs/2022MNRAS.511.4005K/abstract'}
    },
    'FLARES': {
        'FLARES': {size: 115.2, m_g: 1.81e6, m_dm: 9.7e6, n_g_part: 2223, n_dm_part: 2223, code: 'Gadget-3', 'radiative-transfer': false, complete: true, redshift_end: 5.0, periodic: false, suite: true, year: 2021, month: '', effective_volume: 3200, ads: 'https://ui.adsabs.harvard.edu/abs/2021MNRAS.500.2127L/abstract', dust: false},
    },
    'FLAMINGO': {
        'FLAMINGO-L1_m8': {size: 1000, m_g: 1.34e8, m_dm: 7.06e8, n_g_part: 3600, n_dm_part: 3600, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', dust: false, ads: 'https://arxiv.org/abs/2306.04024'},
        'FLAMINGO-L1_m9': {size: 1000, m_g: 1.07e9, m_dm: 5.65e9, n_g_part: 1800, n_dm_part: 1800, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', dust: false, ads: 'https://arxiv.org/abs/2306.04024'},
        'FLAMINGO-L1_m10': {size: 1000, m_g: 8.56e9, m_dm: 4.52e10, n_g_part: 900, n_dm_part: 500, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', dust: false, ads: 'https://arxiv.org/abs/2306.04024'},
        'FLAMINGO-L2p8_m9': {size: 2800, m_g: 1.07e9, m_dm: 5.65e9, n_g_part: 5040, n_dm_part: 5040, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', dust: false, ads: 'https://arxiv.org/abs/2306.04024'}
    },
    'MillenniumTNG': {
        'MTNG740': {size: 740, m_g: 3.1e7, m_dm: 1.7e8, n_g_part: 4320, n_dm_part: 4320, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', ads: 'https://arxiv.org/abs/2210.10060', dust: false},
        'MTNG185': {size: 185, m_g: 3.1e7, m_dm: 1.7e8, n_g_part: 1080, n_dm_part: 1080, code: 'Arepo', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', ads: 'https://arxiv.org/abs/2210.10059', dust: false}
    },
    'COLIBRE': {
        'COLIBRE-50': {size: 50, m_g: 2.3e5, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025, month: ''},
        'COLIBRE-100': {size: 100, m_g: 1.84e6, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025, month: ''},
        'COLIBRE-200': {size: 200, m_g: 1.84e6, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025, month: ''},
        'COLIBRE-400': {size: 400, m_g: 1.47e7, code: 'SWIFT', 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025, month: ''}
    },
    'MassiveBlack': {
        // Masses in h^-1 M_sun converted with h=0.7; box in h^-1 Mpc / 0.7
        'MassiveBlack': {size: 533.3/0.7, m_g: 5.7e7/0.7, 'radiative-transfer': false, complete: true, redshift_end: 4.75, periodic: true, year: 2012, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2012MNRAS.424..605D'},
        'MassiveBlack-II': {size: 100/0.704, m_g: 2.2e6/0.704, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.450.1349K'}
    },
    'Magneticum': {
        // Magneticum Pathfinder suite; box sizes in h^-1 Mpc (h=0.704, WMAP7); masses in M_sun
        'Magneticum-Box0':   {size: 2688/0.704, m_g: 1.7e9,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box1':   {size: 896/0.704,  m_g: 1.7e9,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box2b':  {size: 640/0.704,  m_g: 2.0e8,  'radiative-transfer': false, complete: true, redshift_end: 0.2, periodic: true, year: 2015, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box2hr': {size: 352/0.704,  m_g: 2.0e8,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box3':   {size: 128/0.704,  m_g: 1.0e7,  'radiative-transfer': false, complete: true, redshift_end: 1.7, periodic: true, year: 2015, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box4':   {size: 48/0.704,   m_g: 1.0e7,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'},
        'Magneticum-Box5':   {size: 18/0.704,   m_g: 2.0e6,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2015, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2015MNRAS.451.4277D'}
    },
    'CAMELS': {
        'CAMELS-1': {size: 25/0.7, m_g: 2e7, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, suite: true, year: 2021, month: ''},
        'CAMELS-2': {size: 50/0.7, m_g: 2e7, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, suite: true, year: 2021, month: ''}
    },
    'Quijote': {
        // m_dm = 2.775e11 * omega_m * L^3 / N^3 (Msun/h), divided by h to get Msun
        // omega_m=0.3175, h=0.6711, L=1000 Mpc/h
        'Quijote-512':  {size: 1000/0.6711, m_dm: 2.775e11 * 0.3175 * 1e9 / Math.pow(512,  3) / 0.6711, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, suite: true, year: 2020, month: ''},
        'Quijote-1024': {size: 1000/0.6711, m_dm: 2.775e11 * 0.3175 * 1e9 / Math.pow(1024, 3) / 0.6711, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, suite: true, year: 2020, month: ''}
    },
    'FIREbox': {
        // Feldmann et al. (2023); FIRE-2 cosmological periodic volume; h=0.677 (Planck 2015)
        'FB1024': {size: 22.1, m_g: 6.26e4, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2023MNRAS.522.3831F'},
        'FB512':  {size: 22.1, m_g: 5.01e5, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2023MNRAS.522.3831F'},
        'FB256':  {size: 22.1, m_g: 4.01e6, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2023MNRAS.522.3831F'}
    },
    'OWLS': {
        // Schaye et al. (2010); box sizes in h^-1 Mpc and masses in h^-1 M_sun (h=0.73, WMAP3)
        'OWLS-L100': {size: 100/0.73, m_g: 8.66e7/0.73, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2010, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2010MNRAS.402.1536S'},
        'OWLS-L25':  {size: 25/0.73,  m_g: 1.35e6/0.73, 'radiative-transfer': false, complete: true, redshift_end: 2.0, periodic: true, year: 2010, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2010MNRAS.402.1536S'}
    },
    'Romulus': {
        // Tremmel et al. (2017); masses in M_sun
        'Romulus25': {size: 25, m_g: 2.12e5, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2017, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2017MNRAS.470.1121T'},
        'Romulus50': {size: 50, m_g: 2.12e5, 'radiative-transfer': false, complete: true, redshift_end: 2.0, periodic: true, year: 2017, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2017MNRAS.470.1121T'},
        'Romulus8':  {size: 8,  m_g: 2.12e5, 'radiative-transfer': false, complete: true, redshift_end: 0.5, periodic: true, year: 2017, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2017MNRAS.470.1121T'}
    },
    'SLOW': {
        // Dolag et al.; constrained simulation of local Universe; box = 500 h^-1 Mpc (h=0.6777, Planck)
        // Gas particle masses from Table 1 of respective papers (in h^-1 M_sun, converted to M_sun)
        'SLOW-AGN1536': {size: 500/0.6777, m_g: 4.6e8/0.6777, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2023, month: '', ads: 'https://arxiv.org/abs/2302.10960'},
        'SLOW-AGN3072': {size: 500/0.6777, m_g: 5.5e7/0.6777, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2024, month: '', ads: 'https://arxiv.org/abs/2402.01834'}
    },
    'Individual Hydrodynamical Simulations': {
        'Horizon-AGN': {size: 120, m_g: 4e6, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2014, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2014MNRAS.444.1453D'},
        'BAHAMAS': {size: 560, m_g: 1.5e9, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2017, month: ''},
        'SPHINX': {size: 20, m_g: 3.8e4, 'radiative-transfer': true, complete: true, redshift_end: 4.6, periodic: true, year: 2018, month: ''},
        'FRONTIER-E': {size: 4700, m_g: 1e8, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, year: 2025, month: '', ads: 'https://arxiv.org/abs/2510.03557'},
                // Pre-2010 periodic hydrodynamical simulations.
        // Masses were reported as h^-1 M_sun; converted to M_sun using h≈0.5 for SCDM-era (1992-1996)
        // and h≈0.7 for later runs. Box sizes similarly converted from h^-1 Mpc.
        // Values sourced from Gemini summary — verify against original papers before citing.
        'Cen+Ostriker-1992':  {size: 10/0.5,   m_g: 1.21e6/0.5,  'radiative-transfer': false, complete: true, redshift_end: 2.75, periodic: true, year: 1992, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/1992ApJ...393...22C'},
        'Katz-1996':          {size: 22.2/0.7,  m_g: 3.9e8/0.7,   'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 1996, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/1996ApJS..105...19K'},
        'Hernquist-1996':     {size: 11.1/0.5,  m_g: 5.3e6/0.5,   'radiative-transfer': false, complete: true, redshift_end: 2.0,  periodic: true, year: 1996, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/1996ApJ...457L..51H'},
        'Cen+Ostriker-1999':  {size: 100/0.7,   m_g: 2.3e9/0.7,   'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 1999, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/1999ApJ...514....1C'},
        'Dave-1999':          {size: 50/0.67,   m_g: 1.5e9/0.67,  'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 1999, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/1999ApJ...511..521D'},
        'Dave-2001':          {size: 100/0.7,   m_g: 2.1e8/0.7,   'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 2001, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2001ApJ...552..473D'},
        'MareNostrum-Univ':   {size: 500/0.7,   m_g: 1.5e9/0.7,   'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 2006, month: '', ads: 'https://arxiv.org/abs/astro-ph/0610622'},
        'Popping-2009':       {size: 32/0.7,    m_g: 3.35e6/0.7,  'radiative-transfer': false, complete: true, redshift_end: 0.0,  periodic: true, year: 2009, month: '', ads: 'https://ui.adsabs.harvard.edu/abs/2009A%26A...504...15P'}
    },
    'Individual DMO Simulations': {
        'SMDPL':         {size: 400/0.6711,  m_dm: 9.6e7/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2016, month: ''},
        'Chinchilla':    {size: 400/0.6711,  m_dm: 5.9e8/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2019, month: ''},
        'MDPL2':         {size: 1000/0.6711, m_dm: 1.5e9/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2016, month: ''},
        'Abacus Summit': {size: 2000/0.6711, m_dm: 2.1e9/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2021, month: ''},
        'Outer Rim':     {size: 3000/0.6711, m_dm: 1.8e9/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2019, month: ''},
        'Flagship':      {size: 3600/0.6711, m_dm: 1.0e9/0.6711,  'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2017, month: ''},
        'HalfDome':      {size: 3750/0.6711, m_dm: 2.0e10/0.6711, 'radiative-transfer': false, complete: true, redshift_end: 0.0, periodic: true, dmo: true, year: 2024, month: ''}
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
    'Gadget-3': '🇬3',
    'GIZMO': 'gizmo.png',
    'Gadget-2': '🇬2',
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
