// Calculate E(z) = H(z)/H0
function E(z) {
    const a = 1 / (1 + z);
    return Math.sqrt(cosmology.Om0 / (a * a * a) + cosmology.Ode0);
}

// Calculate comoving distance D_C(z) in Mpc using numerical integration
function comovingDistance(z) {
    const DH = cosmology.c / cosmology.H0;  // Hubble distance in Mpc
    
    // Simple numerical integration using Simpson's rule
    const steps = 1000;
    const dz = z / steps;
    let sum = 0;
    
    for (let i = 0; i <= steps; i++) {
        const zi = i * dz;
        const weight = (i === 0 || i === steps) ? 1 : (i % 2 === 0 ? 2 : 4);
        sum += weight / E(zi);
    }
    
    return DH * sum * dz / 3;  // Simpson's rule factor
}

// Calculate dV/dz/dΩ at redshift z in Mpc^3/sr
function dVdzdOmega(z) {
    const DH = cosmology.c / cosmology.H0;  // Hubble distance in Mpc
    const DC = comovingDistance(z);         // Comoving distance in Mpc
    
    return DH * DC * DC / E(z);
}

// Return the resolution element mass regardless of sim type (baryonic or DM)
function getResolutionMass(sim) {
    return sim.m_g !== undefined ? sim.m_g : sim.m_dm;
}

// Calculate stellar mass upper limit from resolution
// Minimum resolved stellar mass = 100 × gas particle mass
function calcStellarMassLimit(m_g) {
    return Math.log10(m_g * 100);
}

// Calculate area for given volume and redshift range using proper cosmology
function volumeToArea(volume_cMpc3, z_center, delta_z) {
    // Calculate dV/dz/dΩ at the central redshift
    const dVdzdOmega_val = dVdzdOmega(z_center);
    
    // Calculate solid angle in steradians
    const area_sr = volume_cMpc3 / (dVdzdOmega_val * delta_z);
    
    // Convert to square arcminutes
    // 1 steradian = (180/π)^2 * 3600 square arcminutes
    const area_arcmin2 = area_sr * Math.pow(180 / Math.PI, 2) * 3600;
    
    return area_arcmin2;
}

function areaToVolume(area_arcmin2, z_center, delta_z) {
    // Convert square arcminutes to steradians
    const area_sr = area_arcmin2 / (Math.pow(180 / Math.PI, 2) * 3600);
    
    // Calculate dV/dz/dΩ at the central redshift
    const dVdzdOmega_val = dVdzdOmega(z_center);
    
    return area_sr * dVdzdOmega_val * delta_z;
}

// Chart dimensions — width/height are set dynamically by resizeChart()
const margin = {top: 55, right: 20, bottom: 60, left: 70};
let width, height;

const svg = d3.select('#chart');

const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Clip path so data doesn't overflow plot boundary when zoomed
const clipRect = svg.append('defs').append('clipPath').attr('id', 'plot-clip')
    .append('rect').attr('x', 0).attr('y', 0);

// Scales (ranges set in resizeChart)
const xScale = d3.scaleLinear().domain([12.2, 3.8]);
const yScale = d3.scaleLinear().domain([2.5, 12]);

// Tooltip
const tooltip = d3.select('.tooltip');

// Axes
const xAxis = d3.axisBottom(xScale).ticks(8);
const yAxis = d3.axisLeft(yScale).ticks(10);

const xAxisG = g.append('g').attr('class', 'axis');
const yAxisG = g.append('g').attr('class', 'axis');
const yAxisRightG = g.append('g').attr('class', 'axis');

// Axis labels (positions set in resizeChart)
const xLabel = g.append('text')
    .attr('class', 'chart-label')
    .attr('text-anchor', 'middle')
    .style('font-size', '17px')
    .html('log<tspan dy="5" font-size="11px">10</tspan><tspan dy="-5">(baryonic / dark matter resolution element mass / </tspan><tspan font-style="italic">M</tspan><tspan dy="5" font-size="11px">⊙</tspan><tspan dy="-5">)</tspan>');

const yLabel = g.append('text')
    .attr('class', 'chart-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', -50)
    .attr('text-anchor', 'middle')
    .style('font-size', '17px')
    .html('log<tspan dy="5" font-size="11px">10</tspan><tspan dy="-5">(volume / cMpc</tspan><tspan dy="-6" font-size="11px">3</tspan><tspan dy="6">)</tspan>');

// Top axis for stellar mass (range set in resizeChart)
const xScaleTop = d3.scaleLinear()
    .domain([calcStellarMassLimit(Math.pow(10, 12.2)), calcStellarMassLimit(Math.pow(10, 3.8))]);

const xAxisTop = d3.axisTop(xScaleTop).ticks(6);
const xAxisTopG = g.append('g').attr('class', 'axis');

const topLabel = g.append('text')
    .attr('class', 'chart-label')
    .attr('y', -35)
    .attr('text-anchor', 'middle')
    .style('font-size', '17px')
    .html('log<tspan dy="5" font-size="11px">10</tspan><tspan dy="-5">(minimum resolved galaxy stellar mass / </tspan><tspan font-style="italic">M</tspan><tspan dy="5" font-size="11px">⊙</tspan><tspan dy="-5">)</tspan>');

// Particle number lines group (rendered first, behind everything)
const particleGroup = g.append('g').attr('class', 'particle-lines');

// Survey lines group
const surveyGroup = g.append('g').attr('class', 'surveys');

// Simulations group
const simGroup = g.append('g').attr('class', 'simulations');

// Legend group
const legendGroup = g.append('g').attr('class', 'legend');

// Icon key group
const iconKeyGroup = g.append('g').attr('class', 'icon-key-group');

// Animated year display (top-middle of plot, shown only during timeline playback)
const yearDisplayText = g.append('text')
    .attr('class', 'year-display')
    .attr('text-anchor', 'middle')
    .style('opacity', 0);

// ── Box-select zoom ──────────────────────────────────────────────
const DEFAULT_X_DOMAIN = [12.2, 3.8];
const DEFAULT_Y_DOMAIN = [2.5, 12];
let isZoomed = false;
let dragState = null;

// Clip data groups to plot area
particleGroup.attr('clip-path', 'url(#plot-clip)');
surveyGroup.attr('clip-path', 'url(#plot-clip)');
simGroup.attr('clip-path', 'url(#plot-clip)');

// Transparent background rect (first child of g) — catches drag + dblclick on empty space
const plotBg = g.insert('rect', ':first-child')
    .attr('class', 'plot-background')
    .attr('x', 0).attr('y', 0)
    .attr('fill', 'transparent')
    .attr('cursor', 'crosshair');

// Rubber-band selection rect (last child of g, above data, no pointer events)
const selectionRect = g.append('rect')
    .attr('class', 'zoom-selection-rect')
    .attr('fill', 'rgba(100, 150, 255, 0.15)')
    .attr('stroke', '#88aaff')
    .attr('stroke-dasharray', '4 2')
    .attr('stroke-width', 1.5)
    .attr('pointer-events', 'none')
    .style('display', 'none');

// Populate suite checkboxes
const familyCheckboxContainer = d3.select('#family-checkboxes');

