"""
Passive number densities - replicating top panel of Figure 2 from arXiv:2211.07540
"""

import numpy as np
import matplotlib.pyplot as plt

# Data from Table 1 - Volume normalised number densities, log10 n_g / Mpc^-3
# FLARES data
flares_data = {
    'redshifts': [7, 6, 5],
    # M* > 5×10^9, sSFR < -1
    '5e9_sSFR_-1': [-7.92, -6.80, -5.40],
    # M* > 5×10^9, sSFR < -2
    '5e9_sSFR_-2': [np.nan, -7.29, -5.74],
    # M* > 10^10, sSFR < -1
    '1e10_sSFR_-1': [-7.92, -6.99, -5.85],
    # M* > 10^10, sSFR < -2
    '1e10_sSFR_-2': [np.nan, -7.35, -6.00]
}

# EAGLE data
eagle_data = {
    'redshifts': [5, 4, 3, 2, 1, 0],
    # M* > 5×10^9, sSFR < -1
    '5e9_sSFR_-1': [-5.40, -4.40, -3.93, -3.59, -3.09],
    # M* > 5×10^9, sSFR < -2
    '5e9_sSFR_-2': [-5.70, -4.74, -4.31, -3.99, -3.56],
    # M* > 10^10, sSFR < -1
    '1e10_sSFR_-1': [-5.70, -4.77, -4.23, -3.81, -3.16, -2.65],
    # M* > 10^10, sSFR < -2
    '1e10_sSFR_-2': [-6.00, -5.05, -4.59, -4.22, -3.65]
}

# Create the plot with two subplots
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(5, 8), height_ratios=[1, 1])

# Plot FLARES data - only M* > 10^10, sSFR < -1
ax1.plot(flares_data['redshifts'], flares_data['1e10_sSFR_-1'],
        '-', color='red', label='FLARES', markersize=6)

# Plot EAGLE data - only M* > 10^10, sSFR < -1
ax1.plot(eagle_data['redshifts'], eagle_data['1e10_sSFR_-1'],
        '-', color='blue', label='EAGLE', markersize=6)

ax1.plot([0, 1, 2,3,4,5], [-2.5, -3, -3.6, -4.7, -5.4, -5.9],
        '--', label='Simba', markersize=6)  # color='blue',

ax1.plot([0, 1, 2,3,4,5], [-1.5, -2.5, -3.0, -3.8, -4.5, -5.2],
        '--', label='Magneticum', markersize=6)  # color='blue',

ax1.plot([0, 1, 2,3,4], [-1.9, -3, -3.4, -4.2, -6],
        '--', label='IllustrisTNG', markersize=6)  # color='blue',

ax1.errorbar([3.5, 4.5], np.log10([6.3e-5, 3.5e-5]), xerr=[0.5,0.5], 
        color='grey', marker='v', linestyle='none') # label='Carnall+22', 

ax1.errorbar([7.5], -5.8, xerr=[0.], yerr=[[0.8], [0.5]],
        color='grey', marker='*', linestyle='none', ms=10) # label='Weibel+25', 

ax1.errorbar([5.8], -5.6, xerr=[0.], yerr=[[0.5], [0]],
        color='grey', marker='p', linestyle='none', ms=5) # label='Valentino+23', 

ax1.errorbar([2.5, 3.5], [-4.2, -4.8], xerr=[0.], yerr=[[0.0, 0.3], [0.0, 0.1]],
        color='grey', marker='.', linestyle='none', ms=5) # label='Carnall+22', 

ax1.errorbar([4.8], [-4.7], xerr=[[0.4], [0.5]], yerr=[[0.9], [0.2]],
        color='grey', marker='.', linestyle='none', ms=5) # label='Alberts+23', 

ax1.errorbar([3.5], [-5], xerr=[0.5], yerr=[0.1],
        color='grey', marker='.', linestyle='none', ms=5) # label='de Graaf+24', 

ax1.errorbar([5], [np.log10(3e-6)], xerr=[0.5], yerr=[0.1],
        color='grey', marker='.', linestyle='none', ms=5) # label='Nanayakarra+24', 

ax1.errorbar([4.65, 5.5, 6.75], [-5, -5.6, -6.25], xerr=[0.2, 0.5, 0.6], yerr=[[0.2, 0.35, 0.8], [0.1, 0.2, 0.3]],
        color='grey', marker='o', linestyle='none', ms=5) # label='Baker+25', 

ax1.errorbar([0.5, 1.5, 2, 2.5, 3.4], [-3.3, -3.65, -4.15, -4.3, -5], xerr=[0.], yerr=[[0], [0]],
        color='grey', marker='s', linestyle='none', ms=5) # label='McLeod+21', 

ax1.text(6, -2.9, r'$M_* > 10^{10} \, \mathrm{M_{\odot}}$ sSFR $<-1 \; \mathrm{Gyr^{-1}}$',
        fontsize=9, color='black', ha='right')

# Set labels and formatting
ax1.set_xlabel('Redshift (z)', fontsize=12)
ax1.set_ylabel('$\mathrm{log_{10}}(n_g \,/\, \mathrm{Mpc^{-3}})$', fontsize=12)

# Set axis limits to match typical figure style
ax1.set_xlim(0.0, 8.5)
ax1.set_ylim(-9.2, -2.5)

# Add secondary y-axis for number of objects in 1 Gpc^3 volume
ax1_twin = ax1.twinx()
ax1_twin.set_ylim(ax1.get_ylim())

# Convert number density (Mpc^-3) to number of objects in 1 Gpc^3
# 1 Gpc = 1000 Mpc, so 1 Gpc^3 = (1000)^3 Mpc^3 = 1e9 Mpc^3
# N_objects = n_g * V_Gpc = n_g * 1e9
# log10(N_objects) = log10(n_g) + 9

