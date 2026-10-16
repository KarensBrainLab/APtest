// ====== Configuration ======
const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const SOLFEGE_NAMES = ["do","do#","re","re#","mi","fa","fa#","sol","sol#","la","la#","si"];
const DISPLAY_LABELS_SOLFEGE_JA = {
  "C":  "ド",
  "C#": "ド♯/レ♭",
  "D":  "レ",
  "D#": "レ♯/ミ♭",
  "E":  "ミ",
  "F":  "ファ",
  "F#": "ファ♯/ソ♭",
  "G":  "ソ",
  "G#": "ソ♯/ラ♭",
  "A":  "ラ",
  "A#": "ラ♯/シ♭",
  "B":  "シ"
};
const DISPLAY_LABELS_SOLFEGE_EN = {
  "C":  "Do",
  "C#": "Do♯/Re♭",
  "D":  "Re",
  "D#": "Re♯/Mi♭",
  "E":  "Mi",
  "F":  "Fa",
  "F#": "Fa♯/Sol♭",
  "G":  "Sol",
  "G#": "Sol♯/La♭",
  "A":  "La",
  "A#": "La♯/Si♭",
  "B":  "Si"
};
const LABEL_TO_FILE = {
  "C": "C",
  "C#": "Cis",
  "D": "D",
  "D#": "Dis",
  "E": "E",
  "F": "F",
  "F#": "Fis",
  "G": "G",
  "G#": "Gis",
  "A": "A",
  "A#": "Ais",
  "B": "B"
};
const DISPLAY_LABELS = {
  "C":  "C",
  "C#": "C♯/D♭",
  "D":  "D",
  "D#": "D♯/E♭",
  "E":  "E",
  "F":  "F",
  "F#": "F♯/G♭",
  "G":  "G",
  "G#": "G♯/A♭",
  "A":  "A",
  "A#": "A♯/B♭",
  "B":  "B"
};
const BLOCK_DEFS = {
  piano: { blockId: "block1", displayName: "ブロック1", shortLabel: "ブロック1", audioType: "piano", audioDir: "audio" },
  pure: { blockId: "block2", displayName: "ブロック2", shortLabel: "ブロック2", audioType: "pure", audioDir: "audio_pure" },
};
let BLOCKS = [];

// Adjust to your MIDI range
const MIN_MIDI = 36;  // 036-C2.wav
const MAX_MIDI = 95;  // adjust as needed

const N_TRIALS = 60;     // number of trials
const TRIAL_MS = 4000;         // fixed 4s from tone onset to next tone
const START_DELAY_MS = 5000;   // 5s delay after volume check OK
const API_BASE_URL = window.API_BASE_URL || "";
const API_SUBMIT_PATH = window.API_SUBMIT_PATH || "/api/submit.php";
const TEST_CODE = window.TEST_CODE || "aptest_php_server";
// ===== Researcher setting =====
// Change test mode in aptest_php_server.html:
//   window.APTEST_CONFIG.testMode = "both"  -> piano + pure tone
//   window.APTEST_CONFIG.testMode = "piano" -> piano only
//   window.APTEST_CONFIG.testMode = "pure"  -> pure tone only
const TEST_MODE = ["both", "piano", "pure"].includes(window.APTEST_CONFIG?.testMode)
  ? window.APTEST_CONFIG.testMode
  : "piano";

function getConfiguredBlocks() {
  if (TEST_MODE === "piano") return [BLOCK_DEFS.piano];
  if (TEST_MODE === "pure") return [BLOCK_DEFS.pure];
  return [BLOCK_DEFS.piano, BLOCK_DEFS.pure];
}

function hasConfiguredBlock(audioType) {
  return getConfiguredBlocks().some((block) => block.audioType === audioType);
}

