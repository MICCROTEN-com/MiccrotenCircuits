import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import { ShieldCheck, Edit, Save, X, Download, MessageSquare, FileText } from 'lucide-react';

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
  user_id: string;
  user_name: string | null;
  file_path: string | null;
}

interface ContactSubmission {
  id: number;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  service_type: string | null;
  message: string | null;
  created_at: string;
  file_path: string | null;
}

export default function AdminDashboard() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('quotations');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quotation | null>(null);
  const [newTotal, setNewTotal] = useState<number | string>('');
  const [newCurrency, setNewCurrency] = useState<'INR' | 'USD'>('INR');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    // ProtectedRoute now handles the session check
    if (user?.email !== 'miccrotencircuits@gmail.com') {
      navigate('/'); // Redirect non-admins
    } else {
      setIsAuthorized(true);
      fetchData();
    }
  }, [user, session, navigate]);

  const fetchData = async () => {
    setLoading(true);
    const [quotationsResponse, contactsResponse] = await Promise.all([
      supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false }),
    ]);

    if (quotationsResponse.error || contactsResponse.error) {
      setError(quotationsResponse.error?.message || contactsResponse.error?.message || 'Failed to fetch data');
    } else {
      setQuotations(quotationsResponse.data || []);
      setContactSubmissions(contactsResponse.data || []);
    }
    setLoading(false);
  };

  const handleEdit = (quote: Quotation) => {
    setEditingQuote(quote);
    setNewTotal(quote.config.total || '');
    setNewCurrency(quote.config.currency || 'INR');
    setNewStatus(quote.status);
  };

  const handleCancel = () => {
    setEditingQuote(null);
    setNewTotal('');
    setNewCurrency('INR');
    setNewStatus('');
  };

  const handleSave = async () => {
    if (!editingQuote) return;

    const updatedConfig = { ...editingQuote.config, total: Number(newTotal), currency: newCurrency };

    const { error } = await supabase
      .from('quotations')
      .update({ status: newStatus, config: updatedConfig })
      .eq('id', editingQuote.id);

    if (error) {
      setError(error.message);
    } else {
      await fetchData(); // Refresh data
      handleCancel();
    }
  };

  const handleDownload = async (filePath: string | null) => {
    if (!filePath) {
      setError('File path is missing for this entry.');
      return;
    }
    try {
      const { data, error } = await supabase.storage
        .from('quotation-files')
        .createSignedUrl(filePath, 60); // URL valid for 60 seconds

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (err: any) {
      setError(`Failed to get download link: ${err.message}`);
    }
  };

  if (!isAuthorized) {
    return <div className="py-24 text-center">Checking authorization...</div>;
  }

  if (loading) {
    return <div className="py-24 text-center">Loading quotations...</div>;
  }

  if (error) {
    return <div className="py-24 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <section className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <ShieldCheck className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">Admin Dashboard</h2>
          <p className="text-xl text-slate-600">Manage all user quotations.</p>
        </div>

        <div className="flex justify-center border-b border-slate-300 mb-8">
          <button onClick={() => setActiveTab('quotations')} className={`flex items-center gap-2 px-6 py-3 font-semibold ${activeTab === 'quotations' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-slate-500'}`}>
            <FileText className="w-5 h-5" /> Quotations ({quotations.length})
          </button>
          <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-2 px-6 py-3 font-semibold ${activeTab === 'messages' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-slate-500'}`}>
            <MessageSquare className="w-5 h-5" /> Contact Messages ({contactSubmissions.length})
          </button>
        </div>

        {activeTab === 'quotations' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-4">Date</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">File</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map(quote => (
                    <tr key={quote.id} className="border-b hover:bg-slate-50">
                      <td className="p-4">{new Date(quote.created_at).toLocaleDateString()}</td>
                      <td className="p-4">{quote.type}</td>
                      <td className="p-4">
                        <div className="font-medium text-navy-900">{quote.user_name || 'N/A'}</div>
                        <div className="text-xs text-slate-500 font-mono">{quote.user_id.substring(0, 13)}...</div>
                      </td>
                      <td className="p-4">
                        {editingQuote?.id === quote.id ? (
                          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="p-2 border rounded-md">
                            <option>Pending Review</option>
                            <option>Quoted</option>
                            <option>Paid</option>
                            <option>In Production</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                          </select>
                        ) : (
                          <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">{quote.status}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {editingQuote?.id === quote.id ? (
                          <div className="flex items-center gap-2">
                            <select value={newCurrency} onChange={e => setNewCurrency(e.target.value as 'INR' | 'USD')} className="p-2 border rounded-md bg-white">
                              <option>INR</option>
                              <option>USD</option>
                            </select>
                            <input type="number" value={newTotal} onChange={e => setNewTotal(e.target.value)} className="w-24 p-2 border rounded-md" placeholder="Amount" />
                          </div>
                        ) : (
                          `${quote.config.currency === 'USD' ? '$' : '₹'}${quote.config.total?.toLocaleString(
                            quote.config.currency === 'USD' ? 'en-US' : 'en-IN'
                          ) || 'N/A'}`
                        )}
                      </td>
                      <td className="p-4">
                        {quote.file_path && (
                          <button onClick={() => handleDownload(quote.file_path)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Download className="w-5 h-5" /></button>
                        )}
                      </td>
                      <td className="p-4">
                        {editingQuote?.id === quote.id ? (
                          <div className="flex gap-2">
                            <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-100 rounded-full"><Save className="w-5 h-5" /></button>
                            <button onClick={handleCancel} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><X className="w-5 h-5" /></button>
                          </div>
                        ) : (
                          <button onClick={() => handleEdit(quote)} className="p-2 text-slate-600 hover:bg-slate-200 rounded-full"><Edit className="w-5 h-5" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-4">Date</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email / Phone</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">File</th>
                  </tr>
                </thead>
                <tbody>
                  {contactSubmissions.map(sub => (
                    <tr key={sub.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 align-top">{new Date(sub.created_at).toLocaleDateString()}</td>
                      <td className="p-4 align-top">
                        <div className="font-medium text-navy-900">{sub.name}</div>
                        <div className="text-xs text-slate-500">{sub.company}</div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="text-sm text-slate-700">{sub.email}</div>
                        <div className="text-sm text-slate-700">{sub.phone}</div>
                      </td>
                      <td className="p-4 align-top text-sm">{sub.service_type}</td>
                      <td className="p-4 align-top text-sm text-slate-600 max-w-md">{sub.message}</td>
                      <td className="p-4 align-top">
                        {sub.file_path && (
                          <button onClick={() => handleDownload(sub.file_path)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Download className="w-5 h-5" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}