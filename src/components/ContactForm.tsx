"use client";

import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Please fill in all fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([formData]);

      if (error) throw error;
      
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* Contact Form */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
        {status === "success" ? (
          <div className="py-12 text-center animate-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-slate-655 dark:text-slate-400 mb-8">
              Thank you for reaching out. We'll get back to you within 24-48 hours.
            </p>
            <button 
              onClick={() => setStatus("idle")}
              className="text-brand-600 font-medium hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-350">Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900 dark:text-slate-150" 
                  placeholder="Your name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-350">Email</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900 dark:text-slate-150" 
                  placeholder="your@email.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-350">Message</label>
                <textarea 
                  required 
                  rows={5} 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900 dark:text-slate-150" 
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button 
                disabled={status === "submitting"}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors text-sm uppercase tracking-wider font-bold"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Social Links */}
      <div className="space-y-8 w-full">
        <div>
          <h2 className="text-2xl font-bold mb-6">Connect with us</h2>
          <p className="text-slate-655 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Follow smartXman on social media for the latest tech reviews, setup inspirations, and budget finds.
          </p>
          
          <div className="space-y-4">
            <a href="https://www.linkedin.com/company/smartxman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">LinkedIn</h3>
                <p className="text-xs text-slate-500">Professional updates & news</p>
              </div>
            </a>

            <a href="https://www.instagram.com/official_smartxman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-md transition-all group">
              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instagram</h3>
                <p className="text-xs text-slate-500">Setup inspiration & reels</p>
              </div>
            </a>

            <a href="https://www.youtube.com/@smartxman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-red-500 dark:hover:border-red-500 hover:shadow-md transition-all group">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">YouTube</h3>
                <p className="text-xs text-slate-500">In-depth video reviews</p>
              </div>
            </a>
          </div>
        </div>
        
        <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 p-6 rounded-2xl">
          <h3 className="font-bold text-brand-900 dark:text-brand-100 mb-2 flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-600 dark:text-brand-400" /> Direct Email
          </h3>
          <p className="text-xs text-brand-800 dark:text-brand-200 mb-4 leading-relaxed">
            Prefer to send an email directly from your client? 
          </p>
          <a href="mailto:contact@smartxman.com" className="inline-flex font-medium text-brand-600 dark:text-brand-400 hover:underline text-sm font-semibold">
            contact@smartxman.com
          </a>
        </div>
      </div>
    </div>
  );
}
