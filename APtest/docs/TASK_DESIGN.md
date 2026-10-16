# Task design and scoring

This description follows the accompanying APtest manuscript (Task Design and Test Development, Methods). It documents the **full 120-trial protocol**; the released packages default to piano-only unless configured otherwise.

## Purpose

Absolute pitch is the ability to name a tone's pitch class without an external reference. APtest measures within-participant differences by **timbre**, **octave**, **key color**, and **reaction time**. Its objective is multidimensional characterization, not a binary diagnosis.

## Stimuli

- 60 distinct pitches from **C2 to B6** (MIDI 36–95), each presented once per timbre block.
- 12-tone equal temperament, **A4 = 440 Hz**.
- **Piano:** monophonic notes produced with MuseScore 4, extracted as individual WAV files.
- **Pure:** sine waves generated with Python/NumPy, with 10-ms cosine onset and offset ramps.
- Both: **1.5 s**, **44,100 Hz**, **16-bit PCM WAV**, individually peak-normalized. Piano stimuli additionally attenuated by **−10 dB** to reduce the between-timbre level difference.
- Playback-device low-frequency response may affect pure-tone perception, especially in octave 2.

## Procedure

Participants use headphones/earphones in a quiet environment and set a comfortable volume using a test tone. In the full design, they complete one 60-trial piano block and one 60-trial pure-tone block, with randomized block order. Each block presents all 60 tones once. The response is selected on a labeled on-screen piano keyboard. Responses are accepted **from stimulus onset** until **4 s after onset**, not 4 s after offset. Participants are asked to respond quickly and accurately. There is no correctness feedback.

Randomized sequences enforce (1) a difference of at least **13 semitones** between successive pitches and (2) no repetition of the same pitch class on adjacent trials. No interfering tones are inserted. These measures discourage but cannot rule out relative-pitch inference.

## Outcomes

**Primary:** exact pitch-class match (chroma accuracy). An octave error is not an error if the pitch class matches. A neighboring semitone does **not** earn partial credit. Timeouts are incorrect and remain in the accuracy denominator.

**Secondary/descriptive:** accuracy by piano/pure, octave (2–6), white-key pitch classes (C D E F G A B) and black-key pitch classes (C♯ D♯ F♯ G♯ A♯); response time measured from stimulus onset to click; timeout rate. A ±1-semitone measure can be calculated *post hoc* from recorded target and response, but is not the primary score.

For the manuscript's RT analyses, participant-level RT was the **median of correct trials**; timeouts and RTs under 200 ms were excluded from RT analyses (the 200-ms criterion was chosen after data inspection, not a built-in task scoring rule).

## Exploratory four-type AP classification

Classification is computed **separately for each timbre** using 35 white-key trials and 25 black-key trials:

| Type | Operational definition |
| --- | --- |
| **Full chromatic AP** | White ≥32/35 **and** black ≥23/25 (each ≥90%) |
| **White-key AP** | White ≥32/35 and black <23/25 |
| **No AP** | White <9/35 **and** black <9/25 |
| **Quasi AP** | All other patterns |

The cutoffs are **heuristic, post hoc, descriptive**, not validated diagnostic thresholds. A hypothetical black-key-only near-ceiling pattern did not occur in the manuscript sample; the four-label rule above would place such a pattern in quasi AP. Report the actual continuous scores and timbre alongside any label. The label “no AP” means below this operational cutoff, not proof of absent ability.

## Interpretation and reporting

Report the configured test mode, timbre-specific overall accuracy, white-/black-key accuracy, accuracy by octave, median correct RT, and timeouts. Note participant hardware and testing environment. The manuscript reports an initial evaluation in **116** participants; it does **not** establish test–retest reliability or stable biological AP subtypes.

**Source:** Shibayama, Shimada, & Itoh, accompanying APtest manuscript, working draft v7.7. Do not treat the manuscript's unfinished editorial revisions as final publication wording.
