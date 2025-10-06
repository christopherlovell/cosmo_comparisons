
import numpy as np
import os
import sys
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import matplotlib as mpl
import cmasher as cmr
from astropy.cosmology import Planck15 as cosmo

from unyt import sr, arcmin
from scipy import interpolate

plt.style.use('matplotlibrc.txt')


add_zoom_simulations = True
colour_by_redshift_endpoint = False

# add surveys
add_surveys = True
survey_redshift = 7.0

# force numbering of all simulations
number_all = True

# initialise figure
fig = plt.figure(figsize=(4, 4))
left = 0.125
bottom = 0.125
height = 0.85
width = 0.85
ax = fig.add_axes((left, bottom, width, height))

# set axes limits
ax.set_xlim([9.8, 3.8])
ax.set_ylim([3.0, 11.99])

# set colour scale for redshift end-point
norm = mpl.colors.Normalize(vmin=0, vmax=10)
cmap = cmr.cosmic


# add constant particle number
# for i in range(15):
#     ax.plot([11, 2], [4+i, -3+i], lw = 1, c='k', alpha = 0.025, zorder = -1)

simulations = {}

# simulations['Technicolor Dawn'] = {'size': 12/0.7, 'DM_mass': 1.3725E6, 'resimulation': False,  'RT': True}
# simulations['CROC'] = {'size': 30/0.7, 'DM_mass': 7E6, 'resimulation': False,  'RT': True}
# simulations['CoDA'] = {'size': 91, 'DM_mass': 7E6, 'resimulation': False,  'RT': True}
# simulations['Renaissance'] = {'size': 8.3, 'DM_mass': 3E4, 'resimulation': 40,  'RT': True}
# simulations['Katz+17'] = {'size': 10/0.7, 'DM_mass': 6.5E6, 'resimulation': False,  'RT': True}
# simulations['SPHINX-5'] = {'size': 5/0.7, 'DM_mass': 3.1E4, 'resimulation': False,  'RT': True}
# simulations['SPHINX-10'] = {'size': 10/0.7, 'DM_mass': 2.5E5, 'resimulation': False,  'RT': True}

# simulations['Bahamas'] = {'size': 400/0.7, 'm_g': 8E8/0.7, 'resimulation': False,  'RT': False, 'redshift_end': 0.0}





