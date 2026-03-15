import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { UserCircle, MapPin, Building, Briefcase, ChevronRight, Download, CheckCircle, AlertTriangle } from 'lucide-react';

const BorrowerProfile = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow w-full">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
                <Link to="/lender/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400 my-auto" />
                <span className="text-gray-900 font-medium">Borrower Profile</span>
              </nav>
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-primary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  SJ
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">Sarah Jenkins</h1>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6 text-sm text-gray-500">
                    <div className="mt-2 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-gray-400"/> UX Designer, Linear Inc.</div>
                    <div className="mt-2 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400"/> San Francisco, CA</div>
                    <div className="mt-2 flex items-center gap-1.5">< बिल्डिंग className="w-4 h-4 text-gray-400"/> Member since Oct 2024</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4 gap-3">
              <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2"/> Export Data</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Approve Loan</Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Diagnostics */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="bg-gray-50">
                  <h2 className="font-semibold text-gray-900">Intelligence Summary</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">FinPulse Score (FS)</p>
                      <p className="text-4xl font-extrabold text-green-600">94</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Risk Level</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                        Very Low
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Cash Flow Stability</span>
                        <span className="font-medium text-gray-900">Excellent</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Debt-to-Income (DTI)</span>
                        <span className="font-medium text-gray-900">18%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: '82%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Historical Default Prob.</span>
                        <span className="font-medium text-gray-900">0.4%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full" style={{width: '96%'}}></div></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gray-50">
                  <h2 className="font-semibold text-gray-900">Identity Details</h2>
                </CardHeader>
                <CardContent className="p-0 text-sm">
                  <div className="grid grid-cols-3 p-4 border-b border-gray-100">
                    <span className="col-span-1 text-gray-500">SSN</span>
                    <span className="col-span-2 font-medium text-gray-900">***-**-4582</span>
                  </div>
                  <div className="grid grid-cols-3 p-4 border-b border-gray-100">
                    <span className="col-span-1 text-gray-500">DOB</span>
                    <span className="col-span-2 font-medium text-gray-900">10/12/1988</span>
                  </div>
                  <div className="grid grid-cols-3 p-4">
                    <span className="col-span-1 text-gray-500">Phone</span>
                    <span className="col-span-2 font-medium text-gray-900">(415) 555-0198</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Deep Dive */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Details */}
              <Card>
                <CardHeader className="flex justify-between items-center bg-gray-50 flex-row">
                  <h2 className="font-semibold text-gray-900">Pending Application Details</h2>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-medium">In Review</span>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Requested Amount</p>
                      <p className="text-xl font-bold text-gray-900">$25,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Term</p>
                      <p className="text-xl font-bold text-gray-900">36 Months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Purpose</p>
                      <p className="font-medium text-gray-900 mt-1">Auto Purchase</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Affordability Est.</p>
                      <div className="flex items-center text-green-600 mt-1">
                        <CheckCircle className="w-5 h-5 mr-1" /> <span className="font-bold">Pass</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Accounts */}
              <Card>
                <CardHeader className="bg-gray-50">
                  <h2 className="font-semibold text-gray-900">Connected Accounts via Plaid</h2>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Balance</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Synced</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Chase Bank</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Checking</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">$14,205.50</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hour ago</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Wells Fargo</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Savings</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">$32,000.00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Amex</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Credit</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">-$1,450.00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day ago</td>
                      </tr>
                    </tbody>
                  </table>
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
                          <p className="text-xs text-gray-500">Verified by Jumio • Oct 24</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-indigo-600 text-sm px-2">View</Button>
                    </div>
                    <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white text-green-600 rounded shadow-sm"><CheckCircle className="w-5 h-5"/></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Pay Stubs (Last 60d)</p>
                          <p className="text-xs text-green-700">Auto-extracted via Plaid</p>
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
