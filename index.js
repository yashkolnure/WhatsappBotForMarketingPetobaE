const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const USER_DATA_FILE = path.join(__dirname, 'userData.json');
const LOG_FILE = path.join(__dirname, 'messageLogs.txt');

async function simulateTyping(chatId) {
  const chat = await client.getChatById(chatId);
  await chat.sendStateTyping();
  const typingDelay = Math.floor(Math.random() * 10000) + 1000; // 1 to 11 seconds
  await delay(typingDelay);
  await chat.clearState();
}

let userData = {};
if (fs.existsSync(USER_DATA_FILE)) {
  userData = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf8'));
}
function saveUserData() {
  fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
}
function logMessage(phone, messageType) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} | ${phone} | ${messageType}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
}

const welcomeMsg = `👋 Hi! Thanks for reaching out.

We create **beautiful, clean digital menu cards** for restaurants & cafes.
🧾 Easy to update anytime with admin access  
📷 Scan & view menu in seconds  
♾️ Lifetime access — no repeat fees

👋 नमस्ते! जुड़ने के लिए धन्यवाद।

हम बनाते हैं **सुंदर और साफ-सुथरे डिजिटल मेन्यू कार्ड** होटल और कैफे के लिए।
🧾 एडमिन एक्सेस के साथ कभी भी मेन्यू अपडेट करें  
📷 स्कैन करके मेन्यू तुरंत देखें  
♾️ लाइफटाइम एक्सेस — कोई बार-बार फीस नहीं

💬 Want to see a quick demo? Just reply “DEMO”`;

const plansMsg = `We offer 2 plans for your digital menu:
🔹 FREE – You set it up yourself  
🔸 PREMIUM – We do everything for you

हम आपके डिजिटल मेनू के लिए 2 प्लान देते हैं:
🔹 फ्री – आप खुद सेटअप करें  
🔸 प्रीमियम – हम सब कुछ बनाएंगे

📽️ Check the demos:
FREE: bit.ly/AveniryaFree  
PREMIUM: bit.ly/AveniryaPremium

👉 Reply with **Free** or **Premium** to choose your option.`;

const freeMsg = `Free Option

Great! 🎉 Here’s how you can set up your FREE digital menu in just a few minutes:
1️⃣ Visit: app.avenirya.com/register  
2️⃣ Fill in your details and complete registration  
3️⃣ Login to your dashboard  
4️⃣ Start adding your menu items one by one  
5️⃣ At the bottom, you’ll find your QR code ready to download instantly ✅

बस कुछ आसान स्टेप्स में अपना डिजिटल मेनू खुद बनाएं:
1️⃣ इस लिंक पर जाएं: app.avenirya.com/register  
2️⃣ सभी डिटेल्स भरें और रजिस्ट्रेशन पूरा करें  
3️⃣ लॉगिन करें  
4️⃣ एक-एक करके अपने मेनू आइटम जोड़ें  
5️⃣ सबसे नीचे आपको तैयार QR कोड मिल जाएगा, जिसे आप डाउनलोड कर सकते हैं ✅

Just start now and reply here if you need any help. 😊
Want to try Premium Menu? Reply with "Premium" !`;

const premiumMsg = `premium option

Want a fully done-for-you Digital Menu with logo & dish photos? Here’s how our Premium plan works –
1️⃣ Send your menu photos (clear & readable)
2️⃣ Share your logo (if you have one)
3️⃣ We’ll professionally upload all items with images
4️⃣ Get your QR code delivered same day
💰 Only ₹249 (one-time)

अगर आप चाहते हैं कि हम पूरा डिजिटल मेनू बनाएँ – लोगो और डिश फोटो के साथ – तो:
1️⃣ मेनू की साफ़ और पढ़ने लायक फोटो भेजें
2️⃣ अपना लोगो भेजें (अगर है)
3️⃣ हम प्रोफेशनल तरीके से सब कुछ अपलोड करेंगे
4️⃣ आपको आज ही QR कोड मिलेगा
💰 सिर्फ ₹249 (एक बार का भुगतान)

Ready to get started? Just reply here! 😊`;

const followUpVideos = ['vid1.mp4', 'vid2.mp4', 'vid3.mp4'];
const followUpMsg = `Get menu like this for your cafe for just ₹249  
Full Admin Access  
Lifetime Fast and easy Menu  

ऐसा मेनू अपनी कैफे के लिए पाएं सिर्फ ₹249 में  
फुल एडमिन एक्सेस के साथ  
लाइफटाइम, फास्ट और आसान मेनू`;

