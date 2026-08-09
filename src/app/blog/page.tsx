import { ArrowLeft, Clock, Calendar, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getBlogs } from "@/lib/blogs-actions";
import { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("blog", {
    title: "Smart Guides for Tech, Setup & Gadgets | smartXman",
    description: "Read simple smart guides, product comparisons, setup ideas, and budget-friendly tech recommendations for students, creators, gamers, and everyday buyers.",
    url: "https://www.smartxman.com/blog",
  });
}

export const revalidate = 60;

export default async function BlogPage(props: { searchParams: Promise<{ category?: string, page?: string }> }) {
  const searchParams = await props.searchParams;
  const currentCategory = searchParams.category || "All";
  const currentPage = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 9; // Grid will have 9 items per page, plus 1 featured on page 1

  const res = await getBlogs();
  const allArticles = res.success && res.data 
    ? res.data.filter((art: any) => art.status === "published" || art.status === "Published") 
    : [];

  // Extract all unique categories
  const categoriesSet = new Set<string>();
  categoriesSet.add("All");
  allArticles.forEach((a: any) => {
    if (a.category) categoriesSet.add(a.category);
  });
  const categories = Array.from(categoriesSet);

  // Filter articles
  let filteredArticles = allArticles;
  if (currentCategory !== "All") {
    filteredArticles = allArticles.filter((a: any) => a.category === currentCategory);
  }

  // Determine Featured Article (only on page 1, and usually the newest featured or just the newest)
  let featuredArticle: any = null;
  if (currentPage === 1 && filteredArticles.length > 0) {
    featuredArticle = filteredArticles.find((a: any) => a.featured) || filteredArticles[0];
    filteredArticles = filteredArticles.filter((a: any) => a.id !== featuredArticle.id);
  }

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  // Fallback Popular Guides if filtered results are 0
  const popularGuides = allArticles
    .filter((a: any) => a.is_popular)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-24 pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 font-bold mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white leading-tight">
              Smart Guides & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Reviews</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
              Discover in-depth smart guides, product comparisons, and setup inspiration tailored for creators, gamers, and modern professionals.
            </p>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link 
                  key={cat} 
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentCategory === cat ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-20 space-y-16">
        
        {/* Empty State */}
        {featuredArticle == null && paginatedArticles.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Guides Found</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">We couldn't find any guides for the category "{currentCategory}". Try selecting another category.</p>
            <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors">
              View All Guides
            </Link>

            {/* Show popular if empty */}
            {popularGuides.length > 0 && (
              <div className="mt-16 text-left px-8">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-t border-slate-100 dark:border-slate-800 pt-8">Check out our Popular Guides instead:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {popularGuides.map((guide: any) => (
                    <Link key={guide.id} href={`/blog/${guide.slug}`} className="group block space-y-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image src={guide.cover_image_url || guide.cover_image || "/categories/tech.png"} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-2">{guide.title}</h5>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <Link 
                href={`/blog/${featuredArticle.slug}`}
                className="group flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800 md:w-3/5 w-full aspect-video md:aspect-auto">
                  <Image 
                    src={featuredArticle.cover_image_url || featuredArticle.cover_image || "/categories/tech.png"} 
                    alt={featuredArticle.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="backdrop-blur-md bg-white/90 dark:bg-slate-900/90 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                      {featuredArticle.category}
                    </span>
                    {featuredArticle.featured && (
                      <span className="backdrop-blur-md bg-amber-400/90 text-amber-950 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4" /> {featuredArticle.read_time || "5 min read"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {new Date(featuredArticle.created_at || Date.now()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                    <span className="inline-flex items-center gap-2 text-base font-bold text-brand-600 dark:text-brand-400 group-hover:gap-3 transition-all">
                      Read Article <ArrowLeft className="w-5 h-5 rotate-180" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid of Articles */}
            {paginatedArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((article: any) => (
                  <Link 
                    key={article.id} 
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800 w-full aspect-[4/3]">
                      <Image 
                        src={article.cover_image_url || article.cover_image || "/categories/tech.png"} 
                        alt={article.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      <div className="absolute top-4 left-4 z-10">
                        <span className="backdrop-blur-md bg-white/90 dark:bg-slate-900/90 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5" /> {article.read_time || "5 min read"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(article.created_at || Date.now()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug line-clamp-2">
                          {article.title}
                        </h2>
                        
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 group-hover:gap-3 transition-all">
                          Read Guide <ArrowLeft className="w-4 h-4 rotate-180" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Link
                      key={pageNum}
                      href={`/blog?category=${encodeURIComponent(currentCategory)}&page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${currentPage === pageNum ? 'bg-brand-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500'}`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter Subscribe block when articles are few (empty state alternative) */}
      {paginatedArticles.length > 0 && paginatedArticles.length < 4 && (
        <div className="container mx-auto px-4 max-w-4xl pb-16">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="max-w-lg text-center md:text-left">
              <h3 className="text-2xl font-black text-white mb-2">Want more guides like this?</h3>
              <p className="text-slate-400 font-medium">Join 15,000+ buyers who get our latest setups and product reviews straight to their inbox.</p>
            </div>
            <div className="w-full md:w-auto">
              <Link href="/#newsletter" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-black rounded-xl hover:bg-brand-700 transition-colors shadow-xl shadow-brand-500/20 whitespace-nowrap">
                Subscribe for Updates <CheckCircle2 className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
