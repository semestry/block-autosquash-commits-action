import * as core from "@actions/core";
import PullRequestChecker from "./pullRequestChecker.js";

async function run() {
    try {
        await new PullRequestChecker(
            core.getInput("repo-token", { required: true })
        ).process();
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
