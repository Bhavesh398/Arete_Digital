"use client";

import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa6";

const ContactForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setSubmitStatus("success");
      setIsSubmitting(false);
      
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
        setSubmitStatus("");
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-black-100 border border-white/[0.1] rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">
          Let&apos;s Get Started
        </h2>
        <p className="text-white/60 mb-6">
          Fill out the form below and we&apos;ll get back to you within 24 hours
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-black-200 rounded-lg">
            <FaPhone className="text-purple" />
            <div>
              <p className="text-xs text-white/60">Call Us</p>
              <p className="text-sm text-white">+91 9326491223</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-black-200 rounded-lg">
            <FaEnvelope className="text-purple" />
            <div>
              <p className="text-xs text-white/60">Email Us</p>
             <p className="text-xs text-white break-all">arete.digital.services@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-black-200 rounded-lg">
            <FaWhatsapp className="text-purple" />
            <div>
              <p className="text-xs text-white/60">WhatsApp</p>
              <p className="text-sm text-white">Chat Now</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black-200 border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-purple"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black-200 border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-purple"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black-200 border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-purple"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Service Interested In *
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black-200 border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-purple"
              >
                <option value="">Select a service</option>
                <option value="website">Website Development</option>
                <option value="seo">SEO Services</option>
                <option value="chatbot">AI Chatbot</option>
                <option value="social">Social Media Management</option>
                <option value="branding">Branding & Design</option>
                <option value="automation">CRM & Automation</option>
                <option value="complete">Complete Digital Transformation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">
              Tell us about your project *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-black-200 border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-purple resize-none"
              placeholder="Describe your business and what you're looking to achieve..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {submitStatus === "success" && (
            <p className="text-center text-green-500 font-semibold">
              ✓ Message sent successfully! We&apos;ll contact you soon.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;