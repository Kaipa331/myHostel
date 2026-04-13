-- MyHostel Database Schema
-- Run this in Supabase SQL Editor to create the database tables

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'landlord', 'admin')),
  phone TEXT,
  bio TEXT,
  university TEXT,
  address TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  admin_approved BOOLEAN DEFAULT FALSE,
  documents JSONB DEFAULT '[]'::jsonb
);

-- Create hostels table
CREATE TABLE IF NOT EXISTS hostels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  university TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  landlord_id UUID REFERENCES profiles(id) NOT NULL,
  landlord_name TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_details JSONB DEFAULT '{}'::jsonb,
  booking_fee INTEGER DEFAULT 0
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hostel_id UUID REFERENCES hostels(id) NOT NULL,
  hostel_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  payment_status TEXT NOT NULL CHECK (payment_status IN ('unpaid', 'partially_paid', 'fully_paid')) DEFAULT 'unpaid',
  amount_paid INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  booking_fee INTEGER DEFAULT 0,
  receipt_image TEXT,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  student_name TEXT NOT NULL,
  landlord_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hostel_id UUID REFERENCES hostels(id) NOT NULL,
  hostel_name TEXT NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  student_name TEXT NOT NULL,
  landlord_id UUID REFERENCES profiles(id) NOT NULL,
  message TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'replied')) DEFAULT 'new',
  reply_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hostel_id UUID REFERENCES hostels(id) NOT NULL,
  hostel_name TEXT NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  student_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_complaint BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'resolved', 'dismissed')) DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_hostels table for wishlist functionality
CREATE TABLE IF NOT EXISTS saved_hostels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  hostel_id UUID REFERENCES hostels(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, hostel_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_hostels ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for hostels
CREATE POLICY "Anyone can view verified hostels" ON hostels FOR SELECT USING (verified = true);
CREATE POLICY "Landlords can view their own hostels" ON hostels FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can insert their own hostels" ON hostels FOR INSERT WITH CHECK (auth.uid() = landlord_id);
CREATE POLICY "Landlords can update their own hostels" ON hostels FOR UPDATE USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can delete their own hostels" ON hostels FOR DELETE USING (auth.uid() = landlord_id);
CREATE POLICY "Admins can view all hostels" ON hostels FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all hostels" ON hostels FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create policies for bookings
CREATE POLICY "Students can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Landlords can view bookings for their hostels" ON bookings FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Students can insert their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Landlords can update bookings for their hostels" ON bookings FOR UPDATE USING (auth.uid() = landlord_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create policies for enquiries
CREATE POLICY "Students can view their own enquiries" ON enquiries FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Landlords can view enquiries for their hostels" ON enquiries FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Students can insert their own enquiries" ON enquiries FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Landlords can update enquiries for their hostels" ON enquiries FOR UPDATE USING (auth.uid() = landlord_id);
CREATE POLICY "Admins can view all enquiries" ON enquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Students can insert their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins can update all reviews" ON reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create policies for saved_hostels
CREATE POLICY "Students can view their own saved hostels" ON saved_hostels FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert their own saved hostels" ON saved_hostels FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can delete their own saved hostels" ON saved_hostels FOR DELETE USING (auth.uid() = student_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hostels_university ON hostels(university);
CREATE INDEX IF NOT EXISTS idx_hostels_verified ON hostels(verified);
CREATE INDEX IF NOT EXISTS idx_hostels_landlord_id ON hostels(landlord_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_landlord_id ON bookings(landlord_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_student_id ON enquiries(student_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_landlord_id ON enquiries(landlord_id);
CREATE INDEX IF NOT EXISTS idx_reviews_hostel_id ON reviews(hostel_id);
CREATE INDEX IF NOT EXISTS idx_saved_hostels_student_id ON saved_hostels(student_id);

-- Insert admin user (replace with actual admin email)
INSERT INTO profiles (id, email, name, role, verified, admin_approved)
VALUES ('admin-uuid-placeholder', 'kaipap33@gmail.com', 'Admin User', 'admin', true, true)
ON CONFLICT (id) DO NOTHING;

-- Create function to update hostel ratings
CREATE OR REPLACE FUNCTION update_hostel_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hostels
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews
    WHERE hostel_id = NEW.hostel_id AND status = 'resolved'
  ),
  reviews_count = (
    SELECT COUNT(*)
    FROM reviews
    WHERE hostel_id = NEW.hostel_id AND status = 'resolved'
  )
  WHERE id = NEW.hostel_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
CREATE TRIGGER update_hostel_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_hostel_rating();