import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import TopNavbar from '../components/TopNavbar';

const STATUS_COLORS = {
  Approved: '#16a34a',
  Pending: '#d97706',
  Rejected: '#dc2626',
  Shortlisted: '#2563eb',
};

function ReportsAnalytics() {
  const [months, setMonths] = useState(6);
  const [monthly, setMonthly] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [monthlyRes, breakdownRes] = await Promise.all([
        axiosClient.get('/admin/reports/monthly-applications', { params: { months } }),
        axiosClient.get('/admin/reports/status-breakdown'),
      ]);
      setMonthly(asArray(monthlyRes.data?.monthly_data, monthlyRes.data, monthlyRes.data?.data));
      const bd = breakdownRes.data?.breakdown ?? breakdownRes.data;
      setBreakdown(bd && typeof bd === 'object' && !Array.isArray(bd) ? bd : {});
    } catch (err) {
      setError('Could not load reports. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [months]);

  const maxCount = Math.max(1, ...monthly.map((m) => m.count || 0));
  const totalApps = monthly.reduce((sum, m) => sum + (m.count || 0), 0);
  const avgMonthly = monthly.length ? Math.round(totalApps / monthly.length) : 0;
  const peak = monthly.reduce((best, m) => (m.count > (best?.count || 0) ? m : best), null);

  const breakdownTotal = breakdown ? Object.values(breakdown).reduce((s, v) => s + (v || 0), 0) : 0;

  return (
    <div className="ra-layout-container">
      <main className="ra-main-body">
        <TopNavbar title="Reports & Analytics" />

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>
        )}

        <div className="ra-filter-row">
          <div className="filter-group">
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#334155' }}
            >
              <option value={3}>📅 Last 3 Months</option>
              <option value={6}>📅 Last 6 Months</option>
              <option value={12}>📅 Last 12 Months</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading reports...</div>
        ) : (
        <>
        {/* 📊 GRID ZONE */}
        <div className="ra-grid-two-columns">
          {/* Card 1: Bar Chart */}
          <div className="ra-chart-card">
            <div className="card-header-flex">
              <div>
                <h3>Monthly Applications</h3>
                <p>Total volume of applications received across all departments.</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '220px', padding: '20px 10px 10px', borderBottom: '1px solid #e2e8f0', margin: '20px 0' }}>
              {monthly.length === 0 && (
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>No data for this range</span>
              )}
              {monthly.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: '#334155', marginBottom: '4px', fontWeight: 600 }}>{item.count}</span>
                  <div style={{ height: `${Math.max(4, (item.count / maxCount) * 100)}%`, width: '35px', backgroundColor: '#1d4ed8', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }}></div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>{item.month}</span>
                </div>
              ))}
            </div>

            <div className="metrics-summary-footer">
              <div>
                <span className="meta-label">TOTAL APPS</span>
                <h4>{totalApps.toLocaleString()}</h4>
              </div>
              <div>
                <span className="meta-label">AVG MONTHLY</span>
                <h4>{avgMonthly.toLocaleString()}</h4>
              </div>
              <div>
                <span className="meta-label">PEAK VOLUME</span>
                <h4>{peak ? `${peak.count} ` : '—'}<small>{peak ? `in ${peak.month}` : ''}</small></h4>
              </div>
            </div>
          </div>

          {/* Card 2: Status Breakdown */}
          <div className="ra-chart-card status-card-panel">
            <div className="card-header-flex">
              <h3>Status Breakdown</h3>
            </div>

            <div className="donut-center-mock">
              <div className="donut-inner-circle">
                <h2>{breakdownTotal.toLocaleString()}</h2>
                <p>TOTAL FILTERED</p>
              </div>
            </div>

            <ul className="status-legend-list">
              {breakdown && Object.entries(breakdown).map(([key, value]) => (
                <li key={key}>
                  <span className="dot" style={{ backgroundColor: STATUS_COLORS[key] || '#94a3b8' }}></span> {key} <span className="value-align">{value}</span>
                </li>
              ))}
              {(!breakdown || Object.keys(breakdown).length === 0) && (
                <li style={{ color: '#94a3b8' }}>No status data available</li>
              )}
            </ul>
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
}

export default ReportsAnalytics;
