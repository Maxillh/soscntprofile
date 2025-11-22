Hosting the site on GitHub Pages
================================

This project is a static site (HTML/CSS/JS). These are the two quick ways to get
it online using GitHub Pages.

Option 1 — Manual (recommended if you're new)
--------------------------------------------
1. Create a new public repository on GitHub (name it e.g. `soscnt-profile`).
2. From your project folder run:

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

3. In GitHub: go to your repository → Settings → Pages. Under "Source" choose
   branch `main` and folder `/` then Save.
4. Wait a minute. Your site will usually be available at:
   `https://<your-username>.github.io/<repo>/`

Note: if you name your repository exactly `<your-username>.github.io` and publish
from the main branch root, your site will be available at `https://<your-username>.github.io/`.

Option 2 — Use the provided PowerShell helper script
--------------------------------------------------
If you prefer a helper that runs the push steps for you (it will prompt for
the remote URL), run the script included in `scripts/deploy-github-pages.ps1`.

Usage:

```powershell
cd C:\path\to\gunslol-open-source-main\gunslol-open-source-main
.\scripts\deploy-github-pages.ps1
```

The script can optionally create the repo for you using the GitHub CLI (`gh`)
if you answer yes and you have `gh` installed and authenticated.

Common problems
---------------
- 404 on assets: make sure the `assets/` folder and files are committed and the
  file names match exactly (case-sensitive on many hosts).
- Autoplay blocked: modern browsers block autoplay; this site unmutes/plays
  music after the start-screen click to comply with the policy.

Fix the URL you gave me
-----------------------
You gave `https://maxillh.github.io./soscnt-profile/` — note the extra `.` after
`github.io.`. The correct URL will be `https://maxillh.github.io/soscnt-profile/` (no dot before the slash).

If you'd like me to prepare the repo with a small GitHub Action or help you
configure a custom domain, tell me and I'll add the files and instructions.
