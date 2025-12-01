import { pages } from "$lib/pages";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const { path } = params
    const slug = "/" + path
    const page = pages.get(slug)
    if (!page) {
        throw error(404, 'Page not found')
    }
}