function getInstructionDurationText() {
  if (UI_LANG === "ja") {
    return TEST_MODE === "both" ? "所要時間は10分程度です。" : "所要時間は5分程度です。";
  }
  return TEST_MODE === "both" ? "The task takes about 10 minutes." : "The task takes about 5 minutes.";
}
const UI_TEXT = {
  ja: {
    pageTitle: "絶対音感テスト",
    noticeTitle: "注意",
    instructionTitle: "重要",
    noticeLine1: "この課題では音が流れますので、なるべく静かな場所で取り組んでください。",
    noticeLine2: "イヤホンやヘッドホンの使用を推奨します。",
    instructionLine1: "一定の間隔で単音が鳴ります。その都度、きこえた音が何の音だったか、",
    instructionLine2: "ピアノの鍵盤をクリックして回答してください。わかったら",
    instructionEmphasis: "できるだけ速く、",
    instructionLine3: "回答をお願いします。",
    instructionLine4: "所要時間は5分程度です。",
    statusNotStarted: "未開始",
    labelId: "ID",
    idPlaceholder: "例: X26X123X",
    labelSex: "性別",
    sexPlaceholder: "選択してください",
    sexOther: "その他 / 回答しない",
    labelAge: "年齢",
    instrumentSectionTitle: "音楽歴",
    instrumentPlaceholder: "選択してください",
    instrumentNonMusician: "特になし",
    instrumentPiano: "ピアノ",
    instrumentViolin: "バイオリン",
    instrumentFlute: "フルート",
    instrumentClarinet: "クラリネット",
    instrumentSaxophone: "サクソフォン",
    instrumentTrumpet: "トランペット",
    instrumentTrombone: "トロンボーン",
    instrumentCello: "チェロ",
    instrumentGuitar: "ギター",
    instrumentVoice: "声楽",
    instrumentPercussion: "打楽器",
    instrumentOther: "その他",
    instrumentStartPlaceholder: "開始年齢",
    instrumentEndPlaceholder: "終了年齢",
    instrumentOtherPlaceholder: "その他の楽器名",
    addInstrument: "+ 楽器を追加",
    btnStart: "開始",
    btnVolPlay: "音量を確認",
    btnVolOK: "この音量で進む",
    breakMessage: "【課題はまだ終わっていません！】「次へ」を押して進めてください。",
    btnContinue: "次へ",
    labelModeTitle: "鍵盤に表示する音名を選んでください",
    btnLabelModeStart: "この表記で開始",
    speedInstruction: "できるだけ速く答えること",
    statusVolumeCheck: "音量確認です。聞きやすい音量に調整してください。",
    statusPrepareFailed: (msg) => `試行の準備に失敗しました：${msg}`,
    statusBreak: "休憩",
    statusVolumeDone: "音量確認が完了しました。",
    statusStartsIn5: "5秒後に開始します...",
    statusStarting: "開始します。",
    statusSaving: "データを送信しています... しばらくお待ちください。",
    statusSaved: "データはサーバーに自動保存されました。",
    statusSaveFailed: "データの自動保存に失敗しました。通信環境を確認してください。",
    finishTitle: "絶対音感テストが終了しました。",
    finishSaved: "データはサーバーに自動保存されました。",
    finishFailed: "データの自動保存に失敗しました。通信環境を確認してください。",
    finishThanks1: "課題を最後まで実施していただき、ありがとうございました。",
    finishThanks2: "皆さんのご協力のおかげで、研究を進めることができます。心より感謝いたします。",
    resultOverviewTitle: "Result Summary",
    resultOverviewBody: "AP scores for the two blocks are shown below.",
    resultScoreTitle: "AP score",
    resultPianoLabel: "Piano Accuracy",
    resultPureLabel: "Pure Tone Accuracy",
    resultPianoMeanRtLabel: "Piano Mean RT (Correct only)",
    resultPureMeanRtLabel: "Pure Tone Mean RT (Correct only)",
    resultPianoNoResponseLabel: "Piano No Response",
    resultPureNoResponseLabel: "Pure Tone No Response",
    resultBestPitchLabel: "Best pitch",
    resultFastestRtLabel: "Fastest RT",
    resultTrialsUnit: "trials",
    serverSubmitFailed: "サーバーへの送信に失敗しました。通信環境を確認してください。",
    validationId: "IDを入力してください。",
    validationSex: "性別を選択してください。",
    validationAge: "年齢を入力してください。",
    validationAgeRange: "年齢は0以上の数値を入力してください。",
    validationMusicHistory: "音楽歴を入力してください。",
    validationFirstInstrument: "1行目の楽器を選択してください。",
    validationFirstMusicHistory: "1行目の音楽歴をすべて入力してください。",
    validationInstrumentRow: (n) => `${n} 行目の音楽歴をすべて入力するか、空欄のままにしてください。`,
  },
  en: {
    pageTitle: "Absolute Pitch Test",
    noticeTitle: "Notice",
    instructionTitle: "Instructions",
    noticeLine1: "Sounds will be played during this task, so please complete it in as quiet an environment as possible.",
    noticeLine2: "The use of earphones or headphones is recommended.",
    instructionLine1: "Single tones will be presented at regular intervals.",
    instructionLine2: "Each time, identify the note you hear and click the corresponding key on the piano keyboard",
    instructionEmphasis: " as soon as you have identified it.",
    instructionLine3: "",
    instructionLine4: "This task takes approximately 5 minutes.",
    statusNotStarted: "Not started",
    labelId: "ID",
    idPlaceholder: "e.g. X26X123X",
    labelSex: "Sex",
    sexPlaceholder: "Please select",
    sexOther: "Other / Prefer not to answer",
    labelAge: "Age",
    instrumentSectionTitle: "Musical training",
    instrumentPlaceholder: "Please select",
    instrumentNonMusician: "None",
    instrumentPiano: "Piano",
    instrumentViolin: "Violin",
    instrumentFlute: "Flute",
    instrumentClarinet: "Clarinet",
    instrumentSaxophone: "Saxophone",
    instrumentTrumpet: "Trumpet",
    instrumentTrombone: "Trombone",
    instrumentCello: "Cello",
    instrumentGuitar: "Guitar",
    instrumentVoice: "Voice",
    instrumentPercussion: "Percussion",
    instrumentOther: "Other",
    instrumentStartPlaceholder: "Start age",
    instrumentEndPlaceholder: "End age",
    instrumentOtherPlaceholder: "Other instrument name",
    addInstrument: "+ Add instrument",
    btnStart: "Start",
    btnVolPlay: "Check volume",
    btnVolOK: "Use this volume",
    breakMessage: "The task is not finished yet. Please press “Next” to continue.",
    btnContinue: "Next",
    labelModeTitle: "Choose the note labels shown on the keyboard",
    btnLabelModeStart: "Start with this notation",
    speedInstruction: "Answer as quickly as possible",
    statusVolumeCheck: "This is a volume check. Adjust to a comfortable listening level.",
    statusPrepareFailed: (msg) => `Failed to prepare trials: ${msg}`,
    statusBreak: "Break",
    statusVolumeDone: "Volume check completed.",
    statusStartsIn5: "Starting in 5 seconds...",
    statusStarting: "Starting.",
    statusSaving: "Sending data... Please wait.",
    statusSaved: "Data were saved to the server automatically.",
    statusSaveFailed: "Automatic data saving failed. Please check your connection.",
    finishTitle: "The absolute pitch test has ended.",
    finishSaved: "The data were saved automatically to the server.",
    finishFailed: "Automatic data saving failed. Please check your connection.",
    finishThanks1: "Thank you for completing the task.",
    finishThanks2: "Your cooperation helps advance this research.",
    resultOverviewTitle: "Results Overview",
    resultOverviewBody: "AP scores for the two blocks are shown below.",
    resultScoreTitle: "AP score",
    resultPianoLabel: "Piano Accuracy",
    resultPureLabel: "Pure Tone Accuracy",
    resultPianoMeanRtLabel: "Piano Mean RT (Correct only)",
    resultPureMeanRtLabel: "Pure Tone Mean RT (Correct only)",
    resultPianoNoResponseLabel: "Piano No Response",
    resultPureNoResponseLabel: "Pure Tone No Response",
    resultBestPitchLabel: "Best pitch",
    resultFastestRtLabel: "Fastest RT",
    resultTrialsUnit: "trials",
    serverSubmitFailed: "Failed to send data to the server. Please check your connection.",
    validationId: "Please enter the ID.",
    validationSex: "Please select sex.",
    validationAge: "Please enter age.",
    validationAgeRange: "Please enter an age of 0 or older.",
    validationMusicHistory: "Please enter musical training.",
    validationFirstInstrument: "Please select an instrument for the first row.",
    validationFirstMusicHistory: "Please complete all musical training fields in the first row.",
    validationInstrumentRow: (n) => `Please either complete all musical training fields in row ${n} or leave the row blank.`,
  },
};


// ====== State ======
let trials = [];
let trialIndex = -1;
let current = null;
let tSoundOn = null;
let canRespond = false;
let ID = "";
// Label mode: "sharp" | "solfege_ja" | "solfege_en"
let LABEL_MODE = "sharp";
let runId = null;
let currentBlockIndex = 0;
let currentBlock = BLOCK_DEFS.piano;
let currentAudioDir = currentBlock.audioDir;
let currentAudioType = currentBlock.audioType;
let resultsByBlock = {};
let blockSummaries = {};
let sessionStarted = false;
let initialSetupDone = false;
let UI_LANG = "en";

const elStatus = document.getElementById("status");
const btnStart = document.getElementById("btnStart");
const elID = document.getElementById("ID");
const elSex = document.getElementById("sex");
const elAge = document.getElementById("age");
const elInstRows = document.getElementById("instRows");
const btnAddInst = document.getElementById("btnAddInst");
const btnVolPlay = document.getElementById("btnVolPlay");
const btnVolOK   = document.getElementById("btnVolOK");
const elLabelModeChooser = document.getElementById("labelModeChooser");
const btnLabelModeStart = document.getElementById("btnLabelModeStart");
const elSummary = document.getElementById("summary");
const chartTitlePiano = document.getElementById("chartTitlePiano");
const chartTitlePure = document.getElementById("chartTitlePure");
const canvasAccPiano = document.getElementById("accChartPiano");
const canvasAccPure = document.getElementById("accChartPure");
const elKeyboard = document.getElementById("keyboard");
const elBreakPanel = document.getElementById("breakPanel");
const elBreakMessage = document.getElementById("breakMessage");
const btnContinueBlock = document.getElementById("btnContinueBlock");
const audioBufferCache = new Map(); // midi -> AudioBuffer
const VOLUME_CHECK_MIDI = 69; // assumes an A4(440Hz)-equivalent file exists; change if needed

const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);// --- Device detection ---

let inVolumeCheck = false;
let audioCtx = null;

