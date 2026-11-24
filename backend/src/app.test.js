import request from "supertest";
import app from "./app.js";
import env from "./config/env.js";
import { describe, expect, it } from "vitest";
describe("GET /api/health", () => {
    it("should return HTTP 200 and status ok", async () => {
        const response = await request(app).get("/api/health");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: "ok" });
    });
    //********** Header test **********
    it("should allow requests from client origin", async () => {
        const response = await request(app)
            .get("/api/health")
            .set("Origin", env.CLIENT_ORIGIN);
        expect(response.headers["access-control-allow-origin"]).toBe(env.CLIENT_ORIGIN);
        expect(response.headers["access-control-allow-credentials"]).toBe("true");
    });
    // preflight simulation
    it("should allow cors preflight request", async () => {
        const response = await request(app)
            .options("/api/health") //preflight request
            .set("Origin", env.CLIENT_ORIGIN)
            .set("access-control-request-methods", "POST");
        expect(response.statusCode).toBe(204);
        expect(response.headers["access-control-allow-origin"]).toBe(env.CLIENT_ORIGIN);
        // checks if cors configuration allows POST method
        expect(response.headers["access-control-allow-methods"]).toContain("POST");
    });
});
