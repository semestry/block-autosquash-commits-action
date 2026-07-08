import { getInput, setFailed } from "@actions/core";

import PullRequestChecker from "./pullRequestChecker.js";

async function run() {
    try {
        await new PullRequestChecker(
            getInput("repo-token", { required: true })
        ).process();
    } catch (error) {
        setFailed(error.message);
    }
}

run();
