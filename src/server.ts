import express, { Request, Response } from "express";
import { createServer } from "http";

const app = express();
app.use(express.static("views"));
const port = 8000;
const httpServer = createServer(app);
app.get("/", (req: Request, res: Response) => {
    res.render("index.html");
  });

httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });