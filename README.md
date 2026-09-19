# DJI Spark Battery Recovery

Standalone macOS + Arduino Nano Matter recovery tool for DJI Spark batteries whose BMS has latched permanent undervoltage failure data.

The repository contains:

- A concise GitHub Pages recovery interface.
- Large connector-orientation and five-wire diagrams.
- A token-protected helper bound only to `127.0.0.1`.
- The guarded V8 SMBus recovery engine with automatic I2C bus recovery.
- Automated tests and GitHub Pages publication.

## Recovery boundaries

V8 permits diagnosis and PF reset attempts down to a 5.400 V reported pack voltage and 1.800 V per reported cell. Packs below 2.500 V/cell receive a severe-overdischarge warning. PF reset remains blocked while the BMS reports live Cell Undervoltage, outside the 300 mV absolute cell-spread limit, or when identity, voltage plausibility, authentication or reseal verification fails. Transient BMS NACKs trigger bounded retries and Nano I2C reinitialization; the reset is never sent unless `SafetyStatus` is positively read and live CUV is clear.

This tool does not prove that an old or severely over-discharged battery is safe or serviceable.