Object.entries(simulationFamilies).forEach(([familyName, sims]) => {
    const familyGroup = familyCheckboxContainer.append('div')
        .attr('class', 'family-group');

    const familyHeader = familyGroup.append('div')
        .attr('class', 'family-header')
        .attr('data-family', familyName);

    familyHeader.append('span')
        .attr('class', 'family-toggle collapsed')
        .text('▼');

    familyHeader.append('input')
        .attr('type', 'checkbox')
        .attr('class', 'family-checkbox')
        .attr('data-family', familyName)
        .property('checked', true);

    familyHeader.append('span')
        .attr('class', 'family-name')
        .text(familyName);

    const familySimsContainer = familyGroup.append('div')
        .attr('class', 'family-sims collapsed')
        .attr('data-family', familyName);

    Object.keys(sims).forEach(simName => {
        const label = familySimsContainer.append('label')
            .attr('class', 'checkbox-item sim-item');

        label.append('input')
            .attr('type', 'checkbox')
            .attr('class', 'individual-sim')
            .attr('data-family', familyName)
            .attr('value', simName)
            .property('checked', true);

        label.append('span').text(simName);
    });
});

// Populate numerical code checkboxes
const codeCheckboxContainer = d3.select('#code-checkboxes');
const allCodes = [...new Set(Object.values(simulations).map(s => s.code).filter(Boolean))].sort();
allCodes.forEach(code => {
    const label = codeCheckboxContainer.append('label').attr('class', 'checkbox-item');
    label.append('input')
        .attr('type', 'checkbox')
        .attr('class', 'code-checkbox')
        .attr('value', code)
        .property('checked', true);
    label.append('span').text(code);
});

// Reverse mapping: sim name → suite name, for emoji lookup
const simToFamily = {};
Object.entries(simulationFamilies).forEach(([familyName, sims]) => {
    Object.keys(sims).forEach(simName => { simToFamily[simName] = familyName; });
});

function getSimEmoji(simName) {
    const suite = simToFamily[simName];
    return suite ? (familyEmoji[suite] || null) : null;
}

function getCodeEmoji(simName) {
    const sim = simulations[simName];
    return sim && sim.code ? (codeEmoji[sim.code] || null) : null;
}

const YEAR_MIN = 1990;
const YEAR_MAX = new Date().getFullYear();

let currentYMode = 'volume';
let currentRedshift = 7.0;
let currentDeltaZ = 1.0;
let currentMaxRedshiftEnd = 20.0;
let currentMinYear = YEAR_MIN;
let currentMaxYear = YEAR_MAX;
let animationId = null;
let isAnimating = false;
let stickyData = null;

// ── Audio engine ─────────────────────────────────────────────────
let audioCtx = null;
let masterGain = null;
let soundGain = 0.3;
let soundPitchShift = 0;   // octaves
let soundTailScale = 1.0;
const soundCooldowns = new Map(); // sim object → last-played timestamp (ms)

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

// Snap a frequency to the nearest note of the A major pentatonic scale
// (A, B, C#, E, F#  →  semitone offsets from A: 0, 2, 4, 7, 9)
function snapToPentatonic(freq) {
    const penta = [0, 2, 4, 7, 9, 12]; // include octave-wrap sentinel
    const semiF = 12 * Math.log2(freq / 440); // semitones from A4
    const octave = Math.floor(semiF / 12);
    const pos = semiF - octave * 12;          // position within octave (0–12)
    let best = 0, bestDist = Infinity;
    for (const p of penta) {
        const d = Math.abs(pos - p);
        if (d < bestDist) { bestDist = d; best = p; }
    }
    const finalSemi = best === 12 ? (octave + 1) * 12 : octave * 12 + best;
    return 440 * Math.pow(2, finalSemi / 12);
}

function simFrequency(sim) {
    // High resolution (low mass) → high pitch; low resolution → low pitch
    // Maps log10(mass) linearly across 3 octaves: ~1600 Hz (low mass) → ~200 Hz (high mass)
    const logMass = Math.log10(getResolutionMass(sim));
    const t = Math.max(0, Math.min(1, (logMass - 3.8) / (12.2 - 3.8)));
    const baseFreq = 1600 * Math.pow(2, -3 * t);
    return snapToPentatonic(baseFreq * Math.pow(2, soundPitchShift));
}

function simTailLength(sim) {
    // Large volume → long tail; small volume → short tail
    const logVol = Math.log10(Math.pow(sim.size, 3));
    const t = Math.max(0, Math.min(1, (logVol - 3) / (12 - 3)));
    return (0.4 + 2.6 * t) * soundTailScale;
}

function simPan(sim) {
    // N_particles proxy = size³ / m_particle — encodes both axes; few particles → left, many → right
    const logN = Math.log10(Math.pow(sim.size, 3) / getResolutionMass(sim));
    const t = Math.max(0, Math.min(1, (logN + 1) / 4.5));  // range: logN ≈ -1 to 3.5
    return t * 2 - 1;   // -1 = hard left, +1 = hard right
}

function simReverbMix(sim) {
    // Large volume → spacious reverb; small volume → dry
    const logVol = Math.log10(Math.pow(sim.size, 3));
    return Math.max(0, Math.min(1, (logVol - 3) / (12 - 3)));
}

function playSimSound(sim) {
    if (!document.getElementById('play-sounds').checked) return;
    const now = Date.now();
    if (now - (soundCooldowns.get(sim) || 0) < 1000) return;
    soundCooldowns.set(sim, now);
    try {
        const ctx = getAudioCtx();
        const freq = simFrequency(sim);
        const tail = simTailLength(sim);
        const pan = simPan(sim);
        const mix = simReverbMix(sim);
        const t = ctx.currentTime;

        // Stereo panner — encodes particle count (both axes combined)
        const panner = ctx.createStereoPanner();
        panner.pan.value = pan;
        panner.connect(masterGain);

        // Feedback delay reverb — encodes volume (spaciousness of the simulation box)
        const delay = ctx.createDelay(0.12);
        const fbGain = ctx.createGain();
        const dryGain = ctx.createGain();
        const wetGain = ctx.createGain();
        delay.delayTime.value = 0.02 + mix * 0.07;  // 20–90 ms room size
        fbGain.gain.value = mix * 0.62;              // 0 = no echo, 0.62 = long decay
        dryGain.gain.value = 1 - mix * 0.45;
        wetGain.gain.value = mix * 0.45;
        delay.connect(fbGain); fbGain.connect(delay);   // feedback loop
        delay.connect(wetGain);
        dryGain.connect(panner);
        wetGain.connect(panner);
        // Break feedback loop after reverb tail to allow GC
        setTimeout(() => fbGain.disconnect(), (tail + 3) * 1000);

        function makeOsc(freqHz, gain, decayTime) {
            const osc = ctx.createOscillator();
            const env = ctx.createGain();
            osc.connect(env);
            env.connect(dryGain);
            env.connect(delay);
            osc.type = 'sine';
            osc.frequency.value = freqHz;
            env.gain.setValueAtTime(gain, t);
            env.gain.exponentialRampToValueAtTime(0.001, t + decayTime);
            osc.start(t); osc.stop(t + decayTime + 0.05);
        }

        makeOsc(freq, soundGain, tail);
        makeOsc(freq * 2.756, soundGain * 0.45, tail * 0.55);

    } catch (e) {
        console.warn('Audio error:', e);
    }
}

