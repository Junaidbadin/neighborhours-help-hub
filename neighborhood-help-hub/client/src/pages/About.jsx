import React from "react";
import { Users, HeartHandshake, Globe, Target } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          About <span className="text-blue-600">Neighborhood Help Hub</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          We’re building a stronger, kinder, and more connected community —
          one helping hand at a time.
        </p>
      </div>

      {/* Mission and Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-3">
            <Target className="text-blue-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            Our mission is to connect neighbors and create a trusted space where
            people can share help, resources, and kindness. Whether it’s lending
            a tool, offering advice, or helping in emergencies — we make it easy
            to give and receive support locally.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="text-blue-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">Our Vision</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            We envision a world where every neighborhood feels connected, safe,
            and supportive — powered by genuine human connections and digital
            collaboration.
          </p>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-100">
            <HeartHandshake className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Empathy</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We believe in understanding and supporting one another through
              compassion and kindness.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-100">
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Community</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Together, we’re stronger. Our platform thrives on collaboration,
              trust, and inclusivity.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-100">
            <Target className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Purpose</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Every feature, connection, and interaction is designed to make a
              positive difference in people’s lives.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm mt-12 border-t pt-4">
        © {new Date().getFullYear()} Neighborhood Help Hub. Built with ❤️ to
        connect people and communities.
      </p>
    </div>
  );
};

export default About;
