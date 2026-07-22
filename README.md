# Zhahi Tech — Competition Enrollment Platform

MERN stack site for enrolling in 5 live tech competitions: **Web Designing, Video
Editing, Content Creation, Graphic Design, Debugging** — each with its own dynamic
enrollment form and Razorpay payment.

```
zhahi-tech/
├── client/   → React + Vite + Tailwind + Framer Motion
└── server/   → Node + Express + MongoDB + Razorpay
```

## 1. Backend setup (`/server`)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=your MongoDB Atlas connection string
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

- Get a free MongoDB URI from https://www.mongodb.com/cloud/atlas (create a free
  cluster → Database Access user → Network Access "allow from anywhere" for dev →
  copy the connection string).
- Get Razorpay test keys from https://dashboard.razorpay.com/app/keys (Test Mode).

Run it:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

Server runs on `http://localhost:5000`. Check `http://localhost:5000/api/health`.

## 2. Frontend setup (`/client`)

```bash
cd client
npm install
cp .env.example .env
```

`.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Opens on `http://localhost:5173`.

## 3. How enrollment + payment works

1. Person clicks **Enroll Now** on a competition card → a modal opens with a form
   built specifically for that competition (individual vs. team, language choice
   for Debugging, theme-reveal notice for Content Creation / Graphic Design).
2. On submit, the form is validated (name, 10-digit Indian phone, email, college,
   year — plus team fields where relevant).
3. Frontend calls `POST /api/enrollments` → saved in MongoDB with `paymentStatus:
   "pending"`.
4. Frontend calls `POST /api/payment/order` → backend creates a Razorpay order
   using the **fee stored server-side** (never trusts a client-sent amount).
5. Razorpay Checkout opens. On success, frontend calls `POST /api/payment/verify`
   → backend verifies the signature with HMAC-SHA256 and marks the enrollment
   `"paid"`.
6. Success screen shown to the user.

## 4. Adding / editing a competition

Everything about a competition — title, description, fee, whether it's a team
event, whether it has a theme reveal, language choice, etc. — lives in one file:

```
client/src/data/competitions.js
```

Add a new object there and the card, modal, and form all adapt automatically.
The backend's `Enrollment` model enum (`competitionId`) in
`server/models/Enrollment.js` needs the new id added too, plus the matching
`VALID_COMPETITIONS` set in `server/controllers/enrollmentController.js`.

## 5. Illustrations

The hero and cards use original flat-vector illustrations built in SVG (not
copied from any licensed set), styled after the "storyset" aesthetic you shared —
soft blob backgrounds behind flat icons. If you'd like the exact storyset.com
character illustrations, download them for free (with attribution, per their
license) from https://storyset.com and drop the SVGs into
`client/src/assets/`, then swap them into `Hero.jsx` / `BlobIcon.jsx`.

## 6. Deployment notes

- **Frontend**: deploy `client` to Vercel/Netlify. Set `VITE_API_URL` to your
  live backend URL.
- **Backend**: deploy `server` to Render/Railway. Set the same env vars as
  `.env.example`, plus `CLIENT_URL` to your live frontend URL (for CORS).
- Switch Razorpay from Test Mode keys to Live Mode keys before going live, and
  complete Razorpay's KYC/activation for live payments.
- Consider adding an admin view (a protected route reading `GET
  /api/enrollments`) to see registrations — the endpoint already exists, it
  just isn't wired to any UI yet.

## 7. Tech stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, React Hook Form,
  Axios, React Router (installed, ready if you add more pages), Lucide icons.
- **Backend**: Node.js, Express, Mongoose (MongoDB), Razorpay SDK, dotenv, CORS.
