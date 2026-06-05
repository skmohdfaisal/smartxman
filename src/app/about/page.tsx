import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Laptop, Gamepad2, Users, Search, Target, Heart } from "lucide-react";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("about", {
    title: "About smartXman | Our Mission & Story",
    description: "Learn about smartXman — why we started, our mission to simplify product buying decisions, and how we curate the best product recommendations.",
    url: "https://www.smartxman.com/about",
  });
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            About smartXman
          </h1>
          <p className="text-xl md:text-2xl text-brand-600 dark:text-brand-400 font-medium">
            Less confusion. Better choices. Smarter buying.
          </p>
        </div>
      </section>

      {/* Main About Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl text-lg text-slate-700 dark:text-slate-300 space-y-6">
          <p>
            Buying something online sounds easy… until you actually start searching.
          </p>
          <p>
            One product has 10,000 reviews.<br/>
            Another one says "best seller."<br/>
            Some videos say it's amazing.<br/>
            Some comments say don't buy it.
          </p>
          <p>
            And after all that, you still feel confused.
          </p>
          <p className="font-semibold text-slate-900 dark:text-white text-xl pt-4">
            That's why we created smartXman.
          </p>
          <p>
            smartXman is a simple product recommendation website made to help you find useful products without wasting hours online.
          </p>
          <p>
            We focus on products that make sense for real people — students, creators, gamers, working professionals, and anyone who wants to buy smartly.
          </p>
          <p>
            Here, you'll find products related to tech accessories, desk setups, gaming setups, creator tools, productivity, home decor, student essentials, and budget-friendly finds.
          </p>
          <p className="font-medium pt-4">
            But we don't just list products.
          </p>
          <p>
            We try to explain things in a simple way:
          </p>
          <ul className="list-disc pl-6 space-y-2 pb-4">
            <li>Who is this product good for?</li>
            <li>Who should avoid it?</li>
            <li>Is it worth the price?</li>
            <li>Is there a better option?</li>
            <li>Will it actually be useful?</li>
          </ul>
          <div className="py-8 text-center border-y border-slate-100 dark:border-slate-800 my-8">
            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
              Our goal is not to make you buy more.<br/>
              <span className="text-brand-600 dark:text-brand-400">Our goal is to help you buy better.</span>
            </p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 pb-4">
            Sometimes, we may earn a small commission when you buy through our links. But that doesn't change the way we recommend products. We only want to share products that look useful, practical, and worth considering.
          </p>
          <div className="bg-brand-50 dark:bg-brand-900/20 p-8 rounded-2xl text-center">
            <p className="font-medium text-slate-900 dark:text-white mb-2">smartXman is built with one simple idea:</p>
            <p className="text-xl font-bold text-brand-600 dark:text-brand-400">Less confusion. Better choices. Smarter buying.</p>
          </div>
        </div>
      </section>

      {/* Section 1: Who smartXman Is For */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Who smartXman Is For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Students</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Budget-friendly products for study, productivity, and daily use.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Creators</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Useful gear for content creation, desk setup, lighting, audio, and workflow.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Gamers</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Gaming accessories and setup products that balance performance and budget.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Everyday Buyers</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Simple recommendations for people who want useful products without overthinking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What We Recommend */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">
            What We Recommend
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Tech Accessories", "Creator Setup", "Gaming Setup", "Productivity", "Home Decor", "Student Essentials", "Budget Finds", "Smart Gadgets"].map((cat) => (
              <span key={cat} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-full shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-default">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How We Choose Products */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              How We Choose Products
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We look at usefulness, price, features, reviews, alternatives, and real-life needs before adding a product to smartXman.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
              <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
                <Search className="w-6 h-6" />
              </div>
              We try to answer simple buying questions:
            </h3>
            <ul className="space-y-4 max-w-md mx-auto text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                <span>Is this product useful?</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                <span>Is it worth the price?</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                <span>Who is it best for?</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                <span>What are the pros and cons?</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                <span>Is there a better alternative?</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4: Our Promise */}
      <section className="py-24 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full mb-8">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Our Promise
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
            We want smartXman to feel like a helpful friend, not a pushy shopping website.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-16">
            We may earn from affiliate links, but our focus is always on practical, useful, and honest recommendations.
          </p>

          <div className="bg-brand-600 rounded-3xl p-10 md:p-16 text-white shadow-xl shadow-brand-500/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">
              Ready to discover smarter product picks?
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="w-full sm:w-auto px-8 py-4 bg-white text-brand-600 hover:bg-slate-50 rounded-full font-semibold transition-colors shadow-sm">
                Explore Products
              </Link>
              <Link href="/blog" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white rounded-full font-semibold transition-colors">
                Read Buying Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
