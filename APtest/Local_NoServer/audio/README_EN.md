# AP Test Audio README

## Overview

This folder contains piano-tone stimuli for the absolute-pitch task.

- Source long-form audio: `APtest_audio.wav`
- Source score: `APtest_audio.pdf`
- Split stimulus files: `036-C2.wav` to `095-B6.wav`

The final stimulus files were created by automatically splitting a long-form audio export generated in MuseScore.

## Final Workflow

1. Create a sequence of single notes from `C2` to `B6` in MuseScore.
2. Export the long-form audio as `APtest_audio.wav`.
3. Save the corresponding score as `APtest_audio.pdf`.
4. Run `split_musescore_aptest.py` to split the long-form audio into 60 individual WAV files.

## Stimulus Specifications

- File names: `036-C2.wav` to `095-B6.wav`
- Number of files: 60
- Duration: 1.5 s each
- Sampling rate: 44.1 kHz
- Format: stereo, 16-bit PCM WAV

Processing steps during splitting:

- Detect note onsets from the MuseScore long-form export at 4-second intervals
- Extract each note as a 1.5 s segment
- Apply a 10 ms cosine ramp at onset and offset
- Apply peak normalization

## Required Script

Only one script is required for the final stimulus-generation workflow:

- [`split_musescore_aptest.py`](/Users/eeg/EEG-fMRI Dropbox/EEG/users/shibayama/stimuli/split_musescore_aptest.py)

Run:

```bash
python3 split_musescore_aptest.py
```

This script assumes:

- The input file is located at `audio/APtest_audio.wav`
- The input audio format is `44.1 kHz / stereo / 32-bit float WAV`
- The output directory is `audio/`

## Current File Structure

- `APtest_audio.wav`: long-form audio exported from MuseScore
- `APtest_audio.pdf`: score corresponding to the audio file
- `036-C2.wav` - `095-B6.wav`: final stimulus files for the experiment
- `README.md`: Japanese documentation
- `README_EN.md`: English documentation
