import React, { useState } from 'react';
import { crmApi } from '../../api/crm';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Buying Luxury Property');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setSending(true);
      await crmApi.submitEnquiry({
        name,
        email,
        phone,
        message: `[Subject: ${subject}] ${message}`,
        source: 'CONTACT_PAGE',
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to submit message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Connect with Our Advisory Team
          </h1>
          <p className="text-slate-600 mt-3 text-base">
            Have questions about a prime property or looking to list your luxury residence? Our advisory team is available 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Office locations info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">Corporate Headquarters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Level 24, One International Center, Senapati Bapat Marg, Prabhadevi, Mumbai, Maharashtra 400013
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                <p className="text-slate-700"><strong>Direct:</strong> +91 (022) 6789 0000</p>
                <p className="text-slate-700"><strong>Toll-Free:</strong> 1800-209-8888</p>
                <p className="text-slate-700"><strong>Inquiries:</strong> advisory@estatehub.com</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">Bengaluru Regional Office</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prestige Trade Tower, Palace Road, High Grounds, Sampangi Rama Nagar, Bengaluru, Karnataka 560001
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                <p className="text-slate-700"><strong>Direct:</strong> +91 (080) 4567 1111</p>
                <p className="text-slate-700"><strong>Inquiries:</strong> blr@estatehub.com</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">Delhi NCR Regional Office</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                DLF Cyber City, Tower 10B, DLF Phase 2, Gurugram, Haryana 122002
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                <p className="text-slate-700"><strong>Direct:</strong> +91 (0124) 499 2222</p>
                <p className="text-slate-700"><strong>Inquiries:</strong> ncr@estatehub.com</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
              <p className="text-xs text-slate-500 mb-6">
                Fill in the details below and an asset manager will respond within 4 business hours.
              </p>

              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center">
                  <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-lg font-bold">Message Successfully Sent!</h3>
                  <p className="text-sm mt-1 text-emerald-700">
                    Thank you for reaching out. A dedicated specialist has received your inquiry and will contact you promptly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 inline-block text-xs font-bold text-emerald-900 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ananya Roy"
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Topic of Interest</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      >
                        <option>Buying Luxury Property</option>
                        <option>Listing My High-End Property</option>
                        <option>Commercial / Tech Park Leasing</option>
                        <option>Developer Mandate Inquiry</option>
                        <option>Site Visit Request</option>
                        <option>General Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message Details</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please share details such as preferred location, budget, configuration, or specific timeline..."
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full sm:w-auto px-8 bg-slate-950 hover:bg-slate-900 text-white font-bold py-3 rounded-xl text-xs transition shadow disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Transmit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
