const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const app = express();
app.use(express.json());

const botToken = process.env.BOT_TOKEN; 
const targetGroupId = parseInt(process.env.GROUP_ID);



app.post("/webhook", async (req, res) => {
  try {
    const update = req.body;
    console.log("Webhook received:", update);

    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      console.log(`Message from ${chatId}: ${text}`);

      if (chatId === targetGroupId) {
        await sendMessage(chatId, "Hello! I received your message.");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.sendStatus(500);
  }
});



async function sendMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text }),
  });

  const result = await response.json();
  console.log("Message sent:", result);
}

export default app;
