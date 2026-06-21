# ApplyLog 💼

ApplyLog is a professional, modern job application tracker designed to help job seekers organize their application pipelines, track interview stages, visualize success metrics, and never miss an upcoming interview.

---

## Key Features 🚀

- **Secure Authentication**: Register and log in securely. Uses **NextAuth.js (Auth.js v5)** to ensure each user can only view and manage their own application data.
- **Urgent Notification Board**: A notice board automatically surfaces upcoming interviews, color-coded by urgency (Red for Today/Tomorrow, Amber for within 3 days, Blue for others).
- **Active Job Pipeline**: Manage applications in active statuses (`Processing`, `Offered`, `Accepted`) in Grid or List view.
- **Visual Analytics**: Interactive metrics cards and charts powered by **Recharts** displaying success rates, offer conversions, interview trends, and applications logged by month.
- **Archived History**: View `Rejected` and `Withdrawn` application timelines with encouraging empty-state messages.
- **Modular Details Modal**: Seamless transitions between viewing application details, editing parameters, uploading receipts/resumes, and deleting logs with a confirmation dialog.
- **Supabase Cloud Storage**: Drag-and-drop file uploader that saves application documents, PDFs, or confirmation screenshots directly to secure Supabase storage buckets with real-time thumbnail previews.
- **Server-Side Pagination**: Dashboard features smooth database-level offset pagination and custom page-size limit options.

---

## Tech Stack 🛠️

- **Framework**: Next.js (React 19, App Router)
- **Database ORM**: Prisma (with PostgreSQL)
- **Authentication**: Auth.js v5 (NextAuth)
- **Visual Charts**: Recharts
- **Cloud Storage**: Supabase Storage
- **Styling**: Tailwind CSS v4 & Lucide Icons

---

## Installation & Setup ⚙️

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of your directory and populate it with your local credentials:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/yourdb"

NEXTAUTH_SECRET="your-long-random-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Supabase Storage Credentials
SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
```

### 3. Setup Supabase Storage

1. Log into your Supabase Dashboard.
2. Navigate to **Storage** and create a bucket named exactly:

```text
job-applications
```

3. Set the bucket access permissions to **Public** so your dashboard can generate and display previews of the uploaded images.

### 4. Push Database Schema

Apply the database migrations and indices locally:

```bash
npx prisma generate
npx prisma db push
```

### 5. Launch the Development Server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser to view the application.

---

## Project Highlights ✨

### Dashboard Overview

- View all active applications in one place.
- Monitor upcoming interviews through the urgency-based notice board.
- Toggle between Grid and List layouts.
- Navigate paginated records efficiently with customizable page sizes.

### Analytics & Insights

- Application success rate tracking.
- Offer conversion analytics.
- Monthly application activity charts.
- Interview trend visualization.
- Real-time metrics cards powered by Recharts.

### Application Management

- Create, edit, and delete application records.
- Track status progression throughout the hiring process.
- Store notes, interview schedules, and company information.
- Archive rejected or withdrawn applications while preserving history.

### File Storage

- Upload resumes, cover letters, offer letters, screenshots, and supporting documents.
- Secure cloud storage powered by Supabase.
- Drag-and-drop upload experience.
- Instant preview generation for supported file types.

### Security

- Auth.js v5 authentication.
- Protected routes and user-specific data access.
- Secure server-side session handling.
- Database records isolated per authenticated user.

---

## License 📄

This project is intended for educational and portfolio purposes. Feel free to modify and extend it to fit your own job search workflow.