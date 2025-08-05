# 🤖 WhatsApp Auto Reply Bot (Easy Setup with PM2)

This is a simple WhatsApp Bot that automatically replies to messages using your own WhatsApp account. It runs in the background using **PM2**, so you don’t have to keep the terminal open.

---

## 📦 Requirements

Before you begin, make sure you have:

1. **Node.js** installed  
   👉 Download from: https://nodejs.org

2. **Google Chrome or Chromium** installed  
   👉 Download from: https://www.google.com/chrome/

3. **PM2** installed (we’ll guide you below)

---

## 📥 How to Install

### 🖥 Step 1: Download the Project

1. Click the green **"Code"** button above and choose **"Download ZIP"**.  
2. Extract the folder anywhere on your computer (e.g., Desktop).

---

### 🔧 Step 2: Install Dependencies

1. Open the folder you extracted.
2. In the top address bar, type `cmd` and press Enter — this will open **Command Prompt** in that folder.
3. Type the following and press Enter:

```bash
npm install
```

---

### ⚙️ Step 3: Install PM2

Now install **PM2** globally:

```bash
npm install -g pm2
```

This lets you run your bot in the background.

---

## ▶️ How to Start the Bot

Start the bot using PM2 like this:

```bash
pm2 start index.js --name whatsapp-bot
```

✅ This will:
- Start your bot
- Open a QR code (on first run)
- Keep it running even if the terminal closes

---

### 📲 Connect WhatsApp (Only Once)

1. Open WhatsApp on your phone.
2. Tap **three dots** > **Linked Devices** > **Link a Device**.
3. Scan the QR Code shown in the terminal.

After scanning once, your session will be saved and it won’t ask again (unless you logout or clear data).

---

## 🛠 Common PM2 Commands

| Command | Description |
|--------|-------------|
| `pm2 list` | See running apps |
| `pm2 logs whatsapp-bot` | View live logs |
| `pm2 stop whatsapp-bot` | Stop the bot |
| `pm2 restart whatsapp-bot` | Restart the bot |
| `pm2 delete whatsapp-bot` | Remove it from PM2 |

---

## 💡 What This Bot Does

- Automatically replies to messages
- Simulates typing to look human
- Sends follow-up replies

You can change the replies in `index.js`.

---

## 🛑 How to Stop the Bot

Use this command:

```bash
pm2 stop whatsapp-bot
```

---

## 🙋 Need Help?

If you're stuck or need help, contact:

📧 yash@example.com  
🔗 GitHub: https://github.com/your-username

---