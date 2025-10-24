-- =========================================
-- ContentGen Database Schema - UPDATED
-- Project: rsleooojhxinbcurczlo
-- =========================================

-- 1. Enable Required Extensions
-- =========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables (if updating)
-- =========================================
-- DROP TABLE IF EXISTS public.content_history CASCADE;
-- DROP TABLE IF EXISTS public.reminders CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;

-- 3. Create Users Table (with generation counts)
-- =========================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    blogs_generated INTEGER DEFAULT 0,
    captions_generated INTEGER DEFAULT 0,
    tweets_generated INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Create Content History Table
-- =========================================
CREATE TABLE IF NOT EXISTS public.content_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('blog', 'caption', 'tweet')),
    input_text TEXT,
    generated_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Create Reminders Table
-- =========================================
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    topic TEXT,
    date DATE,
    time TIME,
    daily BOOLEAN DEFAULT FALSE,
    repeat_days INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Create Indexes for Performance
-- =========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_content_history_user_id ON public.content_history(user_id);
CREATE INDEX IF NOT EXISTS idx_content_history_created_at ON public.content_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_history_type ON public.content_history(type);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON public.reminders(date);

-- 7. Enable Row Level Security (RLS)
-- =========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies (to avoid conflicts)
-- =========================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own content history" ON public.content_history;
DROP POLICY IF EXISTS "Users can insert their own content history" ON public.content_history;
DROP POLICY IF EXISTS "Users can delete their own content history" ON public.content_history;
DROP POLICY IF EXISTS "Users can view their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can insert their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can update their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can delete their own reminders" ON public.reminders;

-- 9. Create RLS Policies for users table
-- =========================================
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE USING (auth.uid() = id);

-- 10. Create RLS Policies for content_history
-- =========================================
CREATE POLICY "Users can view their own content history"
    ON public.content_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content history"
    ON public.content_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content history"
    ON public.content_history FOR DELETE USING (auth.uid() = user_id);

-- 11. Create RLS Policies for reminders
-- =========================================
CREATE POLICY "Users can view their own reminders"
    ON public.reminders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
    ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
    ON public.reminders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
    ON public.reminders FOR DELETE USING (auth.uid() = user_id);

-- 12. Create Function to Auto-create User Profile on Signup
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create Trigger for Auto-creating User Profile
-- =========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. Create Function to Auto-increment Generation Counts
-- =========================================
CREATE OR REPLACE FUNCTION public.increment_generation_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'blog' THEN
        UPDATE public.users 
        SET blogs_generated = blogs_generated + 1, updated_at = NOW() 
        WHERE id = NEW.user_id;
    ELSIF NEW.type = 'caption' THEN
        UPDATE public.users 
        SET captions_generated = captions_generated + 1, updated_at = NOW() 
        WHERE id = NEW.user_id;
    ELSIF NEW.type = 'tweet' THEN
        UPDATE public.users 
        SET tweets_generated = tweets_generated + 1, updated_at = NOW() 
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create Trigger for Auto-incrementing Counts
-- =========================================
DROP TRIGGER IF EXISTS on_content_created ON public.content_history;
CREATE TRIGGER on_content_created
    AFTER INSERT ON public.content_history
    FOR EACH ROW EXECUTE FUNCTION public.increment_generation_count();

-- 16. Grant Permissions
-- =========================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.content_history TO anon, authenticated;
GRANT ALL ON public.reminders TO anon, authenticated;

-- =========================================
-- SETUP COMPLETE! ✅
-- =========================================
-- Tables Created:
--   1. users - User profiles with generation counts
--      - id (UUID, references auth.users)
--      - name, email, avatar_url
--      - blogs_generated, captions_generated, tweets_generated
--      - created_at, updated_at
--
--   2. content_history - Generated content history
--      - id, user_id (FK to users), type, input_text, generated_text
--      - created_at
--
--   3. reminders - User reminders
--      - id, user_id (FK to users), title, topic, date, time
--      - daily, repeat_days, created_at
--
-- Features:
--   ✅ Auto-create user profile on Google/GitHub signup
--   ✅ Auto-increment generation counts on content creation
--   ✅ Row Level Security (RLS) enabled
--   ✅ Users can only see/modify their own data
-- =========================================
