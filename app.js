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
    .style('font-size', '12px')
    .text('log₁₀(baryonic resolution element mass/M☉)');

let yLabel = g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -50)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('log₁₀(volume/cMpc³)');

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
    .style('font-size', '11px')
    .text('log₁₀(minimum resolved galaxy stellar mass/M☉)');

// Survey lines group
const surveyGroup = g.append('g').attr('class', 'surveys');

// Simulations group
const simGroup = g.append('g').attr('class', 'simulations');

// Populate simulation checkboxes
const simCheckboxContainer = d3.select('#sim-checkboxes');
Object.keys(simulations).sort().forEach(name => {
    const label = simCheckboxContainer.append('label')
        .attr('class', 'checkbox-item');
    
    label.append('input')
        .attr('type', 'checkbox')
        .attr('class', 'individual-sim')
        .attr('value', name)
        .property('checked', true);
    
    label.append('span').text(name);
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
        yLabel.text('log₁₀(volume/cMpc³)');
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
        yLabel.text(`log₁₀(area/arcmin²) @ z=${currentRedshift.toFixed(1)} (Δz=${currentDeltaZ.toFixed(1)})`);
    }
    
    yAxisG.transition().duration(500).call(yAxis);
    
    // Redraw the y-grid with updated scale
    yGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('').ticks(10);
    yGridG.transition().duration(500).call(yGrid);
    
    render();
}

function updateRedshiftParams() {
    if (currentYMode === 'area') {
        yLabel.text(`log₁₀(area/arcmin²) @ z=${currentRedshift.toFixed(1)} (Δz=${currentDeltaZ.toFixed(1)})`);
        
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
    const selectedTypes = Array.from(document.querySelectorAll('.sim-type:checked'))
        .map(cb => cb.value);
    
    const selectedSims = Array.from(document.querySelectorAll('.individual-sim:checked'))
        .map(cb => cb.value);
    
    const showSurveys = document.getElementById('show-surveys').checked;

    // Filter simulations
    const filteredSims = Object.entries(simulations).filter(([name, sim]) => {
        return selectedTypes.includes(sim.type) && selectedSims.includes(name);
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

    points.exit().remove();

    const pointsEnter = points.enter().append('g')
        .attr('class', 'sim-point');

    pointsEnter.append('circle')
        .attr('class', 'main-circle')
        .attr('r', 5);

    pointsEnter.append('circle')
        .attr('class', 'rt-ring')
        .attr('r', 8);

    pointsEnter.append('path')
        .attr('class', 'highlight-star');

    const allPoints = pointsEnter.merge(points);

    allPoints.transition().duration(500)
        .attr('transform', d => {
            const x = xScale(Math.log10(d[1].m_g));
            const y = yScale(getYValue(d[1]));
            return `translate(${x},${y})`;
        });

    allPoints.select('.main-circle')
        .attr('fill', d => d[1].highlight || '#333')
        .attr('opacity', d => d[1].complete ? 1 : 0.3);

    allPoints.select('.rt-ring')
        .attr('stroke', d => d[1].highlight || '#333')
        .attr('opacity', d => (d[1].RT ? 1 : 0) * (d[1].complete ? 1 : 0.3));

    allPoints.select('.highlight-star')
        .attr('d', d => {
            if (!d[1].star) return '';
            return d3.symbol().type(d3.symbolStar).size(150)();
        })
        .attr('stroke', d => d[1].highlight || '#333')
        .attr('opacity', d => d[1].star ? 1 : 0);

    allPoints.on('mouseover', function(event, d) {
        const [name, sim] = d;
        const volume = Math.pow(sim.size, 3);
        
        let details = `<strong>${name}</strong><br>`;
        details += `Resolution: ${sim.m_g.toExponential(2)} M☉<br>`;
        details += `Box size: ${sim.size.toFixed(1)} cMpc<br>`;
        details += `Volume: ${volume.toExponential(2)} cMpc³<br>`;
        if (sim.RT) details += `Radiative Transfer: Yes<br>`;
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
}

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

document.querySelectorAll('.sim-type, .individual-sim, #show-surveys').forEach(cb => {
    cb.addEventListener('change', render);
});

// Initial render
render();
