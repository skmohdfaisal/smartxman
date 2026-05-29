import { ArrowLeft, Clock, Calendar, ChevronRight, Bookmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getBlogBySlug } from "@/lib/blogs-actions";
import { ShareButton } from "@/components/ShareButton";
import { Metadata } from "next";


// Basic markdown to styled JSX converter for robust rendering without extra libraries
function renderMarkdownToJSX(content: string) {
  if (!content) return null;

  const lines = content.split("\n");
  let inList = false;
  const listItems: string[] = [];
  const renderedElements: React.JSX.Element[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`ul-${key}`} className="list-disc pl-6 my-6 space-y-2.5 text-slate-700 dark:text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      listItems.length = 0;
      inList = false;
    }
  };

  const parseInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-brand-600 dark:text-brand-400">$1</code>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Handle Headers
    if (trimmed.startsWith("# ")) {
      flushList(index);
      renderedElements.push(
        <h1 key={index} className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight leading-tight">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(index);
      renderedElements.push(
        <h2 key={index} className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList(index);
      renderedElements.push(
        <h3 key={index} className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
    }
    // Handle List Items
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(trimmed.slice(2));
    } else if (trimmed.match(/^\d+\.\s/)) {
      flushList(index);
      // Simple ordered lists can be grouped as standard paragraphs or individual blocks
      const text = trimmed.replace(/^\d+\.\s/, "");
      renderedElements.push(
        <div key={index} className="flex gap-3 my-4">
          <span className="font-bold text-brand-600 dark:text-brand-400">{trimmed.match(/^\d+/)?.[0]}.</span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(text) }} />
        </div>
      );
    }
    // Handle Paragraphs & Empty lines
    else if (trimmed === "") {
      flushList(index);
    } else {
      if (inList) {
        // Continue list items if line starts with text but we are in list context (multiline lists)
        listItems[listItems.length - 1] += " " + trimmed;
      } else {
        renderedElements.push(
          <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed my-4 text-base md:text-lg" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }} />
        );
      }
    }
  });

  flushList(lines.length);
  return renderedElements;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getBlogBySlug(slug);
  const blog = res.data;

  if (!blog) {
    return { title: 'Article Not Found | smartXman' };
  }

  const title = `${blog.seo_title || blog.title} | smartXman`;
  const description = blog.seo_description || blog.excerpt || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/blog/${slug}`,
      images: blog.cover_image ? [blog.cover_image] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let blog = null;
  try {
    const res = await getBlogBySlug(slug);
    if (res.success && res.data) {
      blog = res.data;
    }
  } catch (err) {
    console.error("Error loading blog details:", err);
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-slate-600 mb-8">The blog post you are looking for does not exist or has been removed.</p>
        <Link href="/blog" className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Top Banner & Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
          <div className="flex items-center gap-3">
            <ShareButton />
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="container mx-auto px-4 max-w-4xl pt-12 md:pt-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold uppercase tracking-wider">
            {blog.category || "Guides"}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" /> {blog.read_time || "5 min read"}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5" /> {new Date(blog.created_at || Date.now()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
          {blog.title}
        </h1>

        {/* Excerpt Summary */}
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-brand-500 pl-6 my-8 italic">
          {blog.excerpt}
        </p>

        {/* Cover Image */}
        {blog.cover_image && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-md mb-12 border border-slate-200 dark:border-slate-800">
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          {/* Article Text Content */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {renderMarkdownToJSX(blog.content)}
            </div>
          </div>

          {/* Reference Links & Sidebar widgets */}
          <div className="space-y-6">
            {blog.reference_links && blog.reference_links.length > 0 && (
              <div className="bg-gradient-to-br from-brand-50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-brand-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white">Featured in Guide</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Quick links to full reviews and current pricing of the tech/gadgets featured in this article:
                </p>
                <div className="space-y-3">
                  {blog.reference_links.map((link: any, idx: number) => (
                    <Link
                      key={idx}
                      href={link.url}
                      className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl hover:border-brand-500 hover:shadow-sm dark:hover:border-brand-400 transition-all group"
                    >
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                        {link.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-all group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Need a setup match?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Use our dynamic Product Finder to receive tailored suggestions tailored to your budget and work requirements.
              </p>
              <Link href="/products" className="inline-block px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold tracking-tight transition-colors">
                Try Product Finder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
