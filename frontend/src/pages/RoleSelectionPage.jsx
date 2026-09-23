import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card, { ContrastCard } from '../components/ui/Card';
import { User, Briefcase, ArrowRight } from 'lucide-react';

const RoleSelectionPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] font-satoshi text-[var(--text-primary)] flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6 sm:p-10">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Welcome to FinPulse
            </span>
            <h1 className="font-clash text-3xl sm:text-5xl font-bold text-[var(--text-primary)] mt-1 mb-3">
              Choose Your Platform Experience
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Select your institution or borrower role to access your dedicated financial workspace.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Borrower Choice */}
            <Link to="/register/borrower" className="block group">
              <Card className="h-full p-8 flex flex-col items-center text-center justify-between transition-all duration-300 hover:border-[var(--accent)] group-hover:-translate-y-1">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <User className="w-8 h-8" />
                  </div>
                  <h2 className="font-clash text-2xl font-bold text-[var(--text-primary)] mb-2">
                    I am a Borrower
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                    Connect your financial accounts, get a real-time AI credit health evaluation, and apply for competitive loans from verified institutional lenders.
                  </p>
                </div>
                <div className="flex items-center text-[var(--accent)] font-semibold text-xs gap-1.5">
                  Register as Borrower <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            {/* Lender Choice */}
            <Link to="/register/lender" className="block group">
              <ContrastCard className="h-full p-8 flex flex-col items-center text-center justify-between transition-all duration-300 group-hover:-translate-y-1 shadow-2xl">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h2 className="font-clash text-2xl font-bold mb-2">
                    I am a Lender
                  </h2>
                  <p className="text-xs opacity-80 leading-relaxed mb-6">
                    Underwrite with deep learning risk scoring, ingest verified bank statements with automated OCR, and continuously monitor loan portfolios.
                  </p>
                </div>
                <div className="flex items-center font-bold text-xs gap-1.5">
                  Register as Institution <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </ContrastCard>
            </Link>
          </div>
          
          <div className="text-center mt-12 text-xs text-[var(--text-secondary)]">
            Already have an account? <Link to="/login" className="text-[var(--accent)] font-semibold hover:underline ml-1">Log in</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoleSelectionPage;
