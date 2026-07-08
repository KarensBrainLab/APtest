# PHP Server Deployment Package

This package is for use on a PHP-capable web server.

## Included Folders

- `site_files/`
  Contains:
  - `aptest_php_server.html`
  - `aptest_php_server.js`
  - `audio/`
  - `audio_pure/`

- `api/`
  Contains:
  - `submit.php`

## Default Settings

- language: English
- test mode: piano only

## Recommended Server Layout

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

## Upload Steps

1. Upload everything inside `site_files/` to `public_html/aptest/`
2. Upload `api/submit.php` to `public_html/api/submit.php`
3. Open:

```text
https://YOUR-DOMAIN/aptest/aptest_php_server.html
```

## How to Change Test Mode

Edit the `window.APTEST_CONFIG` block near the bottom of `site_files/aptest_php_server.html`.

```html
<script>
  window.APTEST_CONFIG = {
    testMode: "piano",
  };
</script>
```

Available values:

- `"piano"` = piano only
- `"pure"` = pure tone only
- `"both"` = piano + pure tone

## Duration Display

- `piano` or `pure`: about 5 minutes
- `both`: about 10 minutes

## Output Files on the Server

- `aptest_php_server_summary.csv`
- `participant_logs/ID_Date_APscoreXX.Xpct_APtest.csv`
- `raw_payloads/ID_Date_APscoreXX.Xpct_APtest.json`

## Notes

- `submit.php` saves data outside `public_html` by default.
- If saving fails, first check `public_html/api/submit.php` placement and server write permissions.
- The Japanese solfège label option (ド, レ, ミ...) is only available when the interface language is set to Japanese. It is hidden automatically when English is selected.
