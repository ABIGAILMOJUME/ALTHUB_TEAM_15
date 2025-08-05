# 🚀 Althub Team 15 Repository 

This repository is a **collaborative workspace** for the Althub 15 team. It enforces **industry-standard Git workflows**, **code quality practices**, and **continuous integration**.

---

## Repository Usage Overview

| Branch Name     | Purpose                          |
|-----------------|----------------------------------|
| `main`          | Production-ready frontend code   |
| `dev-frontend`  | Development branch for frontend  |
| `main-backend`  | Production-ready backend code    |
| `dev-backend`   | Development branch for backend   |

###  What This Repo Enforces:
- Pull Request (PR) **must be created** for any code changes.
- **Peer review is mandatory** before merging.
- Code is merged to `main` **only via PRs**.
- CI/CD Pipeline (GitHub Actions or other) runs for every PR (In progress).
- Protected branches to prevent direct push to `main` and `dev`.

---

## Repository Setup

```bash
git clone https://github.com/ABIGAILMOJUME/ALTHUB_TEAM_15.git
cd <your_project_name>
```

>  All changes must be pushed to a feature branch and go through a Pull Request.

> Use Conventional Commits where possible: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`


### Pull Request Requirements

-   PR title should be descriptive.
    
-   Assign at least **1 reviewer**.
    
-   PR must pass all **CI checks**.
    
-   Link to related issue if applicable.
    
-   Wait for approval before merging.

### Merge to `dev`

Only after PR approval and passing CI/CD checks.

> `main` should only receive changes from `dev` after testing & staging.


## Project Overview - React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template]
(https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Branch Protection Rules

To enforce workflow integrity:

-   ✅ **Direct push to `main` and `dev` is disabled**
    
-   ✅ **PR approval required (at least 1 reviewer)**
    
-   ✅ **Status checks must pass before merging**
    
-   ✅ **Linear history enforced (no merge commits)**


## Commit Standards

Follow Conventional Commit Messages:

```bash
feat: add user login functionality
fix: resolve crash on product page
docs: update README with setup instructions
```

## Housekeeping

-   Delete merged branches after PR is merged.
    
-   Rebase (not merge) if conflicts exist in your branch:
    
	```bash
	 git fetch origin
	 git rebase origin/dev` # this is an example 
	```

## Need Help?

Create a GitHub Issue or reach out to your teammates on [WhatsApp].


> Happy bug free coding
