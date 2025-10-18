import simpleGit from 'simple-git';

const git = simpleGit();

async function getChangedFilesInLastCommit() {
    try {
        // Get the last commit hash
        const log = await git.log({ maxCount: 1 });
        if (!log || !log.latest) {
            throw new Error('No commits found in this repository.');
        }
        const lastCommitHash = log.latest.hash;

        // Get the diff summary for the last commit
        const diffSummary = await git.diffSummary([`${lastCommitHash}^`, lastCommitHash]);
        return diffSummary.files.map(file => ({
            file: file.file,
            changes: file.changes,
            insertions: file.insertions,
            deletions: file.deletions
        }));
    } catch (error) {
        console.error('Error fetching changed files:', error);
        throw error;
    }
}

async function main() {
    try {
        const changedFiles = await getChangedFilesInLastCommit();
        console.log('Changed files in the last commit:', changedFiles);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
