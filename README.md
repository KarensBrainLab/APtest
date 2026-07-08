# APtest Git Package

This directory is the git-ready version of the completed `UpLoad_set` package.

## Structure

```text
UpLoad_set_forGit/
  APtest/
    Local_NoServer/
    Server_PHP/
```

## Notes

- `APtest/` contains the actual release package files.
- Local macOS metadata files are excluded with `.gitignore`.
- PHP server output data is excluded from version control.

## Suggested Next Step

Initialize git in this directory:

```bash
git init
git add .
git commit -m "Initial import of APtest git package"
```