function buildTooltipHTML(d, includeLink) {
    const [name, sim] = d;
    const volume = Math.pow(sim.size, 3);
    let html = `<strong>${name}</strong><br>`;
    html += `Type: ${sim.dmo ? 'Dark Matter Only' : 'Hydrodynamic'}<br>`;
    const massLabel = sim.dmo ? 'DM particle mass' : 'Baryonic mass';
    html += `${massLabel}: ${getResolutionMass(sim).toExponential(2)} M☉<br>`;
    html += `Box size: ${sim.size.toFixed(1)} cMpc<br>`;
    html += `Volume: ${volume.toExponential(2)} cMpc³<br>`;
    if (sim.mhd) html += `MHD: Yes<br>`;
    if (sim['radiative-transfer']) html += `Radiative Transfer: Yes<br>`;
    html += `Redshift end: z=${sim.redshift_end}<br>`;
    if (sim.year !== undefined) html += `Published: ${sim.year}`;
    if (includeLink && sim.ads) html += `<br><a href="${sim.ads}" target="_blank" class="tooltip-link">View paper ↗</a>`;
    return html;
}

function positionTooltip(event) {
    const chartContainer = document.querySelector('.chart-container');
    const containerRect = chartContainer.getBoundingClientRect();
    const tooltipNode = tooltip.node();
    const tooltipWidth = tooltipNode.offsetWidth;
    const tooltipHeight = tooltipNode.offsetHeight;
    let left = event.pageX - containerRect.left - window.scrollX + 12;
    let top = event.pageY - containerRect.top - window.scrollY - tooltipHeight / 2;
    if (left + tooltipWidth > chartContainer.offsetWidth) {
        left = event.pageX - containerRect.left - window.scrollX - tooltipWidth - 12;
    }
    tooltip.style('left', left + 'px').style('top', top + 'px');
}

// Compute area-mode y domain from all simulations.
// Filters out non-finite values (e.g. at z≈0 where volumeToArea → ∞)
// and guarantees at least 1 log-unit of padding on each side.
function calcAreaDomain() {
    const yValues = Object.values(simulations)
        .map(sim => getYValue(sim))
        .filter(v => isFinite(v));
    if (yValues.length === 0) return [0, 8];
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const pad = Math.max((maxY - minY) * 0.15, 0.5); // ≥15%, at least 0.5 log units
    return [minY - pad, maxY + pad];
}

function updateYAxis(mode) {
    currentYMode = mode;

    // Show/hide redshift controls
    const redshiftControls = document.getElementById('redshift-controls');
    if (mode === 'area') {
        redshiftControls.style.display = 'block';
    } else {
        redshiftControls.style.display = 'none';
    }

    if (mode === 'volume') {
        yScale.domain([2.5, 12]);
        yLabel.html('log<tspan dy="5" font-size="11px">10</tspan><tspan dy="-5">(volume / cMpc</tspan><tspan dy="-6" font-size="11px">3</tspan><tspan dy="6">)</tspan>');
    } else {
        yScale.domain(calcAreaDomain());
        yLabel.html(`log<tspan dy="5" font-size="11px">10</tspan><tspan dy="-5">(area / arcmin</tspan><tspan dy="-6" font-size="11px">2</tspan><tspan dy="6">) @ z=${currentRedshift.toFixed(1)} (Δz=${currentDeltaZ.toFixed(1)})</tspan>`);
    }

    yAxisG.transition().duration(500).call(yAxis);
    render();
}

function updateRedshiftParams() {
    if (currentYMode === 'area') {
        yLabel.html(`log<tspan dy="5" font-size="11px">10</tspan><tspan dy="-5">(area / arcmin</tspan><tspan dy="-6" font-size="11px">2</tspan><tspan dy="6">) @ z=${currentRedshift.toFixed(1)} (Δz=${currentDeltaZ.toFixed(1)})</tspan>`);
        yScale.domain(calcAreaDomain());
        yAxisG.transition().duration(500).call(yAxis);
        render();
    }
}

function getYValue(sim) {
    const volume = Math.pow(sim.size, 3);
    
    if (currentYMode === 'volume') {
        return Math.log10(volume);
    } else {
        const area = volumeToArea(volume, currentRedshift, currentDeltaZ);
        return Math.log10(area);
    }
}

function defaultSimColor() {
    return document.querySelector('.chart-container').classList.contains('dark')
        ? '#c8cdd4'
        : '#333333';
}

// Colorscale for final redshift
const redshiftColorScaleDark = d3.scaleLinear()
    .domain([0, 3, 6])
    .range(['#f0f0f0', '#ff8800', '#cc2200'])
    .clamp(true);

const redshiftColorScaleBright = d3.scaleLinear()
    .domain([0, 3, 6])
    .range(['#000000', '#ff8800', '#cc2200'])
    .clamp(true);

function getRedshiftColorScale() {
    return document.getElementById('dark-chart').checked
        ? redshiftColorScaleBright
        : redshiftColorScaleDark;
}

function simColor(sim) {
    if (sim.dmo) return 'purple';
    return getRedshiftColorScale()(sim.redshift_end ?? 0);
}

// Planck 2018: H0 = 67.66 km/s/Mpc, Ωm = 0.3111
// ρ_crit = 2.775e11 h² M_☉/Mpc³  →  ρ_m = Ωm × ρ_crit
const LOG_RHO_M = Math.log10(2.775e11 * Math.pow(67.66 / 100, 2) * 0.3111);

function renderParticleLines() {
    particleGroup.selectAll('*').remove();
    if (currentYMode !== 'volume') return;

    const [yMin, yMax] = yScale.domain();
    const xMin = 3.8;   // right edge of plot (low mass)
    const xMax = 12.2;  // left  edge of plot (high mass)

    for (let logN = 6; logN <= 13; logN++) {
        const c = logN - LOG_RHO_M; // log10(V) = log10(m) + c

        // Clip line to plot boundaries
        const pts = [];
        const y_left   = xMax + c; if (y_left  >= yMin && y_left  <= yMax) pts.push([xMax, y_left]);
        const y_right  = xMin + c; if (y_right >= yMin && y_right <= yMax) pts.push([xMin, y_right]);
        const x_bottom = yMin - c; if (x_bottom > xMin && x_bottom < xMax) pts.push([x_bottom, yMin]);
        const x_top    = yMax - c; if (x_top    > xMin && x_top    < xMax) pts.push([x_top,    yMax]);
        if (pts.length < 2) continue;

        pts.sort((a, b) => a[0] - b[0]);

        particleGroup.append('line')
            .attr('class', 'particle-line')
            .attr('x1', xScale(pts[0][0])).attr('y1', yScale(pts[0][1]))
            .attr('x2', xScale(pts[1][0])).attr('y2', yScale(pts[1][1]));

        // Label at the upper end (highest x in data = left side of SVG)
        const labelPt = pts[1];
        const atLeftEdge = Math.abs(labelPt[0] - xMax) < 0.05;
        const lx = xScale(labelPt[0]);
        const ly = yScale(labelPt[1]);

        const label = particleGroup.append('text').attr('class', 'particle-label');
        if (atLeftEdge) {
            label.attr('x', lx + 5).attr('y', ly + 4).attr('text-anchor', 'start');
        } else {
            // exits through top edge — label just below
            label.attr('x', lx).attr('y', ly + 11).attr('text-anchor', 'middle');
        }
        label.append('tspan').text('10');
        label.append('tspan').attr('baseline-shift', 'super').attr('font-size', '8px').text(logN);
    }
}

