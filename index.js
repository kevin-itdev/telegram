const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const express = require('express');
const app = express();
app.use(express.json());

let channelName = 'Telegram', id = 0, hash = '', session = [], botToken = '';
let prevMsgs = [];
let prevResult = '', result = '';

id = parseInt(process.env.ID);
hash = process.env.HASH;
session = process.env.SESSION;
botToken = process.env.BOT_TOKEN;
const client = new TelegramClient(new StringSession(session), id, hash, { connectionRetries: 5 });



app.get("/", async (req, res) => {
  res.json({ message: "Telegram bot is running!" });
});

app.get("/sendMessage", async (req, res) => {
  
  try {
    await client.connect();
    const dialogs = await client.getDialogs({archived:false});
    if (dialogs[0].title == channelName){
        
        let k = 0;
        const msgs = await client.getMessages(dialogs[0], { limit: 50 });
  
        for (let i = 0; i <= k; i++) {        
          if (msgs[i].className == 'Message' && prevResult == msgs[i].message) {       
  
            prevResult = msgs[0].message;
            break;
          }
          k++;//New messages received
        }
        if (k == 0) { return; }

        for (let i = 0; i <= k - 1; i++) {
          if (msgs[i].className != 'Message')
            continue;
    
          result = `{${msgs[i].message}}`;
          console.log(new Date().toLocaleString(),` ---- ${dialogs[0].title}:\n`,result,"\n");
      }
    }

    await client.sendMessage("me", { message: "Hello from Vercel!" });
    res.json({ success: true, message: "Message sent!" });
  
  
  } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

export default app;
