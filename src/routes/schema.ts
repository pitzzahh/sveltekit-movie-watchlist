import { z } from 'zod';

export const deleteSchema = z.object({
    movieId: z.string()
});

export type FormSchema = typeof deleteSchema;
