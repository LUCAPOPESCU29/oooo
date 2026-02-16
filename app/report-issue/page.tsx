'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Home,
  User,
  Mail,
  FileText,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/providers/language-provider';

const cabinOptions = [
  'The Pine',
  'The Cedar',
  'The Oak',
  'The Birch',
  'The Maple',
  'The Willow'
];

export default function ReportIssuePage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    cabin: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    reportedBy: '',
    reportedByEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit issue');
      }

      setSubmitted(true);
      setFormData({
        cabin: '',
        title: '',
        description: '',
        priority: 'medium',
        reportedBy: '',
        reportedByEmail: ''
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: language === 'en' ? 'Low' : 'Scăzut', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'medium', label: language === 'en' ? 'Medium' : 'Mediu', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'high', label: language === 'en' ? 'High' : 'Ridicat', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { value: 'urgent', label: language === 'en' ? 'Urgent' : 'Urgent', color: 'bg-red-100 text-red-700 border-red-300' }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--cream-warm)] to-[var(--linen-soft)] pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Issue Reported Successfully!' : 'Problema raportată cu succes!'}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === 'en'
                ? 'Thank you for reporting the issue. Our maintenance team will review it shortly and take appropriate action.'
                : 'Vă mulțumim că ați raportat problema. Echipa noastră de întreținere o va verifica în curând și va lua măsurile necesare.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setSubmitted(false)}
                className="bg-[var(--green-deep)] text-white hover:bg-[var(--green-sage)] rounded-full px-8"
              >
                {language === 'en' ? 'Report Another Issue' : 'Raportează altă problemă'}
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-2 border-[var(--brown-rich)] text-[var(--brown-rich)] hover:bg-[var(--brown-rich)] hover:text-white rounded-full px-8"
              >
                {language === 'en' ? 'Back to Home' : 'Înapoi la Pagina Principală'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream-warm)] to-[var(--linen-soft)] pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench size={32} className="text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Report a Maintenance Issue' : 'Raportează o Problemă de Întreținere'}
            </h1>
            <p className="text-gray-600">
              {language === 'en'
                ? 'Help us maintain our cabins by reporting any issues you encounter.'
                : 'Ajută-ne să menținem cabinele noastre prin raportarea oricărei probleme întâlnite.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-red-700 font-medium flex items-center gap-2">
                <AlertTriangle size={20} />
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cabin Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Home size={18} className="text-[var(--green-deep)]" />
                {language === 'en' ? 'Cabin Name' : 'Nume Cabană'}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cabin}
                onChange={(e) => setFormData({ ...formData, cabin: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900"
              >
                <option value="">{language === 'en' ? 'Select a cabin...' : 'Selectează o cabană...'}</option>
                {cabinOptions.map((cabin) => (
                  <option key={cabin} value={cabin}>{cabin}</option>
                ))}
              </select>
            </div>

            {/* Your Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User size={18} className="text-[var(--green-deep)]" />
                {language === 'en' ? 'Your Name' : 'Numele Tău'}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                required
                placeholder={language === 'en' ? 'John Doe' : 'Ion Popescu'}
                className="w-full text-gray-900"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail size={18} className="text-[var(--green-deep)]" />
                {language === 'en' ? 'Your Email' : 'Email-ul Tău'}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.reportedByEmail}
                onChange={(e) => setFormData({ ...formData, reportedByEmail: e.target.value })}
                required
                placeholder="email@example.com"
                className="w-full text-gray-900"
              />
            </div>

            {/* Issue Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-[var(--green-deep)]" />
                {language === 'en' ? 'Issue Title' : 'Titlul Problemei'}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder={language === 'en' ? 'Brief description of the issue' : 'Descriere scurtă a problemei'}
                className="w-full text-gray-900"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-[var(--green-deep)]" />
                {language === 'en' ? 'Detailed Description' : 'Descriere Detaliată'}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={5}
                placeholder={language === 'en'
                  ? 'Please provide as much detail as possible about the issue...'
                  : 'Vă rugăm să furnizați cât mai multe detalii despre problemă...'}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900 resize-none"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-[var(--green-deep)]" />
                {language === 'en' ? 'Priority Level' : 'Nivel de Prioritate'}
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.value as any })}
                    className={`px-4 py-3 rounded-lg font-semibold border-2 transition-all ${
                      formData.priority === option.value
                        ? option.color
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white hover:bg-orange-700 rounded-full py-4 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    {language === 'en' ? 'Submitting...' : 'Se trimite...'}
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {language === 'en' ? 'Submit Issue Report' : 'Trimite Raportul Problemei'}
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              {language === 'en'
                ? '💡 Your report will be reviewed by our maintenance team within 24 hours. For urgent issues, please contact us directly at support@aframe-cabins.com'
                : '💡 Raportul dumneavoastră va fi revizuit de echipa noastră de întreținere în 24 de ore. Pentru probleme urgente, vă rugăm să ne contactați direct la support@aframe-cabins.com'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