function prettyLabel(s) {
  // Display-only conversion (not used for analysis)
  return s.replace(/#/g, "♯");
}

function t(key, ...args) {
  const value = UI_TEXT[UI_LANG][key];
  return typeof value === "function" ? value(...args) : value;
}

function updateInstrumentOptionTexts(root = document) {
  const map = [
    [".inst-option-placeholder", t("instrumentPlaceholder")],
    [".inst-option-non-musician", t("instrumentNonMusician")],
    [".inst-option-piano", t("instrumentPiano")],
    [".inst-option-violin", t("instrumentViolin")],
    [".inst-option-flute", t("instrumentFlute")],
    [".inst-option-clarinet", t("instrumentClarinet")],
    [".inst-option-saxophone", t("instrumentSaxophone")],
    [".inst-option-trumpet", t("instrumentTrumpet")],
    [".inst-option-trombone", t("instrumentTrombone")],
    [".inst-option-cello", t("instrumentCello")],
    [".inst-option-guitar", t("instrumentGuitar")],
    [".inst-option-voice", t("instrumentVoice")],
    [".inst-option-percussion", t("instrumentPercussion")],
    [".inst-option-other", t("instrumentOther")],
  ];
  map.forEach(([selector, text]) => root.querySelectorAll(selector).forEach((el) => { el.textContent = text; }));
  root.querySelectorAll(".instStart").forEach((el) => { el.placeholder = t("instrumentStartPlaceholder"); });
  root.querySelectorAll(".instEnd").forEach((el) => { el.placeholder = t("instrumentEndPlaceholder"); });
  root.querySelectorAll(".instOther").forEach((el) => { el.placeholder = t("instrumentOtherPlaceholder"); });
}

function applyLanguage() {
  document.documentElement.lang = UI_LANG;
  document.title = t("pageTitle");
  const byIdText = {
    pageTitle: "pageTitle",
    noticeTitle: "noticeTitle",
    instructionTitle: "instructionTitle",
    noticeLine1: "noticeLine1",
    noticeLine2: "noticeLine2",
    instructionLine1: "instructionLine1",
    instructionLine2: "instructionLine2",
    instructionEmphasis: "instructionEmphasis",
    instructionLine3: "instructionLine3",
    instructionLine4: "instructionLine4",
    languageChooserTitle: "languageChooserTitle",
    labelId: "labelId",
    labelSex: "labelSex",
    sexPlaceholder: "sexPlaceholder",
    sexOtherOption: "sexOther",
    labelAge: "labelAge",
    instrumentSectionTitle: "instrumentSectionTitle",
    btnAddInst: "addInstrument",
    btnStart: "btnStart",
    btnVolPlay: "btnVolPlay",
    btnVolOK: "btnVolOK",
    breakMessage: "breakMessage",
    btnContinueBlock: "btnContinue",
    labelModeTitle: "labelModeTitle",
    btnLabelModeStart: "btnLabelModeStart",
    speedInstruction: "speedInstruction",
  };
  Object.entries(byIdText).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });
  const instructionLine4 = document.getElementById("instructionLine4");
  if (instructionLine4) instructionLine4.textContent = getInstructionDurationText();
  document.querySelectorAll("[data-ui-lang]").forEach((button) => {
    const isEnglish = button.dataset.uiLang === "en";
    button.classList.toggle("active", (UI_LANG === "en") === isEnglish);
  });
  elID.placeholder = t("idPlaceholder");
  if (elStatus) {
    const currentStatus = (elStatus.textContent || "").trim();
    if (currentStatus === UI_TEXT.ja.statusNotStarted || currentStatus === UI_TEXT.en.statusNotStarted) {
      elStatus.textContent = t("statusNotStarted");
    }
  }
  updateInstrumentOptionTexts(document);
  if (elSummary && elSummary.innerHTML.trim()) {
    renderAllResults();
  }

  // 英語選択時は日本語ドレミ（solfege_ja）オプションを非表示にする
  const solfegeJaLabel = document.querySelector('input[name="labelMode"][value="solfege_ja"]')?.closest('label');
  if (solfegeJaLabel) {
    solfegeJaLabel.style.display = UI_LANG === "en" ? "none" : "";
    // solfege_ja 選択中に英語へ切り替えた場合は sharp にリセット
    if (UI_LANG === "en" && LABEL_MODE === "solfege_ja") {
      LABEL_MODE = "sharp";
      const sharpRadio = document.querySelector('input[name="labelMode"][value="sharp"]');
      if (sharpRadio) sharpRadio.checked = true;
      buildKeyboard();
    }
  }
}

function wireLanguageChooser() {
  document.querySelectorAll("[data-ui-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      UI_LANG = button.dataset.uiLang === "en" ? "en" : "ja";
      document.querySelectorAll("[data-ui-lang]").forEach((el) => {
        el.classList.toggle("active", el === button);
      });
      applyLanguage();
    });
  });
}

function csvEscape(value) {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function formatIsoForFilename(isoString) {
  return String(isoString || new Date().toISOString()).replace(/[:.]/g, "-");
}

function summarizeInstrumentHistory(instruments = []) {
  return instruments
    .map((inst) => {
      const name = inst.name || "";
      const start = inst.startAge || "";
      const end = inst.endAge || "";
      if (!name && !start && !end) return "";
      if (start || end) return `${name}:${start}-${end}`;
      return name;
    })
    .filter(Boolean)
    .join(" | ");
}

function buildSessionPayload() {
  const blocksPayload = BLOCKS.map((block) => ({
    blockId: block.blockId,
    displayName: block.displayName,
    audioType: block.audioType,
    audioDir: block.audioDir,
    summary: blockSummaries[block.blockId] || summarizeResults(getResultsForBlock(block.blockId)),
    results: getResultsForBlock(block.blockId),
  }));

  const flatResults = blocksPayload.flatMap((block) => block.results);

  return {
    runId,
    testCode: TEST_CODE,
    participantId: ID,
    audioType: "mixed",
    audioDir: "audio+audio_pure",
    blockOrder: BLOCKS.map((block) => ({
      blockId: block.blockId,
      displayName: block.displayName,
      audioType: block.audioType,
    })),
    demographics: getDemographics(),
    blocks: blocksPayload,
    summary: {
      totalBlocks: BLOCKS.length,
      totalTrials: flatResults.length,
    },
    results: flatResults,
    clientSubmittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };
}

async function submitDataToResearchServer(payload) {
  const submitUrl = `${API_BASE_URL}${API_SUBMIT_PATH}`;
  try {
    const res = await fetch(submitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        message = data.detail || data.message || message;
      } catch (_) {}
      return { ok: false, message };
    }
    return { ok: true };
  } catch (_) {
    return { ok: false, message: t("serverSubmitFailed") };
  }
}

function getAllResults() {
  return BLOCKS.flatMap((block) => getResultsForBlock(block.blockId));
}

function getOverallApScorePct() {
  const overallSummary = summarizeResults(getAllResults());
  return overallSummary.accPct;
}

function getResultFileStem() {
  const safeId = String(ID || "unknown").replace(/[^a-zA-Z0-9_-]/g, "_");
  const datePart = new Date().toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "-");
  const scorePart = `${getOverallApScorePct().toFixed(1)}pct`;
  return `${safeId}_${datePart}_APscore${scorePart}_APtest`;
}

function makeBlockOrder() {
  const configuredBlocks = getConfiguredBlocks();
  if (configuredBlocks.length <= 1) return configuredBlocks;

  const startedAt = new Date();
  const isEvenSecond = startedAt.getSeconds() % 2 === 0;
  return isEvenSecond
    ? [BLOCK_DEFS.pure, BLOCK_DEFS.piano]
    : [BLOCK_DEFS.piano, BLOCK_DEFS.pure];
}

// ====== UI generation ======
function buildChoiceButtons() {
  const keyboard = document.getElementById("keyboard");
  if (!keyboard) {
    console.error('id="keyboard" not found');
    return;
  }
  keyboard.innerHTML = "";

  // White (7) and black (5) key layout for one octave
  const whiteKeys = ["C","D","E","F","G","A","B"];
  const blackKeys = [
    { note: "C#", leftBase: 0, offset: 0.69 }, // between C and D
    { note: "D#", leftBase: 1, offset: 0.71 }, // between D and E
    { note: "F#", leftBase: 3, offset: 0.69 }, // between F and G
    { note: "G#", leftBase: 4, offset: 0.70 }, // between G and A
    { note: "A#", leftBase: 5, offset: 0.71 }, // between A and B
  ];

  const labelFor = (noteSharp) => {
    if (LABEL_MODE === "sharp") {
      return DISPLAY_LABELS[noteSharp] ?? noteSharp;
    }
    if (LABEL_MODE === "solfege_en") {
      return DISPLAY_LABELS_SOLFEGE_EN[noteSharp] ?? noteSharp;
    }
    return DISPLAY_LABELS_SOLFEGE_JA[noteSharp] ?? noteSharp;
  };

  const pressFlash = (btn) => {
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 120);
  };

  // White keys
  whiteKeys.forEach((note, i) => {
    const w = document.createElement("button");
    w.type = "button";
    w.className = "key white";
    w.style.left = `calc((100% / 7) * ${i})`;

    const span = document.createElement("span");
    span.className = "label";
    w.appendChild(span);
    span.textContent = prettyLabel(labelFor(note));
    w.addEventListener("click", () => {
      pressFlash(w);
      handleResponse(note); // internal label: C/D/E...
    });

    keyboard.appendChild(w);
  });

  // Black keys
  blackKeys.forEach(({ note, leftBase, offset }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "key black";

    // Place black keys slightly to the right of white-key boundaries
    // Fine-tuned per key for a more realistic keyboard look
    b.style.left = `calc((100% / 7) * (${leftBase} + ${offset}))`;

    const span = document.createElement("span");
    span.className = "label";
    const blackLabel = labelFor(note);
    span.textContent = blackLabel;
    b.appendChild(span);

    b.addEventListener("click", () => {
      pressFlash(b);
      handleResponse(note); // internal label: C#...
    });

    keyboard.appendChild(b);
  });
}buildChoiceButtons();

