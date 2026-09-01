import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <style>{`
        .pulse-logo {
            background: linear-gradient(90deg, #2262ec 0%, #60a5fa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
        }
        @keyframes float-delay {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-16px); }
            100% { transform: translateY(0px); }
        }
        @keyframes float-slow {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }
        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.2; }
            100% { transform: scale(0.8); opacity: 0.5; }
        }
        @keyframes dash-move {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -200; }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 6s ease-in-out infinite 1s; }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite 0.5s; }
        .animate-pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }
        .animate-dash { animation: dash-move 20s linear infinite; }
      `}</style>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#2262ec]/10 bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-icons text-[#2262ec] text-3xl">show_chart</span>
            <span className="text-2xl font-extrabold tracking-tight pulse-logo">FinPulse</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a className="hover:text-[#2262ec] transition-colors" href="#">Solutions</a>
            <a className="hover:text-[#2262ec] transition-colors" href="#">Platform</a>
            <a className="hover:text-[#2262ec] transition-colors" href="#">Resources</a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200" to="/login">Log In</Link>
            <Link className="bg-[#2262ec] hover:bg-[#2262ec]/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#2262ec]/20" to="/role-selection">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2262ec]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#2262ec]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#2262ec]/10 text-[#2262ec] text-xs font-bold tracking-widest uppercase mb-6 border border-[#2262ec]/20">The Future of Lending is Here</span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.08]">
                Transform Lending with <span className="text-[#2262ec]">Real-Time</span> Financial Intelligence
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Leverage AI to assess risk, monitor financial health, and close loans faster than ever before. Empowering both lenders and borrowers through transparency.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link className="w-full sm:w-auto px-8 py-4 bg-[#2262ec] text-white font-bold rounded-xl shadow-xl shadow-[#2262ec]/30 hover:scale-[1.02] transition-transform" to="/role-selection">
                  For Lenders
                </Link>
                <Link className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border-2 border-[#2262ec]/20 hover:border-[#2262ec]/50 text-slate-800 dark:text-white font-bold rounded-xl transition-all" to="/role-selection">
                  For Borrowers
                </Link>
              </div>
            </div>

            {/* Right: Animated Hero Graphic */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
              <div className="relative aspect-square">
                {/* Background circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 md:w-96 md:h-96 rounded-full border-2 border-dashed border-[#2262ec]/15 animate-pulse-ring"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border border-[#2262ec]/10 bg-[#2262ec]/5 dark:bg-[#2262ec]/10"></div>
                </div>

                {/* Center orb */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="relative">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#2262ec] to-blue-400 shadow-2xl shadow-[#2262ec]/40 flex items-center justify-center">
                      <span className="material-icons text-white text-5xl md:text-6xl">insights</span>
                    </div>
                    <div className="absolute -inset-4 rounded-full border border-[#2262ec]/30 animate-pulse-ring"></div>
                  </div>
                </div>

                {/* Floating Stat Card 1 — Top Left */}
                <div className="absolute top-4 left-0 md:top-6 md:-left-4 animate-float z-20">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-black/20 p-4 border border-slate-100 dark:border-slate-700 w-44 md:w-52 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                        <span className="material-icons text-green-500 text-base">trending_up</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Health Score</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">847</span>
                      <span className="text-xs font-bold text-green-500 mb-1">+12.3%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{width: '84%'}}></div>
                    </div>
                  </div>
                </div>

                {/* Floating Stat Card 2 — Top Right */}
                <div className="absolute top-0 right-0 md:top-2 md:-right-4 animate-float-delay z-20">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-black/20 p-4 border border-slate-100 dark:border-slate-700 w-44 md:w-52 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#2262ec]/15 flex items-center justify-center">
                        <span className="material-icons text-[#2262ec] text-base">speed</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Risk Analysis</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Low</span>
                      <span className="text-xs font-bold text-[#2262ec] mb-1">AI Score</span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full ${i < 4 ? 'bg-[#2262ec]' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Stat Card 3 — Bottom Left */}
                <div className="absolute bottom-8 -left-2 md:bottom-12 md:-left-6 animate-float-slow z-20">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-black/20 p-4 border border-slate-100 dark:border-slate-700 w-44 md:w-52 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                        <span className="material-icons text-purple-500 text-base">account_balance</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loan Portfolio</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">₹24Cr</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">142 Active Borrowers</p>
                  </div>
                </div>

                {/* Floating Stat Card 4 — Bottom Right */}
                <div className="absolute bottom-0 right-2 md:bottom-4 md:-right-2 animate-float z-20">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-black/20 p-3.5 border border-slate-100 dark:border-slate-700 w-40 md:w-48 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                        <span className="material-icons text-amber-500 text-sm">bolt</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Approval Speed</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">4.2hrs</span>
                      <span className="text-[10px] font-bold text-amber-500 mb-0.5">Avg</span>
                    </div>
                  </div>
                </div>

                {/* Decorative connector lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 400">
                  <line x1="200" y1="200" x2="80" y2="80" stroke="currentColor" className="text-[#2262ec]/20" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="200" y1="200" x2="320" y2="70" stroke="currentColor" className="text-[#2262ec]/20" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="200" y1="200" x2="60" y2="310" stroke="currentColor" className="text-[#2262ec]/20" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="200" y1="200" x2="330" y2="340" stroke="currentColor" className="text-[#2262ec]/20" strokeWidth="1" strokeDasharray="6 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-[#2262ec] dark:bg-[#2262ec]/90 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="py-6 md:py-0">
              <div className="text-4xl font-extrabold mb-1">30-45 Days</div>
              <div className="text-blue-100/80 font-medium">Saved in Processing Time</div>
            </div>
            <div className="py-6 md:py-0">
              <div className="text-4xl font-extrabold mb-1">40%</div>
              <div className="text-blue-100/80 font-medium">Reduction in Default Risk</div>
            </div>
            <div className="py-6 md:py-0">
              <div className="text-4xl font-extrabold mb-1">99.9%</div>
              <div className="text-blue-100/80 font-medium">Data Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-[#101622]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Finance</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic">Precision analytics powered by advanced neural networks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-[#2262ec]/10 bg-[#f6f6f8] dark:bg-slate-800/50 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-xl bg-[#2262ec]/10 text-[#2262ec] flex items-center justify-center mb-6 group-hover:bg-[#2262ec] group-hover:text-white transition-colors">
                <span className="material-icons text-3xl">analytics</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Alternative Credit Scoring</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Go beyond traditional FICO. Our AI analyzes thousands of data points including cash flow and spending patterns to find hidden opportunities.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-[#2262ec]/10 bg-[#f6f6f8] dark:bg-slate-800/50 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-xl bg-[#2262ec]/10 text-[#2262ec] flex items-center justify-center mb-6 group-hover:bg-[#2262ec] group-hover:text-white transition-colors">
                <span className="material-icons text-3xl">speed</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Real-Time Monitoring</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Continuous health tracking ensures you're never caught off guard. Get instant alerts when risk profiles change or opportunities arise.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-[#2262ec]/10 bg-[#f6f6f8] dark:bg-slate-800/50 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-xl bg-[#2262ec]/10 text-[#2262ec] flex items-center justify-center mb-6 group-hover:bg-[#2262ec] group-hover:text-white transition-colors">
                <span className="material-icons text-3xl">psychology</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Transparent Insights</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Explainable AI results. We don't just provide a score; we provide the 'why' behind every decision, ensuring full regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#f6f6f8] dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            {/* Image Side */}
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img className="w-full h-auto object-cover aspect-[4/3]" alt="Financial professionals working with AI software on screens" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBohapDc2-kPWxN6CYAatv046dgLgLGAlyVmNmMbxPx1EBgEEd_wYsqSxIJQXGNRzuFzPp4Ao__rXNjzToMYrA20N8myXctQPD3mH9tfnjzxgi1qqUIeJIXQlx4Ir74Z2GNe_LB0th8Xqlx9tppv_gHjq18R67nnzL8GyJLYoCpQMjynVUwLa08m1suv9SnOA-iLbyz5VQJAURCsCoULv51lGz05bEj613aqBgFMIMm3Q-pMpKg23Y6UDGNWUUlffF3jht-s9yIJbM"/>
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 p-6 rounded-xl shadow-lg border-l-4 border-[#2262ec]">
                  <p className="text-sm font-semibold italic text-slate-800 dark:text-slate-100">"FinPulse has completely revolutionized our risk assessment protocol. We've seen a massive jump in efficiency."</p>
                  <span className="block mt-2 text-xs font-bold text-[#2262ec] uppercase tracking-wide">— Director of Lending, GlobalBank</span>
                </div>
              </div>
            </div>
            {/* Content Side */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">How it Works</h2>
              <div className="space-y-12">
                {/* Path 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#2262ec]/20 text-[#2262ec] p-1.5 rounded-full"><span className="material-icons text-sm">business</span></span>
                    <h4 className="text-lg font-bold">For Lenders</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2262ec] text-white flex items-center justify-center font-bold text-sm">1</span>
                      <div>
                        <h5 className="font-bold mb-1">Integrate Data</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Connect your existing CRM and bank feeds via our secure API.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2262ec] text-white flex items-center justify-center font-bold text-sm">2</span>
                      <div>
                        <h5 className="font-bold mb-1">AI Risk Assessment</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Our engine runs thousands of simulations to determine health scores.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
                {/* Path 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-6 text-slate-500">
                    <span className="bg-slate-200 dark:bg-slate-700 p-1.5 rounded-full"><span className="material-icons text-sm">person</span></span>
                    <h4 className="text-lg font-bold">For Borrowers</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4 opacity-75">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-sm">1</span>
                      <div>
                        <h5 className="font-bold mb-1">Secure Connection</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Grant temporary access to financial statements with 256-bit encryption.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 opacity-75">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-sm">2</span>
                      <div>
                        <h5 className="font-bold mb-1">Dashboard Insights</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive a clear path to loan approval and financial health tips.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white dark:bg-[#101622]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by Forward-Thinking Financial Institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <img alt="Visa" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA904sx6jv-Sk42mbJbqadUvbJTMej_CO1k9g6FQDG_erJLvY6hxT2jBjXTnpEFAssofNpFUr6llEJiW2YZbhr1fXl_EZ4_BXKWZ0xZ_zZSFYCXGcPZflXeSrQ5efuV1WQtm9azgqn9UV0QWPtDPlp1HPU8Bvn-sg-DIl2EwaWnDkbDN9NZeU2J2yz0o1mMvG9j-sMPB-yJ7l9GAK1cwctq1q3f2yU7sl1a5QzFA849tgKXu5IOPDuicEr9GJEnk0gy8IJGvEZcuJM"/>
            <img alt="Mastercard" className="h-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEALK8tt6KHFUjiO5bHuQH3NwCxcGtcxycX24S5KD7aFdDZoC-mdbiiPQv1Seei_sVNsyOMeXviWkL_iFtPs26lxPsWtyuymMJY5W4gDT4tAK7KLHWDEtM5pnxwxv5qYLnLMB9yKOCccatyBCWN0UuyivUBKLO4zx116OwgHiadVWRQfgOjDZ5WWSnw66TWb-al5kl4aY0n1-p5qVw3xPwrbO_Cw0kYU7YzUmvwj6mxBm7uL_SqdXvLExcrSh4t3NbyOzuyrnINr4"/>
            <img alt="PayPal" className="h-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhLVfKM0gU3yXafOqbNlo1fI3wBFnnII45BN9WFUosX62GTKp-UCdeGdDJ7Ll3OaMQ2rCJNTvH02gyWzFlsNEUyM48YxPN8EWgPmOeV1iLxZJ5aGa1X3d2zpUxcQZKkgWZCAHRFpKs2rxxe6qgVyWvEBiCYoZ_7xx-P2DuN8zsQIwxyU9e3QmbSnRgLtQcDJVP3ylJ-DLQNLQS8EGH3m_rASRE4mI8kfNDBAsA1BXWK61J6m7vETAFLRmuoy7sY2-OhuMvfoMYaQ0"/>
            <img alt="Chase" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc3pZ0NDslyHWp3ltodf9nNcIuakvUfsDBX4BzjcXj40h4F6Vz-60xFOeTQ1AB1msxzed0-_YFANRZxSa-L02Ud9f7IOj0jS_ADD0VWk9lJdYGzFmc3A1Vr7k-9tK7mrIabZWwMfKIhtUTOQhJ8FDTKDLAIRL_wTsgQXkvXcQvrb0OcMLJrGLODYjTNitvJfvDplg_1j3aEusTu1l1VXV3KN75bV9o8WdbHDn2QeAf3WEq4u_tG2WTSLkPST2WINErW05jMEpPyPA"/>
            <img alt="Goldman Sachs" className="h-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUpzhJpVpGaQPkiJ8xXy3KL-j_EHob-fzo1zYyC65nTWV3tC8QqgAFHw3nZ6QOvPW9DxDBr88ZVccqIDNHIQfy57gJmt4Z1LDbY_YLqsohxChIhYLj62PxFk_Cba2EcoSKaGLcQcWi6CvI3Rp6h-4lDvxzsakRDtXRTgexocBQURn6FjQEeJsZj2-2cxN4oLXZvMDgpE58HuobpqYUM0d4p_gyrd7jyvxH8O4Ei4KN5oRagSc5XnY2GR2h6w_rC1cV6SHm426B2Zk"/>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#2262ec] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
                <path d="M0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="white" strokeWidth="0.5"></path>
                <path d="M0 70 Q 25 45, 50 70 T 100 70" fill="none" stroke="white" strokeWidth="0.5"></path>
                <path d="M0 30 Q 25 5, 50 30 T 100 30" fill="none" stroke="white" strokeWidth="0.5"></path>
              </svg>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Ready to supercharge your lending pipeline?</h2>
              <p className="text-xl text-blue-100/80 mb-10">Join 500+ financial institutions using FinPulse to make smarter, faster decisions.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/role-selection" className="px-10 py-4 bg-white text-[#2262ec] font-extrabold rounded-xl hover:bg-slate-50 transition-colors shadow-xl">Request a Demo</Link>
                <Link to="/role-selection" className="px-10 py-4 bg-[#2262ec]/20 border border-white/30 text-white font-extrabold rounded-xl hover:bg-[#2262ec]/30 transition-colors">Speak to Sales</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-icons text-[#2262ec] text-2xl">show_chart</span>
                <span className="text-xl font-bold pulse-logo">FinPulse</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                The world's leading AI platform for real-time financial health and loan risk intelligence.
              </p>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#2262ec] hover:text-white transition-all" href="#"><span className="material-icons text-sm">public</span></a>
                <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#2262ec] hover:text-white transition-all" href="#"><span className="material-icons text-sm">camera_alt</span></a>
                <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#2262ec] hover:text-white transition-all" href="#"><span className="material-icons text-sm">groups</span></a>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-6">Product</h5>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Scoring Engine</a></li>
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Monitoring</a></li>
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">API Docs</a></li>
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Press</a></li>
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Legal</h5>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">© 2024 FinPulse Intelligence Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1"><span className="material-icons text-xs text-green-500">fiber_manual_record</span> All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
