# AP Test Audio README

## 概要

このフォルダは、絶対音感課題用のピアノ単音刺激を保存するためのものです。

- 元の長尺音源: `APtest_audio.wav`
- 元の楽譜: `APtest_audio.pdf`
- 切り出し後の刺激音: `036-C2.wav` から `095-B6.wav`

最終版の刺激音は、MuseScore で作成した長尺音源から自動分割して作成しています。

## 最終採用した作成方法

1. MuseScore で `C2` から `B6` までの単音列を作成する
2. 長尺音源として `APtest_audio.wav` を書き出す
3. 同じ内容の楽譜を `APtest_audio.pdf` として保存する
4. `split_musescore_aptest.py` で 60 音を個別 WAV に分割する

## 刺激音の仕様

- ファイル名: `036-C2.wav` から `095-B6.wav`
- 音数: 60
- 長さ: 各 1.5 秒
- サンプリング周波数: 44.1 kHz
- 形式: stereo, 16-bit PCM WAV

分割時の処理内容:

- MuseScore の長尺書き出しから 4 秒ごとのノート開始を検出
- 各音を 1.5 秒で切り出し
- 立ち上がり 10 ms / 立ち下がり 10 ms の cosine ramp を適用
- 最後にピーク正規化
- pure tone 補正版との主観的ラウドネス差を縮めるため、最終版では全ファイルに一律 `-10 dB` の減衰を適用

## 必要なスクリプト

最終版の音源作成に必要なスクリプトは次の 1 本です。

- [`split_musescore_aptest.py`](/Users/eeg/EEG-fMRI Dropbox/EEG/users/shibayama/stimuli/split_musescore_aptest.py)

実行コマンド:

```bash
python3 split_musescore_aptest.py
```

このスクリプトは以下を前提にしています。

- 入力ファイルが `audio/APtest_audio.wav` にあること
- 入力音源が `44.1 kHz / stereo / 32-bit float WAV` であること
- 出力先が `audio/` であること

## 現在のファイル構成

- `APtest_audio.wav`: MuseScore から書き出した長尺音源
- `APtest_audio.pdf`: 上記音源に対応する楽譜
- `036-C2.wav` - `095-B6.wav`: 実験用の最終刺激音
- `README.md`: この説明ファイル
