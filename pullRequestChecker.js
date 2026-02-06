import * as github from "@actions/github";
import * as core from "@actions/core";

class PullRequestChecker {
    constructor(repoToken) {
        this.client = github.getOctokit(repoToken);
    }

    async process() {
        const commits = await this.client.rest.pulls.listCommits({
            ...github.context.repo,
            pull_number: github.context.issue.number,
        });

        core.debug(`${commits.data.length} commit(s) in the pull request`);

        let blockedCommits = 0;
        for (const commit of commits.data) {
            const isAutosquash = commit.commit.message.startsWith("fixup!") || commit.commit.message.startsWith("squash!");

            if (isAutosquash) {
                core.error(`Commit ${commit.sha} is an autosquash commit: ${commit.url}`);

                blockedCommits++;
            }
        }

        if (blockedCommits) {
            throw Error(`${blockedCommits} commit(s) need to be squashed`);
        }
    }
}

module.exports = PullRequestChecker;
