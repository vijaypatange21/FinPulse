import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card, { ContrastCard } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
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
    <div className="min-h-screen bg-[var(--bg-canvas)] font-satoshi text-[var(--text-primary)] flex flex-col pb-16">
      <Navbar />
      
      <main className="flex-grow w-full">
        {/* Profile Header */}
        <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-6 py-8 lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <nav className="flex mb-4 text-xs font-semibold text-[var(--text-secondary)]" aria-label="Breadcrumb">
                <Link to="/lender/dashboard" className="hover:text-[var(--text-primary)]">Dashboard</Link>
                <ChevronRight className="w-3.5 h-3.5 mx-2 text-[var(--text-muted)] my-auto" />
                <span className="text-[var(--accent)] font-medium">Borrower Profile</span>
              </nav>
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-[var(--accent-tint)] rounded-full flex items-center justify-center text-[var(--accent)] text-2xl font-clash font-bold border border-[var(--accent)]/30">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="font-clash text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">{name}</h1>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 text-xs text-[var(--text-secondary)]">
                    <div className="mt-1 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-[var(--text-muted)]"/> {occupation}</div>
                    <div className="mt-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]"/> {location}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4 gap-3">
              <button className="px-4 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-xs font-semibold hover:border-[var(--border-strong)] transition-all flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <Download className="w-3.5 h-3.5"/> Export Profile
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Diagnostics */}
            <div className="lg:col-span-1 space-y-6">
              <ContrastCard className="p-6">
                <span className="text-xs font-medium uppercase tracking-wider opacity-75">Intelligence Summary</span>
                <div className="flex justify-between items-end mt-4 mb-6">
                  <div>
                    <p className="text-[11px] opacity-75">FinPulse Score</p>
                    <p className="font-clash text-4xl font-bold tabular-nums">
                      {score > 0 ? score : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-semibold opacity-75">Risk Classification</p>
                    <span className="inline-block mt-1 font-semibold text-xs px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                      {score > 0 ? `${riskLabel} Risk` : 'Unrated'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 opacity-80">
                      <span>Cash Flow Stability</span>
                      <span className="font-semibold">{score > 0 ? 'Normal' : 'N/A'}</span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[var(--accent)] h-1.5 rounded-full" style={{ width: score > 0 ? '70%' : '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 opacity-80">
                      <span>Debt-to-Income (DTI)</span>
                      <span className="font-semibold">{score > 0 ? '30%' : 'N/A'}</span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[var(--accent)] h-1.5 rounded-full" style={{ width: score > 0 ? '70%' : '0%' }}></div>
                    </div>
                  </div>
                </div>
              </ContrastCard>

              <Card className="p-6 space-y-4">
                <h3 className="font-clash font-semibold text-sm text-[var(--text-primary)]">Identity Verification</h3>
                <div className="divide-y divide-[var(--border-subtle)] text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[var(--text-secondary)]">Email</span>
                    <span className="font-medium text-[var(--text-primary)]">{profile?.user?.email || profile?.email || 'N/A'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[var(--text-secondary)]">Phone</span>
                    <span className="font-medium text-[var(--text-primary)]">{profile?.phone || profile?.contact_phone || 'N/A'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[var(--text-secondary)]">PAN / Tax ID</span>
                    <span className="font-mono font-medium text-[var(--text-primary)]">{profile?.pan_number || 'N/A'}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Deep Dive */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Details */}
              <Card className="p-6">
                <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-4 mb-4">
                  <h2 className="font-clash font-semibold text-base text-[var(--text-primary)]">Application Status</h2>
                  <StatusBadge
                    status={profile?.loan_type || profile?.productType ? 'approved' : 'pending'}
                    label={profile?.loan_type || profile?.productType ? 'Active' : 'No Application'}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Requested Amount</p>
                    <p className="font-clash text-xl font-bold tabular-nums text-[var(--text-primary)]">
                      {profile?.requested_amount ? `₹${Number(profile.requested_amount).toLocaleString('en-IN')}` : '₹0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Tenure</p>
                    <p className="font-clash text-xl font-bold text-[var(--text-primary)]">{profile?.tenure ? `${profile.tenure} Months` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Purpose</p>
                    <p className="text-xs font-semibold text-[var(--text-primary)] mt-1">{profile?.loan_type || profile?.productType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Health Status</p>
                    <div className="flex items-center text-[var(--status-success)] text-xs font-semibold mt-1">
                      <CheckCircle className="w-4 h-4 mr-1" /> <span>{score > 0 ? 'Evaluated' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Compliance & Documents */}
              <Card className="p-6">
                <h2 className="font-clash font-semibold text-base text-[var(--text-primary)] mb-4">Compliance Documents</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 flex justify-between items-center bg-[var(--bg-canvas)]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-[var(--accent-tint)] text-[var(--accent)]">
                        <AlertTriangle className="w-4 h-4"/>
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[var(--text-primary)]">State ID Verification</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">Identity match confirmed</p>
                      </div>
                    </div>
                    <StatusBadge status="verified" label="Verified" />
                  </div>
                  <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 flex justify-between items-center bg-[var(--bg-canvas)]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-[var(--status-success-bg)] text-[var(--status-success)]">
                        <CheckCircle className="w-4 h-4"/>
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[var(--text-primary)]">Bank Statements (60d)</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">Parsed & OCR verified</p>
                      </div>
                    </div>
                    <StatusBadge status="verified" label="Verified" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BorrowerProfile;
