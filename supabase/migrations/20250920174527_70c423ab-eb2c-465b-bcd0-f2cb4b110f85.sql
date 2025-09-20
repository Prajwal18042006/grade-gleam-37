-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty')),
  roll_number TEXT,
  employee_id TEXT,
  department TEXT,
  semester INTEGER,
  course TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL UNIQUE,
  course_name TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  semester INTEGER NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create marks table
CREATE TABLE public.marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  internal_marks DECIMAL(5,2) DEFAULT 0,
  external_marks DECIMAL(5,2) DEFAULT 0,
  total_marks DECIMAL(5,2) DEFAULT 0,
  grade TEXT,
  grade_points DECIMAL(3,2),
  faculty_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id, academic_year)
);

-- Enable RLS on marks
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for courses
CREATE POLICY "Everyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

CREATE POLICY "Faculty can manage courses"
  ON public.courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'faculty'
    )
  );

-- RLS Policies for marks
CREATE POLICY "Students can view their own marks"
  ON public.marks FOR SELECT
  USING (
    student_id = auth.uid() OR
    faculty_id = auth.uid()
  );

CREATE POLICY "Faculty can manage marks"
  ON public.marks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'faculty'
    )
  );

-- Function to automatically create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marks_updated_at
  BEFORE UPDATE ON public.marks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample courses
INSERT INTO public.courses (course_code, course_name, credits, semester, department) VALUES
('CS101', 'Programming Fundamentals', 4, 1, 'Computer Science'),
('CS102', 'Data Structures', 4, 2, 'Computer Science'),
('CS201', 'Database Systems', 3, 3, 'Computer Science'),
('CS202', 'Web Development', 3, 4, 'Computer Science'),
('MATH101', 'Calculus I', 3, 1, 'Mathematics'),
('MATH102', 'Linear Algebra', 3, 2, 'Mathematics');