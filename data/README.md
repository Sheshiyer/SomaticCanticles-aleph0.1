# Data Directory

This directory contains data files used by the Somatic Canticles application.

## Structure

```
data/
└── manuscript/           # Trilogy manuscript data
    ├── somatic_canticles_lore_data.json      # Lore concepts & glossary
    └── somatic_canticles_trilogy_data.json   # Book/chapter structure
```

## Files

### somatic_canticles_lore_data.json
Contains extracted lore concepts, character profiles, and terminology from the trilogy manuscript.

### somatic_canticles_trilogy_data.json
Contains the complete book and chapter structure of the Somatic Canticles trilogy (27 chapters across 3 books).

## Usage

These files are used for:
- Content population in database seeding
- Lore reference in UI components
- Documentation generation

## Source

Original manuscript located at: `/Volumes/madara/2026/Serpentine-raising/chapters/`

## Note

These data files are part of the project source and should be committed to version control. They do not contain user data.
