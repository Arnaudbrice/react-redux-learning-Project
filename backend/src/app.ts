// configures express, middlewares and routes
import express from "express";
const app = express();

// Middleware to parse incoming JSON AND Form data  from the http request body

/* sets up the middleware to parse incoming JSON data in the request body. This is necessary for handling POST, PUT, or PATCH requests that send JSON data */
app.use(express.json());

/*sets up the middleware to parse incoming URL-encoded data in the request body */
app.use(
  express.urlencoded({
    extended: true, // allows parsing nested objects and arrays
  }),
);

app.get("/api/health", (_req, res) => {
  return res.status(200).json({ status: "ok" });
});
export default app;
