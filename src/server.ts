import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { authenticateGenerator } from "./socket/auth";
import connectionManager from "./socket/connectionManager";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const app = next({ dev, hostname, port, turbo: !dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.use(authenticateGenerator(io));

  io.on("connection", connectionManager(io));

  httpServer
    .once("error", (err: unknown) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () =>
      console.log(
        `> Server listening at http://${hostname}:${port} as ${
          dev ? "development" : process.env.NODE_ENV
        }`
      )
    );
});
