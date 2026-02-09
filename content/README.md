# Content Directory

This directory contains content assets for the Somatic Canticles webapp.

## Structure

```
content/
└── audio-scripts/        # Canticle scripts for voice recording
    └── (scripts will be added here)
```

## Canticle Audio Scripts

The canticle audio scripts are located in:
- `src/lib/lore/canticle-scripts.ts` - TypeScript source

These are complete spoken-word scripts for the 12 canticles, ready for professional recording.

### Recording Requirements

- **Total Duration:** ~143 minutes
- **Per Canticle:** 8-15 minutes
- **Format:** MP3, 128-192kbps
- **Voice:** Calm, grounded, contemplative
- **Background:** Custom soundscapes per canticle

### Canticle List

1. The Fluid Self (8 min) - Water, crystal bowls
2. Signal Songs (9 min) - Electrical pulses, synaptic sounds
3. The Barrier Gates (10 min) - Heartbeat, membrane tones
4. Chemical Messengers (11 min) - Bells, vocal harmonics
5. Crossroads (12 min) - Diverging paths, choice sounds
6. Calibration (13 min) - Tuning forks, alignment
7. Sigil Sounds (10 min) - Resonant frequencies, crystals
8. Debug Mode (11 min) - Digital glitches, code sounds
9. Heart Resonance (12 min) - Deep drum, choral voices
10. The Witness (13 min) - Silent gaps, awareness bells
11. Synthesis (14 min) - Four tones converging
12. New Beginning (15 min) - Full orchestral, emergence

## Output Location

Recorded audio files should be placed in:
- `public/canticles/` - For webapp distribution
- R2/S3 storage - For production CDN delivery

## Copyright

Canticle scripts © 2026 Somatic Canticles. All rights reserved.
