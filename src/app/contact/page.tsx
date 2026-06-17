import ContactForm from "@/components/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | smartXman",
  description: "Have a question, want to suggest a product, or interested in a partnership? We'd love to hear from you.",
  alternates: {
    canonical: "https://smartxman.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-slate-900 dark:text-white">Contact Us</h1>
      <p className="text-lg text-slate-655 dark:text-slate-400 mb-12 text-center max-w-2xl mx-auto leading-relaxed">
        Have a question, want to suggest a product, or interested in a partnership? We'd love to hear from you.
      </p>
      <ContactForm />
    </div>
  );
}
