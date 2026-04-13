# MyHostel - Student Accommodation Platform

A comprehensive student accommodation booking platform for Malawian universities, connecting students with verified landlords and administrators.

## Features

- **Student Dashboard**: Browse hostels, make bookings, save favorites, leave reviews
- **Landlord Dashboard**: List properties, manage bookings, respond to enquiries
- **Admin Dashboard**: Approve landlords, moderate content, resolve complaints
- **Real-time Updates**: Live notifications for bookings, enquiries, and reviews
- **Secure Payments**: Receipt upload and verification system
- **Multi-University Support**: 16 Malawian universities supported

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Deployment**: Vercel

## Setup Instructions

### 1. Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Database Setup

Run the SQL schema in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL to create all tables, policies, and functions

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm run preview
```

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles (students, landlords, admins)
- `hostels` - Property listings
- `bookings` - Reservation records
- `enquiries` - Student-landlord messages
- `reviews` - Ratings and complaints
- `saved_hostels` - Student favorites

## User Roles

### Students
- Browse and search hostels
- Save favorite properties
- Make bookings with payment tracking
- Leave reviews and file complaints
- View booking history

### Landlords
- List and manage properties
- Approve/decline booking requests
- Respond to student enquiries
- Track revenue and occupancy
- Requires admin approval to list properties

### Admins
- Approve new landlord registrations
- Moderate content and resolve complaints
- View system analytics
- Send messages to users

## Key Features Implemented

✅ **Student Booking Flow**: Complete booking process with payment verification
✅ **Landlord Approval System**: Admin approval workflow for new landlords
✅ **Booking Management**: Landlords can accept/decline reservations
✅ **Saved Hostels**: Wishlist functionality for students
✅ **Real-time Updates**: Live data synchronization
✅ **Review System**: Ratings and complaint management
✅ **Document Verification**: File upload for landlord approval
✅ **Search & Filters**: University and location-based filtering
✅ **Responsive Design**: Mobile-first approach
✅ **Dark Mode**: Theme switching support

## Deployment

The app is configured for Vercel deployment with SPA routing. Update `vercel.json` if needed for your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