function render() {
    const filterPeriodic = document.getElementById('filter-periodic').checked;
    const filterZoom = document.getElementById('filter-zoom').checked;
    const filterRT = document.getElementById('filter-rt').checked;
    const filterHydro = document.getElementById('filter-hydro').checked;
    const filterDMO = document.getElementById('filter-dmo').checked;
    const filterMHD = document.getElementById('filter-mhd').checked;

    const selectedSims = Array.from(document.querySelectorAll('.individual-sim:checked'))
        .map(cb => cb.value);

    const selectedCodes = new Set(
        Array.from(document.querySelectorAll('.code-checkbox:checked')).map(cb => cb.value)
    );

    const showSurveys = document.getElementById('show-surveys').checked;
    const showLegend = document.getElementById('show-legend').checked;
    const showIconKey = document.getElementById('show-icon-key').checked;
    const showEmojis = document.getElementById('show-emojis').checked;
    const showCodeEmojis = document.getElementById('show-code-emojis').checked;

    const activeEmoji = name => {
        if (showCodeEmojis) { const ce = getCodeEmoji(name); if (ce) return ce; }
        if (showEmojis) return getSimEmoji(name);
        return null;
    };
    const emojiActive = d => !!activeEmoji(d[0]);
    const isPng = e => e && e.endsWith('.png');

    // Filter simulations
    const filteredSims = Object.entries(simulations).filter(([name, sim]) => {
        // Each filter acts as a requirement - if checked, sim must have that property
        // If unchecked, that property is filtered out

        // Check periodic filter
        if (!filterPeriodic && sim.periodic) return false;

        // Check zoom filter (zoom = not periodic)
        if (!filterZoom && !sim.periodic) return false;

        // Check radiative transfer filter
        if (!filterRT && sim['radiative-transfer']) return false;

        // Check hydro / DMO filters
        if (!filterHydro && !sim.dmo) return false;
        if (!filterDMO && sim.dmo) return false;
        if (!filterMHD && sim.mhd) return false;

        // Check final redshift filter
        if (sim.redshift_end > currentMaxRedshiftEnd) return false;

        // Check publication year filter
        if (sim.year !== undefined && (sim.year < currentMinYear || sim.year > currentMaxYear)) return false;

        // Code filter
        if (!selectedCodes.has(sim.code)) return false;

        // Must be in selected individual sims
        return selectedSims.includes(name);
    });

    // If the sticky point was filtered out, clear it
    if (stickyData && !filteredSims.some(([name]) => name === stickyData[0])) {
        stickyData = null;
        tooltip.classed('visible', false).classed('sticky', false).style('pointer-events', 'none');
    }

    // Create simulation number mapping for legend
    const simNumberMap = new Map();
    filteredSims.forEach(([name], index) => {
        simNumberMap.set(name, index + 1);
    });

    // Render particle number lines
    renderParticleLines();

    // Render surveys
    surveyGroup.selectAll('*').remove();
    
    if (showSurveys && currentYMode !== 'volume') {
        const z = currentYMode === 'area_z5' ? 5 : 7;
        const [yMin, yMax] = yScale.domain();
        // Legend occupies the top portion of the plot (y=0 to legendBottom)
        const legendBottom = showLegend ? Math.min(height - 10, 360) : 0;

        Object.entries(surveys).forEach(([name, survey]) => {
            const y = Math.log10(survey.area);

            // Only render if within y-axis limits
            if (y >= yMin && y <= yMax) {
                const py = yScale(y);
                // If the line is sufficiently below the legend, label goes right; otherwise left of legend
                const belowLegend = !showLegend || py > legendBottom + 20;
                const labelX = belowLegend ? width - 5 : width - 138;

                surveyGroup.append('line')
                    .attr('class', 'survey-line')
                    .attr('x1', 0)
                    .attr('x2', width)
                    .attr('y1', py)
                    .attr('y2', py);

                surveyGroup.append('text')
                    .attr('class', 'survey-label')
                    .attr('x', labelX)
                    .attr('y', py - 4)
                    .attr('text-anchor', 'end')
                    .text(name);
            }
        });
    }

    // Render simulations
    const points = simGroup.selectAll('.sim-point')
        .data(filteredSims, d => d[0]);

    points.exit()
        .transition()
        .duration(300)
        .attr('transform', function() {
            // Keep position but scale down
            return d3.select(this).attr('transform') + ' scale(0)';
        })
        .remove();

    const pointsEnter = points.enter().append('g')
        .attr('class', 'sim-point')
        .attr('transform', d => {
            // Start at final position
            const x = xScale(Math.log10(getResolutionMass(d[1])));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y}) scale(0)`;
        });

    pointsEnter.append('circle')
        .attr('class', 'suite-ring')
        .attr('r', 9);

    pointsEnter.append('path')
        .attr('class', 'mhd-field');

    pointsEnter.append('circle')
        .attr('class', 'main-circle')
        .attr('r', 5);

    pointsEnter.append('circle')
        .attr('class', 'rt-ring')
        .attr('r', 8);

    pointsEnter.append('path')
        .attr('class', 'highlight-star');

    pointsEnter.append('rect')
        .attr('class', 'zoom-box')
        .attr('x', -8)
        .attr('y', -8)
        .attr('width', 16)
        .attr('height', 16);

    // Outer ring for zoom+suite combos (circle enclosing the zoom square)
    pointsEnter.append('circle')
        .attr('class', 'outer-ring')
        .attr('r', 13);

    pointsEnter.append('text')
        .attr('class', 'emoji-text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central');

    pointsEnter.append('image')
        .attr('class', 'emoji-image')
        .attr('x', -10).attr('y', -10)
        .attr('width', 20).attr('height', 20);

    pointsEnter.append('text')
        .attr('class', 'point-label')
        .attr('dy', -10);

    // Animate new points with blob effect
    pointsEnter.transition()
        .duration(200)
        .attr('transform', d => {
            const x = xScale(Math.log10(getResolutionMass(d[1])));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y}) scale(1.3)`;
        })
        .transition()
        .duration(200)
        .attr('transform', d => {
            const x = xScale(Math.log10(getResolutionMass(d[1])));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y}) scale(1)`;
        });

    // Update existing points to new positions
    points.transition()
        .duration(400)
        .attr('transform', d => {
            const x = xScale(Math.log10(getResolutionMass(d[1])));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y}) scale(1)`;
        });

    svg.on('click', function() {
        if (stickyData) {
            stickyData = null;
            tooltip.classed('visible', false).classed('sticky', false)
                .style('pointer-events', 'none');
            allPoints.transition().duration(200)
                .attr('transform', p => `translate(${xScale(Math.log10(getResolutionMass(p[1])))},${yScale(getYValue(p[1]))}) scale(1)`);
        }
    });

    const allPoints = pointsEnter.merge(points);

    allPoints.select('.mhd-field')
        .attr('d', d => d[1].mhd ? 'M 0,-5 C -9,-15 -9,15 0,5 M 0,-5 C 9,-15 9,15 0,5' : '')
        .attr('stroke', d => simColor(d[1]))
        .attr('opacity', d => emojiActive(d) ? 0 : (d[1].mhd ? (d[1].complete ? 1 : 0.3) : 0));

    allPoints.select('.suite-ring')
        .attr('stroke', d => simColor(d[1]))
        .attr('opacity', d => emojiActive(d) ? 0 : (d[1].suite && d[1].periodic ? (d[1].complete ? 1 : 0.3) : 0));

    allPoints.select('.outer-ring')
        .attr('fill', 'none')
        .attr('stroke', d => simColor(d[1]))
        .attr('stroke-width', 1.5)
        .attr('opacity', d => emojiActive(d) ? 0 : (d[1].suite && !d[1].periodic ? (d[1].complete ? 1 : 0.3) : 0));

    allPoints.select('.main-circle')
        .attr('fill', d => simColor(d[1]))
        .attr('opacity', d => emojiActive(d) ? 0 : (d[1].complete ? 1 : 0.3));

    allPoints.select('.rt-ring')
        .attr('opacity', 0);

    allPoints.select('.highlight-star')
        .attr('d', d => {
            if (!d[1]['radiative-transfer']) return '';
            return d3.symbol().type(d3.symbolStar).size(80)();
        })
        .attr('stroke', d => simColor(d[1]))
        .attr('opacity', d => emojiActive(d) ? 0 : (d[1]['radiative-transfer'] ? 1 : 0));

    allPoints.select('.zoom-box')
        .attr('fill', 'none')
        .attr('stroke', d => simColor(d[1]))
        .attr('stroke-width', 1.5)
        .attr('opacity', d => emojiActive(d) ? 0 : (!d[1].periodic ? 1 : 0) * (d[1].complete ? 1 : 0.3));

    allPoints.select('.emoji-text')
        .text(d => {
            const e = activeEmoji(d[0]);
            return (e && !isPng(e)) ? e : '';
        })
        .attr('opacity', d => {
            const e = activeEmoji(d[0]);
            return (e && !isPng(e)) ? 1 : 0;
        });

    const isDarkMode = !document.getElementById('dark-chart').checked;
    allPoints.select('.emoji-image')
        .attr('href', d => {
            const e = activeEmoji(d[0]);
            return (e && isPng(e)) ? `emoji/${e}` : null;
        })
        .attr('opacity', d => {
            const e = activeEmoji(d[0]);
            return (e && isPng(e)) ? 1 : 0;
        })
        .style('filter', d => {
            const e = activeEmoji(d[0]);
            return (e && isPng(e) && isDarkMode && e === getCodeEmoji(d[0])) ? 'invert(1)' : null;
        });

    allPoints.select('.point-label')
        .text(d => showLegend ? simNumberMap.get(d[0]) : '')
        .attr('opacity', showLegend ? 1 : 0);

    allPoints.on('mouseover', function(event, d) {
        playSimSound(d[1]);
        
        // Growth animation
        d3.select(this).transition().duration(200)
            .attr('transform', `translate(${xScale(Math.log10(getResolutionMass(d[1])))},${yScale(getYValue(d[1]))}) scale(1.5)`);

        if (stickyData) return;
        tooltip.html(buildTooltipHTML(d, false))
            .classed('visible', true)
            .style('pointer-events', 'none');
        positionTooltip(event);
    })
    .on('mouseout', function(event, d) {
        // Only shrink if NOT sticky
        if (!stickyData || stickyData[0] !== d[0]) {
            d3.select(this).transition().duration(200)
                .attr('transform', `translate(${xScale(Math.log10(getResolutionMass(d[1])))},${yScale(getYValue(d[1]))}) scale(1)`);
        }

        if (stickyData) return;
        tooltip.classed('visible', false);
    })
    .on('click', function(event, d) {
        event.stopPropagation();
        const prevStickyData = stickyData;

        if (stickyData && stickyData[0] === d[0]) {
            // Click same point — unstick
            stickyData = null;
            tooltip.classed('visible', false).classed('sticky', false)
                .style('pointer-events', 'none');
            
            // If mouse is still over, keep 1.5, otherwise 1.0
            // Since this is a click, mouse is over. But we can be safe:
            d3.select(this).transition().duration(200)
                .attr('transform', `translate(${xScale(Math.log10(getResolutionMass(d[1])))},${yScale(getYValue(d[1]))}) scale(1.5)`);
        } else {
            // Stick to this point (switch if another was already sticky)
            stickyData = d;
            
            // Unscale all points except the new sticky
            allPoints.filter(p => !stickyData || p[0] !== stickyData[0])
                .transition().duration(200)
                .attr('transform', p => `translate(${xScale(Math.log10(getResolutionMass(p[1])))},${yScale(getYValue(p[1]))}) scale(1)`);

            // Ensure this point is scaled up
            d3.select(this).transition().duration(200)
                .attr('transform', `translate(${xScale(Math.log10(getResolutionMass(d[1])))},${yScale(getYValue(d[1]))}) scale(1.5)`);

            tooltip.html(buildTooltipHTML(d, true))
                .classed('visible', true)
                .classed('sticky', true)
                .style('pointer-events', 'auto');
            positionTooltip(event);
        }
    });

    // Render legend
    legendGroup.selectAll('*').remove();

    if (showLegend && filteredSims.length > 0) {
        const legendX = width - 130;
        const legendY = 0;

        const legendBox = legendGroup.append('foreignObject')
            .attr('x', legendX)
            .attr('y', legendY)
            .attr('width', 122)
            .attr('height', Math.min(height - 10, 360));

        const legendDiv = legendBox.append('xhtml:div')
            .attr('class', 'legend-box');

        legendDiv.append('div')
            .attr('class', 'legend-title')
            .text('Simulations');

        // When zoomed, only list sims whose coordinates are within the current viewport
        const [xA, xB] = xScale.domain();
        const xLo = Math.min(xA, xB), xHi = Math.max(xA, xB);
        const [yLo, yHi] = yScale.domain().slice().sort((a, b) => a - b);
        const legendSims = isZoomed
            ? filteredSims.filter(([, sim]) => {
                const xv = Math.log10(getResolutionMass(sim));
                const yv = getYValue(sim);
                return xv >= xLo && xv <= xHi && yv >= yLo && yv <= yHi;
            })
            : filteredSims;

        legendSims.forEach(([name, sim]) => {
            const num = simNumberMap.get(name);
            const isActive = stickyData && stickyData[0] === name;
            const entry = legendDiv.append('div')
                .attr('class', isActive ? 'legend-entry legend-entry-active' : 'legend-entry');

            entry.append('span')
                .attr('class', 'legend-number')
                .text(`${num}.`);

            entry.append('span')
                .attr('class', 'legend-name')
                .text(name);

            entry.on('click', function(event) {
                event.stopPropagation();
                const d = filteredSims.find(([n]) => n === name);
                const pts = simGroup.selectAll('.sim-point');
                if (stickyData && stickyData[0] === d[0]) {
                    stickyData = null;
                    tooltip.classed('visible', false).classed('sticky', false)
                        .style('pointer-events', 'none');
                    pts.transition().duration(200)
                        .attr('transform', p => `translate(${xScale(Math.log10(getResolutionMass(p[1])))},${yScale(getYValue(p[1]))}) scale(1)`);
                } else {
                    stickyData = d;
                    pts.filter(p => p[0] !== stickyData[0]).transition().duration(200)
                        .attr('transform', p => `translate(${xScale(Math.log10(getResolutionMass(p[1])))},${yScale(getYValue(p[1]))}) scale(1)`);
                    pts.filter(p => p[0] === stickyData[0]).transition().duration(200)
                        .attr('transform', p => `translate(${xScale(Math.log10(getResolutionMass(p[1])))},${yScale(getYValue(p[1]))}) scale(1.5)`);
                    tooltip.html(buildTooltipHTML(d, true))
                        .classed('visible', true).classed('sticky', true)
                        .style('pointer-events', 'auto');
                    const svgRect = svg.node().getBoundingClientRect();
                    positionTooltip({
                        pageX: svgRect.left + margin.left + xScale(Math.log10(getResolutionMass(d[1]))) + window.scrollX,
                        pageY: svgRect.top + margin.top + yScale(getYValue(d[1])) + window.scrollY,
                    });
                }
                // Update legend active classes directly — avoids a full render() which would reset the enlargement
                document.querySelectorAll('.legend-entry').forEach((node, i) => {
                    const entryName = legendSims[i] ? legendSims[i][0] : null;
                    node.classList.toggle('legend-entry-active', !!(stickyData && stickyData[0] === entryName));
                });
            });
        });
    }

    // Render icon key
    iconKeyGroup.selectAll('*').remove();

    if (showIconKey) {
        const keyX = 10;
        const keyY = height - 240;

        const keyBox = iconKeyGroup.append('foreignObject')
            .attr('x', keyX)
            .attr('y', keyY)
            .attr('width', 180)
            .attr('height', 230);

        const keyDiv = keyBox.append('xhtml:div')
            .attr('class', 'icon-key');

        // Final redshift colorbar
        const colorbarItem = keyDiv.append('div')
            .attr('class', 'icon-key-colorbar');

        colorbarItem.append('div')
            .attr('class', 'colorbar-label')
            .text('Final redshift (z)');

        colorbarItem.append('div')
            .attr('class', 'colorbar-gradient');

        const tickRow = colorbarItem.append('div')
            .attr('class', 'colorbar-ticks');
        tickRow.append('span').text('0');
        tickRow.append('span').text('3');
        tickRow.append('span').text('≥6');

        // Dark Matter Only (purple dot)
        const dmoItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const dmoSvg = dmoItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        dmoSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('fill', 'purple');

        dmoItem.append('span')
            .attr('class', 'icon-key-label')
            .text('Dark Matter Only');

        keyDiv.append('div')
            .attr('class', 'icon-key-divider');

        // Simulation Suite (dot with surrounding circle)
        const suiteItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const suiteSvg = suiteItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        suiteSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 9)
            .attr('fill', 'none')
            .attr('class', 'icon-key-stroke')
            .attr('stroke-width', 1.5);

        suiteSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('class', 'icon-key-fill');

        suiteItem.append('span')
            .attr('class', 'icon-key-label')
            .text('Simulation Suite');

        // Radiative Transfer (star)
        const rtItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const rtSvg = rtItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        rtSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('class', 'icon-key-fill');

        rtSvg.append('path')
            .attr('d', d3.symbol().type(d3.symbolStar).size(100)())
            .attr('transform', 'translate(10,10)')
            .attr('fill', 'none')
            .attr('class', 'icon-key-stroke')
            .attr('stroke-width', 2);

        rtItem.append('span')
            .attr('class', 'icon-key-label')
            .text('Radiative Transfer');

        // Zoom Suite (box)
        const zoomItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const zoomSvg = zoomItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        zoomSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('class', 'icon-key-fill');

        zoomSvg.append('rect')
            .attr('x', 2)
            .attr('y', 2)
            .attr('width', 16)
            .attr('height', 16)
            .attr('fill', 'none')
            .attr('class', 'icon-key-stroke')
            .attr('stroke-width', 1.5);

        zoomItem.append('span')
            .attr('class', 'icon-key-label')
            .text('Zoom Simulation');

        // // Zoom + Suite (dot inside square inside circle)
        // const zoomSuiteItem = keyDiv.append('div')
        //     .attr('class', 'icon-key-item');

        // const zoomSuiteSvg = zoomSuiteItem.append('svg')
        //     .attr('width', 30)
        //     .attr('height', 30)
        //     .attr('overflow', 'visible');

        // zoomSuiteSvg.append('circle')
        //     .attr('cx', 15)
        //     .attr('cy', 15)
        //     .attr('r', 13)
        //     .attr('fill', 'none')
        //     .attr('class', 'icon-key-stroke')
        //     .attr('stroke-width', 1.5);

        // zoomSuiteSvg.append('rect')
        //     .attr('x', 7)
        //     .attr('y', 7)
        //     .attr('width', 16)
        //     .attr('height', 16)
        //     .attr('fill', 'none')
        //     .attr('class', 'icon-key-stroke')
        //     .attr('stroke-width', 1.5);

        // zoomSuiteSvg.append('circle')
        //     .attr('cx', 15)
        //     .attr('cy', 15)
        //     .attr('r', 5)
        //     .attr('class', 'icon-key-fill');

        // zoomSuiteItem.append('span')
        //     .attr('class', 'icon-key-label')
        //     .text('Zoom + Suite');

        // MHD (dot with dipole field lines)
        const mhdItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const mhdSvg = mhdItem.append('svg')
            .attr('width', 20)
            .attr('height', 20)
            .attr('overflow', 'visible');

        mhdSvg.append('path')
            .attr('d', 'M 10,5 C 3,-5 3,25 10,15 M 10,5 C 17,-5 17,25 10,15')
            .attr('fill', 'none')
            .attr('class', 'icon-key-stroke')
            .attr('stroke-width', 1.5);

        mhdSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('class', 'icon-key-fill');

        mhdItem.append('span')
            .attr('class', 'icon-key-label')
            .text('MHD');
    }
}