// ====== MIDI -> note/octave & filename ======
function midiToPcOct(m) {
  const pcSharp = NOTE_NAMES[m % 12];          // internal label for correctness checking
  const solfege = SOLFEGE_NAMES[m % 12];       // display label (solfege)
  const pcFile  = LABEL_TO_FILE[pcSharp];      // file label for audio filenames
  const oct = Math.floor(m / 12) - 1;
  return { pc: pcSharp, solfege, pcFile, oct };
}

function midiToFilename(m) {
  const { pcFile, oct } = midiToPcOct(m);
  const num = String(m).padStart(3, "0");
  return `${num}-${pcFile}${oct}.wav`;
}

function filePathForMidi(m) {
  return `${currentAudioDir}/${midiToFilename(m)}`;
}

// ====== Audio playback ======
async function ensureAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state !== "running") await audioCtx.resume();
}

async function getAudioBuffer(m) {
  const cacheKey = `${currentAudioDir}:${m}`;
  if (audioBufferCache.has(cacheKey)) return audioBufferCache.get(cacheKey);

  await ensureAudioCtx();
  const url = filePathForMidi(m);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`音声ファイルが見つかりません: ${url}`);
  const buf = await res.arrayBuffer();
  const audioBuf = await audioCtx.decodeAudioData(buf);

  audioBufferCache.set(cacheKey, audioBuf);
  return audioBuf;
}

async function playMidi(m) {
  const audioBuf = await getAudioBuffer(m);

  const src = audioCtx.createBufferSource();
  src.buffer = audioBuf;
  src.connect(audioCtx.destination);

  // Schedule slightly ahead to reduce click noise / timing jitter
  const startAt = audioCtx.currentTime + 0.03;
  src.start(startAt);

  return startAt; // return the scheduled audio onset time
}

// ====== Randomization (build trials from MIDI range) ======
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function makeMidiPool() {
  const arr = [];
  for (let m = MIN_MIDI; m <= MAX_MIDI; m++) arr.push(m);
  return arr;
}


// Use all 60 tones (36..95) exactly once and return an order that satisfies adjacent diff >= 13
// ====== Randomization (build trials from MIDI range) ======
const MIN_INTERVAL = 13; // fixed constraint: one octave + semitone

function okAdj(a, b) {
  return (
    a !== b &&
    Math.abs(b - a) >= MIN_INTERVAL &&
    (a % 12) !== (b % 12) // forbid same pitch class (octave-equivalent adjacency)
  );
}

// Build one sequence for a pool (evens only / odds only), using each note exactly once
async function solveOnePool(pool, label) {
  // Precompute adjacency graph
  const neighbors = new Map();
  for (const a of pool) {
    neighbors.set(a, pool.filter(b => okAdj(a, b)));
  }

  // Choose random start among top-K nodes with fewest neighbors (avoid fixed patterns)
  const K = Math.min(8, pool.length);
  const sorted = pool.slice().sort((x, y) => neighbors.get(x).length - neighbors.get(y).length);
  const start = sorted[Math.floor(Math.random() * K)];

  const used = new Set([start]);
  const path = [start];

  let steps = 0;
  const YIELD_EVERY = 3000;

  async function dfs(curr) {
    if (path.length === pool.length) return true;

    steps++;
    if (steps % YIELD_EVERY === 0) {
      elStatus.textContent = `試行を作成しています...（${label}） step=${steps} / length=${path.length}`;
      await new Promise(r => setTimeout(r, 0));
    }

    // Next candidates: unused only
    const cand = neighbors.get(curr).filter(v => !used.has(v));

    // Heuristic: fewer remaining unused neighbors first
    cand.sort((a, b) => {
      const da = neighbors.get(a).filter(v => !used.has(v)).length;
      const db = neighbors.get(b).filter(v => !used.has(v)).length;
      return da - db;
    });

    // Lightly shuffle top candidates to avoid deterministic tie behavior
    const top = Math.min(6, cand.length);
    for (let i = top - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cand[i], cand[j]] = [cand[j], cand[i]];
    }

    for (const nxt of cand) {
      used.add(nxt);
      path.push(nxt);

      if (await dfs(nxt)) return true;

      path.pop();
      used.delete(nxt);
    }
    return false;
  }

  const ok = await dfs(start);
  if (!ok) throw new Error(`No valid sequence found (${label})`);

  return path;
}

// Use all 60 tones (36..95) exactly once
// Build evens, then odds, and only validate the junction
async function makeTrials(n) {
  const poolAll = makeMidiPool(); // 36..95
  if (n !== poolAll.length) {
    throw new Error(`This mode assumes "use every tone in range exactly once". n=${n}, pool=${poolAll.length}`);
  }

  const evenPool = poolAll.filter(m => m % 2 === 0);
  const oddPool  = poolAll.filter(m => m % 2 === 1);

  const MAX_TRIES = 200; // retry limit on failure

  for (let t = 1; t <= MAX_TRIES; t++) {
    elStatus.textContent = `試行を作成しています... ${t}/${MAX_TRIES}`;

    // Build even and odd sequences separately
    const evenPath = await solveOnePool(evenPool, "even");
    const oddPath  = await solveOnePool(oddPool,  "odd");

    // Check junction compatibility
    const a = evenPath[evenPath.length - 1];
    const b = oddPath[0];

    if (okAdj(a, b)) {
      const path = evenPath.concat(oddPath);

      // Convert to trial objects
      return path.map((m) => {
        const { pc, oct } = midiToPcOct(m);
        return { midi: m, target: pc, oct, file: midiToFilename(m) };
      });
    }
    // Retry if junction fails
  }

  throw new Error("Failed to satisfy junction constraints (retry limit reached).");
}

// ====== Task flow ======
async function startTest() {
  alreadySent = false;
  runId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  if (!validateStartRequirements(true)) return;

  ID = (elID.value || "").trim();
  BLOCKS = makeBlockOrder();
  resultsByBlock = {};
  blockSummaries = {};
  currentBlockIndex = 0;
  sessionStarted = true;
  initialSetupDone = false;
  setCurrentBlock(BLOCKS[currentBlockIndex]);
  prepareSessionUI();
  startVolumeCheckForCurrentBlock();
}

let trialTimeoutId = null;
let respondedThisTrial = false;

function setCurrentBlock(block) {
  currentBlock = block;
  currentAudioDir = block.audioDir;
  currentAudioType = block.audioType;
  if (!resultsByBlock[block.blockId]) resultsByBlock[block.blockId] = [];
}

function getCurrentResults() {
  return resultsByBlock[currentBlock.blockId] || [];
}

function getResultsForBlock(blockId) {
  return resultsByBlock[blockId] || [];
}

function setParticipantInputsDisabled(disabled) {
  elID.disabled = disabled;
  if (elSex) elSex.disabled = disabled;
  if (elAge) elAge.disabled = disabled;
  document.querySelectorAll("#instRows select, #instRows input").forEach((el) => {
    el.disabled = disabled;
  });
  if (btnAddInst) btnAddInst.disabled = disabled;
  if (!disabled) {
    document.querySelectorAll("#instRows .instName").forEach((sel) => {
      if (typeof window.toggleOtherInput === "function") window.toggleOtherInput(sel);
    });
  }
}

function prepareSessionUI() {
  btnStart.disabled = true;
  setParticipantInputsDisabled(true);
  elStatus.classList.remove("compact");
  if (elLabelModeChooser) elLabelModeChooser.style.display = "none";
  if (elBreakPanel) elBreakPanel.style.display = "none";
  if (elSummary) elSummary.innerHTML = "";
  if (chartTitlePiano) chartTitlePiano.style.display = "none";
  if (chartTitlePure) chartTitlePure.style.display = "none";
  if (canvasAccPiano) canvasAccPiano.style.display = "none";
  if (canvasAccPure) canvasAccPure.style.display = "none";
}

