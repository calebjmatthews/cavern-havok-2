import { serve } from "bun";

import Universe from "./models/universe";
import index from "@client/index.html";

const universe = new Universe();

const server = serve({
  fetch(req, server) {
		// upgrade the request to a WebSocket
		if (server.upgrade(req)) {
			return; // do not return a Response
		}
		return new Response('Upgrade failed', {status: 500});
	},
	websocket: {
    message(ws, message) { // a message is received
      universe.communicator.receiveMessage({ ws, message });
    },
		open(ws) {}, // a socket is opened
		close(ws, code, message) {},
		drain(ws) {}, // the socket is ready to receive more data
  },
  routes: {
    "/public/*": (req) => new Response(Bun.file(`.${new URL(req.url).pathname}`)),
    // Serve index.html for all unmatched routes.
    "/*": index
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);