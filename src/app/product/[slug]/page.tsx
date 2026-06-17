import { ShoppingBag, Star, ArrowLeft, Trophy, ShieldAlert, Sparkles, Tag, CheckCircle2, HelpCircle, Layers, FileText } from "lucide-react";
import Link from "next/link";
import { FEATURED_PRODUCTS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductSaveButton from "@/components/ProductSaveButton";
import ProductShareButton from "@/components/ProductShareButton";
import StickyCTA from "@/components/StickyCTA";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

// Pre-render all published product pages at build time
export async function generateStaticParams() {
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug')
      .eq('status', 'published')
      .eq('is_active', true);

    return (products || [])
      // Guard: skip slugs that exceed Windows MAX_PATH during local builds
      .filter((p) => p.slug && p.slug.length <= 180)
      .map((p) => ({ slug: p.slug }));
  } catch (_) {
    return [];
  }
}


async function getProduct(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, primary_category:categories!products_primary_category_id_fkey(*)')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    const mockProduct = FEATURED_PRODUCTS.find(p => p.slug === slug);
    if (mockProduct) {
      return {
        ...mockProduct,
        smartScore: mockProduct.smartScore || 8.5,
        valueScore: mockProduct.valueScore || 8.0,
        buyingVerdict: mockProduct.buyingVerdict || mockProduct.expertNote,
        bestFor: "Productivity",
        whoShouldBuy: "Working professionals and students looking for high quality desk setup tools.",
        whoShouldAvoid: "Casual buyers with tight budget limits.",
        pros: mockProduct.pros || ["Solid build quality", "Premium finish"],
        cons: mockProduct.cons || ["Slightly expensive"],
        subCategory: "Setup Upgrades",
        tags: ["tech", "minimalist", "setup"],
        showFreshPrice: false,
        currentPrice: null,
        oldPrice: null,
        lastPriceCheckedAt: null,
        alternatives: null
      };
    }
    return null;
  }

  // Load price freshness setting from site_settings table
  let freshnessWindow = 7;
  try {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("price_freshness_window")
      .limit(1)
      .maybeSingle();
    if (settings?.price_freshness_window) {
      freshnessWindow = settings.price_freshness_window;
    }
  } catch (err) {
    console.warn("Failed to load settings on detail page, using 7 days", err);
  }

  const isPriceFresh = () => {
    if (data.current_price === null || data.current_price === undefined) return false;
    if (!data.price_is_fresh) return false;
    if (!data.last_price_checked_at) return false;
    
    const diffTime = Math.abs(new Date().getTime() - new Date(data.last_price_checked_at).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= freshnessWindow;
  };

  const showFreshPrice = isPriceFresh();

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    brand: data.brand || "",
    description: data.description,
    price: data.price_range || "Check Amazon",
    rating: data.rating || 0,
    image: data.images?.[0] || "/placeholder-product.png",
    images: data.images || [],
    category: data.primary_category?.name || "Tech Accessories",
    subCategory: data.sub_category || "",
    affiliateLink: data.affiliate_link || data.affiliate_url || "#",
    expertNote: data.expert_note || "",
    bestFor: data.best_for || "",
    whoShouldBuy: data.who_should_buy || "",
    whoShouldAvoid: data.who_should_avoid || "",
    pros: data.pros || [],
    cons: data.cons || [],
    buyingVerdict: data.buying_verdict || "",
    testedByUs: data.tested_by_us || false,
    priceIsFresh: data.price_is_fresh || false,
    smartScore: data.smart_score || 8.0,
    valueScore: data.value_score || 8.0,
    tags: data.tags || [],
    reviews: 840, // Dummy reviews
    currentPrice: data.current_price,
    oldPrice: data.old_price,
    showFreshPrice,
    lastPriceCheckedAt: data.last_price_checked_at,
    primaryCategoryId: data.primary_category_id || null
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | smartXman',
    };
  }

  return {
    title: `${product.name} - Review & Best Price | smartXman`,
    description: product.expertNote || product.description?.substring(0, 160),
    openGraph: {
      title: `${product.name} | smartXman Picks`,
      description: product.expertNote || product.description?.substring(0, 160),
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: `${product.name} - smartXman Review`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | smartXman Picks`,
      description: product.expertNote || product.description?.substring(0, 160),
      images: [product.image],
    },
    alternates: {
      canonical: `https://smartxman.com/product/${resolvedParams.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Load price freshness setting from site_settings table or default to 7
  let freshnessWindow = 7;
  try {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("price_freshness_window")
      .limit(1)
      .maybeSingle();
    if (settings?.price_freshness_window) {
      freshnessWindow = settings.price_freshness_window;
    }
  } catch (err) {
    console.warn("Failed to load settings in related products, using 7 days", err);
  }

  // Fetch related products from the same category
  let relatedProducts: any[] = [];
  try {
    if (product.primaryCategoryId) {
      const { data: dbRelated } = await supabase
        .from('products')
        .select('*, primary_category:categories!products_primary_category_id_fkey(*)')
        .eq('primary_category_id', product.primaryCategoryId)
        .neq('id', product.id)
        .eq('status', 'published')
        .limit(4);

      if (dbRelated && dbRelated.length > 0) {
        relatedProducts = dbRelated.map(p => {
          const isPriceFresh = () => {
            if (p.current_price === null || p.current_price === undefined) return false;
            if (!p.price_is_fresh) return false;
            if (!p.last_price_checked_at) return false;
            
            const diffTime = Math.abs(new Date().getTime() - new Date(p.last_price_checked_at).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= freshnessWindow;
          };
          const showFresh = isPriceFresh();
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price_range || "Check Price",
            rating: Number(p.rating) || 0,
            image: p.images?.[0] || "/placeholder-product.png",
            images: p.images || [],
            category: p.primary_category?.name || product.category,
            subCategory: p.sub_category || "",
            brand: p.brand || "",
            affiliateLink: p.affiliate_link || p.affiliate_url || "#",
            expertNote: p.expert_note || "",
            featured: p.featured || false,
            trending: p.trending || false,
            isBudgetPick: p.is_budget_pick || false,
            isBestDeal: p.is_best_deal || false,
            smartScore: Number(p.smart_score) || 8.0,
            valueScore: Number(p.value_score) || 8.0,
            pros: p.pros || [],
            cons: p.cons || [],
            bestFor: p.best_for || "",
            whoShouldBuy: p.who_should_buy || "",
            whoShouldAvoid: p.who_should_avoid || "",
            buyingVerdict: p.buying_verdict || "",
            tags: p.tags || [],
            currentPrice: p.current_price,
            oldPrice: p.old_price,
            showFreshPrice: showFresh,
            lastPriceCheckedAt: p.last_price_checked_at
          };
        });
      }
    }
  } catch (err) {
    console.warn("Failed to load related products", err);
  }

  // Generate JSON-LD Schema for Rich Snippets
  const baseUrl = "https://smartxman.com";
  
  const faqAnswerPricing = product.showFreshPrice 
    ? `Yes, pricing is verified dynamically via our smartXman sync system. The last check was completed recently.` 
    : `Amazon prices fluctuate. We highly recommend clicking 'Check Latest Price' to view live deals and promotions directly on Amazon.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${baseUrl}/product/${product.slug}#product`,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images : [product.image],
        description: product.description || product.expertNote,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'Generic',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating > 0 ? product.rating : 4.5,
          reviewCount: product.reviews || 840,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price ? product.price.replace(/[^0-9.]/g, '') : '0',
          availability: 'https://schema.org/InStock',
          url: product.affiliateLink,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/product/${product.slug}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `Who should buy the ${product.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: product.whoShouldBuy || `It is perfect for professionals, students, and creators looking for workspace tools that deliver stellar durability and clean design.`
            }
          },
          {
            '@type': 'Question',
            name: `Is the pricing verified and fresh?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faqAnswerPricing
            }
          },
          {
            '@type': 'Question',
            name: `What is the VFM (Value For Money) Index of this product?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Our automated value index ranks this product at ${Number(product.valueScore).toFixed(1)}/10, making it an exceptionally cost-effective recommendation compared to similar options on the market.`
            }
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/product/${product.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Products',
            item: `${baseUrl}/products`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: `${baseUrl}/product/${product.slug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Side: Product Gallery (Client Component) */}
        <ProductImageGallery 
           images={product.images} 
           image={product.image} 
           name={product.name} 
           smartScore={product.smartScore} 
           valueScore={product.valueScore} 
        />
        
        {/* Right Side: Primary Meta Data */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-650 dark:text-brand-400 rounded-full text-xs font-black uppercase tracking-wider border border-brand-100/10">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="px-3.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-350 rounded-full text-xs font-bold uppercase border border-transparent">
                  {product.subCategory}
                </span>
              )}
            </div>
            
            {product.brand && (
              <p className="text-xs text-slate-400 dark:text-slate-550 uppercase tracking-widest font-black leading-none mb-1">
                {product.brand}
              </p>
            )}

            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight font-display">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-extrabold text-slate-850 dark:text-slate-200">{Number(product.rating || 0).toFixed(1)} Rating</span>
              </div>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span className="text-slate-500 dark:text-slate-400">{product.reviews.toLocaleString()} Reviews</span>
            </div>
          </div>

          {/* Premium Intelligence Dashboard: Smart Score & VFM Score */}
          <div className="grid grid-cols-2 gap-4 p-1 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-650 dark:text-brand-400 tracking-wider flex items-center gap-1.5 mb-1">
                  🧠 Smart Score
                </span>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {Number(product.smartScore || 8.0).toFixed(1)}<span className="text-xs text-slate-400 font-medium">/10</span>
                </p>
              </div>
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-600 h-full rounded-full" style={{ width: `${(product.smartScore || 8.0) * 10}%` }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-650 dark:text-emerald-450 tracking-wider flex items-center gap-1.5 mb-1">
                  💰 Value Score (VFM)
                </span>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {Number(product.valueScore || 8.0).toFixed(1)}<span className="text-xs text-slate-400 font-medium">/10</span>
                </p>
              </div>
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(product.valueScore || 8.0) * 10}%` }}></div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            {product.showFreshPrice && product.currentPrice ? (
              <>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">Verified Market Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-955 dark:text-white">
                    ₹{Number(product.currentPrice).toLocaleString('en-IN')}
                  </span>
                  {product.oldPrice && product.oldPrice > product.currentPrice && (
                    <>
                      <span className="text-base text-slate-450 line-through">
                        ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="px-2 py-0.5 bg-rose-500 text-white font-black text-[9px] uppercase rounded-md shadow-sm">
                        {Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold">
                  Last checked: {new Date(product.lastPriceCheckedAt).toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-slate-400 dark:text-slate-555 uppercase font-black tracking-wider font-sans">Last Updated Price</p>
                <div className="flex flex-wrap items-baseline gap-3">
                  {(product.currentPrice || (product.price && product.price !== "Check Amazon" && product.price !== "Check Price" && product.price !== "Check latest price")) ? (
                    <span className="text-3xl font-black text-slate-955 dark:text-white">
                      {product.currentPrice 
                        ? `₹${Number(product.currentPrice).toLocaleString('en-IN')}` 
                        : (product.price.startsWith("₹") ? product.price : `₹${product.price}`)}
                    </span>
                  ) : null}
                  <span className="text-xs font-black text-amber-600 dark:text-amber-450 uppercase bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md">
                    Check Latest Price
                  </span>
                </div>
                {product.lastPriceCheckedAt && (
                  <p className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold">
                    Last checked: {new Date(product.lastPriceCheckedAt).toLocaleDateString()}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Clean product description snippet above fold */}
          <div className="space-y-2">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-550">
              Overview
            </h3>
            <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed line-clamp-3">
              {product.description || "Our complete in-depth review on this product is currently active. Scroll down to see full Pros, Cons, and buying verdict recommendations."}
            </p>
          </div>
          
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <a 
                href={product.affiliateLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-brand-500/10 active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" /> Check Best Price
              </a>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-normal font-semibold">
                smartXman may earn a small commission when you buy through this link. Our recommendations are based on usefulness, value, and practical needs.
              </p>
            </div>
            
            <div className="flex gap-2.5">
              {/* Wishlist Button (Client Component) */}
              <ProductSaveButton productId={product.id} />
              
              {/* Share Button (Client Component) */}
              <ProductShareButton affiliateLink={product.affiliateLink} productName={product.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section (Below Fold) */}
      <div className="mt-16 border-t border-slate-150 dark:border-slate-850 pt-16 space-y-12">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            Product Review & In-depth Analysis
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Our expert verdict, recommendations, pros & cons, and side-by-side specifications.
          </p>
        </div>

        {/* AI Insight Verdict Box */}
        {(product.buyingVerdict || product.expertNote) && (
          <div className="p-6 md:p-8 rounded-[2rem] bg-brand-50/20 dark:bg-brand-950/5 border border-brand-100/10 dark:border-brand-950/15 shadow-sm space-y-3">
            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-500" /> AI Verdict & Buying Recommendation
            </h3>
            <p className="text-slate-700 dark:text-slate-350 leading-relaxed text-sm md:text-base font-semibold">
              "{product.buyingVerdict || product.expertNote}"
            </p>
          </div>
        )}

        {/* Why we recommend / Best For / Who should buy / avoid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(product.whoShouldBuy || product.whoShouldAvoid || product.bestFor) && (
            <div className="p-8 rounded-[2rem] bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              {product.bestFor && (
                <div className="space-y-2 border-b border-slate-150 dark:border-slate-800 pb-4">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Best Used For</span>
                  <p className="text-slate-900 dark:text-white font-extrabold text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-500" /> {product.bestFor}
                  </p>
                </div>
              )}
              
              {product.whoShouldBuy && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm text-emerald-650 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> Recommended For
                  </h4>
                  <p className="text-slate-650 dark:text-slate-400 leading-relaxed text-xs font-semibold">{product.whoShouldBuy}</p>
                </div>
              )}
              
              {product.whoShouldAvoid && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm text-rose-500 dark:text-rose-455 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" /> Not Recommended For
                  </h4>
                  <p className="text-slate-655 dark:text-slate-400 leading-relaxed text-xs font-semibold">{product.whoShouldAvoid}</p>
                </div>
              )}
            </div>
          )}

          {/* Pros and Cons Checklist */}
          {(product.pros?.length > 0 || product.cons?.length > 0) && (
            <div className="p-8 rounded-[2rem] bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8">
              {product.pros?.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider text-emerald-650">Pros (+)</h4>
                  <ul className="space-y-3">
                    {product.pros.map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                        <span className="text-emerald-500 font-extrabold shrink-0">+</span> <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product.cons?.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider text-rose-550">Cons (-)</h4>
                  <ul className="space-y-3">
                    {product.cons.map((con: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                        <span className="text-red-500 font-extrabold shrink-0">-</span> <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Alternatives Comparison Table */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="pt-6">
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <Layers className="w-5.5 h-5.5 text-brand-500" /> Compare Against Alternatives
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-semibold mt-0.5 text-xs">
                How this product compares to peer products in the {product.category} category.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/60 scrollbar-thin">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-105 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                    <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/4">Feature</th>
                    <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-brand-650 dark:text-brand-400 w-1/4 bg-brand-50/10 dark:bg-brand-950/5">
                      {product.name} <span className="text-[8px] bg-brand-500 text-white px-1.5 py-0.5 rounded ml-1.5 font-bold uppercase tracking-normal">This Product</span>
                    </th>
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <th key={rel.id} className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-705 dark:text-slate-200 w-1/4">
                        {rel.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                  {/* Image Row */}
                  <tr>
                    <td className="py-4 px-5 text-slate-400">Preview</td>
                    <td className="py-4 px-5 bg-brand-50/10 dark:bg-brand-950/5">
                      <div className="relative w-16 h-16 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-1.5">
                        <img src={product.image} alt={product.name} className="object-contain max-h-full max-w-full" />
                      </div>
                    </td>
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <td key={rel.id} className="py-4 px-5">
                        <div className="relative w-16 h-16 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-1.5">
                          <img src={rel.image} alt={rel.name} className="object-contain max-h-full max-w-full" />
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="py-4 px-5 text-slate-400">Expert Rating</td>
                    <td className="py-4 px-5 bg-brand-50/10 dark:bg-brand-950/5 font-black text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                        <span>{Number(product.rating || 0).toFixed(1)} / 5.0</span>
                      </div>
                    </td>
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <td key={rel.id} className="py-4 px-5 text-slate-700 dark:text-slate-350">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                          <span>{Number(rel.rating || 0).toFixed(1)} / 5.0</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Smart Score */}
                  <tr>
                    <td className="py-4 px-5 text-slate-400">Smart Score</td>
                    <td className="py-4 px-5 bg-brand-50/10 dark:bg-brand-950/5 font-black text-brand-650 dark:text-brand-400">
                      🧠 {Number(product.smartScore || 8.0).toFixed(1)} / 10
                    </td>
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <td key={rel.id} className="py-4 px-5 text-slate-700 dark:text-slate-350">
                        🧠 {Number(rel.smartScore || 8.0).toFixed(1)} / 10
                      </td>
                    ))}
                  </tr>

                  {/* VFM Score */}
                  <tr>
                    <td className="py-4 px-5 text-slate-400">Value Score (VFM)</td>
                    <td className="py-4 px-5 bg-brand-50/10 dark:bg-brand-950/5 font-black text-emerald-650 dark:text-emerald-450">
                      💰 {Number(product.valueScore || 8.0).toFixed(1)} / 10
                    </td>
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <td key={rel.id} className="py-4 px-5 text-slate-700 dark:text-slate-350">
                        💰 {Number(rel.valueScore || 8.0).toFixed(1)} / 10
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr>
                    <td className="py-4 px-5 text-slate-400">Price</td>
                    <td className="py-4 px-5 bg-brand-50/10 dark:bg-brand-950/5">
                      {product.showFreshPrice && product.currentPrice ? (
                        <span className="font-black text-slate-900 dark:text-white">
                          ₹{Number(product.currentPrice).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">{product.price}</span>
                      )}
                    </td>
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <td key={rel.id} className="py-4 px-5">
                        {rel.showFreshPrice && rel.currentPrice ? (
                          <span className="font-extrabold text-slate-750 dark:text-slate-300">
                            ₹{Number(rel.currentPrice).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400 font-semibold">{rel.price}</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Best For */}
                  <tr>
                    <td className="py-4 px-5 text-slate-400">Best For</td>
                    <td className="py-4 px-5 bg-brand-50/10 dark:bg-brand-950/5 font-extrabold text-brand-650 dark:text-brand-400">
                      {product.bestFor || "N/A"}
                    </td>
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <td key={rel.id} className="py-4 px-5 text-slate-700 dark:text-slate-350 font-semibold">
                        {rel.bestFor || "N/A"}
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="py-4 px-5 text-slate-400">Action</td>
                    <td className="py-4 px-5 bg-brand-50/10 dark:bg-brand-950/5">
                      <a
                        href={product.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
                      >
                        Buy Now
                      </a>
                    </td>
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <td key={rel.id} className="py-4 px-5">
                        <div className="flex gap-1.5">
                          <Link
                            href={`/product/${rel.slug}`}
                            className="inline-flex items-center justify-center px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-[10px] font-bold uppercase transition-all"
                          >
                            View
                          </Link>
                          <a
                            href={rel.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                          >
                            Buy
                          </a>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Specifications & Technical Metadata */}
        <div className="pt-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 font-display">
            <FileText className="w-5.5 h-5.5 text-brand-500" /> Product Specifications
          </h3>
          <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-xs">
              {[
                { label: "Manufacturer / Brand", value: product.brand || "Generic" },
                { label: "Primary Category", value: product.category },
                { label: "Sub-Category Section", value: product.subCategory || "Tech Gear" },
                { label: "Smart Score Review Rating", value: `${Number(product.smartScore).toFixed(1)} / 10.0` },
                { label: "Value For Money Score Rating", value: `${Number(product.valueScore).toFixed(1)} / 10.0` },
                { label: "Durability & Purpose Index", value: product.bestFor || "Daily Workspace Comfort" },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-slate-150/40 dark:border-slate-800/50 font-semibold font-sans">
                  <span className="text-slate-450 dark:text-slate-450">{spec.label}</span>
                  <span className="text-slate-900 dark:text-white text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="pt-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 font-display">
            <HelpCircle className="w-5.5 h-5.5 text-brand-500" /> Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: `Who should buy the ${product.name}?`,
                a: product.whoShouldBuy || `It is perfect for professionals, students, and creators looking for workspace tools that deliver stellar durability and clean design.`
              },
              {
                q: `Is the pricing verified and fresh?`,
                a: product.showFreshPrice ? `Yes, pricing is verified dynamically via our smartXman sync system. The last check was completed recently.` : `Amazon prices fluctuate. We highly recommend clicking 'Check Latest Price' to view live deals and promotions directly on Amazon.`
              },
              {
                q: `What is the VFM (Value For Money) Index of this product?`,
                a: `Our automated value index ranks this product at ${Number(product.valueScore).toFixed(1)}/10, making it an exceptionally cost-effective recommendation compared to similar options on the market.`
              }
            ].map((faq, i) => (
              <div key={i} className="p-5 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-1.5 shadow-sm">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs md:text-sm font-display">
                  {faq.q}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alternatives & Related Products Recommendation Grid */}
        <div className="pt-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <Layers className="w-5.5 h-5.5 text-brand-500" /> Alternatives & Related Products
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-semibold mt-0.5 text-xs">
                Discover other premium options handpicked for their usefulness and value.
              </p>
            </div>
            <Link href="/products" className="text-xs font-black uppercase tracking-wider text-brand-650 hover:text-brand-700 transition-colors">
              View All
            </Link>
          </div>

          {/* Server-Side Loaded Related Products Grid */}
          {relatedProducts && relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-450 dark:text-slate-550 font-bold uppercase tracking-widest">No matching alternatives currently in database</p>
            </div>
          )}
        </div>

      </div>

      {/* Discovery Meta Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-850 pt-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Tags:
          </span>
          {product.tags.map((tag: string) => (
            <span key={tag} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800/80 text-[10px] font-semibold text-slate-500 dark:text-slate-400 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Floating Sticky CTA on Scroll */}
      <StickyCTA
        name={product.name}
        image={product.image}
        price={product.price}
        currentPrice={product.currentPrice}
        showFreshPrice={product.showFreshPrice}
        affiliateLink={product.affiliateLink}
      />
    </div>
  );
}

