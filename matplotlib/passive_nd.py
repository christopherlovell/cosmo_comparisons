"""
Passive number densities - replicating top panel of Figure 2 from arXiv:2211.07540
Bottom panel: UV luminosity function
"""

import numpy as np
import matplotlib.pyplot as plt
from astropy.cosmology import Planck18

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

# ===== SECOND SUBPLOT: UV Luminosity Function =====
# Load UVLF data
eagle_dat = np.loadtxt('../../toobig/data/uvlf_eagle.txt', dtype=np.float64, skiprows=1, delimiter=',')
flares_dat = np.loadtxt('../../toobig/data/uvlf_flares.txt', dtype=np.float64, skiprows=1, delimiter=',')
# sphinx_dat = np.loadtxt('../../toobig/data/uvlf_sphinx.txt', dtype=np.float64, skiprows=1, delimiter=',')

redshift = 8

# Survey definitions
euclid_deep = {
    'name': 'Euclid\nDeep',
    'area': 50,  # square degrees
    'depth': -20.7,
}

euclid_wide = {
    'name': 'Euclid\nWide',
    'area': 15000,  # square degrees
    'depth': -22.75,
}

jwst_jades = {
    'name': 'JWST JADES',
    'area': 46 / 3600,  # arcmin^2 to deg^2
    'depth': -18, # -16.25,
}

colors = ['mediumpurple', 'blueviolet', 'orange']

# Plot UVLF data
ax2.plot(flares_dat[:,0], flares_dat[:,1], label=r'FLARES', color='red', lw=3, alpha=0.8)
ax2.plot(eagle_dat[:,0], eagle_dat[:,1], label='EAGLE\n'+r'(V = $\rm 100^3 \, Mpc^3$)', color='blue')

ax2.plot(
    [-20, -20.4, -20.8, -21.2, -21.6, -22, -22.4, -22.8, -23],
    [-3.8, -4.1, -4.4, -4.6, -5.2, -5.4, -6.4, -7, -7.5],
    label='Euclid flagship\n'+r'(V = $\rm 5.3^3 \, Gpc^3$)',
    color='black',
    linestyle='dashed',
)

# Add survey depth regions
for survey, color in zip([euclid_deep, euclid_wide, jwst_jades], colors):
    sky_fraction = survey['area'] / 41253  # full sky in deg^2
    volume = sky_fraction * \
        (Planck18.comoving_volume(redshift + 0.5).value -
         Planck18.comoving_volume(redshift - 0.5).value)

    ax2.fill_between(
        np.linspace(survey['depth'], -100, 2),
        np.log10(1 / volume),
        100,
        alpha=0.3,
        lw=2,
        edgecolor='face',
        color=color,
    )

    ax2.text(
        survey['depth'] - 0.2,
        np.log10(1 / volume) + 0.1,
        survey['name'],
        color='grey',
        alpha=0.8,
    )

# Set labels and formatting for second subplot
ax2.set_xlabel(r'$\rm M_{UV,1500}$', fontsize=12)
ax2.set_ylabel(r'$\phi \,/\, \mathrm{cMpc^{3} \; dex^{-1}}$', fontsize=12)
ax2.set_xlim(-18, -25)
ax2.set_ylim(-12, -1)

# Add secondary y-axis for number of objects in 1 Gpc^3 volume
ax2_twin = ax2.twinx()
ax2_twin.set_ylim(ax2.get_ylim())

# Convert number density (Mpc^-3) to number of objects in 1 Gpc^3
# 1 Gpc = 1000 Mpc, so 1 Gpc^3 = (1000)^3 Mpc^3 = 1e9 Mpc^3
# N_objects = n_g * V_Gpc = n_g * 1e9
# log10(N_objects) = log10(n_g) + 9

# Create specific tick positions within the y-axis limits
ylim2 = ax2.get_ylim()
tick_positions2 = [tick for tick in range(int(ylim2[0]), int(ylim2[1])+1) if ylim2[0] <= tick <= ylim2[1]]
ax2_twin.set_yticks(tick_positions2)
# Only show labels for ticks where log10(N_objects) >= 0 (i.e., tick+9 >= 0, so tick >= -9)
ax2_twin.set_yticklabels([f'{int(tick+9)}' if tick >= -9 else '' for tick in tick_positions2])
ax2_twin.set_ylabel(r'$\mathrm{log_{10}}(N_{\mathrm{objects}} \,/\, \mathrm{Gpc^{3}})$', fontsize=12)

# Add legend
ax2.legend(loc='lower left', fontsize=9, facecolor='white', framealpha=1.0)

# Tight layout to prevent legend cutoff
plt.tight_layout()

# Save the figure
plt.savefig('plots/passive_nd_evolution.png', dpi=100, bbox_inches='tight')
# plt.savefig('plots/passive_nd_evolution.pdf', bbox_inches='tight')
# plt.show()
