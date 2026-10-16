# Pure Tone Audio Rev1 README

## Overview

This folder contains the loudness-corrected pure-tone stimuli for the absolute-pitch task.

- Stimulus files: `036-C2.wav` to `095-B6.wav`

These files were generated from the original pure-tone design and then adjusted with a frequency-dependent gain table to reduce perceptual loudness imbalance across pitch.

## Final Workflow

1. Generate the base pure-tone stimuli with `create_pure_audio.py`
2. Generate the gain table with `generate_pure_gain_table.py`
3. Generate the corrected stimuli with `create_pure_audio_rev1.py`

## Stimulus Specifications

- File names: `036-C2.wav` to `095-B6.wav`
- Number of files: 60
- Duration: 1.5 s each
- Sampling rate: 44.1 kHz
- Format: stereo, 16-bit PCM WAV
- Timbre: pure tone

Processing steps:

- Use frequencies corresponding to MIDI 36 (`C2`) through MIDI 95 (`B6`)
- Apply the frequency-dependent gain from `audio_pure/pure_tone_gain_table.csv`
- Apply a shared global scale so the relative loudness correction is preserved across notes

About the correction method:

- This correction does not directly implement `ITU-R BS.1770-3` or its `K-weighting` filter.
- Instead, it uses a frequency-dependent gain table based on `A-weighting`, referenced to `A4 = 440 Hz`.
- In other words, this is not a simple two-stage filter applied to the audio waveform; it is a note-by-note gain adjustment.

## Required Scripts

- [`create_pure_audio.py`](/Users/eeg/EEG-fMRI Dropbox/EEG/users/shibayama/stimuli/create_pure_audio.py)
- [`generate_pure_gain_table.py`](/Users/eeg/EEG-fMRI Dropbox/EEG/users/shibayama/stimuli/generate_pure_gain_table.py)
- [`create_pure_audio_rev1.py`](/Users/eeg/EEG-fMRI Dropbox/EEG/users/shibayama/stimuli/create_pure_audio_rev1.py)

Run:

```bash
python3 create_pure_audio.py
python3 generate_pure_gain_table.py
python3 create_pure_audio_rev1.py
```

## Notes

- This version is intended to reduce perceptual loudness differences in pure tones, especially in the low-frequency range.
- The piano stimuli were not matched with the same correction in the final design.
