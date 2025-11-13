import React, { useState } from "react";
import { Send, Mail, User, MessageSquare } from "lucide-react";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        Contact Us
      </h1>
      <p className="text-gray-600 mb-6 text-center text-sm">
        Have questions or feedback? Fill out the form below — our support team
        will reply within 24 hours.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow border border-gray-200"
      >
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 text-sm mb-1">
            <User className="w-4 h-4 text-blue-500" /> Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 text-sm mb-1">
            <Mail className="w-4 h-4 text-blue-500" /> Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 text-sm mb-1">
            <MessageSquare className="w-4 h-4 text-blue-500" /> Message
          </label>
          <textarea
            name="message"
            rows="3"
            placeholder="Write your message..."
            value={form.message}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            required
          ></textarea>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 mx-auto hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" /> Send
          </button>
          {sent && (
            <p className="text-green-600 mt-3 text-sm animate-fade-in">
              ✅ Thank you! We’ll get back to you soon.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
