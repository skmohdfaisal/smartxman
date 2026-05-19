-- Database setup for smartXman

-- Users Table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products Table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  images TEXT[], -- Array of image URLs
  rating NUMERIC(3, 2) DEFAULT 0,
  price_range TEXT,
  affiliate_link TEXT,
  tags TEXT[],
  expert_note TEXT,
  featured BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  asin TEXT,
  brand TEXT,
  source TEXT,
  marketplace TEXT,
  affiliate_tag TEXT,
  affiliate_url TEXT,
  approval_status TEXT DEFAULT 'draft',
  import_source TEXT,
  best_for TEXT,
  who_should_buy TEXT,
  who_should_avoid TEXT,
  pros JSONB,
  cons JSONB,
  alternatives JSONB,
  smart_score NUMERIC,
  value_score NUMERIC,
  setup_score NUMERIC,
  buying_verdict TEXT,
  tested_by_us BOOLEAN DEFAULT false,
  last_price_checked_at TIMESTAMP WITH TIME ZONE,
  price_is_fresh BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product Store Links Table
CREATE TABLE public.product_store_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  store_name TEXT,
  marketplace TEXT,
  asin TEXT,
  affiliate_url TEXT,
  price NUMERIC,
  old_price NUMERIC,
  currency TEXT DEFAULT 'INR',
  availability TEXT,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Amazon Imports Table
CREATE TABLE public.amazon_imports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asin TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  keyword TEXT,
  marketplace TEXT,
  raw_api_data JSONB,
  import_status TEXT DEFAULT 'needs_review',
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blogs Table
CREATE TABLE public.blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  content TEXT NOT NULL,
  category TEXT,
  excerpt TEXT,
  read_time TEXT,
  reference_links JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'published',
  author_id UUID REFERENCES public.users(id),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Wishlist Table
CREATE TABLE public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Comments Table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Check constraint to ensure comment belongs to either a product or a blog, not both
  CHECK (
    (product_id IS NOT NULL AND blog_id IS NULL) OR 
    (blog_id IS NOT NULL AND product_id IS NULL)
  )
);

-- Row Level Security (RLS) setup
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_store_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amazon_imports ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for demonstration)
-- Everyone can read published products, categories, blogs, comments
CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Published products are viewable by everyone." ON public.products FOR SELECT USING (
  approval_status = 'published' OR 
  EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin')
);
CREATE POLICY "Admin can insert products" ON public.products FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin'));
CREATE POLICY "Admin can update products" ON public.products FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin'));
CREATE POLICY "Admin can delete products" ON public.products FOR DELETE USING (EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin'));

CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Blogs are viewable by everyone." ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);

-- Product Store Links are viewable by everyone
CREATE POLICY "Product Store Links viewable by everyone" ON public.product_store_links FOR SELECT USING (true);
CREATE POLICY "Product Store Links admin all" ON public.product_store_links FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin'));

-- Amazon Imports admin only
CREATE POLICY "Amazon imports are admin only" ON public.amazon_imports FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'admin'));

-- Wishlist is private to the user
CREATE POLICY "Users can manage their own wishlist." ON public.wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Contact Submissions Table
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (send a message), only admins can view (if you have admin roles)
CREATE POLICY "Anyone can submit contact forms." ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view contact submissions." ON public.contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
    )
  );

-- Auth Trigger to sync users
-- This function inserts a row into public.users when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, avatar)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
