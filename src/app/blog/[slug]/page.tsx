import { ArrowLeft, Clock, Calendar, ChevronRight, Bookmark, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getBlogBySlug, getBlogs } from "@/lib/blogs-actions";
import { ShareButton } from "@/components/ShareButton";
import { Metadata } from "next";

export const revalidate = 3600;

// Enhanced markdown to styled JSX converter for robust rendering without extra libraries
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
      .replace(/\*\*(.*?)\*\//g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-brand-600 dark:text-brand-400">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 font-semibold hover:underline">$1</a>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Handle Inline/Block Images
    if (trimmed.startsWith("![")) {
      flushList(index);
      const altStart = 2;
      const altEnd = trimmed.indexOf("]");
      const urlStart = trimmed.indexOf("(", altEnd);
      const urlEnd = trimmed.indexOf(")", urlStart);
      
      if (altEnd !== -1 && urlStart !== -1 && urlEnd !== -1) {
        const alt = trimmed.substring(altStart, altEnd);
        const src = trimmed.substring(urlStart + 1, urlEnd);
        renderedElements.push(
          <div key={index} className="my-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-950/20 max-w-full">
            <img src={src} alt={alt} className="w-full h-auto max-h-[500px] object-cover mx-auto" />
            {alt && <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2.5 italic px-4">{alt}</p>}
          </div>
        );
      }
    }
    // Handle Headers
    else if (trimmed.startsWith("# ")) {
      flushList(index);
      renderedElements.push(
        <h1 key={index} className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight leading-tight">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(index);
      renderedElements.push(
        <h2 key={index} className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight border-b border-slate-100 dark:border-slate-850 pb-2">
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
      const text = trimmed.replace(/^\d+\.\s/, "");
      renderedElements.push(
        <div key={index} className="flex gap-3 my-4">
          <span className="font-bold text-brand-600 dark:text-brand-400">{trimmed.match(/^\d+/)?.[0]}.</span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(text) }} />
        </div>
      );
    }
    // Handle Blockquotes
    else if (trimmed.startsWith("> ")) {
      flushList(index);
      renderedElements.push(
        <blockquote key={index} className="border-l-4 border-brand-500 pl-6 my-6 italic text-lg text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 py-2 rounded-r-xl">
          {trimmed.slice(2)}
        </blockquote>
      );
    }
    // Handle Paragraphs & Empty lines
    else if (trimmed === "") {
      flushList(index);
    } else {
      if (inList) {
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
      images: blog.cover_image_url ? [blog.cover_image_url] : blog.cover_image ? [blog.cover_image] : [],
    },
    alternates: {
      canonical: blog.canonical_url || `/blog/${slug}`,
    },
    robots: {
      index: !blog.noindex,
      follow: !blog.noindex
    }
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

  // Fetch related posts
  let relatedPosts: any[] = [];
  try {
    const allBlogsRes = await getBlogs();
    if (allBlogsRes.success && allBlogsRes.data) {
      const otherBlogs = allBlogsRes.data.filter((b: any) => b.slug !== slug && b.status === "published");
      const sameCategory = otherBlogs.filter((b: any) => b.category === blog.category);
      relatedPosts = [...sameCategory, ...otherBlogs].slice(0, 3);
      relatedPosts = Array.from(new Set(relatedPosts));
    }
  } catch (err) {
    console.error("Failed to load related posts:", err);
  }

  // FAQ Schema JSON-LD builder
  const faqSchema = blog.faqs && blog.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <article className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Inject FAQ Rich Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

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
        <div className="flex items-center flex-wrap gap-3 mb-6">
          <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold uppercase tracking-wider">
            {blog.category || "Guides"}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" /> {blog.read_time || "5 min read"}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5" /> {new Date(blog.created_at || Date.now()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {blog.author && (
            <span className="text-xs text-slate-500 font-medium border-l border-slate-200 dark:border-slate-850 pl-3">
              By <span className="font-bold text-slate-700 dark:text-slate-300">{blog.author}</span>
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
          {blog.title}
        </h1>

        {/* Excerpt Summary */}
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-brand-500 pl-6 my-8 italic">
          {blog.excerpt}
        </p>

        {/* Cover Image & Alt & Caption */}
        {(blog.cover_image_url || blog.cover_image) && (
          <div className="mb-12">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-slate-50">
              <Image
                src={blog.cover_image_url || blog.cover_image}
                alt={blog.cover_image_alt || blog.title}
                fill
                priority
                className="object-cover"
              />
            </div>
            {blog.cover_image_caption && (
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3.5 italic px-4">
                {blog.cover_image_caption}
              </p>
            )}
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          {/* Article Text Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {renderMarkdownToJSX(blog.content)}
              </div>
            </div>

            {/* Featured Product Recommendation Blocks */}
            {blog.product_blocks && blog.product_blocks.length > 0 && (
              <div className="space-y-6 pt-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-600 rounded-full"></span>
                  Featured Recommendation Picks
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {blog.product_blocks.map((block: any, idx: number) => {
                    let badgeColor = "bg-brand-500/10 text-brand-600 border-brand-500/20";
                    if (block.ratingBadge === "Best Overall") badgeColor = "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400";
                    else if (block.ratingBadge === "Best Budget Pick") badgeColor = "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400";
                    else if (block.ratingBadge === "Best for Students") badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
                    else if (block.ratingBadge === "Best for Creators") badgeColor = "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400";
                    
                    return (
                      <div 
                        key={idx} 
                        className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/90 rounded-3xl hover:border-brand-500/30 transition-all shadow-sm group"
                      >
                        {/* Image */}
                        {block.image_url && (
                          <div className="w-full md:w-36 aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3 flex-shrink-0">
                            <img 
                              src={block.image_url} 
                              alt={block.name} 
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                            />
                          </div>
                        )}

                        {/* Recommendation details */}
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                                {block.ratingBadge || "Recommended"}
                              </span>
                              {block.price && (
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                  {block.price}
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                              {block.name}
                            </h4>
                            {block.note && (
                              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                <span className="font-bold text-slate-800 dark:text-slate-200 not-italic block mb-0.5">Expert review summary:</span>
                                "{block.note}"
                              </div>
                            )}
                          </div>

                          <div className="pt-2">
                            <a 
                              href={block.affiliate_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/10"
                            >
                              {block.cta_label || "Check Latest Price"} <ChevronRight className="w-4 h-4" />
                            </a>
                            <p className="text-[9px] text-slate-400 mt-2 font-medium">
                              * As an Amazon Associate, smartXman earns from qualifying purchases.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FAQ Accordions Section */}
            {blog.faqs && blog.faqs.length > 0 && (
              <div className="space-y-6 pt-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-600 rounded-full"></span>
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Quick expert answers regarding this gear setup guide.
                  </p>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-850">
                  {blog.faqs.map((faq: any, idx: number) => (
                    <details 
                      key={idx} 
                      className="group py-4 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                        <span className="font-bold text-slate-850 dark:text-slate-250 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-sm md:text-base">
                          {faq.question}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
                      </summary>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
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

      {/* Related Posts Section Grid */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-16 mt-16">
          <div className="container mx-auto px-4 max-w-4xl space-y-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Related Setup Guides & Reviews
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explore more optimized desk setup tips, gear analysis, and buying guides.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related: any) => (
                <Link 
                  key={related.id} 
                  href={`/blog/${related.slug}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:border-brand-500/30 hover:shadow-md transition-all group flex flex-col h-full"
                >
                  <div className="relative w-full aspect-video bg-slate-50 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-slate-300">
                    {related.cover_image_url || related.cover_image ? (
                      <img 
                        src={related.cover_image_url || related.cover_image} 
                        alt={related.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-brand-500/70" />
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-brand-600 text-white rounded text-[8px] font-bold uppercase tracking-wider">
                      {related.category || "Guides"}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {related.read_time || "5 min read"}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
                        {related.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-brand-600 flex items-center gap-0.5 self-end">
                      Read Article <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
