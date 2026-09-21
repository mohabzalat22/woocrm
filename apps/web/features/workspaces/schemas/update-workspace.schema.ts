import { z } from "zod";

export const UpdateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a workspace name.")
    .max(80, "Workspace names must be 80 characters or fewer."),
});

export type UpdateWorkspaceFormInput = z.infer<typeof UpdateWorkspaceSchema>;
