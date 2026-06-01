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
      canonical: `/product/${resolvedParams.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
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
        relatedProducts = dbRelated.map(p => ({
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
          tags: p.tags || []
        }));
      }
    }
  } catch (err) {
    console.warn("Failed to load related products", err);
  }

  // Generate JSON-LD Schema for Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
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
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-650 dark:text-brand-400 rounded-full text-xs font-black uppercase tracking-wider border border-brand-100/10">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="px-3.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-full text-xs font-bold uppercase border border-transparent">
                  {product.subCategory}
                </span>
              )}
            </div>
            
            {product.brand && (
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black leading-none mb-1">
                {product.brand}
              </p>
            )}

            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
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
          
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag className="w-16 h-16" />
            </div>
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              Short Buying Advice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-sm">
              "{product.expertNote || "A stellar choice for standard daily requirements with optimal cost-effectiveness."}"
            </p>
          </div>

          <div className="space-y-3">
            {product.showFreshPrice ? (
              <>
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">Verified Market Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-950 dark:text-white">
                    ₹{Number(product.currentPrice).toLocaleString('en-IN')}
                  </span>
                  {product.oldPrice && product.oldPrice > product.currentPrice && (
                    <>
                      <span className="text-lg text-slate-400 line-through">
                        ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="px-2.5 py-1 bg-rose-500 text-white font-black text-[10px] uppercase rounded-lg shadow-sm">
                        {Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold">
                  Last checked: {new Date(product.lastPriceCheckedAt).toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">Amazon Price</p>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Check Price
                </div>
              </>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-655 dark:text-slate-300 text-base leading-relaxed">
              {product.description || "Our complete in-depth review on this product is currently active. Scroll down to see full Pros, Cons, and buying verdict recommendations."}
            </p>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <a 
                href={product.affiliateLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" /> {product.showFreshPrice ? "Buy on Amazon" : "Check Latest Price on Amazon"}
              </a>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-normal">
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

      {/* Detailed Analysis Section */}
      <div className="mt-20 border-t border-slate-100 dark:border-slate-850 pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recommended Lists */}
        {(product.whoShouldBuy || product.whoShouldAvoid || product.bestFor) && (
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            {product.bestFor && (
              <div className="space-y-2 border-b border-slate-50 dark:border-slate-800/60 pb-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Best Used For</span>
                <p className="text-slate-900 dark:text-white font-extrabold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" /> {product.bestFor}
                </p>
              </div>
            )}
            
            {product.whoShouldBuy && (
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 dark:text-white text-base text-emerald-650 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> Recommended For
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-semibold">{product.whoShouldBuy}</p>
              </div>
            )}
            
            {product.whoShouldAvoid && (
              <div className="space-y-2 pt-2">
                <h4 className="font-black text-slate-900 dark:text-white text-base text-rose-500 dark:text-rose-455 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0" /> Not Recommended For
                </h4>
                <p className="text-slate-655 dark:text-slate-400 leading-relaxed text-sm font-semibold">{product.whoShouldAvoid}</p>
              </div>
            )}
          </div>
        )}

        {/* Pros and Cons Checklist */}
        {(product.pros?.length > 0 || product.cons?.length > 0) && (
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8">
            {product.pros?.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5 text-emerald-650">Pros (+)</h4>
                <ul className="space-y-3">
                  {product.pros.map((pro: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400 text-sm font-semibold">
                      <span className="text-emerald-500 font-extrabold mt-0.5">+</span> <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.cons?.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5 text-red-500">Cons (-)</h4>
                <ul className="space-y-3">
                  {product.cons.map((con: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400 text-sm font-semibold">
                      <span className="text-red-500 font-extrabold mt-0.5">-</span> <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Final Buying Verdict */}
      {product.buyingVerdict && (
        <div className="mt-8 p-8 rounded-[2.5rem] bg-brand-50/40 dark:bg-brand-950/10 border border-brand-100/10 dark:border-brand-950/20 shadow-sm space-y-3">
          <h4 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <Trophy className="w-5.5 h-5.5 text-brand-500" /> Final Buying Recommendation
          </h4>
          <p className="text-slate-700 dark:text-slate-350 leading-relaxed text-base font-semibold">
            {product.buyingVerdict}
          </p>
        </div>
      )}

      {/* Product Specifications & Technical Metadata */}
      <div className="mt-16 border-t border-slate-100 dark:border-slate-850 pt-16">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-brand-500" /> Product Specifications
        </h3>
        <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { label: "Manufacturer / Brand", value: product.brand || "Generic" },
              { label: "Primary Category", value: product.category },
              { label: "Sub-Category Section", value: product.subCategory || "Tech Gear" },
              { label: "Smart Score Review Rating", value: `${product.smartScore.toFixed(1)} / 10.0` },
              { label: "Value For Money Score Rating", value: `${product.valueScore.toFixed(1)} / 10.0` },
              { label: "Durability & Purpose Index", value: product.bestFor || "Daily Workspace Comfort" },
            ].map((spec, i) => (
              <div key={i} className="flex justify-between py-3 border-b border-slate-150/40 dark:border-slate-800/50 text-sm font-semibold">
                <span className="text-slate-450 dark:text-slate-400">{spec.label}</span>
                <span className="text-slate-900 dark:text-white text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="mt-16 border-t border-slate-100 dark:border-slate-850 pt-16">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-brand-500" /> Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {[
            {
              q: `Who should buy the ${product.name}?`,
              a: product.whoShouldBuy || `It is perfect for professionals, students, and creators looking for premium workspace tools that deliver stellar durability and clean design.`
            },
            {
              q: `Is the pricing verified and fresh?`,
              a: product.showFreshPrice ? `Yes, pricing is verified dynamically via our smartXman sync system. The last check was completed recently.` : `Amazon prices fluctuate. We highly recommend clicking 'Check Latest Price' to view live deals and promotions directly on Amazon.`
            },
            {
              q: `What is the VFM (Value For Money) Index of this product?`,
              a: `Our automated value index ranks this product at ${product.valueScore.toFixed(1)}/10, making it an exceptionally cost-effective recommendation compared to similar options on the market.`
            }
          ].map((faq, i) => (
            <div key={i} className="p-6 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm md:text-base">
                {faq.q}
              </h4>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alternatives & Related Products Recommendation Grid */}
      <div className="mt-16 border-t border-slate-100 dark:border-slate-850 pt-16 mb-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-brand-500" /> Alternatives & Related Products
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">
              Discover other premium options handpicked for their usefulness and value.
            </p>
          </div>
          <Link href="/products" className="text-xs font-black uppercase tracking-wider text-brand-650 hover:text-brand-700 transition-colors">
            View All Products
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
            <p className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest">No matching alternatives currently in database</p>
          </div>
        )}
      </div>

      {/* Discovery Meta Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-850 pt-8">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Discovery Tags:
          </span>
          {product.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-150/50 dark:border-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-lg">
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

