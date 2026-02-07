# 🏫 International School Management System

A comprehensive school management system built with Next.js, featuring student, teacher, parent, and administrative management capabilities.


## 🌟 Features

- **Student Management** - Track student information, grades, and attendance
- **Teacher Management** - Manage teacher profiles, subjects, and schedules
- **Parent Portal** - Parent access to student information
- **Class & Grade Management** - Organize classes and academic levels
- **Attendance Tracking** - Monitor student attendance for each lesson
- **Exam & Assignment System** - Create and track exams and assignments
- **Events & Announcements** - School-wide communication system
- **Interactive Calendar** - View schedules and important dates
- **Responsive Design** - Works seamlessly on all devices

## 🚀 Live Demo

**[View Live Demo](https://international-school-two.vercel.app/)** 🔗

## 📸 Screenshots

### Admin Dashboard
![Admin Dashboard](./public/screenshots/admin_dashboard.png)

### Teacher Dashboard
![Teacher Dashboard](./public/screenshots/teacher_dashboard.png)

### Teacher Page
![Teacher](./public/screenshots/teacher_page.png)

### Student Form
![Studen Form](./public/screenshots/create_student_form.png)

### Announcements List
![Announcements](./public/screenshots/announcements_list_page.png)


### Sign In
![Sign In](./public/screenshots/sign_in.png)

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL (Prisma ORM)
- **Authentication:** Clerk
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React Icons
- **Charts:** Recharts
- **Calendar:** React Big Calendar
- **Image Upload:** Cloudinary
- **Deployment:** Vercel + Render (Database)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account (for authentication)
- Cloudinary account (for image uploads)

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/international-school.git
cd international-school
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/school_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_publishable_key"
CLERK_SECRET_KEY="your_secret_key"

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

4. **Setup database**
```bash
# Run migrations
npx prisma migrate dev

# Seed demo data
npm run seed
```

5. **Run the development server**
```bash
npm run dev
```
