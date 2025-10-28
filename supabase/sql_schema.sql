-- =========================================
-- Fix User Auto-Creation Trigger
-- Run this in Supabase SQL Editor
-- =========================================

-- 1. First, let's check if the trigger exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        RAISE NOTICE 'Trigger does not exist - will create it';
    ELSE
        RAISE NOTICE 'Trigger exists - will recreate it';
    END IF;
END $$;

-- 2. Drop existing trigger and function (if they exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.users (id, email, name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$;

-- 4. Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 5. Now let's manually create users for anyone who has already signed in
-- This will populate public.users from existing auth.users
INSERT INTO public.users (id, email, name, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name',
        split_part(email, '@', 1)
    ) as name,
    created_at,
    NOW() as updated_at
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    updated_at = NOW();

-- 6. Verify the results
SELECT 
    'Trigger created successfully' as status,
    (SELECT COUNT(*) FROM public.users) as total_users_in_public_table,
    (SELECT COUNT(*) FROM auth.users) as total_users_in_auth_table;

-- =========================================
-- DONE! ✅
-- =========================================
-- What this does:
-- 1. Creates/recreates the trigger function
-- 2. Creates the trigger on auth.users
-- 3. Backfills public.users with any existing auth.users
-- 4. Shows verification counts
-- =========================================