function startVolumeCheckForCurrentBlock() {
  inVolumeCheck = true;
  btnVolPlay.disabled = false;
  btnVolOK.disabled = false;
  if (elBreakPanel) elBreakPanel.style.display = "none";
  elStatus.textContent = t("statusVolumeCheck");
}

async function prepareCurrentBlockTrials() {
  elStatus.textContent = "試行を準備しています...";

  try {
    trials = await makeTrials(N_TRIALS);
  } catch (e) {
    elStatus.textContent = t("statusPrepareFailed", e.message);
    return false;
  }

  trialIndex = -1;
  canRespond = false;
  return true;
}

async function nextTrial() {
  if (trialTimeoutId) {
    clearTimeout(trialTimeoutId);
    trialTimeoutId = null;
  }

  trialIndex++;

  if (trialIndex >= trials.length) {
    await finishBlock();
    return;
  }

  current = trials[trialIndex];
  respondedThisTrial = false;
  canRespond = false;
  elStatus.textContent = `${trialIndex + 1} / ${trials.length} `;

  try {
    const startAt = await playMidi(current.midi);
    const nowCtx = audioCtx.currentTime;
    const msUntilStart = Math.max(0, (startAt - nowCtx) * 1000);

    setTimeout(() => {
      tSoundOn = performance.now();
      canRespond = true;
      elStatus.textContent = `${trialIndex + 1} / ${trials.length} `;

      trialTimeoutId = setTimeout(() => {
        if (!respondedThisTrial) {
          getCurrentResults().push({
            ID,
            blockId: currentBlock.blockId,
            blockLabel: currentBlock.displayName,
            audioType: currentAudioType,
            audioDir: currentAudioDir,
            trial: trialIndex + 1,
            midi: current.midi,
            file: current.file,
            target: current.target,
            target_solfege: midiToPcOct(current.midi).solfege,
            response: "",
            response_solfege: "",
            correct: 0,
            rt_ms: "",
            no_response: 1,
          });
        }

        canRespond = false;
        nextTrial();
      }, TRIAL_MS);
    }, msUntilStart);
  } catch (e) {
    elStatus.textContent = String(e.message || e);
    setParticipantInputsDisabled(false);
    updateStartButtonState();
  }
}

function handleResponse(resp) {
  if (!canRespond || !current || respondedThisTrial) return;

  const rt = performance.now() - tSoundOn;
  const correct = resp === current.target;
  const responseIdx = NOTE_NAMES.indexOf(resp);
  const responseSolfege = responseIdx >= 0 ? SOLFEGE_NAMES[responseIdx] : "";

  getCurrentResults().push({
    ID,
    blockId: currentBlock.blockId,
    blockLabel: currentBlock.displayName,
    audioType: currentAudioType,
    audioDir: currentAudioDir,
    trial: trialIndex + 1,
    midi: current.midi,
    file: current.file,
    target: current.target,
    target_solfege: midiToPcOct(current.midi).solfege,
    response: resp,
    response_solfege: responseSolfege,
    correct: correct ? 1 : 0,
    rt_ms: Math.round(rt),
    no_response: 0,
  });

  respondedThisTrial = true;
  elStatus.textContent = `${trialIndex + 1} / ${trials.length}`;
}

async function finishBlock() {
  blockSummaries[currentBlock.blockId] = summarizeResults(getCurrentResults());

  const hasNextBlock = currentBlockIndex < BLOCKS.length - 1;
  if (hasNextBlock) {
    canRespond = false;
    if (elBreakPanel) {
      elBreakPanel.style.display = "block";
      if (elBreakMessage) {
        elBreakMessage.textContent = "【課題はまだ終わっていません！】「次へ」を押して進めてください。";
        elBreakMessage.textContent = t("breakMessage");
      }
    }
    elStatus.textContent = t("statusBreak");
    return;
  }

  await finishSession();
}

function continueToNextBlock() {
  if (currentBlockIndex >= BLOCKS.length - 1) return;
  currentBlockIndex += 1;
  setCurrentBlock(BLOCKS[currentBlockIndex]);
  if (elBreakPanel) elBreakPanel.style.display = "none";
  startNextBlockWithoutSetup();
}

async function finishSession() {
  renderAllResults();
  const ok = await sendOnce();
  setParticipantInputsDisabled(false);
  sessionStarted = false;
  updateStartButtonState();
  elStatus.innerHTML = `<b>${t("finishTitle")}</b><br>${ok ? t("finishSaved") : t("finishFailed")}<br><br>${t("finishThanks1")}<br>${t("finishThanks2")}`;
}

function calcAccuracy(results = getCurrentResults()) {
  const nCorrect = results.filter(r => r.correct === 1).length;
  const total = N_TRIALS;
  return { nCorrect, total };
}

function calcAccuracyByPitchClass(results = getCurrentResults()) {
  // 12-note aggregation: per target (correct count / presented count)
  const stat = {};
  NOTE_NAMES.forEach(n => stat[n] = { total: 0, correct: 0 });

  for (const r of results) {
    // Only numeric trial rows (ignore any summary/misc rows)
    if (typeof r.trial !== "number") continue;
    if (!r.target || !(r.target in stat)) continue;

    stat[r.target].total += 1;
    if (r.correct === 1) stat[r.target].correct += 1;
  }

  const labels = NOTE_NAMES.slice();
  const rates = labels.map(n => {
    const { total, correct } = stat[n];
    return total ? (correct / total) : 0;
  });
  const totals = labels.map(n => stat[n].total);
  return { labels, rates, totals };
}

function labelForDisplay(pcSharp) {
  if (LABEL_MODE === "sharp") return pcSharp;
  if (LABEL_MODE === "solfege_en") return DISPLAY_LABELS_SOLFEGE_EN[pcSharp] ?? pcSharp;
  return DISPLAY_LABELS_SOLFEGE_JA[pcSharp] ?? pcSharp;
}

function drawBarChartAccuracy(canvas, labelsSharp, rates, totals, meansSec = [], rtCounts = []) {
  // Match keyboard width
  const cssW = elKeyboard.getBoundingClientRect().width;
  const cssH = 280;

  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, cssW, cssH);

  // Padding
  const padL = 48, padR = 52, padT = 48, padB = 46;
  const plotW = cssW - padL - padR;
  const plotH = cssH - padT - padB;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cssW, cssH);

  ctx.fillStyle = "#333";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Accuracy + Mean Reaction Time by Pitch Class", padL + plotW / 2, 13);
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = "#5f6b7a";
  ctx.textAlign = "left";
  ctx.fillText("Bar: Accuracy (%)", padL, 31);
  ctx.textAlign = "right";
  ctx.fillText("Dot: Mean RT (s, correct only)", padL + plotW + 36, 31);

  // Axis (0–100%)
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  // Ticks
  ctx.fillStyle = "#333";
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  [0, 0.25, 0.5, 0.75, 1].forEach(v => {
    const y = padT + plotH - v * plotH;
    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();

    ctx.fillStyle = "#333";
    ctx.fillText(`${Math.round(v*100)}%`, padL - 6, y + 1);
  });

  // Bar
  const n = labelsSharp.length;
  const gap = 6;
  const barW = Math.max(6, (plotW - gap * (n - 1)) / n);

  const accColorWhite = "#ffffff";
  const accColorSharp = "#8a8a8a";
  ctx.strokeStyle = "#333";

  const accLabelYs = Array(n).fill(null);
  for (let i = 0; i < n; i++) {
    const rate = rates[i];          // 0..1
    const x = padL + i * (barW + gap);
    const h = rate * plotH;
    const y = padT + plotH - h;

    const pc = labelsSharp[i];
    const black = pc.includes("#");

    ctx.fillStyle = black ? accColorSharp : accColorWhite;
    ctx.strokeStyle = "#333";

    ctx.fillRect(x, y, barW, h);
    ctx.strokeRect(x, y, barW, h);

    // X labels (respect current label mode)
    const lab = prettyLabel(labelForDisplay(labelsSharp[i]));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333";
    ctx.fillText(lab, x + barW / 2, padT + plotH + 14);

    if (rate > 0) {
      const accY = Math.max(padT + 8, y - 7);
      accLabelYs[i] = accY;
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillStyle = "#444";
      ctx.fillText(`${(rate * 100).toFixed(1)}%`, x + barW / 2, accY);
      ctx.font = "12px system-ui, sans-serif";
    }
  }

  if (meansSec.length === n) {
    const yMaxRT = 4.0; // right axis fixed at 4.0s for reaction time

    // Right axis (reaction time)
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL + plotW, padT);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    ctx.fillStyle = "#555";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    [0, 1, 2, 3, 4].forEach(rt => {
      const y = padT + plotH - (rt / yMaxRT) * plotH;
      ctx.fillText(`${rt.toFixed(1)}s`, padL + plotW + 6, y + 1);
    });

    // Reaction time: dots only (prioritize readability and reduce overlap)
    for (let i = 0; i < n; i++) {
      if ((rtCounts[i] || 0) <= 0) {
        continue;
      }
      const x = padL + i * (barW + gap) + barW / 2;
      const y = padT + plotH - (Math.min(meansSec[i], yMaxRT) / yMaxRT) * plotH;

      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      // If overlapping same-note accuracy label, shift RT label up/down
      let rtLabelY = y - 8;
      if (accLabelYs[i] != null && Math.abs(rtLabelY - accLabelYs[i]) < 12) {
        rtLabelY = accLabelYs[i] - 12;
        if (rtLabelY < padT + 8) rtLabelY = accLabelYs[i] + 12;
      }
      if (rtLabelY > padT + plotH - 4) rtLabelY = padT + plotH - 4;

      ctx.font = "9px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${meansSec[i].toFixed(1)}s`, x, rtLabelY);
      ctx.font = "12px system-ui, sans-serif";
    }
  }
}

