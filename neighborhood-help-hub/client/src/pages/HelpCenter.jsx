import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How to create an account and verify your email?",
      answer:
        "Go to the Register page, fill out your details, and click 'Sign Up'. You will receive a verification email — open it and click the verification link to activate your account.",
    },
    {
      question: "How to post a request or offer help?",
      answer:
        "After logging in, go to the Dashboard and click on 'Create Post'. Choose your category (Request or Offer), write details, and submit. Your post will appear in the community feed.",
    },
    {
      question: "How to message or chat with other users?",
      answer:
        "Open a user's profile or one of their posts, then click on the 'Message' or 'Chat' button. You can then exchange messages securely within the app.",
    },
    {
      question: "How to report inappropriate content?",
      answer:
        "Click the three dots (...) on the post or user profile, select 'Report', and choose a reason. Our admin team will review and take action accordingly.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Help Center
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        Welcome to the Neighborhood Help Hub Help Center!  
        Click on a question below to view detailed instructions.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none"
            >
              <span className="text-lg font-medium text-gray-800">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-5 pb-4 text-gray-600 border-t border-gray-200 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-gray-600">
        Still need help?{" "}
        <a
          href="/contact"
          className="text-blue-600 font-medium hover:underline"
        >
          Contact Us
        </a>
      </p>
    </div>
  );
};

export default HelpCenter;
