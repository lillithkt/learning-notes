import { z } from 'zod';

// Schema for page metadata
const metadataSchema = z.object({
    title: z.string().min(1, 'Title is required and must not be empty'),
    createdAt: z.iso.datetime(),
    editedAt: z.iso.datetime().optional(),
});

type Metadata = z.infer<typeof metadataSchema>;

interface RawPage {
    metadata: unknown; // Unknown because we need to validate it
    default: typeof import('dummy.svx').default
}
interface Page {
    metadata: Metadata
    content: typeof import('dummy.svx').default
    rawContent: string
    slug: string
    category: string
}

const pagesGlobbed = import.meta.glob<RawPage>(`./notes/**/*.svx`, { eager: true })
const rawContent = import.meta.glob<string>(`./notes/**/*.svx`, { eager: true, query: 'raw', import: 'default' })

const pagesArr: Page[] = Object.entries(pagesGlobbed).map(([path, module]) => {
    const { metadata: rawMetadata, default: content } = module
    const raw = rawContent[path]
    const slug = path.match(/^\.\/notes(.+)\.svx/)?.[1]
    if (!slug) {
        console.error(`Invalid path: ${path}`)
        return null
    }
    
    // Validate metadata
    const validationResult = metadataSchema.safeParse(rawMetadata);
    if (!validationResult.success) {
        console.error(`Invalid metadata for ${path}:`, validationResult.error.format());
        return null;
    }
    
    const metadata = validationResult.data;
    
    // Extract category from path (e.g., /rust/struct-impl -> rust)
    const category = slug.split('/').filter(Boolean)[0] || 'general'
    
    return {
        metadata,
        content,
        slug,
        category,
        rawContent: raw
    }
}).filter((page): page is Page => page !== null)

// Group pages by category
export const pagesByCategory = pagesArr.reduce((acc, page) => {
    if (!acc[page.category]) {
        acc[page.category] = []
    }
    acc[page.category].push(page)
    return acc
}, {} as Record<string, Page[]>)

// Create a map for quick lookup
export const pages = new Map<string, Page>(pagesArr.map(p => [p.slug, p]))

export const allPages = pagesArr
