# Data output and variables

The two packages store trial-level responses; storage locations differ.

| Package | Output | Location |
| --- | --- | --- |
| Local | CSV, JSON; PDF when jsPDF CDN is accessible | Browser Downloads folder |
| Server | `aptest_php_server_summary.csv` | `APTEST_DATA_DIR` or default `aptest_data/` |
| Server | One trial-level CSV per run | `participant_logs/` |
| Server | One raw JSON payload per run | `raw_payloads/` |

## Server trial CSV fields

The following names are taken from `Server_PHP/api/submit.php`:

| Field | Meaning |
| --- | --- |
| `saved_at` | Client-submitted timestamp |
| `run_id` | Run identifier |
| `test_code` | Application/test identifier |
| `participant_id` | Participant-entered identifier |
| `age`, `sex`, `musical_training` | Demographic / musical-experience fields |
| `block_id` | Internal block identifier |
| `audio_type`, `audio_dir` | Stimulus timbre and audio directory |
| `trial` | Trial index |
| `midi`, `file` | MIDI note number and stimulus filename |
| `target`, `target_solfege` | Target pitch-class label and solfège label |
| `response`, `response_solfege` | Selected pitch-class label and solfège label |
| `correct` | Recorded exact-match correctness |
| `rt_ms` | Response time in **milliseconds**, from stimulus onset |
| `no_response` | Flag for trials without a response |

## Server summary CSV fields

`saved_at`, `run_id`, `test_code`, `participant_id`, `age`, `sex`, `musical_training`, `piano_apscore_pct`, `pure_apscore_pct`, `mean_apscore_pct`, `piano_correct_n`, `pure_correct_n`, `total_trials`, `first_block_audio_type`, `second_block_audio_type`.

**Analysis caution:** The manuscript's primary AP score is exact pitch-class accuracy, with timeouts counted incorrect. For RT analyses, use correct trials and document any preprocessing. **Inspect `audio_type` rather than assuming `block_id` encodes presentation order**. Some summary columns may be empty or zero for single-timbre runs; do not interpret them as measured performance in an unadministered condition. Local CSV/JSON/PDF may use a different schema from server outputs; inspect their headers before pooling datasets.

Keep raw trial records so white-/black-key, octave, error-distribution, and alternative tolerance analyses can be recomputed transparently.
