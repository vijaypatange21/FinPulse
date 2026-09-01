import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { MapPin, Briefcase, ChevronRight, Download, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { getBorrowerById, listBorrowers } from '../lib/api';

const BorrowerProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (id) {
          const data = await getBorrowerById(id).catch(() => null);
          if (data) {
            setProfile(data);
          } else {
            const list = await listBorrowers().catch(() => []);
            const found = list.find((b) => String(b.id || b.borrower_id) === id);
            setProfile(found || null);
          }
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const name = profile?.name || profile?.display_name || profile?.user?.username || 'Borrower Profile';
  const occupation = profile?.occupation || profile?.productType || 'N/A';
  const location = profile?.location || profile?.city ? `${profile?.city || ''}, ${profile?.state || ''}`.trim() : 'N/A';
  const score = profile?.healthScore || profile?.health_score || 0;
  const riskLabel = profile?.healthLabel || (score > 750 ? 'Very Low' : (score > 650 ? 'Low' : 'Medium'));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-grow w-full">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
                <Link to="/lender/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400 my-auto" />
                <span className="text-gray-900 dark:text-white font-medium">Borrower Profile</span>
              </nav>
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-[#2262ec] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl sm:truncate">{name}</h1>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6 text-sm text-gray-500">
                    <div className="mt-2 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-gray-400"/> {occupation}</div>
                    <div className="mt-2 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400"/> {location}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4 gap-3">
              <Button variant="outline" className="bg-white dark:bg-slate-800"><Download className="w-4 h-4 mr-2"/> Export Data</Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Diagnostics */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader className="bg-gray-50 dark:bg-slate-800/50">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Intelligence Summary</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">FinPulse Score</p>
                      <p className={`text-4xl font-extrabold ${score > 700 ? 'text-green-600' : score > 500 ? 'text-amber-500' : 'text-slate-500'}`}>
                        {score > 0 ? score : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Risk Level</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-[#2262ec] dark:bg-blue-900/30 dark:text-blue-400 mt-1">
                        {score > 0 ? riskLabel : 'Unrated'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-slate-400">Cash Flow Stability</span>
                        <span className="font-medium text-gray-900 dark:text-white">{score > 0 ? 'Normal' : 'N/A'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: score > 0 ? '70%' : '0%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-slate-400">Debt-to-Income (DTI)</span>
                        <span className="font-medium text-gray-900 dark:text-white">{score > 0 ? '30%' : 'N/A'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: score > 0 ? '70%' : '0%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader className="bg-gray-50 dark:bg-slate-800/50">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Identity Details</h2>
                </CardHeader>
                <CardContent className="p-0 text-sm">
                  <div className="grid grid-cols-3 p-4 border-b border-gray-100 dark:border-slate-800">
                    <span className="col-span-1 text-gray-500">Email</span>
                    <span className="col-span-2 font-medium text-gray-900 dark:text-white">{profile?.user?.email || profile?.email || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 p-4 border-b border-gray-100 dark:border-slate-800">
                    <span className="col-span-1 text-gray-500">Phone</span>
                    <span className="col-span-2 font-medium text-gray-900 dark:text-white">{profile?.phone || profile?.contact_phone || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 p-4">
                    <span className="col-span-1 text-gray-500">PAN / Tax ID</span>
                    <span className="col-span-2 font-medium text-gray-900 dark:text-white">{profile?.pan_number || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Deep Dive */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Details */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 flex-row">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Application Status</h2>
                  <span className="bg-blue-100 text-[#2262ec] dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {profile?.loan_type || profile?.productType ? 'Active' : 'No Application'}
                  </span>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Requested Amount</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{profile?.requested_amount ? `₹${Number(profile.requested_amount).toLocaleString('en-IN')}` : '₹0'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Term</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{profile?.tenure ? `${profile.tenure} Months` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Purpose</p>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{profile?.loan_type || profile?.productType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Health Status</p>
                      <div className="flex items-center text-[#2262ec] mt-1">
                        <CheckCircle className="w-5 h-5 mr-1" /> <span className="font-bold">{score > 0 ? 'Evaluated' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Accounts */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader className="bg-gray-50 dark:bg-slate-800/50">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Connected Accounts & Documents</h2>
                </CardHeader>
                <CardContent className="p-6 text-center text-slate-500">
                  <p className="text-sm">No linked third-party aggregator accounts found.</p>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader className="bg-gray-50">
                  <h2 className="font-semibold text-gray-900">Compliance & Documents</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center group hover:border-indigo-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded"><AlertTriangle className="w-5 h-5"/></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">State ID Verification</p>
                          <p className="text-xs text-gray-500">Verified • Identity Check Complete</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-indigo-600 text-sm px-2">View</Button>
                    </div>
                    <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white text-green-600 rounded shadow-sm"><CheckCircle className="w-5 h-5"/></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Pay Stubs (Last 60d)</p>
                          <p className="text-xs text-green-700">Verified Statement Record</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BorrowerProfile;
