/**
 * Ethical Hacking Framework UI Panel
 *
 * Provides orchestration controls for multi-phase security testing
 * - Engagement management
 * - Rules of Engagement validation
 * - Evidence tracking
 * - Finding collection
 * - Compliance reporting
 */

import React, { useState } from 'react';

interface Engagement {
  engagementId: string;
  clientName: string;
  phase: 'reconnaissance' | 'testing' | 'reporting' | 'disclosure';
  status: 'planning' | 'active' | 'paused' | 'completed';
  findingCount: number;
  startDate: string;
  endDate: string;
}

interface _Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  status: 'open' | 'mitigated' | 'false_positive';
}

export const EthicalHackingPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'engagements' | 'roe' | 'findings' | 'evidence'>('engagements');
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [showNewEngagementForm, setShowNewEngagementForm] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);

  const handleCreateEngagement = (data: Partial<Engagement>) => {
    const newEngagement: Engagement = {
      engagementId: `ENG-${Date.now()}`,
      clientName: data.clientName || '',
      phase: 'reconnaissance',
      status: 'planning',
      findingCount: 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setEngagements([...engagements, newEngagement]);
    setShowNewEngagementForm(false);
  };

  const _getRoeSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#f59e0b',
      low: '#10b981',
      informational: '#3b82f6',
    };
    return colors[severity] || '#6b7280';
  };

  return (
    <div className="ethical-hacking-panel" style={{ padding: '20px', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px', color: '#fbbf24' }}>🛡️ Ethical Hacking Framework</h2>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>
        {(['engagements', 'roe', 'findings', 'evidence'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === tab ? '#3b82f6' : 'transparent',
              color: activeTab === tab ? '#fff' : '#9ca3af',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Engagements Tab */}
      {activeTab === 'engagements' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Active Engagements</h3>
            <button
              onClick={() => setShowNewEngagementForm(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              + New Engagement
            </button>
          </div>

          {showNewEngagementForm && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#111827', borderRadius: '4px' }}>
              <input
                type="text"
                placeholder="Client Name"
                onChange={(e) => handleCreateEngagement({ clientName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  backgroundColor: '#374151',
                  color: '#fff',
                  border: '1px solid #4b5563',
                  borderRadius: '4px',
                }}
              />
              <button
                onClick={() => setShowNewEngagementForm(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {engagements.map((eng) => (
              <div
                key={eng.engagementId}
                onClick={() => setSelectedEngagement(eng.engagementId)}
                style={{
                  padding: '15px',
                  backgroundColor: '#111827',
                  border: `2px solid ${selectedEngagement === eng.engagementId ? '#3b82f6' : '#374151'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4>{eng.clientName}</h4>
                  <span
                    style={{
                      padding: '4px 8px',
                      backgroundColor: eng.status === 'active' ? '#10b981' : '#6b7280',
                      color: '#fff',
                      borderRadius: '3px',
                      fontSize: '12px',
                    }}
                  >
                    {eng.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  <p>ID: {eng.engagementId}</p>
                  <p>Phase: {eng.phase}</p>
                  <p>Findings: {eng.findingCount}</p>
                </div>
              </div>
            ))}
          </div>

          {engagements.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No active engagements. Create one to get started.</p>
          )}
        </div>
      )}

      {/* Rules of Engagement Tab */}
      {activeTab === 'roe' && (
        <div>
          <h3 style={{ marginBottom: '15px' }}>Rules of Engagement</h3>
          {selectedEngagement ? (
            <div style={{ backgroundColor: '#111827', padding: '15px', borderRadius: '4px' }}>
              <h4>Engagement: {selectedEngagement}</h4>
              <div style={{ marginTop: '15px' }}>
                <h5 style={{ color: '#fbbf24' }}>Authorized Targets</h5>
                <div style={{ backgroundColor: '#1f2937', padding: '10px', borderRadius: '4px', marginBottom: '10px', minHeight: '50px' }}>
                  <p style={{ color: '#9ca3af' }}>No targets configured</p>
                </div>

                <h5 style={{ color: '#fbbf24' }}>Prohibited Targets</h5>
                <div style={{ backgroundColor: '#1f2937', padding: '10px', borderRadius: '4px', marginBottom: '10px', minHeight: '50px' }}>
                  <p style={{ color: '#9ca3af' }}>No prohibited targets</p>
                </div>

                <h5 style={{ color: '#fbbf24' }}>Allowed Techniques</h5>
                <div style={{ backgroundColor: '#1f2937', padding: '10px', borderRadius: '4px', minHeight: '50px' }}>
                  <p style={{ color: '#9ca3af' }}>Configure allowed testing techniques</p>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Select an engagement to view Rules of Engagement</p>
          )}
        </div>
      )}

      {/* Findings Tab */}
      {activeTab === 'findings' && (
        <div>
          <h3 style={{ marginBottom: '15px' }}>Findings Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Critical', count: 0, color: '#dc2626' },
              { label: 'High', count: 0, color: '#ea580c' },
              { label: 'Medium', count: 0, color: '#f59e0b' },
              { label: 'Low', count: 0, color: '#10b981' },
              { label: 'Info', count: 0, color: '#3b82f6' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: '15px',
                  backgroundColor: '#111827',
                  borderLeft: `4px solid ${item.color}`,
                  borderRadius: '4px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.color }}>{item.count}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#111827', padding: '15px', borderRadius: '4px', minHeight: '200px' }}>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No findings recorded yet</p>
          </div>
        </div>
      )}

      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <div>
          <h3 style={{ marginBottom: '15px' }}>Evidence Chain of Custody</h3>
          <div style={{ backgroundColor: '#111827', padding: '15px', borderRadius: '4px', minHeight: '250px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              {['Screenshots', 'Network Logs', 'Findings', 'Credentials'].map((type) => (
                <div key={type} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>0</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{type}</div>
                </div>
              ))}
            </div>

            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              <p>📋 Evidence tracking provides:</p>
              <ul>
                <li>Immutable hash verification</li>
                <li>Timestamped chain of custody</li>
                <li>Cryptographic signatures</li>
                <li>Compliance audit trails</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Status Footer */}
      <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #374151', fontSize: '12px', color: '#9ca3af' }}>
        <p>Framework Status: <span style={{ color: '#10b981' }}>● Ready</span></p>
        <p>Active Engagements: {engagements.length}</p>
      </div>
    </div>
  );
};

export default EthicalHackingPanel;
