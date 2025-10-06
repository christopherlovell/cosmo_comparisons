# Cosmological Simulations Comparison

An interactive web-based visualization tool for comparing cosmological simulations across resolution and volume parameter space.

## Usage

### Y-Axis Modes

- **Volume Mode**: Shows the comoving volume of each simulation box
- **Area Mode**: Converts volume to effective survey area at a given redshift

### Redshift Parameters (Area Mode)

- **Central Redshift (z)**: The redshift at which to calculate the area (0-15)
- **Redshift Range (Δz)**: The depth of the redshift window (0.1-5)

### Filtering

- **Simulation Types**: Toggle large volume, radiative transfer, and zoom simulations
- **Survey Lines**: Show/hide reference lines for major surveys
- **Individual Simulations**: Select specific simulations to display

### Interactive Elements

- **Hover**: Hover over any simulation point to see detailed information
- **Tooltips**: Display resolution, box size, volume, and other properties

## Data Sources

The visualization includes data from major cosmological simulation projects.

Survey data includes:
- JWST (COSMOS-Web, NGDEEP)
- Euclid (Wide and Deep surveys)
- All Sky reference

## Technical Details

### Cosmological Calculations

The tool assumes Planck 2015 parameters to calculate equivalent areas, using numerical integration to compute comoving distances and the differential comoving volume element dV/dz/dΩ. Please take care as this will only be valid for reasonable values of redshift and redshift interval.

### Dependencies

- [D3.js](https://d3js.org/) v7.8.5 (loaded from CDN)

## Contributing

Contributions are welcome! To add new simulations:

1. Edit `data.js` and add your simulation to the `simulations` object
2. Follow the existing format with required fields: `size`, `m_g`, `RT`, `complete`, `redshift_end`, `type`
3. Submit a pull request

## License
MIT License - feel free to use and modify for your research.

## Contact
For questions or suggestions, please open an issue on GitHub.
