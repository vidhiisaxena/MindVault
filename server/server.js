require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const cron = require("node-cron");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const PORT = process.env.PORT || 3001;

// Read the stored number before sending message
function getWhatsAppNumber() {
  try {
    return fs.readFileSync("whatsappNumber.txt", "utf-8").trim();
  } catch (err) {
    return null;
  }
}

cron.schedule("0 */6 * * *", async () => {
  const number = getWhatsAppNumber();
  if (!number) return console.log("❌ No WhatsApp number subscribed yet");

  try {
    const response = await client.messages.create({
      body: "📚 Hey! Time for your quiz and flashcards!",
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: `whatsapp:${number}`,
    });

    console.log("✅ Reminder sent");
  } catch (err) {
    console.error("❌ Failed to send scheduled WhatsApp message via Twilio:", err.message);
  }
});

// Route to send WhatsApp message
app.post('/send-whatsapp', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).send({ success: false, error: "Missing 'to' or 'message'" });
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', 
      to: `whatsapp:${to}`,
    });

    fs.writeFileSync("whatsappNumber.txt", to);

    res.status(200).send({ success: true, sid: response.sid });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});