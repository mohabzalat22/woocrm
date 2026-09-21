import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a workspace name.")
    .max(80, "Workspace names must be 80 characters or fewer."),
});

export type CreateWorkspaceFormInput = z.infer<typeof CreateWorkspaceSchema>;
