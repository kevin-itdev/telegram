const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const express = require('express');
const input = require('input');
const app = express();
app.use(express.json());

let channelName = 'Telegram', id = 0, hash = '', session = [];
let dialogs = [], prevMsgs = [], msgs = [];
let prevResult = '', result = '', blocked = false;

id = parseInt(process.env.ID);
hash = process.env.HASH;
session = new StringSession(process.env.SESSION);


const client = new TelegramClient(new StringSession(session), id, hash, {
  connectionRetries: 5,
});

app.get("/", async (req, res) => {
  res.json({ message: "Telegram bot is running!" });
});

app.get("/sendMessage", async (req, res) => {
  try {
    await client.connect();
    await client.sendMessage("me", { message: "Hello from Vercel!" });
    res.json({ success: true, message: "Message sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
