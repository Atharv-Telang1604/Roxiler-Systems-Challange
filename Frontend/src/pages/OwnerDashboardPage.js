import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function OwnerDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/owner/dashboard");
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card">
      <div className="page-header">
        <div>
          <div className="page-title">Store Owner Dashboard</div>
          <div className="page-subtitle">
            View the average rating of your store and the users who rated it.
          </div>
        </div>
      </div>
      {loading && <div className="page-subtitle">Loading dashboard...</div>}
      {error && <div className="form-error">{error}</div>}
      {data && (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Store Name</div>
              <div className="metric-value">{data.storeName}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Average Rating</div>
              <div className="metric-value">{data.averageRating}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total Raters</div>
              <div className="metric-value">
                {Array.isArray(data.ratedBy) ? data.ratedBy.length : 0}
              </div>
            </div>
          </div>
          <table className="table" style={{ marginTop: "1.25rem" }}>
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data.ratedBy) && data.ratedBy.length ? (
                data.ratedBy.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.name}</td>
                    <td>{r.rating}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="page-subtitle">
                    No ratings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