async function volumePlay() {
  try {
    await playMidi(VOLUME_CHECK_MIDI);
  } catch (e) {
    elStatus.textContent = String(e.message || e);
  }
}

async function volumeOK() {
  if (!inVolumeCheck) return;

  inVolumeCheck = false;
  btnVolPlay.disabled = true;
  btnVolOK.disabled = true;
  const ok = await prepareCurrentBlockTrials();
  if (!ok) {
    btnVolPlay.disabled = false;
    btnVolOK.disabled = false;
    inVolumeCheck = true;
    return;
  }
  showLabelModeChooser();
}

function showLabelModeChooser() {
  if (!elLabelModeChooser) {
    startMainAfterLabelChoice();
    return;
  }
  elLabelModeChooser.style.display = "block";
  elStatus.classList.add("compact");
  const current = document.querySelector(`input[name="labelMode"][value="${LABEL_MODE}"]`);
  if (current) current.checked = true;
  elStatus.textContent = t("statusVolumeDone");
}

async function startMainAfterLabelChoice() {
  if (elLabelModeChooser) elLabelModeChooser.style.display = "none";
  elStatus.classList.remove("compact");
  elStatus.textContent = t("statusStartsIn5");
  initialSetupDone = true;

  setTimeout(async () => {
    elStatus.textContent = t("statusStarting");
    await nextTrial();
  }, START_DELAY_MS);
}

async function startNextBlockWithoutSetup() {
  const ok = await prepareCurrentBlockTrials();
  if (!ok) {
    setParticipantInputsDisabled(false);
    sessionStarted = false;
    updateStartButtonState();
    return;
  }

  elStatus.textContent = t("statusStartsIn5");
  setTimeout(async () => {
    elStatus.textContent = t("statusStarting");
    await nextTrial();
  }, START_DELAY_MS);
}

function wireLabelModeChooser() {
  const radios = Array.from(document.querySelectorAll('input[name="labelMode"]'));
  radios.forEach(r => {
    r.addEventListener("change", () => {
      if (!r.checked) return;
      LABEL_MODE = ["sharp", "solfege_ja", "solfege_en"].includes(r.value) ? r.value : "sharp";
      buildChoiceButtons();
    });
  });

  if (btnLabelModeStart) {
    btnLabelModeStart.addEventListener("click", startMainAfterLabelChoice);
  }
}

function setStatus(msg, isError=false) {
  elStatus.textContent = msg;
  elStatus.style.color = isError ? "crimson" : "#111";
}

// ===== Prevent duplicate submission (send exactly once) =====
let alreadySent = false;

async function sendOnce() {
  if (alreadySent) return true;

  setStatus(t("statusSaving"));
  const payload = buildSessionPayload();
  const result = await submitDataToResearchServer(payload);

  if (result.ok) {
    alreadySent = true;
    setStatus(result.message || t("statusSaved"));
  } else {
    setStatus(result.message || t("statusSaveFailed"), true);
  }

  return result.ok;
}

function summarizeResults(results) {
  const { nCorrect, total } = calcAccuracy(results);
  const { labels, rates, totals } = calcAccuracyByPitchClass(results);
  const { meansSec, counts } = calcMeanRTByPitchClass(results);
  const rtValuesMs = results
    .filter(r => typeof r.trial === "number" && r.correct === 1 && r.rt_ms !== "" && r.rt_ms != null && !Number.isNaN(Number(r.rt_ms)))
    .map(r => Number(r.rt_ms));
  const meanRtMs = rtValuesMs.length ? Math.round(rtValuesMs.reduce((a, b) => a + b, 0) / rtValuesMs.length) : null;
  const noResponseN = results.filter(r => r.no_response === 1).length;
  const noResponsePct = total ? Math.round((noResponseN / total) * 100) : 0;
  const accPct = total ? (nCorrect / total) * 100 : 0;
  const bestIdx = rates.indexOf(Math.max(...rates));
  const rtCandidates = meansSec
    .map((v, i) => ({ idx: i, v, n: counts[i] }))
    .filter(x => x.n > 0);
  const fastest = rtCandidates.length ? rtCandidates.reduce((a, b) => (a.v <= b.v ? a : b)) : null;

  return {
    nCorrect,
    total,
    accPct,
    labels,
    rates,
    totals,
    meansSec,
    counts,
    meanRtMs,
    noResponseN,
    noResponsePct,
    bestIdx,
    fastest,
  };
}

function getResultOverviewBodyText(showPiano, showPure) {
  return showPiano && showPure ? t("resultOverviewBody") : "";
}

