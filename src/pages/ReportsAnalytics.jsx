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
  
  // New state to trigger entrance animations after data loads
  const [showAnims, setShowAnims] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    setShowAnims(false);
    try {
      const [monthlyRes, breakdownRes] = await Promise.all([
        axiosClient.get('/admin/reports/monthly-applications', { params: { months } }),
        axiosClient.get('/admin/reports/status-breakdown'),
      ]);
      setMonthly(asArray(monthlyRes.data?.monthly_data, monthlyRes.data, monthlyRes.data?.data));
      const bd = breakdownRes.data?.breakdown ?? breakdownRes.data;
      setBreakdown(bd && typeof bd === 'object' && !Array.isArray(bd) ? bd : {});
      
      // Trigger animations shortly after data is set
      setTimeout(() => setShowAnims(true), 100);
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

  // Calculate dynamic conic gradient for the donut chart
  const generateDonutGradient = () => {
    if (!breakdown || breakdownTotal === 0) return 'conic-gradient(#e2e8f0 0% 100%)';
    let currentPercentage = 0;
    const stops = Object.entries(breakdown).map(([key, value]) => {
      const percentage = (value / breakdownTotal) * 100;
      const color = STATUS_COLORS[key] || '#94a3b8';
      const stop = `${color} ${currentPercentage}% ${currentPercentage + percentage}%`;
      currentPercentage += percentage;
      return stop;
    });
    return `conic-gradient(${stops.join(', ')})`;
  };

  return (
    <div className="ra-layout-container animated-reports-wrapper">
      <style>{`
        .animated-reports-wrapper {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
        }
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .creative-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #f1f5f9;
        }
        .creative-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .bar-chart-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 240px;
          padding: 20px 10px 0;
          border-bottom: 2px dashed #e2e8f0;
          margin: 20px 0 30px;
        }
        .animated-bar {
          width: 40px;
          background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 6px 6px 0 0;
          transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 -4px 10px rgba(59, 130, 246, 0.2);
          position: relative;
        }
        .animated-bar:hover {
          filter: brightness(1.1);
          cursor: pointer;
        }
        .pulse-loader {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .dynamic-donut {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          margin: 30px auto;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.1);
          animation: spinIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes spinIn {
          from { transform: scale(0.5) rotate(-90deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .donut-hole {
          width: 110px;
          height: 110px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 4px 6px -1px rgba(0,0,0,0.1);
          z-index: 2;
        }
        .status-legend-list li {
          transition: transform 0.2s ease, background 0.2s ease;
          padding: 8px 12px;
          border-radius: 8px;
        }
        .status-legend-list li:hover {
          background: #f8fafc;
          transform: translateX(5px);
        }
      `}</style>

      <main className="ra-main-body" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <TopNavbar title="Reports & Analytics" />

        {error && (
          <div className="fade-in-up" style={{ background: '#fef2f2', color: '#dc2626', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', borderLeft: '4px solid #dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="ra-filter-row fade-in-up" style={{ marginBottom: '24px', animationDelay: '0.1s' }}>
          <div className="filter-group">
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#1e293b', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            >
              <option value={3}>📅 Last 3 Months</option>
              <option value={6}>📅 Last 6 Months</option>
              <option value={12}>📅 Last 12 Months</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="pulse-loader" style={{ display: 'flex', gap: '24px', marginTop: '30px' }}>
             <div style={{ flex: 2, height: '400px', background: '#e2e8f0', borderRadius: '16px' }}></div>
             <div style={{ flex: 1, height: '400px', background: '#e2e8f0', borderRadius: '16px' }}></div>
          </div>
        ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Card 1: Animated Bar Chart */}
          <div className="creative-card fade-in-up" style={{ gridColumn: 'span 2', animationDelay: '0.2s' }}>
            <div className="card-header-flex" style={{ marginBottom: '10px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>Monthly Applications</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Application volume trajectory over the selected period.</p>
              </div>
            </div>

            <div className="bar-chart-container">
              {monthly.length === 0 && (
                <span style={{ color: '#94a3b8', fontSize: '14px', width: '100%', textAlign: 'center', marginBottom: '20px' }}>No data for this date range</span>
              )}
              {monthly.map((item, idx) => {
                const targetHeight = Math.max(4, (item.count / maxCount) * 100);
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', group: 'hover' }}>
                    <span style={{ 
                      fontSize: '13px', 
                      color: '#1e293b', 
                      marginBottom: '8px', 
                      fontWeight: 700,
                      opacity: showAnims ? 1 : 0,
                      transform: showAnims ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'all 0.5s ease',
                      transitionDelay: `${(idx * 0.1) + 0.3}s`
                    }}>
                      {item.count}
                    </span>
                    <div 
                      className="animated-bar"
                      style={{ 
                        height: showAnims ? `${targetHeight}%` : '0%',
                        transitionDelay: `${idx * 0.1}s` 
                      }}
                    ></div>
                    <span style={{ fontSize: '13px', color: '#64748b', marginTop: '12px', fontWeight: 500 }}>{item.month}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px' }}>TOTAL APPS</span>
                <h4 style={{ margin: '4px 0 0', fontSize: '1.5rem', color: '#0f172a' }}>{totalApps.toLocaleString()}</h4>
              </div>
              <div style={{ width: '1px', background: '#e2e8f0' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px' }}>AVG MONTHLY</span>
                <h4 style={{ margin: '4px 0 0', fontSize: '1.5rem', color: '#0f172a' }}>{avgMonthly.toLocaleString()}</h4>
              </div>
              <div style={{ width: '1px', background: '#e2e8f0' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px' }}>PEAK VOLUME</span>
                <h4 style={{ margin: '4px 0 0', fontSize: '1.5rem', color: '#0f172a' }}>
                  {peak ? peak.count : '—'} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>{peak ? `(${peak.month})` : ''}</span>
                </h4>
              </div>
            </div>
          </div>

          {/* Card 2: Status Breakdown with Dynamic Conic Gradient */}
          <div className="creative-card fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="card-header-flex">
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>Status Breakdown</h3>
            </div>

            <div className="dynamic-donut" style={{ background: generateDonutGradient() }}>
              <div className="donut-hole">
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>{breakdownTotal.toLocaleString()}</h2>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.5px' }}>TOTAL</p>
              </div>
            </div>

            <ul className="status-legend-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {breakdown && Object.entries(breakdown).map(([key, value], idx) => (
                <li 
                  key={key} 
                  className="fade-in-up"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px',
                    animationDelay: `${0.6 + (idx * 0.1)}s` 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: STATUS_COLORS[key] || '#94a3b8', boxShadow: `0 0 8px ${STATUS_COLORS[key]}40` }}></span>
                    <span style={{ color: '#334155', fontWeight: 500 }}>{key}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{value.toLocaleString()}</span>
                </li>
              ))}
              {(!breakdown || Object.keys(breakdown).length === 0) && (
                <li style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No status data available</li>
              )}
            </ul>
          </div>

        </div>
        )}
      </main>
    </div>
  );
}

export default ReportsAnalytics;