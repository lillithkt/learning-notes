import type { Page } from "./pages";

export const REPO_URL = "https://github.com/lillithkt/learning-notes";

export function getDocsUrl(page: Page) {
    return `${REPO_URL}/blob/main/${page.sourcePath}`;
}

export function getCommitUrl(page: Page) {
    return `${REPO_URL}/commits/main/${page.sourcePath}`;
}