// Suite toggle functionality
document.querySelectorAll('.family-header').forEach(header => {
    header.addEventListener('click', (e) => {
        // Don't toggle if clicking on checkbox
        if (e.target.classList.contains('family-checkbox')) {
            return;
        }

        const familyName = header.getAttribute('data-family');
        const familySimsContainer = document.querySelector(`.family-sims[data-family="${familyName}"]`);
        const toggleIcon = header.querySelector('.family-toggle');

        if (familySimsContainer) {
            familySimsContainer.classList.toggle('collapsed');
            toggleIcon.classList.toggle('collapsed');
        }
    });
});

// Family checkbox functionality - select/deselect all sims in family
document.querySelectorAll('.family-checkbox').forEach(familyCheckbox => {
    familyCheckbox.addEventListener('change', (e) => {
        e.stopPropagation(); // Prevent toggle when clicking checkbox
        const familyName = familyCheckbox.getAttribute('data-family');
        const isChecked = familyCheckbox.checked;

        // Update all individual sim checkboxes in this family
        document.querySelectorAll(`.individual-sim[data-family="${familyName}"]`).forEach(simCheckbox => {
            simCheckbox.checked = isChecked;
        });

        render();
    });
});

// Individual sim checkbox functionality - update family checkbox state
document.querySelectorAll('.individual-sim').forEach(simCheckbox => {
    simCheckbox.addEventListener('change', () => {
        const familyName = simCheckbox.getAttribute('data-family');
        const familyCheckbox = document.querySelector(`.family-checkbox[data-family="${familyName}"]`);

        // Check if all sims in family are checked
        const allSimsInFamily = document.querySelectorAll(`.individual-sim[data-family="${familyName}"]`);
        const allChecked = Array.from(allSimsInFamily).every(cb => cb.checked);
        const anyChecked = Array.from(allSimsInFamily).some(cb => cb.checked);

        if (familyCheckbox) {
            familyCheckbox.checked = allChecked;
            familyCheckbox.indeterminate = !allChecked && anyChecked;
        }

        render();
    });
});

