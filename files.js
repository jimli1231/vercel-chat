/** @satisfies {import('@webcontainer/api').FileSystemTree} */
export const files = {
  'index.js': {
    file: {
      contents: `
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const port = 3111;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(port, () => {
  console.log(\`Chat app is live at http://localhost:\${port}\`);
});
      `,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "chat-room-app",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest",
    "socket.io": "latest"
  },
  "scripts": {
    "start": "nodemon index.js"
  }
}
      `,
    },
  },
  'index.html': {
    file: {
      contents: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebContainers Chat Room</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding-bottom: 3rem; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages > li { padding: 0.5rem 1rem; }
      #messages > li:nth-child(odd) { background: #efefef; }
      #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
      #input:focus { outline: none; }
      #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form id="form" action="">
      <input id="input" autocomplete="off" /><button>Send</button>
    </form>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();

      const form = document.getElementById('form');
      const input = document.getElementById('input');
      const messages = document.getElementById('messages');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });

      socket.on('chat message', (msg) => {
        const item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });
    </script>
  </body>
</html>
      `,
    },
  },
};