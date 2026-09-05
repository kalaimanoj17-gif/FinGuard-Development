import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CreateInvoiceModal({ onClose, onSave }) {
  const [customer, setCustomer] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [items, setItems] = useState([
    { description: 'Consulting & Implementation Services', qty: 1, rate: 2500 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { description: '', qty: 1, rate: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, val) => {
    const next = [...items];
    next[index][field] = field === 'description' ? val : Number(val);
    setItems(next);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const gstAmount = subtotal * 0.18; // 18% GST standard
  const total = subtotal + gstAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer) return;
    onSave({
      id: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
      customer,
      amount: total,
      gstAmount,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      aiRisk: 'Low Risk',
      paymentTerms
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-100 border border-teal-200 text-teal-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Create New Smart Invoice</h3>
              <p className="text-xs text-slate-500">FinGuard AI auto-calculates GST & verifies customer credit risk</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Customer Name</label>
              <input
                type="text"
                required
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. Apex Global Retail"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">Line Items & Services</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                    className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Price ($)"
                    value={item.rate}
                    onChange={(e) => updateItem(idx, 'rate', e.target.value)}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Invoice Validation Banner */}
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span className="text-slate-700 font-medium">GST (18% Auto Calculation)</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Subtotal: ${subtotal.toLocaleString()} + GST: ${gstAmount.toLocaleString()}</span>
              <p className="text-sm font-extrabold text-teal-800">Total: ${total.toLocaleString()}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create & Issue Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