// Dropdown toggle functionality
document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
        const sectionId = header.getAttribute('data-section');
        const content = document.getElementById(`${sectionId}-content`);
        const icon = header.querySelector('.toggle-icon');

        if (content) {
            content.classList.toggle('collapsed');
            icon.classList.toggle('collapsed');
        }
    });
});

// Event listeners
document.querySelectorAll('input[name="yaxis"]').forEach(radio => {
    radio.addEventListener('change', (e) => updateYAxis(e.target.value));
});

document.getElementById('z-slider').addEventListener('input', (e) => {
    currentRedshift = parseFloat(e.target.value);
    document.getElementById('z-value').textContent = currentRedshift.toFixed(1);
    updateRedshiftParams();
});

document.getElementById('dz-slider').addEventListener('input', (e) => {
    currentDeltaZ = parseFloat(e.target.value);
    document.getElementById('dz-value').textContent = currentDeltaZ.toFixed(1);
    updateRedshiftParams();
});

document.getElementById('finalz-slider').addEventListener('input', (e) => {
    currentMaxRedshiftEnd = parseFloat(e.target.value);
    document.getElementById('finalz-value').textContent = currentMaxRedshiftEnd.toFixed(1);
    render();
});

// ── Publication year filter ───────────────────────────────────────
function updateYearUI() {
    const range = YEAR_MAX - YEAR_MIN;
    document.getElementById('year-fill').style.left  = ((currentMinYear - YEAR_MIN) / range * 100) + '%';
    document.getElementById('year-fill').style.right = ((YEAR_MAX - currentMaxYear) / range * 100) + '%';
    document.getElementById('year-min-value').textContent = currentMinYear;
    document.getElementById('year-max-value').textContent = currentMaxYear;
    document.getElementById('year-min').value = currentMinYear;
    document.getElementById('year-max').value = currentMaxYear;
    // Keep the draggable thumb accessible at the boundary
    const atMax = currentMinYear >= YEAR_MAX - 1;
    document.getElementById('year-min').style.zIndex = atMax ? 5 : 4;
    document.getElementById('year-max').style.zIndex = atMax ? 4 : 5;
}

