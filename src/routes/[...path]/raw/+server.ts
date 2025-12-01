import { pages } from "$lib/pages";
import { error, text, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
    const { path } = params
    const slug = "/" + path
    const page = pages.get(slug)
    if (!page) {
        throw error(404, 'Page not found')
    }
    return text(page.rawContent)
}