# Local setup (no PHP server)

## Requirements

A computer with **Chrome or Edge**, working audio output, and sufficient free space for the included WAV files. This package is intended to open directly from disk; no PHP hosting is required. The audio task and CSV/JSON exports can run without internet, but PDF generation currently loads jsPDF from an external CDN and therefore requires internet access unless jsPDF is bundled locally.

## Steps

1. Download the repository ZIP from GitHub and extract it completely.
2. Open `APtest/Local_NoServer/` and **keep** `aptest_local.html`, `aptest_local.js`, `audio/`, and `audio_pure/` together. Do not move the HTML file out of this folder.
3. Double-click `aptest_local.html`, or open it in Chrome/Edge.
4. Connect headphones/earphones, check the sound, and complete a test run using a nonparticipant ID.
5. After finishing, find the **CSV** and **JSON** in the browser's Downloads folder. The **PDF** additionally requires access to the jsPDF CDN. If prompted, allow **multiple downloads** for this page.

## Selecting the protocol

Open `aptest_local.html` in a text editor and find `window.APTEST_CONFIG`. Set `testMode` to `"piano"` (default, 60 trials), `"pure"` (60 trials), or `"both"` (**full 120-trial design**). Save and reload the page. The interface's approximate duration display is 5 minutes for one block and 10 minutes for both; the manuscript reports 7–8 minutes for its full protocol.

## Data and troubleshooting

The local package downloads files named approximately `ID_Date_APscoreXX.Xpct_APtest.csv`, `.json`, and `.pdf`. Actual download location follows browser settings. If sound is missing, check audio output, browser permissions, and the unchanged `audio/` and `audio_pure/` paths. If results are missing, check browser download permissions and the Downloads folder. If CSV/JSON appear but PDF is missing, verify internet access to the jsPDF CDN; the current package does not include an offline copy of jsPDF. If your browser blocks local-file access, try the other supported browser before modifying code.

For field descriptions, see [DATA_FORMAT.md](DATA_FORMAT.md). Avoid entering identifiable personal information in participant IDs.
