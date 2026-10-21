import z from "zod";

export const registerSchema = z.object({
    email: z.email({ error: "Invalid e-mail address." }).max(254, { error: "Email must not exceed 254 characters."}),
    name: z.string().trim().min(1, { error: "Name is required." }).max(100, { error: "Name must not exceed 100 characters."}),
    password: z.string().min(8, { error: "Password must be at least 8 characters." }).max(128, { error: "Password must not exceed 128 characters." })
});

export type RegisterBody = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email({ error: "Invalid e-mail address." }),
    password: z.string().min(1, { error: "Password is required." }).max(128, { error: "Password must not exceed 128 characters."})
});

export type LoginBody = z.infer<typeof loginSchema>;