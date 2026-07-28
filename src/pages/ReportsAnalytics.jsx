import React from 'react';
import './ReportsAnalytics.css';

function ReportsAnalytics() {
  const monthlyMetrics = [
    { month: "Jan", volume: 430 },
    { month: "Feb", volume: 510 },
    { month: "Mar", volume: 560 },
    { month: "Apr", volume: 540 },
    { month: "May", volume: 645 },
    { month: "Jun", volume: 780 }
  ];

  const breakdownStats = [
    { type: "Approved", count: 400, color: "#16a34a" },
    { type: "Pending", count: 300, color: "#eab308" },
    { type: "Rejected", count: 200, color: "#dc2626" },
    { type: "Shortlisted", count: 150, color: "#2563eb" }
  ];

  return (
    <div className="rep-analytics-container">
      
      {/* 🔝 TOP HEADER CONTROLS SECTION */}
      <div className="rep-main-header-flex">
        <h2>Reports & Analytics</h2>
        <div className="rep-search-bar-wrapper">
          <input type="text" placeholder="Search dashboard..." />
        </div>
      </div>

      {/* 📈 DUAL SPLIT ROW: METRICS LEFT & OVERVIEW CHIPS RIGHT */}
      <div className="rep-top-dashboard-split-row">
        {/* LEFT COMPONENT: 3 CORE STATS CARDS */}
        <div className="rep-stats-triple-grid">
          <div className="rep-counter-box-card">
            <p className="rep-box-label">TOTAL APPS</p>
            <div className="rep-data-numeric-row">
              <h3>3,730</h3>
              <span className="rep-rate-badge upward">▲ +18.4%</span>
            </div>
          </div>
          <div className="rep-counter-box-card">
            <p className="rep-box-label">AVG MONTHLY</p>
            <div className="rep-data-numeric-row">
              <h3>621</h3>
              <span className="rep-rate-badge upward">▲ +5.2%</span>
            </div>
          </div>
          <div className="rep-counter-box-card">
            <p className="rep-box-label">PEAK VOLUME</p>
            <div className="rep-data-numeric-row">
              <h3>850</h3>
              <span className="rep-peak-timeline-flag">in Jun</span>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: 2 STATUS ROW BLOCKS SUMMARY */}
        <div className="rep-status-overview-panel-card">
          <div className="rep-pill-info-row">
            <span className="rep-status-indicator-dot red-dot-marker"></span>
            <span className="rep-pill-label">Rejected:</span>
            <span className="rep-pill-count-value">200</span>
          </div>
          <div className="rep-pill-info-row">
            <span className="rep-status-indicator-dot blue-dot-marker"></span>
            <span className="rep-pill-label">Shortlisted:</span>
            <span className="rep-pill-count-value">150</span>
          </div>
        </div>
      </div>

      {/* 🔄 MID SECTION COLUMN GRIDS SPLIT - BAR CHART & DONUT PIE */}
      <div className="rep-charts-equalizer-layout-grid">
        
        {/* MONTHLY APPLICATIONS BAR DISPLAY */}
        <div className="rep-workspace-card-panel rep-bar-chart-card-wrapper">
          <div className="rep-panel-header-toolbar">
            <div className="rep-text-group-block">
              <h4>Monthly Applications</h4>
              <p className="rep-muted-sub-label">Total volume of applications received across all departments.</p>
            </div>
            <div className="rep-utility-actions-flex-strip">
              <button className="rep-action-download-btn">📥 PDF</button>
              <button className="rep-action-download-btn">📥 CSV</button>
              <button className="rep-contextual-menu-trigger">⋮</button>
            </div>
          </div>

          <div className="rep-bar-chart-graphics-engine-box">
            <div className="rep-axis-ticks-y-labels">
              <span>860</span>
              <span>645</span>
              <span>430</span>
              <span>215</span>
              <span>0</span>
            </div>
            <div className="rep-bars-viewport-render-track">
              {monthlyMetrics.map((item, index) => (
                <div className="rep-individual-column-track" key={index}>
                  <div className="rep-solid-colored-bar" style={{ height: `${(item.volume / 860) * 100}%` }}>
                    <span className="rep-floating-tooltip">{item.volume}</span>
                  </div>
                  <span className="rep-coordinate-label-x">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATUS BREAKDOWN PIE PANEL */}
        <div className="rep-workspace-card-panel rep-donut-breakdown-card-wrapper">
          <div className="rep-panel-header-toolbar">
            <h4>Status Breakdown</h4>
            <button className="rep-contextual-menu-trigger">⋮</button>
          </div>

          <div className="rep-donut-chart-graphic-frame-box">
            <div className="rep-conic-gradient-pie-ring">
              <div className="rep-inner-mask-hole-core">
                <h3>1,150</h3>
                <p>TOTAL FILTERED</p>
              </div>
            </div>
          </div>

          <div className="rep-donut-legends-vertical-stack">
            {breakdownStats.map((stat, idx) => (
              <div className="rep-legend-item-alignment-row" key={idx}>
                <div className="rep-legend-left-inline-group">
                  <span className="rep-legend-color-box-dot" style={{ backgroundColor: stat.color }}></span>
                  <span className="rep-legend-title-string">{stat.type}</span>
                </div>
                <span className="rep-legend-numeric-value">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 📉 BOTTOM AREA GRID SECTION: REGISTRATION GROWTH FULL SPAN BLOCK */}
      <div className="rep-workspace-card-panel rep-full-width-trends-card-wrapper">
        <div className="rep-panel-header-toolbar">
          <div className="rep-text-group-block">
            <h4>Registration Growth Trends</h4>
            <p className="rep-muted-sub-label">Acquisition rate for new institutional partners and student profiles.</p>
          </div>
          <div className="rep-graph-chips-filter-row">
            <div className="rep-toggle-filter-badge active-students-pill">
              <span className="rep-color-chip-bullet blue-bullet-marker"></span> Students
            </div>
            <div className="rep-toggle-filter-badge active-companies-pill">
              <span className="rep-color-chip-bullet orange-bullet-marker"></span> Companies
            </div>
            <button className="rep-contextual-menu-trigger">⋮</button>
          </div>
        </div>

        {/* 🛠️ SVG BASED FULL WIDTH RESPONSIVE GRAPH VIEWPORT */}
        <div className="rep-linear-graph-viewport-layout">
          <div className="rep-linear-y-axis-ticks-labels">
            <span>360</span>
            <span>275</span>
            <span>190</span>
            <span>105</span>
            <span>20</span>
          </div>
          
          <div className="rep-matrix-background-grid-lines">
            <div className="rep-matrix-grid-line-item"></div>
            <div className="rep-matrix-grid-line-item"></div>
            <div className="rep-matrix-grid-line-item"></div>
            <div className="rep-matrix-grid-line-item"></div>
            <div className="rep-matrix-grid-line-item"></div>

            <svg className="rep-responsive-vector-svg-viewport" viewBox="0 0 800 160" preserveAspectRatio="none">
              <path d="M 10 120 Q 150 100, 260 85 T 520 50 T 790 25 L 790 160 L 10 160 Z" fill="url(#linearGraphGradientFill)" />
              <path d="M 10 120 Q 150 100, 260 85 T 520 50 T 790 25" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="linearGraphGradientFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              <circle cx="10" cy="120" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="145" cy="102" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="260" cy="85" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="390" cy="71" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="525" cy="50" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="790" cy="25" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
            </svg>

            <div className="rep-linear-x-axis-timeline-labels-row">
              <span>2023-01</span>
              <span>2023-02</span>
              <span>2023-03</span>
              <span>2023-04</span>
              <span>2023-05</span>
              <span>2023-06</span>
              <span>2023-07</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ANALYSIS STRIP HEADER GRID */}
        <div className="rep-bottom-analytics-metric-dashboard-strip">
          <div className="rep-footer-status-block-cell">
            <div className="rep-footer-block-label-title-row">
              <span className="rep-footer-icon-badge">📈</span>
              <strong>GROWTH MOMENTUM</strong>
            </div>
            <h4>Robust (+22%)</h4>
          </div>
          <div className="rep-footer-status-block-cell">
            <span className="rep-footer-cell-dim-label">TOTAL STUDENTS</span>
            <h4>1,850 <small className="positive-text-trend">▲ +310 this quarter</small></h4>
          </div>
          <div className="rep-footer-status-block-cell">
            <span className="rep-footer-cell-dim-label">TOTAL PARTNERS</span>
            <h4>245 <small className="positive-text-trend">▲ +18 this quarter</small></h4>
          </div>
          <div className="rep-footer-status-block-cell">
            <span className="rep-footer-cell-dim-label">CONVERSION RATE</span>
            <h4>68.4% <small className="negative-text-trend">▼ -2.1%</small></h4>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ReportsAnalytics;