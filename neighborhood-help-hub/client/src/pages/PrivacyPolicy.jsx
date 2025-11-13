import React from "react";
import { ShieldCheck, Lock, UserCheck } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-700">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          We value your trust and are committed to protecting your personal
          information with transparency and care.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-10">
        {/* Info We Collect */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-3">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Information We Collect
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We collect basic details such as your name, email address, and activity within
            the platform to help you connect and interact with the community effectively.
          </p>
        </section>

        {/* How We Use Data */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              How We Use Your Data
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Your information helps us improve your experience, personalize your feed,
            enhance community safety, and provide better communication between users.
          </p>
        </section>

        {/* Data Protection */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Data Protection
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We use encrypted servers, secure authentication, and regular system updates
            to protect your data from unauthorized access and misuse.
          </p>
        </section>
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>
          Last updated on <span className="font-medium text-gray-700">October 2025</span>
        </p>
        <p>
          If you have any questions, please{" "}
          <a href="/contact" className="text-blue-600 hover:underline font-medium">
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
