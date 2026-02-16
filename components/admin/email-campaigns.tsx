'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Users, Eye, MousePointer, TrendingUp, Plus } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  sent: number;
  opened: number;
  clicked: number;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledDate?: string;
}

export function EmailCampaigns() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Winter Sale 2024',
      subject: 'Cozy Mountain Getaways - 30% Off!',
      sent: 1250,
      opened: 856,
      clicked: 342,
      status: 'sent',
    },
    {
      id: '2',
      name: 'Valentine Special',
      subject: 'Romantic Cabin Escape for Two ❤️',
      sent: 0,
      opened: 0,
      clicked: 0,
      status: 'scheduled',
      scheduledDate: '2024-02-10',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Mail className="text-blue-600" size={28} />
          Email Marketing
        </h2>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <Send size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{campaigns.reduce((sum, c) => sum + c.sent, 0)}</div>
          <div className="text-blue-100">Total Sent</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <Eye size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">
            {campaigns.length > 0
              ? (
                  (campaigns.reduce((sum, c) => sum + c.opened, 0) /
                    campaigns.reduce((sum, c) => sum + c.sent, 0)) *
                  100
                ).toFixed(1)
              : 0}
            %
          </div>
          <div className="text-green-100">Open Rate</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <MousePointer size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">
            {campaigns.length > 0
              ? (
                  (campaigns.reduce((sum, c) => sum + c.clicked, 0) /
                    campaigns.reduce((sum, c) => sum + c.sent, 0)) *
                  100
                ).toFixed(1)
              : 0}
            %
          </div>
          <div className="text-purple-100">Click Rate</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <TrendingUp size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{campaigns.filter((c) => c.status === 'sent').length}</div>
          <div className="text-orange-100">Sent Campaigns</div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign, index) => {
          const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0;
          const clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent) * 100 : 0;

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        campaign.status === 'sent'
                          ? 'bg-green-100 text-green-700'
                          : campaign.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600">{campaign.subject}</p>
                  {campaign.scheduledDate && (
                    <p className="text-sm text-blue-600 mt-1">Scheduled for: {campaign.scheduledDate}</p>
                  )}
                </div>
              </div>

              {campaign.status === 'sent' && (
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Send size={18} className="text-blue-600" />
                      <span className="text-sm text-gray-600">Sent</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{campaign.sent}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye size={18} className="text-green-600" />
                      <span className="text-sm text-gray-600">Opened</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {campaign.opened} ({openRate.toFixed(1)}%)
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointer size={18} className="text-purple-600" />
                      <span className="text-sm text-gray-600">Clicked</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {campaign.clicked} ({clickRate.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {campaign.status === 'draft' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Send Now
                  </button>
                )}
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
