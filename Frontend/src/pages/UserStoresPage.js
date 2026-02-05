import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function UserStoresPage() {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const loadStores = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchName) params.append("name", searchName);
      if (searchAddress) params.append("address", searchAddress);
      const qs = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`/api/stores${qs}`);
      setStores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRatingChange = (storeId, value) => {
    const v = value ? Number(value) : "";
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId ? { ...s, userRating: v } : s
      )
    );
  };

  const handleSubmitRating = async (storeId, rating) => {
    if (!rating || rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }
    setSavingId(storeId);
    try {
      await apiFetch("/api/ratings", {
        method: "POST",
        body: JSON.stringify({ storeId, rating }),
      });
      await loadStores();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="card">
      <div className="page-header">
        <div>
          <div className="page-title">Stores</div>
          <div className="page-subtitle">
            Browse all registered stores and submit or update your rating.
          </div>
        </div>
      </div>

      <div className="form-grid" style={{ marginBottom: "0.75rem" }}>
        <div className="form-field">
          <label>Search by name</label>
          <input
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Store name..."
          />
        </div>
        <div className="form-field">
          <label>Search by address</label>
          <input
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="City, area..."
          />
        </div>
        <div className="form-field">
          <label>&nbsp;</label>
          <div className="stack-row">
            <button className="btn btn-secondary" onClick={loadStores}>
              Apply Filters
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setSearchName("");
                setSearchAddress("");
                setTimeout(loadStores, 0);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading ? (
        <div className="page-subtitle">Loading stores...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan={5} className="page-subtitle">
                  No stores found.
                </td>
              </tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.address}</td>
                  <td>{s.avgRating ?? "—"}</td>
                  <td>
                    <input
                      className="rating-input"
                      type="number"
                      min={1}
                      max={5}
                      value={s.userRating ?? ""}
                      onChange={(e) =>
                        handleRatingChange(s.id, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      disabled={savingId === s.id}
                      onClick={() =>
                        handleSubmitRating(s.id, Number(s.userRating))
                      }
                    >
                      {s.userRating ? "Update" : "Submit"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

