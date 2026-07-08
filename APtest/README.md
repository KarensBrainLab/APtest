# APtest — Absolute Pitch Test

A browser-based absolute pitch test for research use.  
Two packages are included: one for local use (no server required) and one for PHP server deployment.

## Repository Structure

```
APtest/
  Local_NoServer/   — runs directly in the browser; no server needed
  Server_PHP/       — requires a PHP-capable web server
```

## Packages

### Local_NoServer

Open `aptest_local.html` in Chrome or Edge. At the end of the session the browser automatically downloads:

- `ID_Date_APscoreXX.Xpct_APtest.csv`
- `ID_Date_APscoreXX.Xpct_APtest.json`
- `ID_Date_APscoreXX.Xpct_APtest.pdf`

### Server_PHP

Upload the contents of `Server_PHP/site_files/` to your public web directory and `Server_PHP/api/submit.php` to your API directory. See `Server_PHP/README.md` for the recommended server layout and upload steps.

## Default Settings

Both packages are configured as:

- Language: English
- Test mode: piano only

To change the test mode, edit the `window.APTEST_CONFIG` block near the bottom of the HTML file:

```html
<script>
  window.APTEST_CONFIG = {
    testMode: "piano",  // "piano" | "pure" | "both"
  };
</script>
```

## Notes

- Audio folders are included in each package so each package is self-contained.
- The Japanese solfège label option (ド, レ, ミ...) is only available when the interface language is set to Japanese. It is hidden automatically when English is selected.
- This repository is intended for research use.

## Versioning

This repository uses [semantic versioning](https://semver.org/).  
See the [Releases](../../releases) page on GitHub for tagged versions.
