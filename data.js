// Simulation data
const simulations = {
    'EAGLE-Ref': {size: 100, m_g: 1.81e6, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'EAGLE-Recal': {size: 25, m_g: 2.26e5, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'Illustris-TNG50': {size: 51.7, m_g: 8.5e4, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'Illustris-TNG100': {size: 110.7, m_g: 1.4e6, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'Illustris-TNG300': {size: 302.6, m_g: 1.1e7, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'Simba-100': {size: 100/0.7, m_g: 1.82e7, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'Simba-50': {size: 50/0.7, m_g: 2.28e6, RT: false, complete: true, redshift_end: 1.0, type: 'large-volume'},
    'Simba-25': {size: 25/0.7, m_g: 2.85e5, RT: false, complete: true, redshift_end: 2.0, type: 'large-volume'},
    'Horizon-AGN': {size: 120, m_g: 4e6, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'BAHAMAS': {size: 560, m_g: 1.5e9, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'THESAN-1': {size: 95.5, m_g: 5.82e5, RT: true, complete: true, redshift_end: 5.5, type: 'radiative-transfer'},
    'THESAN-2': {size: 95.5, m_g: 4.66e6, RT: true, complete: true, redshift_end: 5.5, type: 'radiative-transfer'},
    'SPHINX': {size: 20, m_g: 3.8e4, RT: true, complete: true, redshift_end: 4.6, type: 'radiative-transfer'},
    'FLAMINGO-L1_m8': {size: 1000, m_g: 1.34e8, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'FLAMINGO-L1_m9': {size: 1000, m_g: 1.07e9, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'FLAMINGO-L2p8_m9': {size: 2800, m_g: 1.07e9, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'MTNG740': {size: 740, m_g: 7.63e7, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'MTNG185': {size: 185, m_g: 2.98e6, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'COLIBRE-50': {size: 50, m_g: 2.3e5, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'COLIBRE-100': {size: 100, m_g: 1.84e6, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'COLIBRE-200': {size: 200, m_g: 1.84e6, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'COLIBRE-400': {size: 400, m_g: 1.47e7, RT: false, complete: true, redshift_end: 0.0, type: 'large-volume'},
    'FLAMELS': {size: 20, m_g: 2e7, RT: false, complete: true, redshift_end: 5.0, type: 'zoom', highlight: 'red', star: true},
    'FLARES': {size: 14.28, m_g: 1.81e6, RT: false, complete: true, redshift_end: 5.0, type: 'zoom', highlight: 'green', star: true},
    'CAMELS-1': {size: 25/0.7, m_g: 2e7, RT: false, complete: true, redshift_end: 0.0, type: 'zoom', highlight: 'red'},
    'CAMELS-2': {size: 50/0.7, m_g: 2e7, RT: false, complete: true, redshift_end: 0.0, type: 'zoom', highlight: 'red'}
};

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
