import { useState } from 'react';
import { Upload, Download, Send, Check } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

interface PCBConfig {
  layers: number;
  width: string;
  height: string;
  quantity: number;
  discreteDesigns: number;
  deliveryFormat: string;
  thickness: number;
  maskColor: string;
  finish: string;
  copperThickness: string;
  buildTime: string;
  shippingMethod: string;
  additionalMessage: string;
}

const initialConfig: PCBConfig = {
  layers: 2,
  width: '',
  height: '',
  quantity: 5,
  discreteDesigns: 1,
  deliveryFormat: 'Single PCB',
  thickness: 1.6,
  maskColor: 'Green',
  finish: 'HASL Finish',
  copperThickness: '1 oz (35 µm)',
  buildTime: '5-6 days',
  shippingMethod: 'DTDC Standard (2-3 working days)',
  additionalMessage: '',
};

export default function InstantQuotation() {
  const [config, setConfig] = useState<PCBConfig>(initialConfig);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (file: File | null) => {
    if (file && file.name.endsWith('.zip') && file.size <= 50 * 1024 * 1024) {
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
        user_name: user.user_metadata.full_name,
        type: 'PCB',
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

  const handleConfigChange = (field: keyof PCBConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = uploadedFile && config.width && config.height;

  return (
    <section id="instant-quotation" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Instant PCB Quotation
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Configure your PCB requirements and get instant pricing estimates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900">
                  Upload Gerber File
                </h3>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-300 hover:border-orange-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-700 font-semibold mb-2">
                  {uploadedFile
                    ? `File uploaded: ${uploadedFile.name}`
                    : 'Drag & drop your Gerber file here'}
                </p>
                <p className="text-sm text-slate-500 mb-4">or</p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <span className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold cursor-pointer transition-colors inline-block">
                    Choose File
                  </span>
                </label>
                <p className="text-xs text-slate-500 mt-4">
                  Format: .zip • Max size: 50MB
                </p>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Your file is secure and confidential</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-navy-900 mb-6">
                PCB Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Base Material
                  </label>
                  <input
                    type="text"
                    value="FR4"
                    disabled
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Layers
                  </label>
                  <select
                    value={config.layers}
                    onChange={(e) =>
                      handleConfigChange('layers', parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[2, 4, 6, 8, 10, 12, 14, 18, 20, 22].map((num) => (
                      <option key={num} value={num}>
                        {num} Layers
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Width (mm)
                  </label>
                  <input
                    type="number"
                    value={config.width}
                    onChange={(e) => handleConfigChange('width', e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Height (mm)
                  </label>
                  <input
                    type="number"
                    value={config.height}
                    onChange={(e) => handleConfigChange('height', e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

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
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Discrete Designs
                  </label>
                  <select
                    value={config.discreteDesigns}
                    onChange={(e) =>
                      handleConfigChange('discreteDesigns', parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Delivery Format
                  </label>
                  <select
                    value={config.deliveryFormat}
                    onChange={(e) =>
                      handleConfigChange('deliveryFormat', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Single PCB</option>
                    <option>Panel by Customer</option>
                    <option>Panel by Miccroten Circuits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    PCB Thickness (mm)
                  </label>
                  <select
                    value={config.thickness}
                    onChange={(e) =>
                      handleConfigChange('thickness', parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[0.4, 0.8, 1.2, 1.6, 2.0, 2.4].map((num) => (
                      <option key={num} value={num}>
                        {num} mm
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Mask Color
                  </label>
                  <select
                    value={config.maskColor}
                    onChange={(e) => handleConfigChange('maskColor', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {['Green', 'White', 'Red', 'Blue', 'Black'].map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    PCB Finish
                  </label>
                  <select
                    value={config.finish}
                    onChange={(e) => handleConfigChange('finish', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>HASL Finish</option>
                    <option>Lead-Free HASL</option>
                    <option>ENIG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Copper Thickness
                  </label>
                  <select
                    value={config.copperThickness}
                    onChange={(e) =>
                      handleConfigChange('copperThickness', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>1 oz (35 µm)</option>
                    <option>2 oz (70 µm)</option>
                    <option>3 oz (105 µm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Build Time
                  </label>
                  <select
                    value={config.buildTime}
                    onChange={(e) => handleConfigChange('buildTime', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>5-6 days</option>
                    <option>4-5 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Shipping Method
                  </label>
                  <select
                    value={config.shippingMethod}
                    onChange={(e) =>
                      handleConfigChange('shippingMethod', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>DTDC Standard (2-3 working days)</option>
                    <option>DTDC Plus (1-2 working days)</option>
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Any special requests or notes for your order?"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24 space-y-6">
              <h3 className="text-2xl font-bold text-navy-900 text-center">
                Ready to Proceed?
              </h3>
              <p className="text-slate-600 text-center">
                Once you've configured your PCB and uploaded your files, submit your request. Our team will review it and get back to you shortly.
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
                    Upload a Gerber file and enter dimensions to proceed
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
