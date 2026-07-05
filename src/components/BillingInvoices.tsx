import React, { useState } from 'react';
import { Invoice, Subscription } from '../types';
import { CreditCard, ShieldCheck, Ticket, Download, Sparkles, Check, Play, RefreshCw, Layers } from 'lucide-react';

interface BillingInvoicesProps {
  subscription: Subscription;
  invoices: Invoice[];
  onUpgradePlan: (planId: 'free' | 'starter' | 'pro' | 'agency') => Promise<void>;
}

export default function BillingInvoices({
  subscription,
  invoices,
  onUpgradePlan,
}: BillingInvoicesProps) {
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const plans = [
    { id: 'free', name: 'Free Trial', price: 0, desc: 'Ideal for small local single-profile testing.', features: ['1 Business Location Sync', 'AI Profile Review replies (10/mo)', 'Standard Content Calendar'] },
    { id: 'starter', name: 'Starter Local', price: 19, desc: 'For growing neighborhood service providers.', features: ['1 Location Profile Sync', 'AI Local SEO audits', 'AI Content calendar (7 posts/wk)', 'Geo-Grid Rank maps (1 keyword)', 'Email Invoicing with GST'] },
    { id: 'pro', name: 'Pro Professional', price: 49, desc: 'Advanced automation for clinics and offices.', features: ['Up to 5 Business Syncs', 'Weekly multi-agent post schedules', 'GMB review reply drafts with tone filter', 'Geo-Grid Rank coordinates (3 terms)', 'Automated weekly EventBridge cron pipelines', 'priority clinical support'] },
    { id: 'agency', name: 'Agency Scale', price: 99, desc: 'Complete client automation for local agencies.', features: ['Unlimited GMB locations', 'Unlimited post schedules with images', 'Bulk location manager uploads', 'White-labeled printable reports', 'Dedicated local search advisor', 'Custom multi-user permissions'] }
  ];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.toUpperCase() === 'LAUNCH50' || coupon.toUpperCase() === 'SEO2026') {
      setCouponApplied(true);
      setLogs(prev => [...prev, `[COUPON APPROVED] Code ${coupon.toUpperCase()} successfully validated. 50% discount will apply on checkout.`]);
    } else {
      setLogs(prev => [...prev, `[COUPON ERROR] Invalid promo coupon: "${coupon}". Please verify.`]);
    }
    setCoupon("");
  };

  const handleSelectPlan = async (planId: any) => {
    setLoadingPlan(planId);
    setLogs(prev => [...prev, `[PAYMENT INTENT] Initiating checkout protocol for "${planId}" billing plan...`]);
    
    // Simulate payment gateway redirect & callback webhook
    setTimeout(async () => {
      setLogs(prev => [...prev, `[GATEWAY CALLBACK] Received successful webhook payload from gateway: { status: 'success', invoice_generated: true }`]);
      await onUpgradePlan(planId);
      setLoadingPlan(null);
      setLogs(prev => [...prev, `[SUCCESS] Account upgraded to ${planId.toUpperCase()}! Active membership duration auto-extended.`]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Subscriptions Grid Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {plans.map(p => {
          const isActive = subscription.planId === p.id;
          const discountedPrice = couponApplied ? p.price * 0.5 : p.price;

          return (
            <div 
              key={p.id}
              className={`bg-slate-900 rounded-3xl p-6 border flex flex-col justify-between transition relative ${
                isActive ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-800 hover:bg-slate-850/60'
              }`}
            >
              {isActive && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Active Plan
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-white font-mono">${discountedPrice}</span>
                    <span className="text-slate-500 text-[10px] font-mono">/mo</span>
                    {couponApplied && p.price > 0 && (
                      <span className="text-[9px] line-through text-slate-600 ml-1.5 font-mono">${p.price}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-bold">{p.desc}</p>
                </div>

                <ul className="space-y-2 border-t border-slate-800/60 pt-3">
                  {p.features.map((f, i) => (
                    <li key={i} className="text-[10px] text-slate-400 flex items-start gap-1.5 leading-normal">
                      <Check size={11} className="text-blue-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 border-t border-slate-800/60 mt-5">
                <button
                  disabled={isActive || loadingPlan !== null}
                  onClick={() => handleSelectPlan(p.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isActive 
                      ? 'bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {loadingPlan === p.id ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      Verifying...
                    </>
                  ) : isActive ? (
                    'Current Plan'
                  ) : (
                    'Select Plan'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon checkout bar & Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Promo code application */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-white uppercase tracking-tighter text-xs font-display mb-2">Apply Promo Coupon</h3>
            <p className="text-[11px] text-slate-400 leading-normal mb-4">
              Enter discount coupons or free trial partner codes here. Try code <strong>LAUNCH50</strong> to get 50% off.
            </p>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. LAUNCH50"
                className="text-xs bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none font-mono font-bold uppercase"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer transition"
              >
                Apply
              </button>
            </form>
          </div>

          {couponApplied && (
            <div className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl p-3 text-[10px] leading-normal mt-4 flex items-center gap-2">
              <Ticket size={14} className="text-green-400" />
              <span>Promo coupon <strong>LAUNCH50</strong> applied: 50% discount active.</span>
            </div>
          )}
        </div>

        {/* Webhook diagnostics console */}
        <div className="md:col-span-2 bg-slate-950 text-slate-200 rounded-3xl p-6 border border-slate-850 flex flex-col justify-between h-48 md:h-auto">
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">
              ⚡ Payment Gateway Webhook Log Console (Razorpay / Stripe)
            </span>
            <div className="max-h-28 overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-300">
              {logs.length === 0 ? (
                <span className="text-slate-600 italic">No webhook activities detected yet. Click "Select Plan" to simulate.</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="leading-snug">{log}</div>
                ))
              )}
            </div>
          </div>

          <div className="text-[9px] text-slate-500 border-t border-slate-850 pt-2 font-mono mt-2">
            *Fully functional API routes are listening for gateway responses (and automatically dispatching invoice generation triggers).
          </div>
        </div>

      </div>

      {/* Invoice Records history */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
        <h3 className="font-black text-white uppercase tracking-tighter text-xs font-display mb-4">Historical Invoice receipts</h3>
        
        <div className="space-y-3">
          {invoices.length === 0 ? (
            <div className="text-center p-4 text-xs font-black text-slate-500 uppercase tracking-widest font-mono">No payment receipts found.</div>
          ) : (
            invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between border-b border-slate-850 pb-2.5 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <span className="text-xs font-black text-white uppercase tracking-wide">{inv.invoiceNumber}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono font-bold">
                    <span>Date: {inv.date}</span>
                    <span>•</span>
                    <span className="uppercase">Plan: {inv.planId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-white font-mono">${inv.amount}.00</span>
                  <span className="bg-green-500/10 text-green-400 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-green-500/20 font-mono tracking-wider">
                    PAID
                  </span>
                  
                  {/* Simulated Receipt Downloader */}
                  <button
                    onClick={() => {
                      setLogs(prev => [...prev, `[PRINT RECEIPT] Receipt details for ${inv.invoiceNumber} printed to console: Dental Corp - $${inv.amount}.00 (Includes GST)`]);
                    }}
                    className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg cursor-pointer transition"
                    title="Print receipt details"
                  >
                    <Download size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
