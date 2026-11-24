import "dotenv/config";
import { z } from "zod";
const envSchema = z.object({
    PORT: z.coerce.number().int().min(1).max(65535), //turn string to integer
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    CLIENT_ORIGIN: z.url(),
});
// validate process.env
// safeParse returns an object that either contains {success: true,data} and data, or contains {success: false,error}
const result = envSchema.safeParse(process.env);
if (!result.success) {
    for (const issue of result.error.issues) {
        console.error(`${issue.path.join(".")}: ${issue.message}`);
    }
    //! avoids running the server with invalid environment variables
    throw new Error("Invalid environment variables");
}
// export the validated environment variables
const env = result.data;
export default env;
