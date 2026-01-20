import { z } from 'zod'

export const scanBodySchema = z.object({
  text: z.string().min(50, 'The extracted text is too short to be a valid resume.').max(100000, 'The resume content is too large.'),
  locale: z.enum(['en', 'es'])
})

export type ScanBody = z.infer<typeof scanBodySchema>

export const scanResponseSchema = z.object({
  score: z.number().min(0).max(100),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  structured: z.object({
    categories: z.array(z.object({
      name: z.string(),
      pros: z.array(z.string()),
      cons: z.array(z.string())
    }))
  })
})

export type ScanResult = z.infer<typeof scanResponseSchema>
