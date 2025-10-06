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

// Chart dimensions
const margin = {top: 40, right: 140, bottom: 60, left: 70};
const width = 800 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

const svg = d3.select('#chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Scales
const xScale = d3.scaleLinear()
    .domain([10.5, 3.8])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([3.0, 12])
    .range([height, 0]);

// Tooltip
const tooltip = d3.select('.tooltip');

// Axes
const xAxis = d3.axisBottom(xScale).ticks(8);
const yAxis = d3.axisLeft(yScale).ticks(10);

const xAxisG = g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

const yAxisG = g.append('g')
    .attr('class', 'axis')
    .call(yAxis);

// Grid
const xGrid = d3.axisBottom(xScale).tickSize(-height).tickFormat('').ticks(8);
let yGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('').ticks(10);

g.append('g')
    .attr('class', 'grid x-grid')
    .attr('transform', `translate(0,${height})`)
    .call(xGrid);

const yGridG = g.append('g')
    .attr('class', 'grid y-grid')
    .call(yGrid);

// Axis labels
let xLabel = g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .html('log<tspan baseline-shift="sub" font-size="11px">10</tspan>(baryonic resolution element mass/M<tspan baseline-shift="sub" font-size="11px">☉</tspan>)');

let yLabel = g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -50)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .html('log<tspan baseline-shift="sub" font-size="11px">10</tspan>(volume/cMpc<tspan baseline-shift="super" font-size="11px">3</tspan>)');

// Top axis for stellar mass
const xScaleTop = d3.scaleLinear()
    .domain([calcStellarMassLimit(Math.pow(10, 10.5)), calcStellarMassLimit(Math.pow(10, 3.8))])
    .range([0, width]);

const xAxisTop = d3.axisTop(xScaleTop).ticks(6);

g.append('g')
    .attr('class', 'axis')
    .call(xAxisTop);

g.append('text')
    .attr('x', width / 2)
    .attr('y', -25)
    .attr('text-anchor', 'middle')
    .style('font-size', '13px')
    .html('log<tspan baseline-shift="sub" font-size="10px">10</tspan>(minimum resolved galaxy stellar mass/M<tspan baseline-shift="sub" font-size="10px">☉</tspan>)');

// Survey lines group
const surveyGroup = g.append('g').attr('class', 'surveys');

// Simulations group
const simGroup = g.append('g').attr('class', 'simulations');

// Legend group
const legendGroup = g.append('g').attr('class', 'legend');

// Icon key group
const iconKeyGroup = g.append('g').attr('class', 'icon-key-group');

// Populate suite checkboxes
const suiteCheckboxContainer = d3.select('#suite-checkboxes');

Object.entries(simulationSuites).forEach(([suiteName, sims]) => {
    const suiteGroup = suiteCheckboxContainer.append('div')
        .attr('class', 'suite-group');

    const suiteHeader = suiteGroup.append('div')
        .attr('class', 'suite-header')
        .attr('data-suite', suiteName);

    suiteHeader.append('span')
        .attr('class', 'suite-toggle')
        .text('▼');

    suiteHeader.append('input')
        .attr('type', 'checkbox')
        .attr('class', 'suite-checkbox')
        .attr('data-suite', suiteName)
        .property('checked', true);

    suiteHeader.append('span')
        .attr('class', 'suite-name')
        .text(suiteName);

    const suiteSimsContainer = suiteGroup.append('div')
        .attr('class', 'suite-sims')
        .attr('data-suite', suiteName);

    Object.keys(sims).forEach(simName => {
        const label = suiteSimsContainer.append('label')
            .attr('class', 'checkbox-item sim-item');

        label.append('input')
            .attr('type', 'checkbox')
            .attr('class', 'individual-sim')
            .attr('data-suite', suiteName)
            .attr('value', simName)
            .property('checked', true);

        label.append('span').text(simName);
    });
});