simulations['EAGLE-Ref'] = {'size': 100, 'm_g': 1.81E6,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': True}
simulations['EAGLE-Recal'] = {'size': 25, 'm_g': 2.26E5, 'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': True}

simulations['Illustris-TNG50'] = {'size': 51.7, 'm_g': 8.5E4,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': True}
simulations['Illustris-TNG100'] = {'size': 110.7, 'm_g': 1.4E6,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
simulations['Illustris-TNG300'] = {'size': 302.6, 'm_g': 1.1E7,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': True}

simulations['Simba-100'] = {'size': 100/0.7, 'm_g': 1.82E7,   'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': True}
simulations['Simba-50'] = {'size': 50/0.7, 'm_g': 2.28E6,  'RT': False, 'complete': True, 'redshift_end': 1.0, 'label': True}
simulations['Simba-25'] = {'size': 25/0.7, 'm_g': 2.85E5, 'RT': False, 'complete': True, 'redshift_end': 2.0, 'label': True}

simulations['Horizon-AGN'] = {'size': 120, 'm_g': 4E6,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': True}

simulations['BAHAMAS'] = {'size': 560, 'm_g': 1.5E9,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': True}


# simulations['Bluetides'] = {'size': 400/0.7, 'm_g': 2.36E6/0.7,  'RT': False, 'complete': True, 'redshift_end': 7.0, 'label': False}

# simulations['ASTRID'] = {'size': 250/0.7, 'm_g': 1.27E6/0.7,  'RT': False, 'complete': True, 'redshift_end': 3.0, 'label': False}

# THESAN
simulations['THESAN-1'] = {'size': 95.5, 'm_g': 5.82E5,  'RT': True, 'complete': True, 'redshift_end': 5.5, 'label': True}
simulations['THESAN-2'] = {'size': 95.5, 'm_g': 4.66E6,  'RT': True, 'complete': True, 'redshift_end': 5.5, 'label': True}
simulations['SPHINX'] = {'size': 20, 'm_g': 3.8E4,  'RT': True, 'complete': True, 'redshift_end': 4.6, 'label': True}

# FLAMINGO
simulations['FLAMINGO-L1_m8'] = {'size': 1000, 'm_g': 1.34E8,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
simulations['FLAMINGO-L1_m9'] = {'size': 1000, 'm_g': 1.07E9,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
# simulations['FLAMINGO-L1_m10'] = {'size': 1000, 'm_g': 8.56E9,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
simulations['FLAMINGO-L2p8_m9'] = {'size': 2800, 'm_g': 1.07E9,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}

# Millennium-TNG
simulations['MTNG740'] = {'size': 740, 'm_g': 2e7/0.6711,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
simulations['MTNG185'] = {'size': 185, 'm_g': 2e7/0.6711,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}


# COLIBRE future runs
simulations['COLIBRE-50'] = {'size': 50, 'm_g': 2.3e5,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
simulations['COLIBRE-200'] = {'size': 200, 'm_g': 1.84e6,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
simulations['COLIBRE-100'] = {'size': 100, 'm_g': 1.84e6,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
simulations['COLIBRE-400'] = {'size': 400, 'm_g': 1.47e7,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False}
 

# simulations['SPICE'] = {'size': 10/0.7, 'm_g': 970,  'RT': True, 'complete': True, 'redshift_end': 5.0, 'label': False}


# simulations['CAMELS-25'] = {'size': 25/0.7, 'm_g': 2E7,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False, 'suite': True}
# simulations['CAMELS-50'] = {'size': 50/0.7, 'm_g': 2E7,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False, 'suite': True}

# simulations['MEGATRON'] = {'size': 50/0.7, 'm_g': 2E7,  'RT': False, 'complete': True, 'redshift_end': 0.0, 'label': False, 'suite': True}


# # zoom simulations (e.g FLARES)
zoom_simulations = {}
# zoom_simulations['FLARES-1'] = {
#     'parent': 3200,
#     'size': [np.array([8.0, 8.5, 9.0, 9.5, 10., 10.5, 11.0]), np.array([6.5, 6.7, 6.8, 6.9, 7.1, 7.5, 8.0])],
#     'm_g': 1.81E6,
#     'RT': False,
#     'complete': True,
#     'redshift_end': 5.0}


# surveys
surveys = {}

# All sky
surveys['All Sky'] = {'area': (4*np.pi*sr).to('arcmin**2').value}

# Euclid
surveys['Euclid/Deep'] = {'area': 40*3600}
surveys['Euclid/Wide'] = {'area': 18000*3600}

# Webb
surveys['Webb/COSMOS-Web'] = {'area': 0.6*3600}
surveys['Webb/NGDEEP'] = {'area': 8.}






# list of simulations labelled with a number
labels = []

# starting index for simulations labelled with a number 
j = 1

for i, (simulation_name, simulation) in enumerate(simulations.items()):

    s = simulation

    marker = 'o'

    # set transparency based on whether completed or not
    if s['complete']:
        alpha = 1.0
    else:
        alpha = 0.3

    # set colour 
    if colour_by_redshift_endpoint:
        c = cmap(norm(s['redshift_end']))
    else:
        c = 'k'

    if 'suite' in s:
        c = 'red'

    ax.scatter(
        np.log10(s['m_g']),
        3*np.log10(s['size']),
        c=[c],
        s=20,
        lw=0,
        marker=marker,
        zorder=2,
        alpha=alpha)

    if s['RT']:
        ax.scatter(
            np.log10(s['m_g']),
            3*np.log10(s['size']),
            facecolors='none',
            edgecolors=c,
            s=40,
            lw=0.5,
            marker=marker,
            zorder=2,
            alpha=alpha)


    # if the point should be immediately labelled put it here.
    if (s['label'] is True) and (number_all is False):

        ax.text(
            np.log10(s['m_g']),
            3*np.log10(s['size'])-0.25,
            simulation_name,
            fontsize=7,
            ha='center',
            va='center',
            alpha=alpha,
            c=c)

    # if not add it to a list to label later
    else:

        # add number label
        ax.text(
            np.log10(s['m_g'])-0.075,
            3*np.log10(s['size'])-0.15,
            j,
            fontsize=7,
            ha='left',
            va='center',
            alpha=alpha,
            c=c)

        # add to list for annotating later
        labels.append(simulation_name)

        # increment label
        j += 1

# add labels for numbered simulations
x_pos = 9.7
y_start_pos = 7.3
y_increment = 0.2

for i, simulation in enumerate(labels):

    label = rf'{i+1}: {simulation}'

    ax.text(
        x_pos,
        y_start_pos - i*y_increment,
        label,
        c='k',
        fontsize=6,
        ha='left',
        va='bottom')


if add_zoom_simulations:

    for simulation_name, simulation in zoom_simulations.items():

        s = simulation

        x = np.linspace(s['size'][0][0], s['size'][0][-1], 100)
        # y = np.interp(x, s['size'][0], s['size'][1])
        f = interpolate.interp1d(s['size'][0], s['size'][1], kind='cubic')
        y = f(x)

        norm_ = mpl.colors.Normalize(vmin=7, vmax=11)
        cmap_ = cmr.bubblegum

        c_ = cmap_(norm_(x))

        ax.plot([np.log10(s['m_g'])]*2, [y[0], 3*np.log10(s['parent'])-0.1],c='k',alpha=0.05, zorder = 0, lw = 5, solid_capstyle='round')
        ax.scatter([np.log10(s['m_g'])]*100, y, color=c_, s=8, zorder = 1)

        label_loc = np.mean([y[0], y[-1]])
        label_loc = y[0]

        ax.text(
            np.log10(s['m_g'])+0.2,
            label_loc,
            rf'$\rm\bf {simulation_name}$',
            c='k',
            rotation=90,
            fontsize=6,
            ha='center',
            va='bottom',)

    # Add colour bar - NEEDS BETTER POSITION
    # cax = fig.add_axes((0.3, 0.7, 0.4, 0.02))
    # cmapper = cm.ScalarMappable(norm=norm_, cmap=cmap_)
    # cmapper.set_array([])
    # cbar = fig.colorbar(cmapper, cax=cax, orientation='horizontal')
    # cbar.set_label(r'$\rm log_{10}(M_{\star}/M_{\odot})$', fontsize=6)
    # cbar.ax.xaxis.set_ticks_position('top')
    # cbar.ax.xaxis.set_label_position('top')
    # cbar.ax.tick_params(labelsize=6)


# add surveys as horizontal lines
if add_surveys:

    v1, v2 = cosmo.comoving_volume([survey_redshift-0.5, survey_redshift+0.5]).to('Mpc3')

    for survey_name, survey in surveys.items():

        area = survey['area']

        volume = -np.log10(1. / ((v2 - v1) * (area/(41253.*3600))).value)

        ax.axhline(volume, c='k', alpha=0.05, lw=2)
        ax.text(
            4.1,
            volume+0.15,
            survey_name,
            size=7,
            va='center',
            ha='right',
            color='k',
            zorder=4,
            alpha=0.5)


# # add target region
# ax.fill(
#     (6.8, 6.8, 4, 4, 6.8),
#     (10, 11.55, 11.55, 6.6, 10),
#     alpha=0.2, color='green'
# )
# ax.text(5, 10, 'target\nparameter\nspace', va='center', ha='center')

ax.scatter([6.3], [9], marker='*', color='red', s=20)
ax.text(
    6.3 - 0.1, 9,
    rf'$\rm\bf CARAVAN$',
    c='red',
    rotation=0,
    fontsize=10,
    ha='left',
    va='center'
)

ax.scatter([np.log10(1.81e6)], [np.log10(3.2e3**3)], marker='*', color='green', s=20)
ax.text(
    np.log10(1.81e6)-0.1, np.log10(3.2e3**3),
    rf'$\rm\bf FLARES \; (z=5)$',
    c='green',
    rotation=0,
    fontsize=7,
    ha='left',
    va='center'
)

ax.scatter([7.3, 7.3], np.log10((np.array([25, 50])/0.7)**3), marker='o', color='red', s=20)
ax.text(
    7.3, 5.1,
    rf'$\rm\bf CAMELS$',
    c='red',
    rotation=0,
    fontsize=7,
    ha='center',
    va='center'
)


# add secondary x-axis at top for minimum resolved galaxy stellar mass (100x bottom axis)
ax2 = ax.twiny()
ax2.set_xlim(ax.get_xlim())
ax2.set_xlabel(r'$\rm\log_{10}(minimum\ resolved\ galaxy\ stellar\ mass/M_{\odot})$')

# Set ticks on top axis to correspond to 100x the bottom axis values
# Create appropriate tick locations within the x-limits (10.5 to 3.8)
xlim = ax.get_xlim()
# Create ticks at integer values within the range
tick_positions = [tick for tick in range(int(xlim[1]), int(xlim[0])+1) if xlim[1] <= tick <= xlim[0]]
ax2.set_xticks(tick_positions)
ax2.set_xticklabels([f'{int(tick+2)}' for tick in tick_positions])

# add axes labels
ax.set_xlabel(r'$\rm\log_{10}(baryonic\ resolution\ element\ mass/M_{\odot})$')
ax.set_ylabel(r'$\rm\log_{10}(volume/cMpc^{3})$')

noflares='' # '_noflares'  # ''
fig.savefig(f'plots/baryonic_volume{noflares}.pdf', bbox_inches='tight')
fig.savefig(f'plots/baryonic_volume{noflares}.png', bbox_inches='tight')
fig.clf()
