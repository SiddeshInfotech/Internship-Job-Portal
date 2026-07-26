import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import { asArray } from '../../api/asArray';
import ClientTopNavbar from '../../components/ClientTopNavbar';

// There's no "all applicants across every job" API endpoint — applicants
// are only queryable scoped to one job at a time. Rather than silently
// redirecting to Jobs (which reads as "the Applicants link is broken"),
// this shows the client's jobs directly so they can pick one to view.
function ApplicantsLanding() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({}); // verified per-job applicant totals
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await clientAxios.get('/client/jobs', { params: { per_page: 50 } });
        const list = asArray(res.data.jobs, res.data.results, res.data);
        setJobs(list);
        // The jobs list endpoint doesn't reliably include applicant counts, so
        // verify each job's true total from its applicants endpoint (cheap:
        // per_page=1, we only need `total`). Capped to the first 25 jobs.
        Promise.all(
          list.slice(0, 25).map((job) =>
            clientAxios
              .get(`/client/jobs/${job.id}/applicants`, { params: { page: 1, per_page: 1 } })
              .then((r) => [job.id, r.data.total ?? 0])
              .catch(() => [job.id, null])
          )
        ).then((pairs) => {
          const map = {};
          pairs.forEach(([id, n]) => { if (n !== null) map[id] = n; });
          setCounts(map);
        });
      } catch (err) {
        setError('Could not load your jobs. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Applicants" />
      <div className="cp-page-head">
        <div>
          <h1>Applicants</h1>
          <p>Select a job to review its applicants.</p>
        </div>
      </div>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      {loading ? (
        <div className="cp-panel" aria-label="Loading your jobs">
          {[0, 1, 2].map((i) => (
            <div key={i} className="cp-skel-row">
              <div style={{ flex: 1 }}>
                <div className="pf-skeleton" style={{ width: '30%', height: 14, marginBottom: 7 }} />
                <div className="pf-skeleton" style={{ width: '45%', height: 11 }} />
              </div>
              <div className="pf-skeleton" style={{ width: 90, height: 14 }} />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="cp-panel cp-empty">
          <div className="cp-empty-icon" aria-hidden="true">💼</div>
          You haven't posted any jobs yet.{' '}
          <button onClick={() => navigate('/jobs/new')} className="cp-link-btn">Post one now →</button>
        </div>
      ) : (
        <div className="cp-panel" style={{ padding: '8px 22px' }}>
          {jobs.map((job) => (
            <div key={job.id} onClick={() => navigate(`/jobs/${job.id}/applicants`)} className="cp-list-row" style={{ cursor: 'pointer' }}>
              <div style={{ minWidth: 0 }}>
                <p className="cp-list-name">{job.title}</p>
                <p className="cp-list-sub">{job.status} · Posted {job.posted_date || job.created_at}</p>
              </div>
              <div className="cp-list-meta">
                <span style={{ fontSize: '13px', color: 'var(--pf-text-2)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {counts[job.id] ?? job.applicants_count ?? job.applications_count ?? 0} applicants
                </span>
                <span className="cp-chevron" aria-hidden="true">›</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default ApplicantsLanding;
