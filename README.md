# Block Autosquash Commits Action

[![CI](https://github.com/semestry/block-autosquash-commits-action/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/semestry/block-autosquash-commits-action/actions/workflows/ci.yml)
[![CodeQL](https://github.com/semestry/block-autosquash-commits-action/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/semestry/block-autosquash-commits-action/actions/workflows/codeql-analysis.yml)


A Github Action to prevent merging pull requests containing [autosquash](https://git-scm.com/docs/git-rebase#git-rebase---autosquash) commit messages.

## How it works

If any commit message in the pull request starts with `fixup!` or `squash!` the check status will be set to `error`.

>⚠️ GitHub's API only returns the first 250 commits of a PR so if you're working on a really large PR your fixup commits might not be detected.

## Usage

```yaml
on: pull_request

name: Pull Requests

jobs:
  message-check:
    name: Block Autosquash Commits

    runs-on: ubuntu-latest

    steps:
      - name: Block Autosquash Commits
        uses: semestry/block-autosquash-commits-action@<full-commit-sha> # v2.2.0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

You'll also need to add a [required status check](https://help.github.com/en/articles/enabling-required-status-checks) rule for your action to block merging if it detects any `fixup!` or `squash!` commits.

### Control Permissions

If your repository is using [control permissions](https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/) you'll need to set `pull-request: read` on either the workflow or the job.

#### Workflow Config

```yaml
on: pull_request

name: Pull Request

permissions:
  pull-requests: read

jobs:
  message-check:
    name: Block Autosquash Commits

    runs-on: ubuntu-latest

    steps:
      - name: Block Autosquash Commits
        uses: semestry/block-autosquash-commits-action@<full-commit-sha> # v2.2.0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Job Config

```yaml
on: pull_request

name: Pull Request

jobs:
  message-check:
    name: Block Autosquash Commits

    runs-on: ubuntu-latest

    permissions:
      pull-requests: read

    steps:
      - name: Block Autosquash Commits
        uses: semestry/block-autosquash-commits-action@<full-commit-sha> # v2.2.0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## Development

Unlike the [original repository](https://github.com/xt0rted/block-autosquash-commits-action), which ran as a
[Docker container action](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-docker-container-action),
this is a [JavaScript action](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-javascript-action).
It runs directly on the runner's Node.js and starts up faster because there's no image to build or pull.

### Building

JavaScript actions can't install their dependencies at runtime, so the source (`main.js`) and everything it imports from
`node_modules` are bundled with [`@vercel/ncc`](https://github.com/vercel/ncc) into a single self-contained file,
`dist/index.js`. That file is committed to the repository and is what `action.yml` actually runs.

The bundle is regenerated automatically as a `postinstall` step whenever you run `npm install`, and you can also build
it manually:

```sh
npm run build
```

Because `dist/index.js` is checked in, it must be rebuilt and committed whenever `main.js`, its imports, or the
dependencies change. The [`dist` workflow](.github/workflows/dist.yml) verifies this on every pull request and on
`main` by rebuilding the bundle and failing if the committed `dist/index.js` is out of date.

## Releasing

Releases are cut as annotated tags. To publish a new version:

1. Make sure `dist/index.js` is up to date (`npm run build`) and committed on `main`.
2. Create and push a version tag for the release:

   ```sh
   git tag -a v2.3.0 -m "v2.3.0"
   git push origin v2.3.0
   ```

3. Move the floating major-version tag (`v2`) to the same commit so that consumers pinned to `@v2` pick up the
   release:

   ```sh
   git tag -f -a v2 -m "v2.3.0"
   git push --force origin v2
   ```

> Consumers who pin to a full-length commit SHA are unaffected by the moved `v2` tag and must bump their SHA
> deliberately (see below).

### Pinning as a consumer

For supply-chain safety, pin this action to a specific commit SHA rather than a tag, and keep the human-readable
version in a trailing comment:

```yaml
- name: Block Autosquash Commits
  uses: semestry/block-autosquash-commits-action@<full-commit-sha> # v2.3.0
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```

A tag such as `@v2` can be moved to point at different code, whereas a commit SHA is immutable, so pinning by SHA
guarantees you run exactly the code you reviewed. [Dependabot](https://docs.github.com/en/code-security/dependabot)
understands SHA pins and will raise pull requests to bump both the SHA and the version comment.