// Initialise slider max to current year
document.getElementById('year-min').max = YEAR_MAX;
document.getElementById('year-max').max = YEAR_MAX;
document.getElementById('year-max').value = YEAR_MAX;
updateYearUI();

document.getElementById('year-min').addEventListener('input', e => {
    currentMinYear = Math.min(parseInt(e.target.value), currentMaxYear);
    e.target.value = currentMinYear;
    updateYearUI();
    render();
});

document.getElementById('year-max').addEventListener('input', e => {
    currentMaxYear = Math.max(parseInt(e.target.value), currentMinYear);
    e.target.value = currentMaxYear;
    updateYearUI();
    render();
});

let animStepMs = 400;

function startAnimation() {
    if (!isAnimating) {
        // Fresh start — always begin from YEAR_MIN
        currentMinYear = YEAR_MIN;
        currentMaxYear = YEAR_MIN;
        isAnimating = true;
        updateYearUI();
        render();
    }
    document.getElementById('year-play').textContent = '⏸';
    yearDisplayText.text(currentMaxYear).style('opacity', 0.15);

    function step() {
        currentMaxYear = Math.min(currentMaxYear + 1, YEAR_MAX);
        yearDisplayText.text(currentMaxYear);

        // Play a sound for each sim that first appears this year, staggered slightly
        const newSims = Object.values(simulations).filter(s => s.year === currentMaxYear);
        newSims.forEach((sim, i) => setTimeout(() => playSimSound(sim), i * 50));

        updateYearUI();
        render();
        if (currentMaxYear >= YEAR_MAX) {
            animationId = null;
            isAnimating = false;
            document.getElementById('year-play').textContent = '▶';
            return;
        }
        animationId = setTimeout(step, animStepMs);
    }
    animationId = setTimeout(step, animStepMs);
}

function pauseAnimation() {
    clearTimeout(animationId);
    animationId = null;
    document.getElementById('year-play').textContent = '▶';
}

function resetAnimation() {
    pauseAnimation();
    isAnimating = false;
    currentMinYear = YEAR_MIN;
    currentMaxYear = YEAR_MAX;
    yearDisplayText.style('opacity', 0);
    updateYearUI();
    render();
}

document.getElementById('year-play').addEventListener('click', () => {
    if (animationId !== null) {
        pauseAnimation();
    } else {
        startAnimation();
    }
});

document.getElementById('year-stop').addEventListener('click', resetAnimation);

document.getElementById('anim-speed').addEventListener('input', e => {
    animStepMs = parseInt(e.target.value);
    document.getElementById('anim-speed-value').textContent = (animStepMs / 1000).toFixed(1) + 's / yr';
});

document.querySelectorAll('#show-surveys, #show-legend, #show-icon-key, #show-emojis, #show-code-emojis, #filter-periodic, #filter-zoom, #filter-rt, #filter-hydro, #filter-dmo, #filter-mhd').forEach(cb => {
    cb.addEventListener('change', render);
});

document.getElementById('show-emojis').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('show-code-emojis').checked = false;
        render();
    }
});
document.getElementById('show-code-emojis').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('show-emojis').checked = false;
        render();
    }
});

document.querySelectorAll('.code-checkbox').forEach(cb => cb.addEventListener('change', render));

document.getElementById('codes-select-all').addEventListener('click', () => {
    document.querySelectorAll('.code-checkbox').forEach(cb => { cb.checked = true; });
    render();
});

document.getElementById('codes-clear-all').addEventListener('click', () => {
    document.querySelectorAll('.code-checkbox').forEach(cb => { cb.checked = false; });
    render();
});

document.getElementById('families-select-all').addEventListener('click', () => {
    document.querySelectorAll('.family-checkbox, .individual-sim').forEach(cb => { cb.checked = true; });
    render();
});

document.getElementById('families-clear-all').addEventListener('click', () => {
    document.querySelectorAll('.family-checkbox, .individual-sim').forEach(cb => { cb.checked = false; });
    render();
});

// ── Sound controls ───────────────────────────────────────────────
document.getElementById('play-sounds').addEventListener('change', e => {
    document.getElementById('sound-controls').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('sound-gain').addEventListener('input', e => {
    soundGain = parseFloat(e.target.value);
    document.getElementById('sound-gain-value').textContent = soundGain.toFixed(2);
    playSimSound({ size: 100, m_g: 1e6 }); // preview
});

document.getElementById('sound-pitch').addEventListener('input', e => {
    soundPitchShift = parseFloat(e.target.value);
    const sign = soundPitchShift > 0 ? '+' : '';
    document.getElementById('sound-pitch-value').textContent = `${sign}${soundPitchShift} oct`;
    playSimSound({ size: 100, m_g: 1e6 }); // preview
});

document.getElementById('sound-tail').addEventListener('input', e => {
    soundTailScale = parseFloat(e.target.value);
    document.getElementById('sound-tail-value').textContent = soundTailScale.toFixed(1) + '×';
    playSimSound({ size: 100, m_g: 1e6 }); // preview
});

// Dismiss sticky tooltip when clicking chart background
document.querySelector('.chart-container').addEventListener('click', () => {
    if (stickyData) {
        stickyData = null;
        tooltip.classed('visible', false).classed('sticky', false)
            .style('pointer-events', 'none');
    }
});

// Prevent clicks inside the tooltip (e.g. on a link) from dismissing it
tooltip.on('click', event => event.stopPropagation());

document.getElementById('dark-chart').addEventListener('change', (e) => {
    document.querySelector('.chart-container').classList.toggle('dark', !e.target.checked);
    render();
});

// Download functionality
document.getElementById('download-format').addEventListener('change', (e) => {
    const format = e.target.value;

    if (!format) return;

    const svgElement = document.getElementById('chart');
    const svgData = new XMLSerializer().serializeToString(svgElement);

    if (format === 'png') {
        // Create a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to match SVG
        const bbox = svgElement.getBoundingClientRect();
        canvas.width = bbox.width * 2; // 2x for higher resolution
        canvas.height = bbox.height * 2;

        // Create image from SVG
        const img = new Image();
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);

            // Download PNG
            canvas.toBlob((blob) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'cosmo-comparison.png';
                a.click();
            });
        };

        img.src = url;
    } else if (format === 'svg') {
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'cosmo-comparison.svg';
        a.click();

        URL.revokeObjectURL(url);
    }

    // Reset dropdown
    e.target.value = '';
});

