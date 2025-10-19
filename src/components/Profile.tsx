import { User, Mail, Phone, MapPin, ShoppingBag, FileText, Settings, LogOut, CreditCard } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { useRazorpay } from 'react-razorpay';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import logo from '../logo.png';

interface Quotation {
  id: string;
  type: string;
  status: string;
  created_at: string;
  config: {
    currency?: 'INR' | 'USD';
    total?: number;
    [key: string]: any;
  };
  additional_message: string | null;
}

interface ProfileType {
  full_name: string | null;
  phone: string | null;
  [key: string]: any;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('details');
  const { user } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [pastOrders, setPastOrders] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { Razorpay } = useRazorpay();

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Fetch profile and quotations in parallel
    const [profileResponse, quotationsResponse] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('quotations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]);

    if (profileResponse.error || quotationsResponse.error) {
      setError(profileResponse.error || quotationsResponse.error);
    } else {
      setProfile(profileResponse.data);
      if (quotationsResponse.data) {
        setQuotations(quotationsResponse.data.filter(q => ['Pending Review', 'Quoted'].includes(q.status)));
        setPastOrders(quotationsResponse.data.filter(q => !['Pending Review', 'Quoted'].includes(q.status)));
      }
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const handlePayment = useCallback(async (quote: Quotation) => {
    if (!Razorpay || !user || !profile) {
      setPaymentMessage({ type: 'error', text: 'Payment service or user data is not available. Please refresh.' });
      return;
    }

    const options = {
      key: 'rzp_live_RVLpP9s4B07vLY', // IMPORTANT: Replace with your Razorpay Test Key ID
      amount: (quote.config.total || 0) * 100, // amount in the smallest currency unit (paise for INR)
      currency: quote.config.currency || 'INR',
      name: 'Miccroten Circuits',
      description: `Payment for Quote #${quote.id.substring(0, 8)}`,
      image: logo,
      handler: async (response: any) => {
        // On successful payment, update the quotation status to 'Paid'
        const { error: updateError } = await supabase
          .from('quotations')
          .update({ status: 'Paid', razorpay_payment_id: response.razorpay_payment_id })
          .eq('id', quote.id);

        if (updateError) {
          setPaymentMessage({ type: 'error', text: `Payment successful, but failed to update order status. Please contact support with Payment ID: ${response.razorpay_payment_id}` });
        } else {
          setPaymentMessage({ type: 'success', text: `Payment successful! Payment ID: ${response.razorpay_payment_id}` });
          // Refresh data to move the item to 'Past Orders' after a short delay
          setTimeout(() => fetchUserData(), 2000);
        }
      },
      prefill: {
        name: profile.full_name || '',
        email: user.email || '',
        contact: profile.phone || '',
      },
      notes: {
        quotation_id: quote.id,
        user_id: user.id,
      },
      theme: {
        color: '#F97316', // Orange-500
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();

  }, [Razorpay, user, profile, fetchUserData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        if (loading) return <div>Loading orders...</div>;
        if (error) return <div className="text-red-500">Error loading orders: {error.message}</div>;
        return (
          <div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Past Orders</h3>
            {pastOrders.length > 0 ? (
              <div className="space-y-4">
                {pastOrders.map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                    <div>
                      <p className="font-bold text-navy-900">Order #{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {order.config.currency === 'USD' ? '$' : '₹'}
                        {order.config.total?.toLocaleString(order.config.currency === 'USD' ? 'en-US' : 'en-IN') || 'N/A'}
                      </p>
                      <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">You have no past orders.</p>
            )}
          </div>
        );
      case 'quotations':
        if (loading) return <div>Loading quotations...</div>;
        if (error) return <div className="text-red-500">Error loading quotations: {error.message}</div>;
        return (
          <div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">My Quotations</h3>
            {quotations.length > 0 ? (
              <div className="space-y-4">
                {quotations.map(quote => (
                  <div key={quote.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                    <div>
                      <p className="font-bold text-navy-900">Quote #{quote.id.substring(0, 8)} <span className="text-sm font-normal text-slate-600">({quote.type})</span></p>
                      <p className="text-sm text-slate-500">{new Date(quote.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      {quote.status === 'Quoted' ? (
                        <>
                          <div className="font-semibold text-navy-900">
                            <p>
                              {quote.config.currency === 'USD' ? '$' : '₹'}
                              {quote.config.total?.toLocaleString(quote.config.currency === 'USD' ? 'en-US' : 'en-IN') || 'N/A'}
                            </p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">{quote.status}</span>
                          </div>
                          <button
                            onClick={() => handlePayment(quote)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </button>
                        </>
                      ) : (
                        <span className="text-sm px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{quote.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">You have no active quotations.</p>
            )}
          </div>
        );
      default:
        if (loading) return <div>Loading details...</div>;
        if (error) return <div className="text-red-500">Error loading details: {error.message}</div>;
        return (
          <div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">My Details</h3>
            <div className="space-y-4 text-slate-700">
              <div className="flex items-center gap-3"><User className="w-5 h-5 text-orange-500" /><span>{profile?.full_name || 'N/A'}</span></div>
              <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-orange-500" /><span>{user?.email}</span></div>
              <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-orange-500" /><span>{profile?.phone || 'N/A'}</span></div>
              {/* Address is not in the database yet, you can add it to your 'profiles' table */}
              {/* <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-orange-500 mt-1" /><span>{profile?.address || 'No address provided'}</span></div> */}
            </div>
          </div>
        );
    }
  };

  const tabs = [
    { id: 'details', name: 'My Details', icon: User },
    { id: 'orders', name: 'Past Orders', icon: ShoppingBag },
    { id: 'quotations', name: 'My Quotations', icon: FileText },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">My Profile</h2>
          <p className="text-xl text-slate-600">Manage your information, orders, and quotations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-2">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-colors ${activeTab === tab.id ? 'bg-orange-500 text-white' : 'text-navy-900 hover:bg-slate-100'}`}>
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold text-red-600 hover:bg-red-50 transition-colors"><LogOut className="w-5 h-5" /> Logout</button>
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8 min-h-[400px]">
              {paymentMessage && (
                <div
                  className={`border rounded-lg p-4 mb-6 text-sm ${paymentMessage.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-700'}`}
                  role="alert"
                >
                  {paymentMessage.text}
                </div>
              )}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}