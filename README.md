### `README.md`

# AI Lead Qualifier & Outreach Micro-App

## 📌 Project Overview
This micro-app captures leads via a public website, scores and classifies them using OpenAI, stores them in a database (Supabase), triggers automation via n8n, and provides a lightweight admin dashboard for review and outreach.

**Core Use Case:**  
A marketing page captures potential customer leads (name, email, company, problem statement). The system:
- Scores intent and fit (High/Medium/Low + 0–100 score).
- Classifies the use case theme.
- Suggests a first outreach email.
- Stores all data and events.
- Notifies Slack or Email via n8n.
- Lets an authenticated admin review leads and send outreach.

---

## 🏗 Architecture Diagram

```

[Website (Lovable)]
↓
[Webhook A (n8n)] → [OpenAI API] → [Database (Supabase)]
↓
Slack / Email Notifications

[Admin Dashboard (Lovable)]
↓
[Webhook B (n8n)] → [OpenAI API] → [Mail Node / Database]

````

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Rohitsurwade2003/26ideas_assignment.git
cd 26ideas_assignment
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your actual keys:

```bash
cp .env.example .env
```

**Example `.env`:**

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
N8N_WEBHOOK_A=your_n8n_webhook_a
N8N_WEBHOOK_B=your_n8n_webhook_b
SLACK_OAUTH_TOKEN=your_slack_oauth_token
PORT=3000
NODE_ENV=development
```

### 4. Run the App

```bash
npm run dev
```

The app should now be running at:

```
http://localhost:5173
```

---

## 🧪 Test Instructions

**Test Lead Submission:**

1. Open the public lead capture page:
   [Live Demo Link](https://26ideas-assignment-rohit.vercel.app/)
2. Fill the form with sample data:

   * Name: `John Doe`
   * Email: `john@example.com`
   * Company: `Example Inc.`
   * Problem Statement: `We need to automate report generation.`
3. Submit and verify the admin dashboard updates.

**Test Admin Dashboard:**

* Login with admin credentials:

  * **Email:** `Admin@gmail.com`
  * **Password:** `Admin@123`
* Filter leads by score/status.
* Click “Send Outreach” and check the automation flow in n8n.

---

## ⚡ n8n Workflows

* **On New Lead**: Triggered when a lead is captured → Classifies lead → Stores in Supabase → Notifies Slack/email.
* **Send Outreach**: Triggered when “Send Outreach” is clicked → Generates outreach via OpenAI → Sends email via Mail Node → Logs status in Supabase.

*(Workflows are available as JSON exports in the repo.)*

---

## 📄 Known Limitations

* Slack integration requires OAuth2 token.
* Company enrichment is mocked (no real API).
* No retry queue for failed outreach.
* Basic admin authentication only.

---

## 📁 Repo Structure

```
.
├── src/                   # Lovable frontend source
├── supabase/             # Database migrations and config
├── .env.example          # Example environment variables
├── README.md             # Project documentation
└── package.json          # Node project config
```

---

## 🌐 Live Demo

[https://26ideas-assignment-rohit.vercel.app/](https://26ideas-assignment-rohit.vercel.app/)

---

## 📜 License

This project is submitted as part of the AI Lead Qualifier & Outreach Micro-App assignment.

```

---

If you want, I can now **give you the exact copy-paste content for README.md and the command to add it directly to your repo** so your submission is fully ready.  

Do you want me to do that?
```
