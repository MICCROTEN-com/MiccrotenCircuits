import { useState } from 'react';
import { Upload, FileSpreadsheet, Send, Check } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

interface AssemblyConfig {
  quantity: number;
  leadTime: string;
  additionalMessage: string;
}

const initialConfig: AssemblyConfig = {
  quantity: 5,
  leadTime: '7-10 days',
  additionalMessage: '',
};

export default function AssemblyQuotation() {
  const [config, setConfig] = useState<AssemblyConfig>(initialConfig);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (file: File | null) => {
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadedFile(file);
    }
  };

  const handleRequestQuotation = async () => {
    if (!canProceed || !user || !uploadedFile) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Upload the file to Supabase Storage
      const filePath = `${user.id}/${Date.now()}-${uploadedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('quotation-files')
        .upload(filePath, uploadedFile);

      if (uploadError) throw uploadError;

      // 2. Insert the quotation data into the database
      const { error: insertError } = await supabase.from('quotations').insert({
        user_id: user.id,
        type: 'Assembly',
        config: config,
        file_path: filePath,
        status: 'Pending Review',
        additional_message: config.additionalMessage,
      });

      if (insertError) throw insertError;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleConfigChange = (field: keyof AssemblyConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = uploadedFile;

  return (
    <section id="assembly-quotation" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            PCB Assembly Quotation
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your Bill of Materials and configure assembly requirements for instant pricing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-50 rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900">
                  Upload BOM File
                </h3>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all bg-white ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-300 hover:border-orange-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-700 font-semibold mb-2">
                  {uploadedFile
                    ? `File uploaded: ${uploadedFile.name}`
                    : 'Drag & drop your BOM file here'}
                </p>
                <p className="text-sm text-slate-500 mb-4">or</p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <span className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold cursor-pointer transition-colors inline-block">
                    Choose File
                  </span>
                </label>
                <p className="text-xs text-slate-500 mt-4">
                  Format: CSV, Excel (.xlsx, .xls) • Max size: 10MB
                </p>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Your BOM is secure and confidential. We respect your intellectual property.</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-navy-900 mb-6">
                Assembly Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={config.quantity}
                    onChange={(e) =>
                      handleConfigChange('quantity', parseInt(e.target.value))
                    }
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Lead Time
                  </label>
                  <select
                    value={config.leadTime}
                    onChange={(e) => handleConfigChange('leadTime', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option>7-10 days</option>
                    <option>5-7 days</option>
                    <option>3-5 days (Rush)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    value={config.additionalMessage}
                    onChange={(e) =>
                      handleConfigChange('additionalMessage', e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    placeholder="Any special requests, component substitutions, or notes for your assembly?"
                  />
                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-navy-900 mb-3">BOM Guidelines</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Include columns: Part Number, Description, Quantity, Reference Designator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Specify manufacturer part numbers for accurate sourcing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Note any special handling requirements or component orientation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-xl shadow-lg p-8 sticky top-24 space-y-6">
              <h3 className="text-2xl font-bold text-navy-900 text-center">
                Ready to Proceed?
              </h3>
              <p className="text-slate-600 text-center">
                Once you've configured your assembly and uploaded your BOM, submit your request. Our team will review it and provide a final quote.
              </p>
              <div className="space-y-3">
                {saveSuccess ? (
                  <div className="bg-green-50 border border-green-500 text-green-700 px-6 py-3 rounded-lg text-center font-semibold flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Quotation Requested!
                  </div>
                ) : (
                  <button
                    onClick={handleRequestQuotation}
                    disabled={!canProceed || loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <Send className="w-5 h-5" />
                    {loading ? 'Submitting...' : 'Request Quotation'}
                  </button>
                )}

                {error && (
                  <p className="text-sm text-center text-red-600">{error}</p>
                )}

                {!canProceed && (
                  <p className="text-sm text-center text-slate-600">
                    Upload a BOM file to proceed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