function renderAllResults() {
  const pianoSummary = blockSummaries.block1 || summarizeResults(getResultsForBlock("block1"));
  const pureSummary = blockSummaries.block2 || summarizeResults(getResultsForBlock("block2"));
  const showPiano = hasConfiguredBlock("piano");
  const showPure = hasConfiguredBlock("pure");
  const allResults = getAllResults();
  const overallSummary = summarizeResults(allResults);
  const bestPitch = overallSummary.bestIdx >= 0 ? overallSummary.labels[overallSummary.bestIdx] : "-";
  const fastestText = overallSummary.fastest
    ? `${overallSummary.labels[overallSummary.fastest.idx]} (${overallSummary.fastest.v.toFixed(2)}s)`
    : "-";
  const overviewBody = getResultOverviewBodyText(showPiano, showPure);

  elSummary.innerHTML = `
    <div class="result-panel">
      <div class="result-title">${t("resultOverviewTitle")}</div>
      ${overviewBody ? `${overviewBody}` : ""}
      <div class="kpi-grid" style="margin-top:10px;">
        ${showPiano ? `
        <div class="kpi-card">
          <div class="kpi-label">${t("resultPianoLabel")}</div>
          <div class="kpi-value">${pianoSummary.accPct.toFixed(1)}%</div>
          <div class="kpi-sub">${pianoSummary.nCorrect} / ${pianoSummary.total}</div>
        </div>
        ` : ""}
        ${showPure ? `
        <div class="kpi-card">
          <div class="kpi-label">${t("resultPureLabel")}</div>
          <div class="kpi-value">${pureSummary.accPct.toFixed(1)}%</div>
          <div class="kpi-sub">${pureSummary.nCorrect} / ${pureSummary.total}</div>
        </div>
        ` : ""}
        ${showPiano ? `
        <div class="kpi-card">
          <div class="kpi-label">${t("resultPianoMeanRtLabel")}</div>
          <div class="kpi-value">${pianoSummary.meanRtMs == null ? "-" : `${(pianoSummary.meanRtMs / 1000).toFixed(2)}s`}</div>
          <div class="kpi-sub">${pianoSummary.counts.reduce((a, b) => a + b, 0)} ${t("resultTrialsUnit")}</div>
        </div>
        ` : ""}
        ${showPure ? `
        <div class="kpi-card">
          <div class="kpi-label">${t("resultPureMeanRtLabel")}</div>
          <div class="kpi-value">${pureSummary.meanRtMs == null ? "-" : `${(pureSummary.meanRtMs / 1000).toFixed(2)}s`}</div>
          <div class="kpi-sub">${pureSummary.counts.reduce((a, b) => a + b, 0)} ${t("resultTrialsUnit")}</div>
        </div>
        ` : ""}
        ${showPiano ? `
        <div class="kpi-card">
          <div class="kpi-label">${t("resultPianoNoResponseLabel")}</div>
          <div class="kpi-value">${pianoSummary.noResponsePct}%</div>
          <div class="kpi-sub">${pianoSummary.noResponseN} / ${pianoSummary.total}</div>
        </div>
        ` : ""}
        ${showPure ? `
        <div class="kpi-card">
          <div class="kpi-label">${t("resultPureNoResponseLabel")}</div>
          <div class="kpi-value">${pureSummary.noResponsePct}%</div>
          <div class="kpi-sub">${pureSummary.noResponseN} / ${pureSummary.total}</div>
        </div>
        ` : ""}
      </div>
      <div class="insight-row">${t("resultBestPitchLabel")}: <b>${bestPitch}</b> (${overallSummary.bestIdx >= 0 ? Math.round(overallSummary.rates[overallSummary.bestIdx] * 100) : 0}%) / ${t("resultFastestRtLabel")}: <b>${fastestText}</b></div>
    </div>
  `;

  if (chartTitlePiano) chartTitlePiano.style.display = showPiano ? "block" : "none";
  if (chartTitlePure) chartTitlePure.style.display = showPure ? "block" : "none";
  if (canvasAccPiano) {
    canvasAccPiano.style.display = showPiano ? "block" : "none";
  }
  if (canvasAccPure) {
    canvasAccPure.style.display = showPure ? "block" : "none";
  }
  if (showPiano && canvasAccPiano) {
    canvasAccPiano.style.display = "block";
    drawBarChartAccuracy(
      canvasAccPiano,
      pianoSummary.labels,
      pianoSummary.rates,
      pianoSummary.totals,
      pianoSummary.meansSec,
      pianoSummary.counts,
    );
  }
  if (showPure && canvasAccPure) {
    drawBarChartAccuracy(
      canvasAccPure,
      pureSummary.labels,
      pureSummary.rates,
      pureSummary.totals,
      pureSummary.meansSec,
      pureSummary.counts,
    );
  }
  window.onresize = () => {
    if (showPiano && canvasAccPiano) {
      drawBarChartAccuracy(
        canvasAccPiano,
        pianoSummary.labels,
        pianoSummary.rates,
        pianoSummary.totals,
        pianoSummary.meansSec,
        pianoSummary.counts,
      );
    }
    if (showPure && canvasAccPure) {
      drawBarChartAccuracy(
        canvasAccPure,
        pureSummary.labels,
        pureSummary.rates,
        pureSummary.totals,
        pureSummary.meansSec,
        pureSummary.counts,
      );
    }
  };
}

function getDemographics() {
  const sex = (elSex?.value || "").trim();
  const age = (elAge?.value || "").trim();

  // instruments: collect multiple rows as [{name,start,end}]
  const rows = Array.from(document.querySelectorAll("#instRows .instRow"));
  const instruments = rows.map(r => {
    const nameSel = r.querySelector(".instName");
    const startEl = r.querySelector(".instStart");
    const endEl   = r.querySelector(".instEnd");
    const otherEl = r.querySelector(".instOther");

    let name = (nameSel?.value || "").trim();
    if (name === "other") {
      name = (otherEl?.value || "").trim();
    }

    const start = (startEl?.value || "").trim();
    const endRaw = (endEl?.value || "").trim();
    const end = endRaw.toLowerCase() === "present" ? "present" : endRaw;

    return { name, startAge: start, endAge: end };
  }).filter(x => x.name || x.startAge || x.endAge); // drop empty rows

  return { sex, age, instruments };
}

function getInstrumentRowValues(row) {
  const nameSel = row.querySelector(".instName");
  const startEl = row.querySelector(".instStart");
  const endEl   = row.querySelector(".instEnd");
  const otherEl = row.querySelector(".instOther");

  const rawName = (nameSel?.value || "").trim();
  const other = (otherEl?.value || "").trim();
  const start = (startEl?.value || "").trim();
  const end = (endEl?.value || "").trim();
  const name = rawName === "other" ? other : rawName;

  return { rawName, name, other, start, end };
}

function isInstrumentRowComplete(v) {
  // non-musician does not require age inputs
  if (v.rawName === "non-musician") return !!v.name;
  return !!v.name && !!v.start && !!v.end;
}

function clearInvalidMarks() {
  document.querySelectorAll(".invalid-field").forEach(el => el.classList.remove("invalid-field"));
}

function markInvalid(el) {
  if (!el) return;
  el.classList.add("invalid-field");
}

function validateStartRequirements(showMessage = false) {
  clearInvalidMarks();

  const id = (elID?.value || "").trim();
  const sex = (elSex?.value || "").trim();
  const age = (elAge?.value || "").trim();
  const ageNum = Number(age);
  const rows = Array.from(document.querySelectorAll("#instRows .instRow"));
  let msg = "";
  let valid = true;

  if (!id) {
    markInvalid(elID);
    valid = false;
    msg ||= t("validationId");
  }
  if (!sex) {
    markInvalid(elSex);
    valid = false;
    msg ||= t("validationSex");
  }
  if (!age) {
    markInvalid(elAge);
    valid = false;
    msg ||= t("validationAge");
  } else if (!Number.isFinite(ageNum) || ageNum < 0) {
    markInvalid(elAge);
    valid = false;
    msg ||= t("validationAgeRange");
  }
  if (!rows.length) {
    valid = false;
    msg ||= t("validationMusicHistory");
  }

  for (let i = 0; i < rows.length; i++) {
    const v = getInstrumentRowValues(rows[i]);
    const nameSel = rows[i].querySelector(".instName");
    const startEl = rows[i].querySelector(".instStart");
    const endEl = rows[i].querySelector(".instEnd");
    const otherEl = rows[i].querySelector(".instOther");
    const isBlank = !v.rawName && !v.start && !v.end && !v.other;
    const isComplete = isInstrumentRowComplete(v);

    // Row 1 is required; additional rows must be either fully blank or fully completed
    if (i === 0) {
      if (!isComplete) {
        if (!v.rawName) markInvalid(nameSel);
        if (v.rawName === "other" && !v.other) markInvalid(otherEl);
        if (v.rawName !== "non-musician" && !v.start) markInvalid(startEl);
        if (v.rawName !== "non-musician" && !v.end) markInvalid(endEl);
        valid = false;
        msg ||= (v.rawName === "non-musician")
          ? t("validationFirstInstrument")
          : t("validationFirstMusicHistory");
      }
    } else if (!isBlank && !isComplete) {
      if (!v.rawName) markInvalid(nameSel);
      if (v.rawName === "other" && !v.other) markInvalid(otherEl);
      if (v.rawName !== "non-musician" && !v.start) markInvalid(startEl);
      if (v.rawName !== "non-musician" && !v.end) markInvalid(endEl);
      valid = false;
      msg ||= t("validationInstrumentRow", i + 1);
    }
  }

  if (showMessage && !valid) elStatus.textContent = msg;
  return valid;
}

