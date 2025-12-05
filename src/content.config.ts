import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog collection is hidden (moved to _blog)
// const blog = defineCollection({
// 	loader: glob({ base: './src/content/_blog', pattern: '**/*.{md,mdx}' }),
// 	schema: ({ image }) =>
// 		z.object({
// 			title: z.string(),
// 			description: z.string(),
// 			pubDate: z.coerce.date(),
// 			updatedDate: z.coerce.date().optional(),
// 			heroImage: image().optional(),
// 		}),
// });

const investment = defineCollection({
	// Load Markdown and MDX files in the `src/content/investment/` directory.
	loader: glob({ base: './src/content/investment', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			category: z.enum(['dividend', 'els', 'market-analysis', 'strategy']).optional(),
			tags: z.array(z.string()).optional(),
		}),
});

export const collections = { investment };
