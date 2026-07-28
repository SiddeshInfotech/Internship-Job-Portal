import React from 'react';
import './ManageCompanies.css';

function ManageCompanies() {
  // Exact layout structure data as visible in mockups
  const companiesData = [
    { id: 1, name: "Global Tech Solutions", short: "G", subtitle: "A LEADING PROVIDER OF ENTERPRISE", industry: "Software Engineering", email: "hr@globaltech.com", status: "VERIFIED" },
    { id: 2, name: "North Star Logistics", short: "N", subtitle: "MODERN LOGISTICS FOR THE 21ST CE", industry: "Supply Chain", email: "careers@nstarlogistics.io", status: "PENDING" },
    { id: 3, name: "Apex FinTech", short: "A", subtitle: "DISRUPTING THE TRADITIONAL BANKI", industry: "Financial Services", email: "partnerships@apexfin.com", status: "VERIFIED" },
    { id: 4, name: "Green Horizon Energy", short: "G", subtitle: "SUSTAINABLE ENERGY SOLUTIONS FO", industry: "Renewable Resources", email: "contact@greenhorizon.org", status: "BLOCKED" },
    { id: 5, name: "Creative Media Labs", short: "C", subtitle: "HIGH-IMPACT STORYTELLING FOR GLO", industry: "Digital Marketing", email: "hiring@cmlabs.net", status: "PENDING" }
  ];

  return (
    <main className="manage-companies-panel">
      
      {/* 🔝 MAIN COMPONENT TITLE HEAD */}
      <header className="comp-panel-header">
        <h2 className="comp-panel-title">Manage Companies</h2>
        
        <div className="comp-header-right">
          <div className="comp-search-pill-box">
            <span className="search-lens">🔍</span>
            <input type="text" placeholder="Search dashboard..." />
          </div>
          
          <div className="comp-admin-badge">
            <div className="admin-meta-info">
              <h4>Super Admin</h4>
              <p>INSTITUTIONAL ROLE</p>
            </div>
            <div className="admin-avatar-node">SA</div>
          </div>
        </div>
      </header>

      {/* 📊 4 METRICS SECTION GRID */}
      <section className="comp-metrics-quad-grid">
        <div className="metric-quad-card cyan-pulse">
          <div className="metric-card-inner-flex">
            <div>
              <p className="metric-top-label">TOTAL PARTNERS</p>
              <h2 className="metric-giant-num">124</h2>
            </div>
            <div className="metric-icon-badge blue-tint">🏢</div>
          </div>
          <span className="metric-trend-subtext text-tint-blue">+12 this semester</span>
        </div>

        <div className="metric-quad-card emerald-pulse">
          <div className="metric-card-inner-flex">
            <div>
              <p className="metric-top-label">VERIFIED</p>
              <h2 className="metric-giant-num">98</h2>
            </div>
            <div className="metric-icon-badge green-tint">✅</div>
          </div>
          <span className="metric-trend-subtext text-tint-green">79% Trust Score</span>
        </div>

        <div className="metric-quad-card amber-pulse">
          <div className="metric-card-inner-flex">
            <div>
              <p className="metric-top-label">PENDING APPROVAL</p>
              <h2 className="metric-giant-num">18</h2>
            </div>
            <div className="metric-icon-badge orange-tint">⏳</div>
          </div>
          <span className="metric-trend-subtext text-tint-orange">Require review</span>
        </div>

        <div className="metric-quad-card crimson-pulse">
          <div className="metric-card-inner-flex">
            <div>
              <p className="metric-top-label">BANNED COMPANIES</p>
              <h2 className="metric-giant-num">08</h2>
            </div>
            <div className="metric-icon-badge red-tint">🚫</div>
          </div>
          <span className="metric-trend-subtext text-tint-red">-2 since last month</span>
        </div>
      </section>

      {/* 📋 MAIN CONTENT LAYER CONTROL */}
      <div className="comp-table-card-wrapper">
        
        {/* FILTERS SUB-NAVBAR */}
        <div className="comp-table-action-row">
          <div className="left-input-filter-cluster">
            <div className="inline-search-input">
              <span className="input-lens">🔍</span>
              <input type="text" placeholder="Search by company name, industry, or email..." />
            </div>
            
            <select className="inline-dropdown-select">
              <option>All Industries</option>
            </select>
          </div>

          <button className="orange-action-cta-btn">＋ Add Company</button>
        </div>

        {/* DATA TABLE VIEW */}
        <div className="table-header-caption-bar">
          <h3>Company Registry</h3>
        </div>

        <table className="visily-companies-grid-table">
          <thead>
            <tr>
              <th>COMPANY NAME</th>
              <th>INDUSTRY</th>
              <th>CONTACT EMAIL</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {companiesData.map((company) => (
              <tr key={company.id}>
                <td>
                  <div className="cell-identity-layout">
                    <div className="cell-logo-avatar">{company.short}</div>
                    <div>
                      <p className="cell-main-title">{company.name}</p>
                      <p className="cell-sub-caption">{company.subtitle}</p>
                    </div>
                  </div>
                </td>
                <td className="cell-standard-text font-medium">{company.industry}</td>
                <td className="cell-standard-text text-slate">{company.email}</td>
                <td>
                  <span className={`pill-badge-status ${company.status.toLowerCase()}`}>
                    {company.status}
                  </span>
                </td>
                <td>
                  <div className="cell-actions-flex-wrapper">
                    <span className="action-glyph view-blue" title="View Profile">👁️</span>
                    <span className="action-glyph approve-emerald" title="Approve Partners">✔️</span>
                    <span className="action-glyph ban-crimson" title="Block Partners">🚫</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION LAYOUT FOR REGISTRY */}
        <div className="table-pagination-footer-row">
          <span className="pagination-counter-label">Showing 1-5 of 124 results</span>
          
          <div className="pagination-controls-stack">
            <button className="arrow-step-btn">‹</button>
            <button className="page-num-btn state-active">1</button>
            <button className="page-num-btn">2</button>
            <button className="page-num-btn">3</button>
            <span className="pagination-elipsis-break">...</span>
            <button className="page-num-btn">12</button>
            <button className="arrow-step-btn">›</button>
          </div>
        </div>

      </div>

      {/* 🟦 BLUE PARTNER VERIFICATION GUIDE BANNER BLOCK */}
      <div className="partner-guide-banner-card">
        <div className="banner-text-content-side">
          <h3>Partner Verification Guide</h3>
          <p>Institutional partnerships require active verification of business licenses and placement histories. Ensure all documents are reviewed before approving new entities.</p>
          <button className="banner-white-action-btn">View Policy Documents</button>
        </div>
        <div className="banner-vector-graphics-side">
          <div className="abstract-document-icon">📄</div>
        </div>
      </div>

    </main>
  );
}

export default ManageCompanies;