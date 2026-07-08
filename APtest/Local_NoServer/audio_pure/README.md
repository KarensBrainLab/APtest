# Pure Tone Audio README

## 概要

このフォルダは、絶対音感課題用のラウドネス補正版の純音刺激を保存するためのものです。

- 刺激音: `036-C2.wav` から `095-B6.wav`

これらのファイルは、元の純音刺激をベースに作成し、その後、周波数依存のゲイン表を用いて音高間の知覚ラウドネス差を軽減するよう補正したものです。

## 最終採用した作成方法

1. `create_pure_audio.py` で基礎となる純音刺激を生成する
2. `generate_pure_gain_table.py` でゲイン表を作成する
3. `create_pure_audio.py` で補正版刺激を生成する
   実際には `create_pure_audio_rev1.py` を使用する

## 刺激音の仕様

- ファイル名: `036-C2.wav` から `095-B6.wav`
- 音数: 60
- 長さ: 各 1.5 秒
- サンプリング周波数: 44.1 kHz
- 形式: stereo, 16-bit PCM WAV
- 音色: 純音

処理内容:

- MIDI 36 (`C2`) から MIDI 95 (`B6`) までに対応する周波数を使用
- `audio_pure/pure_tone_gain_table.csv` の周波数依存ゲインを適用
- 音間の相対的なラウドネス補正を保つため、全音に共通のグローバルスケールを適用

補正方式について:

- 本補正は `ITU-R BS.1770-3` の `K-weighting` を直接適用したものではありません。
- `A4 = 440 Hz` を基準とした `A-weighting` ベースの周波数依存ゲイン表を用いています。
- したがって、2段階フィルタを音声信号に直接かけた処理ではなく、音高ごとに異なるゲイン値を適用する方法です。

## 必要なスクリプト

- [`create_pure_audio_rev1.py`](/Users/eeg/EEG-fMRI Dropbox/EEG/users/shibayama/stimuli/create_pure_audio_rev1.py)
- [`generate_pure_gain_table.py`](/Users/eeg/EEG-fMRI Dropbox/EEG/users/shibayama/stimuli/generate_pure_gain_table.py)
- [`create_pure_audio.py`](/Users/eeg/EEG-fMRI Dropbox/EEG/users/shibayama/stimuli/create_pure_audio.py)

実行コマンド:

```bash
python3 create_pure_audio_rev1.py
python3 generate_pure_gain_table.py
python3 create_pure_audio.py
```

## 補足

- この版は、特に低周波数帯の純音で生じやすい知覚ラウドネス差を軽減するためのものです。
- piano 刺激には同じ補正は適用していません。
