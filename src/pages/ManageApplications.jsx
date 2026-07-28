import React from 'react';

function ManageApplications() {
  // Screenshots ke mutabik exact live student data array
  const applicationsData = [
    { id: 1, name: "Arjun Mehta", dept: "Computer Science", role: "Frontend Developer", company: "TechNova Solutions", logo: "TE", date: "Oct 12, 2023", status: "PENDING" },
    { id: 2, name: "Sarah Williams", dept: "Electrical Engineering", role: "Systems Engineer", company: "Global Power Systems", logo: "GL", date: "Oct 10, 2023", status: "APPROVED" },
    { id: 3, name: "Vikram Singh", dept: "Mechanical Engineering", role: "Product Designer", company: "AutoDrive Corp", logo: "AU", date: "Oct 08, 2023", status: "REJECTED" },
    { id: 4, name: "Elena Rodriguez", dept: "Data Science", role: "Junior Data Analyst", company: "Insight Analytics", logo: "IN", date: "Oct 07, 2023", status: "PENDING" },
    { id: 5, name: "Kevin Park", dept: "Information Tech", role: "Security Intern", company: "SecureNet Systems", logo: "SE", date: "Oct 05, 2023", status: "APPROVED" },
  ];

  return (
    <main className="db-main-body" style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 🔝 TOP NAVIGATION BAR */}
      <header className="db-top-navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div className="nav-left-title">
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Manage Applications</h2>
        </div>
        <div className="nav-right-controls" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="search-bar-wrapper" style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search dashboard..." 
              style={{ padding: '8px 16px 8px 36px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '240px', fontSize: '14px', outline: 'none' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
          </div>
          <div className="admin-profile-identity" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="profile-text-node" style={{ textAlign: 'right' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Super Admin</h4>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '500', color: '#64748b', letterSpacing: '0.5px' }}>INSTITUTIONAL ROLE</p>
            </div>
            <div className="avatar-circle" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#475569' }}>
              SA
            </div>
          </div>
        </div>
      </header>

      {/* 📊 FOUR METRICS ROW */}
      <section className="metrics-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        
        {/* TOTAL APPLIED */}
        <div className="metric-panel-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>TOTAL APPLIED</p>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>1,248</h2>
            </div>
            <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '50%', fontSize: '18px', color: '#3b82f6' }}>📄</div>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>🕒 Updated 12 mins ago</span>
        </div>

        {/* PENDING REVIEW */}
        <div className="metric-panel-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>PENDING REVIEW</p>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>426</h2>
            </div>
            <div style={{ padding: '10px', background: '#fffbeb', borderRadius: '50%', fontSize: '18px', color: '#d97706' }}>🕒</div>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>🕒 Updated 12 mins ago</span>
        </div>

        {/* SHORTLISTED */}
        <div className="metric-panel-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>SHORTLISTED</p>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>582</h2>
            </div>
            <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '50%', fontSize: '18px', color: '#16a34a' }}>✅</div>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>🕒 Updated 12 mins ago</span>
        </div>

        {/* REJECTED */}
        <div className="metric-panel-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>REJECTED</p>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>240</h2>
            </div>
            <div style={{ padding: '10px', background: '#fef2f2', borderRadius: '50%', fontSize: '18px', color: '#dc2626' }}>❌</div>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>🕒 Updated 12 mins ago</span>
        </div>

      </section>

      {/* 📋 TABLE AND FILTER INTERFACE CARD */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* FILTERS TOOLBAR ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search by student or company..." 
                style={{ padding: '8px 16px 8px 36px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '280px', fontSize: '14px' }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            </div>
            
            <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: '14px' }}>
              <option>📅 Semester 2023-24</option>
            </select>

            <button style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⏳</span> Filter Status
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📥</span> Export CSV
            </button>
            <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#ea580c', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Generate Report
            </button>
          </div>
        </div>

        {/* DATA TABLE AREA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Submissions</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Showing 5 entries</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '12px 8px' }}>Student Name ↕</th>
              <th style={{ padding: '12px 8px' }}>Job Title</th>
              <th style={{ padding: '12px 8px' }}>Company</th>
              <th style={{ padding: '12px 8px' }}>Applied Date ↕</th>
              <th style={{ padding: '12px 8px' }}>Status</th>
              <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationsData.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {/* Student Avatar + Identity Details */}
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#475569', fontSize: '12px' }}>
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{item.dept}</p>
                    </div>
                  </div>
                </td>
                
                {/* Job Info Text */}
                <td style={{ padding: '16px 8px', color: '#334155', fontWeight: '500' }}>{item.role}</td>
                
                {/* Company Label + Mini Monogram */}
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#f1f5f9', color: '#64748b', padding: '4px 6px', borderRadius: '4px' }}>{item.logo}</span>
                    <span style={{ color: '#475569', fontWeight: '500' }}>{item.company}</span>
                  </div>
                </td>
                
                {/* Applied Date stamp */}
                <td style={{ padding: '16px 8px', color: '#64748b' }}>{item.date}</td>
                
                {/* Colorful Status Tags exactly matching colors */}
                <td style={{ padding: '16px 8px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'inline-block',
                    backgroundColor: item.status === 'APPROVED' ? '#f0fdf4' : item.status === 'PENDING' ? '#fffbeb' : '#fef2f2',
                    color: item.status === 'APPROVED' ? '#16a34a' : item.status === 'PENDING' ? '#d97706' : '#dc2626'
                  }}>
                    {item.status}
                  </span>
                </td>
                
                {/* Action CTA Icons pack */}
                <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', color: '#64748b', fontSize: '16px' }}>
                    <span style={{ cursor: 'pointer' }} title="View">👁️</span>
                    <span style={{ cursor: 'pointer' }} title="Download">📥</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔢 FOOTER INTERACTION AREA: PAGINATION BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Showing 1-5 of 42 applications</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>‹</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '4px', border: 'none', background: '#eff6ff', color: '#1d4ed8', fontWeight: '600', fontSize: '13px' }}>1</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>2</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>3</button>
            <span style={{ color: '#94a3b8', padding: '0 4px' }}>...</span>
            <button style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>9</button>
            <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>›</button>
          </div>
        </div>

        {/* 💡 BOTTOM PRO-TIP INFO PANEL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '8px', padding: '12px 16px', marginTop: '24px', color: '#0f766e', fontSize: '13px' }}>
          <span>🧭</span>
          <p style={{ margin: 0, fontWeight: '500' }}><strong>Pro Tip:</strong> You can click on the column headers to sort the applications by student name, company, or submission date.</p>
        </div>

      </div>

      {/* 📝 FOOTER BRAND LINE */}
      <footer style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
        © 2026 YourCompany Institutional Management System. All rights reserved. | <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Support</span> | <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
      </footer>

    </main>
  );
}

export default ManageApplications;