import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Heart, 
  MapPin, 
  MessageCircle, 
  Star, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Connect with Neighbors',
      description: 'Find and connect with people in your local community who are ready to help or need assistance.'
    },
    {
      icon: <Heart className="w-8 h-8 text-primary-600" />,
      title: 'Help Each Other',
      description: 'Offer help or request assistance with daily tasks, services, and support in your neighborhood.'
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-600" />,
      title: 'Location-Based',
      description: 'Find help requests and offers near you using our location-based filtering system.'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary-600" />,
      title: 'Real-Time Chat',
      description: 'Communicate instantly with other users through our built-in messaging system.'
    },
    {
      icon: <Star className="w-8 h-8 text-primary-600" />,
      title: 'Rating System',
      description: 'Rate and review your experiences to build trust and reputation in the community.'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Safe & Secure',
      description: 'Your safety is our priority with verified profiles and secure communication channels.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Users' },
    { number: '25,000+', label: 'Help Requests' },
    { number: '50+', label: 'Cities Covered' },
    { number: '98%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Building Stronger
              <span className="text-primary-600"> Communities</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with your neighbors, offer help, and build meaningful relationships in your local community. 
              Together, we can make our neighborhoods better places to live.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/create-post"
                    className="bg-white hover:bg-gray-50 text-primary-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors border-2 border-primary-600"
                  >
                    Create a Post
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/posts"
                    className="bg-white hover:bg-gray-50 text-primary-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors border-2 border-primary-600"
                  >
                    Browse Posts
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Neighborhood Help Hub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide all the tools you need to connect with your community and make a positive impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting started is simple and takes just a few minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sign Up & Create Profile
              </h3>
              <p className="text-gray-600">
                Join our community by creating your profile and telling us about your skills and interests.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Browse or Create Posts
              </h3>
              <p className="text-gray-600">
                Look for help requests in your area or create your own post offering assistance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Connect & Help
              </h3>
              <p className="text-gray-600">
                Chat with neighbors, coordinate help, and build lasting relationships in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of neighbors who are already helping each other and building stronger communities.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>Join Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

