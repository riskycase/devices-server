const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const app = next({ dev, hostname, port, turbo: !dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  new Server(httpServer);

  httpServer
    .once("error", (err: any) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () =>
      console.log(
        `> Server listening at http://localhost:${port} as ${
          dev ? "development" : process.env.NODE_ENV
        }`
      )
    );
});
