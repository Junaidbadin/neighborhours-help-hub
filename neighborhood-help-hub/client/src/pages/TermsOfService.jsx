import React from "react";
import { ShieldCheck, FileText, AlertCircle } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Terms of Service</h1>
        </div>

        <p className="text-gray-700 text-base mb-6 leading-relaxed">
          By using the <strong>Neighborhood Help Hub</strong> platform, you agree
          to the following terms and conditions. Please read carefully before
          using our services.
        </p>

        {/* Section 1 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            1. Use of the Platform
          </h2>
          <p className="text-gray-700 text-base mt-1 leading-relaxed">
            You must be at least 13 years old to use this platform. You agree to
            use it responsibly and avoid any actions that harm other users or
            disrupt community harmony.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            2. User Content
          </h2>
          <p className="text-gray-700 text-base mt-1 leading-relaxed">
            You are solely responsible for the content you post. Inappropriate,
            offensive, or misleading content may result in removal or account
            suspension without notice.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            3. Termination
          </h2>
          <p className="text-gray-700 text-base mt-1 leading-relaxed">
            The platform reserves the right to terminate or suspend your account
            if you violate community rules, misuse the system, or engage in
            harmful behavior.
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-5 border-t pt-3 text-center">
          © {new Date().getFullYear()} Neighborhood Help Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
