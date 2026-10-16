# PHP server deployment

## Requirements

A web server able to serve HTML/JavaScript/WAV files and execute PHP, with a **writable data directory**. HTTPS is strongly recommended for participant data collection. Server administration access is needed to configure file permissions and storage.

## Example layout

```text
/home/account-name/
  public_html/
    aptest/
      aptest_php_server.html
      aptest_php_server.js
      audio/
      audio_pure/
    api/
      submit.php
  aptest_data/
    participant_logs/
    raw_payloads/
    aptest_php_server_summary.csv
```

The last three output paths are created as data arrive, provided PHP has permission to write to `aptest_data/`. **Keep `aptest_data/` outside `public_html/`** to avoid exposing participant records.

## Install

1. Upload **the contents** of `APtest/Server_PHP/site_files/` into `public_html/aptest/`, including both audio directories.
2. Upload `APtest/Server_PHP/api/submit.php` into `public_html/api/submit.php`.
3. In `aptest_php_server.html`, check `window.API_SUBMIT_PATH = "/api/submit.php";`. If the API is hosted elsewhere, change this to the actual same-origin endpoint.
4. Check the data path: `submit.php` uses environment variable **`APTEST_DATA_DIR`** when set; otherwise it uses the `aptest_data` directory **two levels above** the API directory (`dirname(__DIR__, 2)`). In the example layout this is `/home/account-name/aptest_data`.
5. Ensure the PHP process can create/write the data directory and its subfolders. Do **not** make data publicly downloadable.
6. Open `https://YOUR-DOMAIN/aptest/aptest_php_server.html` and complete a **test submission**.
7. Confirm creation of `aptest_php_server_summary.csv`, `participant_logs/*.csv`, and `raw_payloads/*.json` under the data directory. Remove test records before collecting real data.

## Choose the protocol

In `site_files/aptest_php_server.html`, edit `window.APTEST_CONFIG` to `testMode: "both"` for the full 120-trial two-timbre protocol. The distributed default is `"piano"` (60 trials); `"pure"` is also supported.

## Troubleshooting and privacy

If the page loads but submission fails, verify the API URL, PHP execution, directory permissions, and PHP error logs. `submit.php` expects a JSON POST containing `runId`, `participantId`, and `blocks`. Check browser developer tools for HTTP errors. Protect participant data with appropriate access controls, retention policies, and institutional ethics procedures. Do not expose the raw payload directory on the public web. **The sample endpoint does not implement user authentication or rate limiting**; consider appropriate protection before internet-wide deployment.

See [DATA_FORMAT.md](DATA_FORMAT.md) for the output structure.
