import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent } from '../components/ui/Card';
import { User, Briefcase, ArrowRight } from 'lucide-react';

const RoleSelectionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How do you want to use FinPulse?</h1>
            <p className="text-xl text-gray-600">Select your role to get started with the right experience for you.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Borrower Choice */}
            <Link to="/register/borrower" className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50 group-hover:-translate-y-1">
                <CardContent className="p-10 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <User className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Borrower</h2>
                  <p className="text-gray-600 flex-grow mb-8">
                    Apply for loans, monitor your credit health, and get personalized financial recommendations.
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    Continue as Borrower <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Lender Choice */}
            <Link to="/register/lender" className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-indigo-500/50 group-hover:-translate-y-1">
                <CardContent className="p-10 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Briefcase className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Lender</h2>
                  <p className="text-gray-600 flex-grow mb-8">
                    Analyze borrower risk, deploy capital effectively, and monitor portfolio performance in real-time.
                  </p>
                  <div className="flex items-center text-indigo-600 font-semibold">
                    Continue as Lender <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="text-center mt-12 text-gray-500">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoleSelectionPage;
