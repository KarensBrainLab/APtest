# APtest — Multidimensional Absolute Pitch Assessment

**APtest** is an open-source, browser-based pitch-naming task for research. It assesses absolute-pitch (AP) performance across **timbre**, **pitch register**, **white-/black-key pitch classes**, and **response time**, rather than relying on a single total score.

## Quick start

Choose one of two self-contained packages:

| Package | Best for | Setup | Results |
| --- | --- | --- | --- |
| [Local_NoServer](Local_NoServer/) | Local or researcher-supervised testing | Open `aptest_local.html` in Chrome or Edge | Browser downloads CSV and JSON; PDF needs CDN access |
| [Server_PHP](Server_PHP/) | Remote data collection | Upload site files and configure PHP endpoint | Server-side summary CSV, trial CSV, and raw JSON |

**Default in both packages: English interface, piano-only (60 trials).** To run the full published two-timbre design, set `testMode: "both"` in the `window.APTEST_CONFIG` block near the top of the relevant HTML file. Available modes are `"piano"`, `"pure"`, and `"both"`.

**Important:** The manuscript describes the **both-timbre 120-trial protocol**. Running the default piano-only package is a shortened configuration, not the complete published protocol.

## Published task design

| Feature | Full protocol (`both`) |
| --- | --- |
| Timbres | Piano and pure sine-wave tones, in separate blocks |
| Pitch range | C2–B6, 12 pitch classes × 5 octaves |
| Tuning | 12-tone equal temperament; A4 = 440 Hz |
| Trials | 60 per timbre; 120 total |
| Stimulus duration | 1.5 s |
| Response deadline | 4 s **from stimulus onset** |
| Response | Click a labeled on-screen piano keyboard |
| Feedback | No accuracy feedback |
| Sequence | Consecutive targets separated by ≥13 semitones; no consecutive identical pitch classes |
| Main outcome | Exact pitch-class accuracy (octave ignored) |
| Additional outcomes | Correct-trial RT, accuracy by timbre, octave, and white/black key |
| Study duration | Approximately 7–8 min in the manuscript (actual time varies) |

The sequence restrictions **reduce but do not eliminate** the possibility of relative-pitch strategies. No intervening distractor tones are used.

## Documentation

- [Task design, stimulus preparation, scoring, and classification](docs/TASK_DESIGN.md)
- [Local setup](docs/LOCAL_SETUP.md)
- [PHP server setup](docs/SERVER_SETUP.md)
- [Data files and field definitions](docs/DATA_FORMAT.md)

**Offline note:** The local test and CSV/JSON export do not require a server; PDF export currently loads jsPDF from a third-party CDN and is not fully offline. See the [local guide](docs/LOCAL_SETUP.md).

## Research use and interpretation

The four descriptive AP profiles (*no AP*, *quasi AP*, *white-key AP*, *full chromatic AP*) were developed **post hoc** and are not diagnostic categories. If reporting a profile, specify the **timbre condition** and also report continuous accuracy scores. The test's reliability and test–retest stability have not yet been established.

Online timing and acoustic output depend on the participant's device and browser; low-frequency pure tones are particularly sensitive to playback hardware. For comparable data, document headphones, playback conditions, browser/device, and any deviations from the full protocol.

## Authors and citation

Karen Shibayama, Hitoshi Shimada, and Kosuke Itoh — Brain Research Institute, Niigata University.

**Associated manuscript (in preparation):** *Beyond a Single Score: Multidimensional Assessment and Four-Type Classification of Absolute Pitch* (working title; publication details to be added when available). Do not cite this as a published paper until publication information is confirmed. When citing the software, identify the repository and the specific release or commit used.

## License

No license is asserted by this documentation. Consult the repository's actual license status before assuming permission to redistribute or modify the code or audio files.
