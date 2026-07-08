<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Empty request body'], JSON_UNESCAPED_UNICODE);
    exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

validate_payload($payload);

$homeDir = dirname(__DIR__, 2);
$dataDir = getenv('APTEST_DATA_DIR') ?: ($homeDir . DIRECTORY_SEPARATOR . 'aptest_data');
$logDir = $dataDir . DIRECTORY_SEPARATOR . 'participant_logs';
$rawDir = $dataDir . DIRECTORY_SEPARATOR . 'raw_payloads';
$summaryFile = $dataDir . DIRECTORY_SEPARATOR . 'aptest_php_server_summary.csv';

ensure_dir($dataDir);
ensure_dir($logDir);
ensure_dir($rawDir);

$baseName = build_result_file_stem($payload);
$detailPath = $logDir . DIRECTORY_SEPARATOR . $baseName . '.csv';
$rawPath = $rawDir . DIRECTORY_SEPARATOR . $baseName . '.json';

$detailCsv = rows_to_csv(build_detail_rows($payload));
$rawJson = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
if ($rawJson === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Failed to encode JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

write_text_file($detailPath, $detailCsv);
write_text_file($rawPath, $rawJson . PHP_EOL);
append_summary_csv($summaryFile, build_summary_header(), build_summary_row($payload));

echo json_encode([
    'ok' => true,
    'savedSummary' => $summaryFile,
    'savedDetail' => $detailPath,
    'savedRaw' => $rawPath,
], JSON_UNESCAPED_UNICODE);

function validate_payload(array $payload): void
{
    if (empty($payload['runId'])) {
        fail(422, 'runId が必要です。');
    }
    if (empty($payload['participantId'])) {
        fail(422, 'participantId が必要です。');
    }
    if (empty($payload['blocks']) || !is_array($payload['blocks'])) {
        fail(422, 'blocks が不正です。');
    }
}

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function ensure_dir(string $path): void
{
    if (is_dir($path)) {
        return;
    }
    if (!mkdir($path, 0700, true) && !is_dir($path)) {
        fail(500, 'Failed to create data directory.');
    }
}

function write_text_file(string $path, string $contents): void
{
    $result = file_put_contents($path, $contents, LOCK_EX);
    if ($result === false) {
        fail(500, 'Failed to write data file.');
    }
}

function build_summary_header(): array
{
    return [
        'saved_at', 'run_id', 'test_code', 'participant_id', 'age', 'sex', 'musical_training',
        'piano_apscore_pct', 'pure_apscore_pct', 'mean_apscore_pct',
        'piano_correct_n', 'pure_correct_n', 'total_trials', 'first_block_audio_type', 'second_block_audio_type',
    ];
}

function build_summary_row(array $payload): array
{
    $demo = is_array($payload['demographics'] ?? null) ? $payload['demographics'] : [];
    $blocks = is_array($payload['blocks'] ?? null) ? $payload['blocks'] : [];
    $byId = [];
    foreach ($blocks as $block) {
        if (is_array($block) && isset($block['blockId'])) {
            $byId[(string) $block['blockId']] = is_array($block['summary'] ?? null) ? $block['summary'] : [];
        }
    }
    $piano = $byId['block1'] ?? [];
    $pure = $byId['block2'] ?? [];
    $pianoPct = (float) ($piano['accPct'] ?? 0);
    $purePct = (float) ($pure['accPct'] ?? 0);
    $meanPct = ($pianoPct + $purePct) / 2;
    $blockOrder = is_array($payload['blockOrder'] ?? null) ? $payload['blockOrder'] : [];

    return [
        (string) ($payload['clientSubmittedAt'] ?? ''),
        (string) ($payload['runId'] ?? ''),
        (string) ($payload['testCode'] ?? ''),
        (string) ($payload['participantId'] ?? ''),
        (string) ($demo['age'] ?? ''),
        (string) ($demo['sex'] ?? ''),
        summarize_instrument_history(is_array($demo['instruments'] ?? null) ? $demo['instruments'] : []),
        number_format($pianoPct, 1, '.', ''),
        number_format($purePct, 1, '.', ''),
        number_format($meanPct, 1, '.', ''),
        (string) ($piano['nCorrect'] ?? ''),
        (string) ($pure['nCorrect'] ?? ''),
        (string) (($payload['summary']['totalTrials'] ?? '')),
        (string) (($blockOrder[0]['audioType'] ?? '')),
        (string) (($blockOrder[1]['audioType'] ?? '')),
    ];
}

function get_overall_ap_score_pct(array $payload): float
{
    $total = 0;
    $correct = 0;
    foreach (($payload['blocks'] ?? []) as $block) {
        if (!is_array($block)) {
            continue;
        }
        $summary = is_array($block['summary'] ?? null) ? $block['summary'] : [];
        $total += (int) ($summary['total'] ?? 0);
        $correct += (int) ($summary['nCorrect'] ?? 0);
    }
    if ($total === 0) {
        return 0.0;
    }
    return ($correct / $total) * 100.0;
}

function build_result_file_stem(array $payload): string
{
    $participantId = (string) ($payload['participantId'] ?? 'unknown');
    $safeParticipantId = preg_replace('/[^A-Za-z0-9_-]/', '_', $participantId) ?: 'unknown';
    $savedAt = (string) ($payload['clientSubmittedAt'] ?? '');
    $savedAt = str_replace([':', '.'], '-', $savedAt);
    if ($savedAt === '') {
        $savedAt = 'unknown-date';
    }
    $scorePart = number_format(get_overall_ap_score_pct($payload), 1, '.', '') . 'pct';
    return $safeParticipantId . '_' . $savedAt . '_APscore' . $scorePart . '_APtest';
}

function summarize_instrument_history(array $instruments): string
{
    $items = [];
    foreach ($instruments as $inst) {
        if (!is_array($inst)) {
            continue;
        }
        $name = (string) ($inst['name'] ?? '');
        $start = (string) ($inst['startAge'] ?? '');
        $end = (string) ($inst['endAge'] ?? '');
        if ($name === '' && $start === '' && $end === '') {
            continue;
        }
        $items[] = ($start !== '' || $end !== '') ? ($name . ':' . $start . '-' . $end) : $name;
    }
    return implode(' | ', $items);
}

function build_detail_rows(array $payload): array
{
    $demo = is_array($payload['demographics'] ?? null) ? $payload['demographics'] : [];
    $training = summarize_instrument_history(is_array($demo['instruments'] ?? null) ? $demo['instruments'] : []);
    $rows = [[
        'saved_at', 'run_id', 'test_code', 'participant_id', 'age', 'sex', 'musical_training',
        'block_id', 'audio_type', 'audio_dir',
        'trial', 'midi', 'file', 'target', 'target_solfege',
        'response', 'response_solfege', 'correct', 'rt_ms', 'no_response',
    ]];

    foreach (($payload['blocks'] ?? []) as $block) {
        if (!is_array($block)) {
            continue;
        }
        foreach (($block['results'] ?? []) as $result) {
            if (!is_array($result)) {
                continue;
            }
            $rows[] = [
                (string) ($payload['clientSubmittedAt'] ?? ''),
                (string) ($payload['runId'] ?? ''),
                (string) ($payload['testCode'] ?? ''),
                (string) ($payload['participantId'] ?? ''),
                (string) ($demo['age'] ?? ''),
                (string) ($demo['sex'] ?? ''),
                $training,
                (string) ($block['blockId'] ?? ''),
                (string) ($block['audioType'] ?? ''),
                (string) ($block['audioDir'] ?? ''),
                (string) ($result['trial'] ?? ''),
                (string) ($result['midi'] ?? ''),
                (string) ($result['file'] ?? ''),
                (string) ($result['target'] ?? ''),
                (string) ($result['target_solfege'] ?? ''),
                (string) ($result['response'] ?? ''),
                (string) ($result['response_solfege'] ?? ''),
                (string) ($result['correct'] ?? ''),
                (string) ($result['rt_ms'] ?? ''),
                (string) ($result['no_response'] ?? ''),
            ];
        }
    }

    return $rows;
}

function rows_to_csv(array $rows): string
{
    $stream = fopen('php://temp', 'r+');
    if ($stream === false) {
        fail(500, 'Failed to open temp stream.');
    }
    foreach ($rows as $row) {
        fputcsv($stream, $row);
    }
    rewind($stream);
    $csv = stream_get_contents($stream);
    fclose($stream);
    if ($csv === false) {
        fail(500, 'Failed to build CSV.');
    }
    return $csv;
}

function append_summary_csv(string $path, array $header, array $row): void
{
    $handle = fopen($path, 'c+');
    if ($handle === false) {
        fail(500, 'Failed to open summary CSV.');
    }
    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        fail(500, 'Failed to lock summary CSV.');
    }

    $stat = fstat($handle);
    if ($stat === false) {
        flock($handle, LOCK_UN);
        fclose($handle);
        fail(500, 'Failed to stat summary CSV.');
    }

    fseek($handle, 0, SEEK_END);
    if (($stat['size'] ?? 0) === 0) {
        fputcsv($handle, $header);
    }
    fputcsv($handle, $row);
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}