# Create specific tick positions within the y-axis limits
ylim = ax1.get_ylim()
tick_positions = [tick for tick in range(int(ylim[0]), int(ylim[1])+1) if ylim[0] <= tick <= ylim[1]]
ax1_twin.set_yticks(tick_positions)
ax1_twin.set_yticklabels([f'{int(tick+9)}' for tick in tick_positions])
ax1_twin.set_ylabel(r'$\mathrm{log_{10}}(N_{\mathrm{objects}} \,/\, \mathrm{Gpc^{3}})$', fontsize=12)

# Add shaded region below 1e-6 Mpc^-3 (log10(-6)) for zoom accessible regime
ax1.axhspan(ax1.get_ylim()[0], -6, alpha=0.2, color='grey', zorder=0)
ax1.text(0.15, -6.25, 'zoom-accessible regime', fontsize=9, color='black',
        ha='left', va='center', alpha=0.7)

# Add hashed shaded region above z > 5 for cosmic variance limited regime
ax1.axvspan(5, ax1.get_xlim()[1], alpha=0.2, color='grey', hatch='///', zorder=0)
ax1.text(5.2, -4.2, 'Cosmic variance\nlimited regime', fontsize=9, color='black',
        ha='left', va='center', alpha=0.7, rotation=90)

# Add legend
ax1.legend(loc='lower left', fontsize=10, ncol=1)

# ===== SECOND SUBPLOT: Stellar-halo mass relation =====
# Moster+13 semi-empirical relationship (simplified approximation)
# Based on the screenshot, creating a typical SHMR curve
halo_mass = np.logspace(10.0, 15.0, 100)  # 10^10.5 to 10^15 solar masses
log_halo_mass = np.log10(halo_mass)

# Simplified Moster+13-like relationship
# Peak efficiency around 10^12 solar masses, declining at high and low masses
log_M1 = 11.8  # Peak halo mass
N = 0.03  # Peak efficiency
alpha = 1.3  # Low mass slope
beta = 0.6   # High mass slope
gamma = 0.5  # Transition sharpness

# SHMR efficiency function
efficiency = 2 * N / ((halo_mass/10**log_M1)**(-alpha) + (halo_mass/10**log_M1)**beta)
stellar_mass_ratio = efficiency

ax2.plot(log_halo_mass, stellar_mass_ratio, 'g-', linewidth=2, label='z = 0 (Moster+13)')

# Add z~5 SHMR using provided data points
z5_halo_mass = np.array([11, 11.415841584158416, 11.828382838283828, 12.184818481848184,
                        12.732673267326733, 13.138613861386139, 13.508250825082508,
                        13.996699669966997])
z5_log_efficiency = np.array([-2.4397590361445785, -2.141566265060241, -1.8253012048192772,
                             -1.5753012048192772, -1.3283132530120478, -1.3644578313253009,
                             -1.5391566265060241, -1.8493975903614457])
z5_efficiency = 10**z5_log_efficiency

ax2.plot(z5_halo_mass, z5_efficiency, 'b', linewidth=2, label='z = 5 (Shuntov+22)')

# Find the peak of the relation and add vertical line
peak_idx = np.argmax(stellar_mass_ratio)
peak_halo_mass = log_halo_mass[peak_idx]
peak_efficiency = stellar_mass_ratio[peak_idx]
peak_stellar_mass = 10**peak_halo_mass * peak_efficiency

# Add vertical line at peak
ax2.axvline(peak_halo_mass, color='grey', linestyle='--', alpha=0.7)

# Add label with peak stellar mass
ax2.text(peak_halo_mass + 0.1, 0.0015,
         r'Peak: M* ≈ $2 \times 10^{10}$ M☉',
         rotation=90, fontsize=9, color='grey', va='bottom')

# Add vertical line at lower res limit
ax2.axvline(10.2, color='grey', linestyle='--', alpha=0.7)

# Add label with lower res limit
ax2.text(10.2 + 0.1, 0.0015,
         r'Res Limit: M* ≈ $10^{8}$ M☉',
         rotation=90, fontsize=9, color='grey', va='bottom')

# Add feedback arrows from the example figure
# Star formation feedback arrow (left side, low mass halos)
ax2.annotate('Stellar\nfeedback', xy=(11.0, 0.02), xytext=(11.0, 0.04),
            arrowprops=dict(arrowstyle='->', color='orange', lw=2),
            fontsize=10, ha='center', va='bottom', color='orange')

# AGN feedback arrow (right side, high mass halos)
ax2.annotate('AGN\nfeedback', xy=(14.2, 0.02), xytext=(14.2, 0.038),
            arrowprops=dict(arrowstyle='->', color='orange', lw=2),
            fontsize=10, ha='center', va='bottom', color='orange')

# Set labels and formatting for second subplot
ax2.set_xlabel(r'$\mathrm{Log(halo\ mass)\ [M_{\odot}]}$', fontsize=12)
ax2.set_ylabel(r'$\mathrm{Stellar\ mass\ /\ halo\ mass\ (average)}$', fontsize=12)

# Set axis limits to match the screenshot
ax2.set_xlim(10.0, 15.0)
ax2.set_ylim(0.001, 0.08)
ax2.set_yscale('log')

# Add redshift label
# ax2.text(14.75, 0.05, 'z = 0', fontsize=12, ha='right', va='top',
#          bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))

# Add legend
ax2.legend(loc='lower right', fontsize=10, facecolor='white', framealpha=1.0)

# Tight layout to prevent legend cutoff
plt.tight_layout()

# Save the figure
plt.savefig('plots/passive_nd_evolution.png', dpi=100, bbox_inches='tight')
# plt.savefig('plots/passive_nd_evolution.pdf', bbox_inches='tight')
# plt.show()