let currentYMode = 'volume';
let currentRedshift = 7.0;
let currentDeltaZ = 1.0;

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
        yScale.domain([3.0, 12]);
        yLabel.html('log<tspan baseline-shift="sub" font-size="11px">10</tspan>(volume/cMpc<tspan baseline-shift="super" font-size="11px">3</tspan>)');
    } else {
        // Calculate y-values for all simulations to determine range
        const yValues = Object.values(simulations).map(sim => {
            const volume = Math.pow(sim.size, 3);
            const area = volumeToArea(volume, currentRedshift, currentDeltaZ);
            return Math.log10(area);
        });
        
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const padding = (maxY - minY) * 0.1; // 10% padding
        
        yScale.domain([minY - padding, maxY + padding]);
        yLabel.html(`log<tspan baseline-shift="sub" font-size="11px">10</tspan>(area/arcmin<tspan baseline-shift="super" font-size="11px">2</tspan>) @ z=${currentRedshift.toFixed(1)} (Δz=${currentDeltaZ.toFixed(1)})`);
    }
    
    yAxisG.transition().duration(500).call(yAxis);
    
    // Redraw the y-grid with updated scale
    yGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('').ticks(10);
    yGridG.transition().duration(500).call(yGrid);
    
    render();
}

function updateRedshiftParams() {
    if (currentYMode === 'area') {
        yLabel.html(`log<tspan baseline-shift="sub" font-size="11px">10</tspan>(area/arcmin<tspan baseline-shift="super" font-size="11px">2</tspan>) @ z=${currentRedshift.toFixed(1)} (Δz=${currentDeltaZ.toFixed(1)})`);
        
        // Recalculate y-axis limits
        const yValues = Object.values(simulations).map(sim => {
            const volume = Math.pow(sim.size, 3);
            const area = volumeToArea(volume, currentRedshift, currentDeltaZ);
            return Math.log10(area);
        });
        
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const padding = (maxY - minY) * 0.1;
        
        yScale.domain([minY - padding, maxY + padding]);
        yAxisG.transition().duration(500).call(yAxis);
        
        // Redraw the y-grid
        yGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('').ticks(10);
        yGridG.transition().duration(500).call(yGrid);
        
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

function render() {
    const filterPeriodic = document.getElementById('filter-periodic').checked;
    const filterZoom = document.getElementById('filter-zoom').checked;
    const filterRT = document.getElementById('filter-rt').checked;

    const selectedSims = Array.from(document.querySelectorAll('.individual-sim:checked'))
        .map(cb => cb.value);

    const showSurveys = document.getElementById('show-surveys').checked;
    const showLegend = document.getElementById('show-legend').checked;
    const showIconKey = document.getElementById('show-icon-key').checked;

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

        // Must be in selected individual sims
        return selectedSims.includes(name);
    });

    // Create simulation number mapping for legend
    const simNumberMap = new Map();
    filteredSims.forEach(([name], index) => {
        simNumberMap.set(name, index + 1);
    });

    // Render surveys
    surveyGroup.selectAll('*').remove();
    
    if (showSurveys && currentYMode !== 'volume') {
        const z = currentYMode === 'area_z5' ? 5 : 7;
        const [yMin, yMax] = yScale.domain();
        
        Object.entries(surveys).forEach(([name, survey]) => {
            const y = Math.log10(survey.area);
            
            // Only render if within y-axis limits
            if (y >= yMin && y <= yMax) {
                surveyGroup.append('line')
                    .attr('class', 'survey-line')
                    .attr('x1', 0)
                    .attr('x2', width)
                    .attr('y1', yScale(y))
                    .attr('y2', yScale(y));
                
                surveyGroup.append('text')
                    .attr('class', 'survey-label')
                    .attr('x', width - 5)
                    .attr('y', yScale(y) - 3)
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
            const x = xScale(Math.log10(d[1].m_g));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y}) scale(0)`;
        });

    pointsEnter.append('circle')
        .attr('class', 'main-circle')
        .attr('r', 5);

    pointsEnter.append('circle')
        .attr('class', 'rt-ring')
        .attr('r', 8);

    pointsEnter.append('path')
        .attr('class', 'highlight-star');

    pointsEnter.append('text')
        .attr('class', 'point-label')
        .attr('dy', -10);

    // Animate new points with blob effect
    pointsEnter.transition()
        .duration(200)
        .attr('transform', d => {
            const x = xScale(Math.log10(d[1].m_g));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y}) scale(1.3)`;
        })
        .transition()
        .duration(200)
        .attr('transform', d => {
            const x = xScale(Math.log10(d[1].m_g));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y}) scale(1)`;
        });

    // Update existing points to new positions
    points.transition()
        .duration(400)
        .attr('transform', d => {
            const x = xScale(Math.log10(d[1].m_g));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y}) scale(1)`;
        });

    const allPoints = pointsEnter.merge(points);

    allPoints.select('.main-circle')
        .attr('fill', d => d[1].highlight || '#333')
        .attr('opacity', d => d[1].complete ? 1 : 0.3);

    allPoints.select('.rt-ring')
        .attr('stroke', d => d[1].highlight || '#333')
        .attr('opacity', d => (d[1]['radiative-transfer'] ? 1 : 0) * (d[1].complete ? 1 : 0.3));

    allPoints.select('.highlight-star')
        .attr('d', d => {
            if (!d[1].star) return '';
            return d3.symbol().type(d3.symbolStar).size(150)();
        })
        .attr('stroke', d => d[1].highlight || '#333')
        .attr('opacity', d => d[1].star ? 1 : 0);

    allPoints.select('.point-label')
        .text(d => showLegend ? simNumberMap.get(d[0]) : '')
        .attr('opacity', showLegend ? 1 : 0);

    allPoints.on('mouseover', function(event, d) {
        const [name, sim] = d;
        const volume = Math.pow(sim.size, 3);
        
        let details = `<strong>${name}</strong><br>`;
        details += `Resolution: ${sim.m_g.toExponential(2)} M☉<br>`;
        details += `Box size: ${sim.size.toFixed(1)} cMpc<br>`;
        details += `Volume: ${volume.toExponential(2)} cMpc³<br>`;
        if (sim['radiative-transfer']) details += `Radiative Transfer: Yes<br>`;
        details += `Redshift end: z=${sim.redshift_end}`;
        
        // Get the position of the chart container
        const chartContainer = document.querySelector('.chart-container');
        const containerRect = chartContainer.getBoundingClientRect();
        
        tooltip.html(details)
            .classed('visible', true);
        
        // Position relative to the chart container
        const tooltipNode = tooltip.node();
        const tooltipWidth = tooltipNode.offsetWidth;
        const tooltipHeight = tooltipNode.offsetHeight;
        
        // Calculate position relative to the event, offset slightly
        let left = event.pageX - containerRect.left - window.scrollX + 12;
        let top = event.pageY - containerRect.top - window.scrollY - tooltipHeight / 2;
        
        // Keep tooltip within bounds
        if (left + tooltipWidth > chartContainer.offsetWidth) {
            left = event.pageX - containerRect.left - window.scrollX - tooltipWidth - 12;
        }
        
        tooltip.style('left', left + 'px')
            .style('top', top + 'px');
    })
    .on('mouseout', function() {
        tooltip.classed('visible', false);
    });

    // Render legend
    legendGroup.selectAll('*').remove();

    if (showLegend && filteredSims.length > 0) {
        const legendX = width + 10;
        const legendY = 0;

        const legendBox = legendGroup.append('foreignObject')
            .attr('x', legendX)
            .attr('y', legendY)
            .attr('width', 120)
            .attr('height', height);

        const legendDiv = legendBox.append('xhtml:div')
            .attr('class', 'legend-box');

        legendDiv.append('div')
            .attr('class', 'legend-title')
            .text('Simulations');

        filteredSims.forEach(([name], index) => {
            const entry = legendDiv.append('div')
                .attr('class', 'legend-entry');

            entry.append('span')
                .attr('class', 'legend-number')
                .text(`${index + 1}.`);

            entry.append('span')
                .attr('class', 'legend-name')
                .text(name);
        });
    }

    // Render icon key
    iconKeyGroup.selectAll('*').remove();

    if (showIconKey) {
        const keyX = 10;
        const keyY = height - 180;

        const keyBox = iconKeyGroup.append('foreignObject')
            .attr('x', keyX)
            .attr('y', keyY)
            .attr('width', 180)
            .attr('height', 190);

        const keyDiv = keyBox.append('xhtml:div')
            .attr('class', 'icon-key');

        keyDiv.append('div')
            .attr('class', 'icon-key-title')
            .text('Icon Key');

        // Periodic (dot)
        const periodicItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const periodicSvg = periodicItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        periodicSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('fill', '#333');

        periodicItem.append('span')
            .attr('class', 'icon-key-label')
            .text('Periodic');

        // Radiative Transfer (circle with dot)
        const rtItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const rtSvg = rtItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        rtSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('fill', '#333');

        rtSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 8)
            .attr('fill', 'none')
            .attr('stroke', '#333')
            .attr('stroke-width', 1.5);

        rtItem.append('span')
            .attr('class', 'icon-key-label')
            .text('Radiative Transfer');

        // Simulation Suite (red dot)
        const suiteItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const suiteSvg = suiteItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        suiteSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('fill', 'red');

        suiteItem.append('span')
            .attr('class', 'icon-key-label')
            .text('Simulation Suite');

        // Zoom Suite (star)
        const zoomItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const zoomSvg = zoomItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        zoomSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('fill', '#333');

        zoomSvg.append('path')
            .attr('d', d3.symbol().type(d3.symbolStar).size(100)())
            .attr('transform', 'translate(10,10)')
            .attr('fill', 'none')
            .attr('stroke', '#333')
            .attr('stroke-width', 2);

        zoomItem.append('span')
            .attr('class', 'icon-key-label')
            .text('Zoom Suite');

        // High Redshift (green dot)
        const highzItem = keyDiv.append('div')
            .attr('class', 'icon-key-item');

        const highzSvg = highzItem.append('svg')
            .attr('width', 20)
            .attr('height', 20);

        highzSvg.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 5)
            .attr('fill', 'green');

        highzItem.append('span')
            .attr('class', 'icon-key-label')
            .text('High Redshift');
    }
}

