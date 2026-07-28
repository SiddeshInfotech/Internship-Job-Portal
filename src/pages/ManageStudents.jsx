import React from 'react';
import './ManageStudents.css';

function ManageStudents() {
  const studentsData = [
    { id: 1, name: "Arjun Sharma", roll: "STU-001", college: "Indian Institute of Technology", branch: "Computer Science", email: "arjun.s@iit.edu", status: "ACTIVE", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" },
    { id: 2, name: "Priya Patel", roll: "STU-002", college: "St. Xavier's College", branch: "Economics", email: "priya.p@stxaviers.ac.in", status: "ACTIVE", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    { id: 3, name: "Rahul Verma", roll: "STU-003", college: "Delhi Technological University", branch: "Mechanical Engineering", email: "rahul.v@dtu.ac.in", status: "BLOCKED", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    { id: 4, name: "Ananya Iyer", roll: "STU-004", college: "Birla Institute of Technology", branch: "Information Technology", email: "ananya.i@bits.edu", status: "ACTIVE", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
    { id: 5, name: "Vikram Singh", roll: "STU-005", college: "National Institute of Design", branch: "Interaction Design", email: "vikram.s@nid.edu", status: "ACTIVE", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" }
  ];

  return (
    <div className="stud-layout-wrapper">
      
      {/* 📋 TOP ACTION BAR */}
      <div className="stud-header-title-bar">
        <h2>Manage Students</h2>
      </div>

      <div className="stud-table-card-wrapper">
        <div className="stud-table-action-row">
          <div className="stud-left-filter-cluster">
            <div className="stud-inline-search-input">
              <span className="stud-input-lens">🔍</span>
              <input type="text" placeholder="Search by student name, college, or email..." />
            </div>
            <select className="stud-inline-dropdown-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Blocked</option>
            </select>
          </div>

          <div className="stud-right-action-cluster">
            <button className="stud-orange-action-cta-btn">+ Add Student</button>
          </div>
        </div>

        {/* 📊 RESPONSIVE DATA TABLE */}
        <div className="stud-table-responsive-scroller">
          <table className="visily-stud-grid-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>STUDENT NAME</th>
                <th style={{ width: '30%' }}>COLLEGE & BRANCH</th>
                <th style={{ width: '25%' }}>EMAIL ADDRESS</th>
                <th style={{ width: '10%' }}>STATUS</th>
                <th style={{ width: '10%', textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="stud-cell-identity-layout">
                      <img src={student.avatar} alt={student.name} className="stud-cell-logo-avatar" />
                      <div className="stud-cell-text-group">
                        <p className="stud-cell-main-title">{student.name}</p>
                        <p className="stud-cell-sub-caption">{student.roll}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="stud-cell-text-group">
                      <p className="stud-cell-standard-text font-medium">{student.college}</p>
                      <p className="stud-cell-sub-caption text-slate">{student.branch}</p>
                    </div>
                  </td>
                  <td className="stud-cell-standard-text">{student.email}</td>
                  <td>
                    <span className={`stud-pill-badge-status ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="stud-cell-actions-flex-wrapper">
                      <span className="stud-action-glyph view" title="View Profile">👁️</span>
                      <span className="stud-action-glyph status-toggle" title="Change Status">🚫</span>
                      <span className="stud-action-glyph delete" title="Delete Student">🗑️</span>
                      <span className="stud-action-glyph options" title="More Options">•••</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔢 FOOTER PAGINATION ZONE */}
        <div className="stud-table-pagination-footer-row">
          <p className="stud-pagination-counter-label">Showing 1-5 of 124 students</p>
          <div className="stud-pagination-controls-stack">
            <button className="stud-arrow-step-btn">‹</button>
            <button className="stud-page-num-btn state-active">1</button>
            <button className="stud-page-num-btn">2</button>
            <button className="stud-page-num-btn">3</button>
            <span className="stud-pagination-ellipsis">...</span>
            <button className="stud-page-num-btn">25</button>
            <button className="stud-arrow-step-btn">›</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ManageStudents;