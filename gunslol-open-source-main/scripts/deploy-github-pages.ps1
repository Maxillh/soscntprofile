<#
Simple PowerShell helper to initialize a git repo (if needed), add a remote
and push the current folder to the remote `main` branch so you can enable
GitHub Pages from the repo settings.

Usage: run this script from the project root in PowerShell:
  cd C:\path\to\gunslol-open-source-main\gunslol-open-source-main
  .\scripts\deploy-github-pages.ps1

The script will prompt for a remote repo URL (HTTPS or SSH). If you have
the GitHub CLI (`gh`) and want the script to create the repo for you, answer
"y" when prompted and the script will attempt `gh repo create` (you must be
logged in with `gh auth login`).

Important: this script only runs local git commands. It cannot enable GitHub
Pages for you — you must enable Pages in the repository Settings on github.com
or let GitHub automatically publish from `main` root (Settings → Pages).
#>

function Abort($msg) {
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Abort "git is not installed or not in PATH. Install git and re-run."
}

Write-Host "Deploy helper — push this folder to GitHub and prepare for Pages" -ForegroundColor Cyan

$cwd = Get-Location
Write-Host "Project folder: $cwd"

$useGh = Read-Host "Do you want me to try creating the GitHub repo for you (requires 'gh' and login)? (y/N)"
if ($useGh -match '^[Yy]') {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        Write-Host "gh (GitHub CLI) not found. We'll fall back to manual remote setup." -ForegroundColor Yellow
        $useGh = 'n'
    }
}

if (-not (Test-Path '.git')) {
    Write-Host "No git repo detected — running 'git init'" -ForegroundColor Yellow
    git init
}

if ($useGh -match '^[Yy]') {
    $repoName = Read-Host "Enter the GitHub repo name to create (eg. soscnt-profile)"
    if (-not $repoName) { Abort "No repo name provided" }
    Write-Host "Creating repository via 'gh'..." -ForegroundColor Cyan
    gh repo create $repoName --public --source=. --remote=origin --push || Abort "'gh repo create' failed. Make sure you're logged in with 'gh auth login'"
    $remoteUrl = git remote get-url origin
    Write-Host "Repository created and pushed to $remoteUrl" -ForegroundColor Green
} else {
    $remoteUrl = Read-Host "Enter your Git remote URL (HTTPS or SSH). Example: https://github.com/username/repo.git"
    if (-not $remoteUrl) { Abort "No remote URL provided" }
    # configure remote
    try {
        git remote get-url origin > $null 2>&1
        Write-Host "Remote 'origin' already exists. Updating it to the URL you provided..." -ForegroundColor Yellow
        git remote set-url origin $remoteUrl
    } catch {
        git remote add origin $remoteUrl
    }
}

# Add and commit
git add --all
try {
    git commit -m "Deploy site: initial commit" --allow-empty
} catch {
    Write-Host "Nothing to commit or commit failed; continuing." -ForegroundColor Yellow
}

Write-Host "Pushing to origin/main..." -ForegroundColor Cyan
git branch -M main
git push -u origin main --force

Write-Host "Push complete. Next steps:" -ForegroundColor Green
Write-Host "1) Open your repository on GitHub: $remoteUrl" -ForegroundColor White
Write-Host "2) Go to Settings → Pages and set Source to branch 'main' and folder '/' then Save." -ForegroundColor White
Write-Host "3) Wait ~1 minute and visit https://<your-username>.github.io/<repo>/ (note: remove any stray '.' after github.io)" -ForegroundColor White

Write-Host "If you want, I can also add a small workflow to auto-deploy or help you configure a custom domain." -ForegroundColor Cyan
