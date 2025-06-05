import { Server } from "socket.io";
import fs from "fs";
import path from "path";

export default function SocketHandler(req: any, res: any) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  fs.watchFile(path.join(process.cwd(), "freebies.json"), () => {
    const data = fs.readFileSync(path.join(process.cwd(), "freebies.json"), "utf-8");
    io.emit("update", JSON.parse(data));
  });

  res.end();
}
