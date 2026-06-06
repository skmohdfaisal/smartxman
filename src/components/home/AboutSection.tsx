"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, DollarSign, HelpCircle, ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/20 dark:to-transparent z-0"></div>
      
      <div className="container relative z-10 mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Why smartXman?
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400 mb-8">
              <p>
                smartXman helps you find the best smart product picks without wasting hours online.
              </p>
              <p>
                We recommend smart picks for tech accessories, setup products, gaming gear, creator tools, productivity essentials, home decor, and budget-friendly finds in a simple and practical way.
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                Our goal is not to make you buy more.
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                Our goal is to help you buy better.
              </p>
            </div>
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-colors shadow-md hover:shadow-brand-500/25"
            >
              Learn More About smartXman <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right Column */}
          <div className="lg:w-1/2 w-full grid gap-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Simple Recommendations</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    No confusing jargon. Just clear product suggestions based on real use cases.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Budget-Friendly Picks</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Find products that match your needs and your budget.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Honest Buying Guidance</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    We explain who should buy, who should avoid, and what alternatives are worth checking.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
