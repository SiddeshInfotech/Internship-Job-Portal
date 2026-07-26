import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import TopNavbar from '../components/TopNavbar';

const STATUS_COLORS = {
  Approved: '#159957',
  Shortlisted: '#2563eb',
  Pending: '#f59e0b',
  Applied: '#7c8cf8',
  Rejected: '#d92d20',
};
const FALLBACK_COLORS = ['#2563eb', '#f59e0b', '#159957', '#d92d20', '#7c8cf8', '#8494ab'];

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

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [months]);

  const chartData = monthly.map((m) => ({ month: m.month, count: m.count || 0 }));
  const totalApps = chartData.reduce((sum, m) => sum + m.count, 0);
  const avgMonthly = chartData.length ? Math.round(totalApps / chartData.length) : 0;
  const peak = chartData.reduce((best, m) => (m.count > (best?.count || 0) ? m : best), null);

  const pieData = breakdown
    ? Object.entries(breakdown)
        .filter(([, v]) => (v || 0) > 0)
        .map(([name, value]) => ({ name, value }))
    : [];
  const breakdownTotal = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="ra-layout-container">
      <main className="ra-main-body">
        <TopNavbar title="Reports & Analytics" />

        {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

        <div className="page-intro-header">
          <h2>Placement Analytics</h2>
          <p>Application volume and pipeline health across the institution.</p>
        </div>

        <div className="ra-filter-row">
          <div className="filter-group">
            <label htmlFor="ra-range">Time range</label>
            <select id="ra-range" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="filter-dropdown-box">
              <option value={3}>Last 3 Months</option>
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last 12 Months</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <MiniStat label="Total applications" value={totalApps.toLocaleString()} />
            <MiniStat label="Avg / month" value={avgMonthly.toLocaleString()} />
            <MiniStat label="Peak" value={peak ? `${peak.count}` : '—'} sub={peak ? peak.month : ''} />
          </div>
        </div>

        {loading ? (
          <div className="ra-grid-two-columns">
            {[0, 1].map((i) => (
              <div key={i} className="ra-chart-card">
                <div className="pf-skeleton" style={{ width: '35%', height: 15, marginBottom: 10 }} />
                <div className="pf-skeleton" style={{ width: '60%', height: 11, marginBottom: 22 }} />
                <div className="pf-skeleton" style={{ width: '100%', height: 240 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="ra-grid-two-columns">
            {/* ---- Monthly applications ---- */}
            <div className="ra-chart-card">
              <div className="card-header-flex" style={{ marginBottom: '18px' }}>
                <div>
                  <h3>Monthly Applications</h3>
                  <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--pf-text-3)' }}>
                    Volume of applications received per month.
                  </p>
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="cp-empty">
                  <div className="cp-empty-icon" aria-hidden="true">📊</div>
                  No application data for this range yet.
                </div>
              ) : (
                <BarChartSVG data={chartData} />
              )}
            </div>

            {/* ---- Status breakdown ---- */}
            <div className="ra-chart-card">
              <div className="card-header-flex" style={{ marginBottom: '18px' }}>
                <div>
                  <h3>Status Breakdown</h3>
                  <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--pf-text-3)' }}>
                    Where every application currently sits.
                  </p>
                </div>
              </div>

              {pieData.length === 0 ? (
                <div className="cp-empty">
                  <div className="cp-empty-icon" aria-hidden="true">🥧</div>
                  No status data available yet.
                </div>
              ) : (
                <>
                  <DonutSVG data={pieData} total={breakdownTotal} colorFor={(name, i) => STATUS_COLORS[name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />

                  <div style={{ borderTop: '1px solid var(--pf-line)', paddingTop: '14px', marginTop: '6px' }}>
                    {pieData.map((d, i) => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0' }}>
                        <span style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: STATUS_COLORS[d.name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length] }} />
                        <span style={{ flex: 1, fontSize: '13px', color: 'var(--pf-text-2)', fontWeight: 500 }}>{d.name}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pf-text)', fontVariantNumeric: 'tabular-nums' }}>{d.value}</span>
                        <span style={{ fontSize: '12px', color: 'var(--pf-text-3)', width: 44, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {Math.round((d.value / breakdownTotal) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* Hand-built SVG bar chart: gridlines, value labels, hover highlight.
   No chart library needed — keeps the bundle lean and the styling on-token. */
function BarChartSVG({ data }) {
  const [hover, setHover] = React.useState(null);
  const W = 520, H = 260;
  const padL = 42, padR = 12, padT = 16, padB = 34;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(1, ...data.map((d) => d.count));
  // "Nice" upper bound so gridlines land on round numbers
  const step = Math.max(1, Math.ceil(max / 4));
  const top = step * 4;
  const bw = innerW / data.length;
  const barW = Math.min(46, bw * 0.55);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 320, height: 'auto', display: 'block' }} role="img" aria-label="Monthly applications bar chart">
        <defs>
          <linearGradient id="ra-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f83f5" />
            <stop offset="100%" stopColor="#1d4fd7" />
          </linearGradient>
        </defs>

        {/* gridlines + y labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const v = (top / 4) * i;
          const y = padT + innerH - (v / top) * innerH;
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="var(--pf-line)" strokeDasharray={i === 0 ? '0' : '3 6'} />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--pf-text-3)">{v}</text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const h = (d.count / top) * innerH;
          const x = padL + i * bw + (bw - barW) / 2;
          const y = padT + innerH - h;
          const active = hover === i;
          return (
            <g key={d.month} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={padL + i * bw} y={padT} width={bw} height={innerH} fill={active ? 'rgba(37,99,235,0.06)' : 'transparent'} />
              <rect
                x={x} y={y} width={barW} height={Math.max(2, h)} rx="7"
                fill="url(#ra-bar)"
                style={{ filter: active ? 'brightness(1.12)' : 'none', transition: 'filter 150ms ease' }}
              />
              <text x={x + barW / 2} y={y - 7} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--pf-text)">
                {d.count}
              </text>
              <text x={padL + i * bw + bw / 2} y={H - 12} textAnchor="middle" fontSize="11.5" fill="var(--pf-text-3)">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* SVG donut built from real proportions (no fake conic-gradient). */
function DonutSVG({ data, total, colorFor }) {
  const size = 210, stroke = 30, r = (size - stroke) / 2, C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', padding: '6px 0 14px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Application status breakdown">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--pf-line)" strokeWidth={stroke} />
          {data.map((d, i) => {
            const frac = total ? d.value / total : 0;
            const len = frac * C;
            const el = (
              <circle
                key={d.name}
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke={colorFor(d.name, i)}
                strokeWidth={stroke}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              >
                <title>{`${d.name}: ${d.value}`}</title>
              </circle>
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <p className="pf-display" style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: 'var(--pf-text)', fontVariantNumeric: 'tabular-nums' }}>
          {total.toLocaleString()}
        </p>
        <p style={{ margin: 0, fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pf-text-3)' }}>TOTAL</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, sub }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <p style={{ margin: 0, fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--pf-text-3)' }}>{label}</p>
      <p className="pf-display" style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 700, color: 'var(--pf-text)', fontVariantNumeric: 'tabular-nums' }}>
        {value}{sub ? <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--pf-text-3)' }}> · {sub}</span> : null}
      </p>
    </div>
  );
}

export default ReportsAnalytics;