const mediaFolder = path.join(__dirname, 'media');
const paymentQRPath = path.join(mediaFolder, 'pytm.jpg');
let paymentQRMedia = null;
if (fs.existsSync(paymentQRPath)) {
  paymentQRMedia = MessageMedia.fromFilePath(paymentQRPath);
}
const followUpMedia = followUpVideos.map(file => {
  const p = path.join(mediaFolder, file);
  if (fs.existsSync(p)) return MessageMedia.fromFilePath(p);
  return null;
}).filter(Boolean);

const INACTIVITY_MINUTES = 30;
const INACTIVITY_MS = INACTIVITY_MINUTES * 60 * 1000;

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './sessions' }),
  puppeteer: { headless: true }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => {
  console.log('✅ WhatsApp Client is ready');
  startInactivityChecker();
});

client.on('message', async msg => {
  const from = msg.from;
  const userId = from.split('@')[0];
  const text = msg.body.trim().toLowerCase();

  const demoTriggers = ['demo', 'sample'];
  const freeTriggers = ['free', '1', 'fre', 'freemenu', 'free menu', 'free digital menu'];
  const premiumTriggers = ['premium', '249', '2', '249rs', 'premium menu'];

  if (!userData[userId]) {
    userData[userId] = {
      stage: 'welcome_sent',
      lastInteraction: Date.now(),
      followUpSent: false,
    };
    saveUserData();

    await simulateTyping(from);
    await client.sendMessage(from, welcomeMsg);
    logMessage(userId, 'Welcome Message Sent');
    return;
  }

  userData[userId].lastInteraction = Date.now();
  userData[userId].followUpSent = false;
  saveUserData();

  if (demoTriggers.includes(text)) {
    for (const media of followUpMedia) {
      await simulateTyping(from);
      await client.sendMessage(from, media);
    }
    await simulateTyping(from);
    await client.sendMessage(from, followUpMsg);
    logMessage(userId, 'Demo Triggered: Follow-up Media Sent');
    return;
  }

  const stage = userData[userId].stage;

  if (stage === 'welcome_sent') {
    await simulateTyping(from);
    await client.sendMessage(from, plansMsg);
    userData[userId].stage = 'plans_sent';
    logMessage(userId, 'Plans Message Sent');
    saveUserData();
    return;
  }

  if (['plans_sent', 'free_sent', 'premium_sent'].includes(stage)) {
    if (freeTriggers.some(k => text.includes(k))) {
      await simulateTyping(from);
      await client.sendMessage(from, freeMsg);
      userData[userId].stage = 'free_sent';
      logMessage(userId, 'Free Plan Message Sent');
    } else if (premiumTriggers.some(k => text.includes(k))) {
      await simulateTyping(from);
      await client.sendMessage(from, premiumMsg);
      if (paymentQRMedia) {
        await simulateTyping(from);
        await client.sendMessage(from, paymentQRMedia);
      }
      logMessage(userId, 'Premium Plan Message Sent');
      userData[userId].stage = 'premium_sent';
    } else {
      await simulateTyping(from);
      await client.sendMessage(from, `We offer 2 plans for your digital menu:
🔹 FREE – You set it up yourself  
🔸 PREMIUM – We do everything for you

हम आपके डिजिटल मेनू के लिए 2 प्लान देते हैं:
🔹 फ्री – आप खुद सेटअप करें  
🔸 प्रीमियम – हम सब कुछ बनाएंगे

📽️ Check the demos:
FREE: bit.ly/AveniryaFree  
PREMIUM: bit.ly/AveniryaPremium

❓ Please reply with "Free" or "Premium" to choose a plan.`);
      logMessage(userId, 'Unrecognized Plan Keyword');
    }
    saveUserData();
  }
});

function startInactivityChecker() {
  setInterval(async () => {
    const now = Date.now();
    for (const userId in userData) {
      const user = userData[userId];
      if (user.lastInteraction && !user.followUpSent && now - user.lastInteraction > INACTIVITY_MS) {
        const chatId = userId + '@c.us';
        try {
          for (const media of followUpMedia) {
            await simulateTyping(chatId);
            await client.sendMessage(chatId, media);
            await delay(1500);
          }
          await simulateTyping(chatId);
          await client.sendMessage(chatId, followUpMsg);
          logMessage(userId, 'Follow-up Triggered via Inactivity');
          user.followUpSent = true;
          saveUserData();
        } catch (err) {
          console.error(`❌ Error sending follow-up to ${userId}:`, err);
        }
      }
    }
  }, 5 * 60 * 1000);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

client.initialize();