// Suite toggle functionality
document.querySelectorAll('.suite-header').forEach(header => {
    header.addEventListener('click', (e) => {
        // Don't toggle if clicking on checkbox
        if (e.target.classList.contains('suite-checkbox')) {
            return;
        }

        const suiteName = header.getAttribute('data-suite');
        const suiteSimsContainer = document.querySelector(`.suite-sims[data-suite="${suiteName}"]`);
        const toggleIcon = header.querySelector('.suite-toggle');

        if (suiteSimsContainer) {
            suiteSimsContainer.classList.toggle('collapsed');
            toggleIcon.classList.toggle('collapsed');
        }
    });
});

// Suite checkbox functionality - select/deselect all sims in suite
document.querySelectorAll('.suite-checkbox').forEach(suiteCheckbox => {
    suiteCheckbox.addEventListener('change', (e) => {
        e.stopPropagation(); // Prevent toggle when clicking checkbox
        const suiteName = suiteCheckbox.getAttribute('data-suite');
        const isChecked = suiteCheckbox.checked;

        // Update all individual sim checkboxes in this suite
        document.querySelectorAll(`.individual-sim[data-suite="${suiteName}"]`).forEach(simCheckbox => {
            simCheckbox.checked = isChecked;
        });

        render();
    });
});

// Individual sim checkbox functionality - update suite checkbox state
document.querySelectorAll('.individual-sim').forEach(simCheckbox => {
    simCheckbox.addEventListener('change', () => {
        const suiteName = simCheckbox.getAttribute('data-suite');
        const suiteCheckbox = document.querySelector(`.suite-checkbox[data-suite="${suiteName}"]`);

        // Check if all sims in suite are checked
        const allSimsInSuite = document.querySelectorAll(`.individual-sim[data-suite="${suiteName}"]`);
        const allChecked = Array.from(allSimsInSuite).every(cb => cb.checked);
        const anyChecked = Array.from(allSimsInSuite).some(cb => cb.checked);

        if (suiteCheckbox) {
            suiteCheckbox.checked = allChecked;
            suiteCheckbox.indeterminate = !allChecked && anyChecked;
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

document.querySelectorAll('#show-surveys, #show-legend, #show-icon-key, #filter-periodic, #filter-zoom, #filter-rt').forEach(cb => {
    cb.addEventListener('change', render);
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

// Initial render
render();