function resizeChart() {
    const container = document.querySelector('.chart-container');
    const innerW = container.clientWidth - 60;   // 30px padding left + right
    const innerH = container.clientHeight - 90;  // 30px top + 60px bottom padding
    width  = innerW - margin.left - margin.right;
    height = innerH - margin.top  - margin.bottom;
    if (width < 50 || height < 50) return;

    svg.attr('width', innerW).attr('height', innerH);

    xScale.range([0, width]);
    yScale.range([height, 0]);
    xScaleTop.range([0, width]);

    clipRect.attr('width', width).attr('height', height);
    plotBg.attr('width', width).attr('height', height);

    xAxisG.attr('transform', `translate(0,${height})`).call(xAxis);
    yAxisG.call(yAxis);
    xAxisTopG.call(xAxisTop);
    yAxisRightG.attr('transform', `translate(${width},0)`)
               .call(d3.axisRight(yScale).tickValues([]));

    xLabel.attr('x', width / 2).attr('y', height + 55);
    yLabel.attr('x', -height / 2);
    topLabel.attr('x', width / 2);
    yearDisplayText.attr('x', width * 0.62).attr('y', 80);

    render();
}

// ── Box-select zoom handlers ─────────────────────────────────────
function refreshAxes() {
    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
    xAxisTopG.call(xAxisTop);
    yAxisRightG.call(d3.axisRight(yScale).tickValues([]));
}

function getDefaultYDomain() {
    if (currentYMode === 'volume') return [2.5, 12];
    return calcAreaDomain();
}

function resetZoom() {
    if (!isZoomed) return;
    xScale.domain(DEFAULT_X_DOMAIN);
    yScale.domain(getDefaultYDomain());
    xScaleTop.domain([
        calcStellarMassLimit(Math.pow(10, DEFAULT_X_DOMAIN[0])),
        calcStellarMassLimit(Math.pow(10, DEFAULT_X_DOMAIN[1]))
    ]);
    isZoomed = false;
    refreshAxes();
    render();
}

svg.node().addEventListener('mousedown', event => {
    if (event.target !== plotBg.node()) return;
    const [mx, my] = d3.pointer(event, g.node());
    dragState = { x0: mx, y0: my };
    selectionRect
        .attr('x', mx).attr('y', my)
        .attr('width', 0).attr('height', 0)
        .style('display', null);
    event.preventDefault();
});

svg.node().addEventListener('mousemove', event => {
    if (!dragState) return;
    const [mx, my] = d3.pointer(event, g.node());
    const x = Math.min(dragState.x0, mx);
    const y = Math.min(dragState.y0, my);
    const w = Math.abs(mx - dragState.x0);
    const h = Math.abs(my - dragState.y0);
    selectionRect.attr('x', x).attr('y', y).attr('width', w).attr('height', h);
});

window.addEventListener('mouseup', () => {
    if (!dragState) return;
    const x = +selectionRect.attr('x');
    const y = +selectionRect.attr('y');
    const w = +selectionRect.attr('width');
    const h = +selectionRect.attr('height');
    selectionRect.style('display', 'none');
    dragState = null;
    if (w < 10 || h < 10) return;
    const newXDomain = [xScale.invert(x), xScale.invert(x + w)];
    const newYDomain = [yScale.invert(y + h), yScale.invert(y)];
    xScale.domain(newXDomain);
    yScale.domain(newYDomain);
    xScaleTop.domain([
        calcStellarMassLimit(Math.pow(10, newXDomain[0])),
        calcStellarMassLimit(Math.pow(10, newXDomain[1]))
    ]);
    isZoomed = true;
    refreshAxes();
    render();
});

plotBg.on('dblclick', resetZoom);

// ── Sidebar responsive behaviour ────────────────────────────────
const MOBILE_BREAKPOINT = 768;

// On mobile, start with sidebar hidden and heavy overlays off
if (window.innerWidth <= MOBILE_BREAKPOINT) {
    document.body.classList.remove('sidebar-open');
    document.getElementById('show-icon-key').checked = false;
    document.getElementById('show-legend').checked = false;
}

document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
});

document.getElementById('mobile-warning-dismiss').addEventListener('click', () => {
    document.getElementById('mobile-warning').style.display = 'none';
});

document.getElementById('reset-all').addEventListener('click', () => {
    // Stop any running animation and reset year range
    resetAnimation();

    // Animation speed
    animStepMs = 400;
    document.getElementById('anim-speed').value = 400;
    document.getElementById('anim-speed-value').textContent = '0.4s / yr';

    // Y-axis back to volume
    document.querySelector('input[name="yaxis"][value="volume"]').checked = true;
    updateYAxis('volume');

    // Redshift sliders
    currentRedshift = 7.0;
    currentDeltaZ = 1.0;
    document.getElementById('z-slider').value = 7;
    document.getElementById('z-value').textContent = '7.0';
    document.getElementById('dz-slider').value = 1;
    document.getElementById('dz-value').textContent = '1.0';

    // Final redshift slider
    currentMaxRedshiftEnd = 20.0;
    document.getElementById('finalz-slider').value = 20;
    document.getElementById('finalz-value').textContent = '20.0';

    // Simulation type filters — all on
    ['filter-periodic', 'filter-zoom', 'filter-rt', 'filter-hydro', 'filter-dmo', 'filter-mhd']
        .forEach(id => { document.getElementById(id).checked = true; });

    // Visual elements
    document.getElementById('show-surveys').checked = true;
    document.getElementById('show-legend').checked = true;
    document.getElementById('show-icon-key').checked = true;
    document.getElementById('show-emojis').checked = false;
    document.getElementById('show-code-emojis').checked = false;
    document.getElementById('dark-chart').checked = false;
    document.querySelector('.chart-container').classList.add('dark');

    // Sounds off
    document.getElementById('play-sounds').checked = false;
    document.getElementById('sound-controls').style.display = 'none';
    soundGain = 0.3;
    soundPitchShift = 0;
    soundTailScale = 1.0;
    document.getElementById('sound-gain').value = 0.3;
    document.getElementById('sound-gain-value').textContent = '0.30';
    document.getElementById('sound-pitch').value = 0;
    document.getElementById('sound-pitch-value').textContent = '0 oct';
    document.getElementById('sound-tail').value = 1;
    document.getElementById('sound-tail-value').textContent = '1.0×';

    // All numerical codes on
    document.querySelectorAll('.code-checkbox').forEach(cb => { cb.checked = true; });

    // All families and individual sims on
    document.querySelectorAll('.family-checkbox, .individual-sim').forEach(cb => { cb.checked = true; });

    // Clear sticky tooltip
    stickyData = null;
    tooltip.classed('visible', false).classed('sticky', false).style('pointer-events', 'none');

    // Reset zoom
    isZoomed = true; // ensure resetZoom runs
    resetZoom();

    render();
});

document.getElementById('sidebar-overlay').addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
});

// Re-open sidebar automatically when resizing back to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
        document.body.classList.add('sidebar-open');
    }
});

// ── Initial sizing and render ────────────────────────────────────
resizeChart();

// Re-size on container change; debounce so the grid transition
// (0.25s) finishes before we recalculate dimensions
let resizeTimeout;
new ResizeObserver(() => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeChart, 50);
}).observe(document.querySelector('.chart-container'));
