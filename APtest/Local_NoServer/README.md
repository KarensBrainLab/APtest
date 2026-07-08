# Local Browser Download Package

This package is for local use on a researcher-managed computer.

## Included Files

- `aptest_local.html`
- `aptest_local.js`
- `audio/`
- `audio_pure/`

## Default Settings

- language: English
- test mode: piano only

## How to Run

1. Open `aptest_local.html` in Chrome or Edge.
2. Complete the task normally.
3. At the end of the task, the browser downloads:
   - `ID_Date_APscoreXX.Xpct_APtest.csv`
   - `ID_Date_APscoreXX.Xpct_APtest.json`
   - `ID_Date_APscoreXX.Xpct_APtest.pdf`

## How to Change Test Mode

Edit the `window.APTEST_CONFIG` block near the bottom of `aptest_local.html`.

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

## Browser Notes

- Allow multiple automatic downloads if the browser asks.
- Download location follows the browser's own download settings.

## Notes

- The Japanese solfège label option (ド, レ, ミ...) is only available when the interface language is set to Japanese. It is hidden automatically when English is selected.