function updateStartButtonState() {
  if (!btnStart) return;
  if (sessionStarted) {
    btnStart.disabled = true;
    return;
  }
  // Keep Start disabled during volume check
  if (inVolumeCheck) {
    btnStart.disabled = true;
    return;
  }
  btnStart.disabled = !validateStartRequirements(false);
}

function wireStartValidation() {
  [elID, elSex, elAge].forEach(el => {
    if (!el) return;
    el.addEventListener("input", updateStartButtonState);
    el.addEventListener("change", updateStartButtonState);
  });
  updateStartButtonState();
}

function wireInstrumentUI() {
  if (!btnAddInst) return;

  // Show free-text field only when "other" is selected
  const toggleOther = (row) => {
    const sel = row.querySelector(".instName");
    const other = row.querySelector(".instOther");
    const start = row.querySelector(".instStart");
    const end = row.querySelector(".instEnd");
    if (!sel || !other) return;
    const isOther = sel.value === "other";
    const isNonMusician = sel.value === "non-musician";
    other.style.display = isOther ? "inline-block" : "none";
    if (start) {
      start.disabled = isNonMusician;
      if (isNonMusician) start.value = "";
    }
    if (end) {
      end.disabled = isNonMusician;
      if (isNonMusician) end.value = "";
    }
  };

  // Attach handlers to the initial row as well
  document.querySelectorAll("#instRows .instRow").forEach(r => {
    const sel = r.querySelector(".instName");
    const other = r.querySelector(".instOther");
    const start = r.querySelector(".instStart");
    const end = r.querySelector(".instEnd");
    if (sel) sel.addEventListener("change", () => {
      toggleOther(r);
      updateStartButtonState();
    });
    if (other) other.addEventListener("input", updateStartButtonState);
    if (start) start.addEventListener("input", updateStartButtonState);
    if (end) end.addEventListener("input", updateStartButtonState);
    toggleOther(r);
  });
}

function calcMeanRTByPitchClass(results = getCurrentResults()) {
  const stat = {};
  NOTE_NAMES.forEach(n => stat[n] = { sum: 0, n: 0 });

  for (const r of results) {
    if (typeof r.trial !== "number") continue;
    if (!r.target || !(r.target in stat)) continue;
    if (r.correct !== 1) continue; // RT mean is computed from correct trials only
    if (r.rt_ms === "" || r.rt_ms == null || Number.isNaN(Number(r.rt_ms))) continue;

    stat[r.target].sum += Number(r.rt_ms);
    stat[r.target].n += 1;
  }

  const labels = NOTE_NAMES.slice();
  const meansSec = labels.map(n => {
    const s = stat[n];
    return s.n ? (s.sum / s.n) / 1000 : 0;
  });
  const counts = labels.map(n => stat[n].n);
  return { labels, meansSec, counts };
}

function drawBarChartRT(canvas, labelsSharp, meansSec, counts) {
  const cssW = elKeyboard.getBoundingClientRect().width;
  const cssH = 220;

  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, cssW, cssH);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, cssW, cssH);

  const padL = 46, padR = 10, padT = 28, padB = 40;
  const plotW = cssW - padL - padR;
  const plotH = cssH - padT - padB;

  ctx.fillStyle = "#333";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Mean Reaction Time by Pitch Class", padL + plotW / 2, 12);
  ctx.font = "12px system-ui, sans-serif";

  const maxVal = Math.max(1.0, ...meansSec);
  const yMax = Math.ceil(maxVal * 10) / 10;

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  const ticks = 4;
  ctx.fillStyle = "#333";
  ctx.font = "12px system-ui, sans-serif";
  for (let i = 0; i <= ticks; i++) {
    const v = (yMax / ticks) * i;
    const y = padT + plotH - (v / yMax) * plotH;
    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
    ctx.fillStyle = "#333";
    ctx.fillText(`${v.toFixed(1)}s`, 4, y + 4);
  }

  const n = labelsSharp.length;
  const gap = 6;
  const barW = Math.max(6, (plotW - gap * (n - 1)) / n);

  for (let i = 0; i < n; i++) {
    const val = meansSec[i];
    const x = padL + i * (barW + gap);
    const h = (val / yMax) * plotH;
    const y = padT + plotH - h;

    const pc = labelsSharp[i];
    const black = pc.includes("#");

    ctx.fillStyle = black ? "#888" : "#fff";
    ctx.strokeStyle = "#333";
    ctx.fillRect(x, y, barW, h);
    ctx.strokeRect(x, y, barW, h);

    const lab = prettyLabel(labelForDisplay(labelsSharp[i]));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333";
    ctx.fillText(lab, x + barW / 2, padT + plotH + 14);

    ctx.fillStyle = "#333";
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillText(`n=${counts[i]}`, x + 1, padT + plotH + 32);
    ctx.font = "12px system-ui, sans-serif";
  }
}

// ===== Instruments UI (minimal) =====
window.addInstrumentRow = function addInstrumentRow() {
  const elInstRows = document.getElementById("instRows");
  if (!elInstRows) return;

  elInstRows.insertAdjacentHTML("beforeend", `
    <div class="row instRow" style="margin:0;">
      <select class="instName" onchange="toggleOtherInput(this)">
        <option value="" class="inst-option-placeholder">選択してください</option>
        <option value="non-musician" class="inst-option-non-musician">演奏歴なし</option>
        <option value="piano" class="inst-option-piano">ピアノ</option>
        <option value="violin" class="inst-option-violin">バイオリン</option>
        <option value="flute" class="inst-option-flute">フルート</option>
        <option value="clarinet" class="inst-option-clarinet">クラリネット</option>
        <option value="saxophone" class="inst-option-saxophone">サクソフォン</option>
        <option value="trumpet" class="inst-option-trumpet">トランペット</option>
        <option value="trombone" class="inst-option-trombone">トロンボーン</option>
        <option value="cello" class="inst-option-cello">チェロ</option>
        <option value="guitar" class="inst-option-guitar">ギター</option>
        <option value="voice" class="inst-option-voice">声楽</option>
        <option value="percussion" class="inst-option-percussion">打楽器</option>
        <option value="other" class="inst-option-other">その他</option>
      </select>

      <input class="instStart" type="number" min="0" max="120" placeholder="開始年齢" style="width:120px;" />
      <input class="instEnd" type="number" min="0" max="120" placeholder="終了年齢" style="width:120px;" />
      <input class="instOther" type="text" placeholder="その他の楽器名" style="width:180px; display:none;" />
    </div>
  `);

  const row = elInstRows.lastElementChild;
  if (!row) return;

  const sel = row.querySelector(".instName");
  const other = row.querySelector(".instOther");
  const start = row.querySelector(".instStart");
  const end = row.querySelector(".instEnd");

  if (sel) sel.addEventListener("change", () => window.toggleOtherInput(sel));
  if (other) other.addEventListener("input", updateStartButtonState);
  if (start) start.addEventListener("input", updateStartButtonState);
  if (end) end.addEventListener("input", updateStartButtonState);

  updateInstrumentOptionTexts(row);
  updateStartButtonState();
};

  // Show free-text input only when "other" is selected
  window.toggleOtherInput = function toggleOtherInput(sel) {
    const row = sel.closest(".instRow");
    const other = row.querySelector(".instOther");
    const start = row.querySelector(".instStart");
    const end = row.querySelector(".instEnd");
    if (!other) return;
    other.style.display = (sel.value === "other") ? "inline-block" : "none";
    const isNonMusician = sel.value === "non-musician";
    if (start) {
      start.disabled = isNonMusician;
      if (isNonMusician) start.value = "";
    }
    if (end) {
      end.disabled = isNonMusician;
      if (isNonMusician) end.value = "";
    }
    updateStartButtonState();
  };

btnStart.addEventListener("click", startTest);
btnVolPlay.addEventListener("click", volumePlay);
btnVolOK.addEventListener("click", volumeOK);
if (btnContinueBlock) btnContinueBlock.addEventListener("click", continueToNextBlock);
wireInstrumentUI();
wireLanguageChooser();
wireLabelModeChooser();
wireStartValidation();
applyLanguage();
buildChoiceButtons();
