# CI & Workflow Notes

The repository contains `.github/workflows/security-ci.yml` which runs lint, tests, build, and uploads artifacts.

Improvements made:
- Updated action pins to v4 to resolve local validator warnings.
- Added `actions/cache` step to speed up `npm ci`.

Next CI improvements to consider:
- Pin specific action SHAs for reproducibility
- Add job matrix for Node versions
- Fail CI on critical vulnerabilities or enforce `npm audit` gating
- Add coverage reports and PR checks
