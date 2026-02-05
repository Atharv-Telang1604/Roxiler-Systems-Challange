import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("stores");
  const [error, setError] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [userMessage, setUserMessage] = useState("");

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });
  const [creatingStore, setCreatingStore] = useState(false);
  const [storeMessage, setStoreMessage] = useState("");

  const loadMetrics = async () => {
    try {
      const data = await apiFetch("/api/admin/dashboard");
      setMetrics(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStores = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.email) params.append("email", filters.email);
      if (filters.address) params.append("address", filters.address);
      const qs = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`/api/admin/stores${qs}`);
      setStores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.email) params.append("email", filters.email);
      if (filters.address) params.append("address", filters.address);
      if (filters.role) params.append("role", filters.role);
      const qs = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`/api/admin/users${qs}`);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    loadStores();
    loadUsers();
    
  }, []);

  const applyFilters = () => {
    if (tab === "stores") loadStores();
    else loadUsers();
  };

  const clearFilters = () => {
    setFilters({ name: "", email: "", address: "", role: "" });
    setTimeout(() => {
      if (tab === "stores") loadStores();
      else loadUsers();
    }, 0);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMessage("");
    setCreatingUser(true);
    try {
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      setUserMessage("User created successfully.");
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER",
      });
      await loadUsers();
    } catch (err) {
      setUserMessage(err.message);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setStoreMessage("");
    setCreatingStore(true);
    try {
      const payload = {
        name: newStore.name,
        email: newStore.email,
        address: newStore.address,
        owner_id: Number(newStore.owner_id) || null,
      };

      await apiFetch("/api/admin/stores", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setStoreMessage("Store created successfully.");
      setNewStore({ name: "", email: "", address: "", owner_id: "" });
      await loadStores();
    } catch (err) {
      setStoreMessage(err.message);
    } finally {
      setCreatingStore(false);
    }
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="page-header">
          <div>
            <div className="page-title">Admin Dashboard</div>
            <div className="page-subtitle">
              Overview of users, stores and submitted ratings.
            </div>
          </div>
        </div>
        {metrics && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Total Users</div>
              <div className="metric-value">{metrics.totalUsers}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total Stores</div>
              <div className="metric-value">{metrics.totalStores}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total Ratings</div>
              <div className="metric-value">{metrics.totalRatings}</div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="stack-row" style={{ justifyContent: "space-between" }}>
          <div className="stack-row">
            <button
              className="btn btn-secondary"
              onClick={() => setTab("stores")}
              style={{
                background: tab === "stores" ? "#2563eb" : undefined,
                color: tab === "stores" ? "#fff" : undefined,
              }}
            >
              Stores
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setTab("users")}
              style={{
                background: tab === "users" ? "#2563eb" : undefined,
                color: tab === "users" ? "#fff" : undefined,
              }}
            >
              Users
            </button>
          </div>
        </div>
            <div className="card">
              <div className="card-title">Add New Store</div>
              <div className="card-subtitle">Create a store and assign an owner.</div>
              <form className="form-grid" onSubmit={handleCreateStore}>
                <div className="form-field">
                  <label>Name</label>
                  <input
                    value={newStore.name}
                    onChange={(e) =>
                      setNewStore((v) => ({ ...v, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newStore.email}
                    onChange={(e) =>
                      setNewStore((v) => ({ ...v, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Address</label>
                  <input
                    value={newStore.address}
                    onChange={(e) =>
                      setNewStore((v) => ({ ...v, address: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Owner</label>
                  <select
                    value={newStore.owner_id}
                    onChange={(e) =>
                      setNewStore((v) => ({ ...v, owner_id: e.target.value }))
                    }
                  >
                    <option value="">Select owner (optional)</option>
                    {users
                      .filter((u) => u.role === "STORE_OWNER")
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.email})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>&nbsp;</label>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={creatingStore}
                  >
                    {creatingStore ? "Creating..." : "Create Store"}
                  </button>
                </div>
              </form>
              {storeMessage && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    color: storeMessage.includes("successfully")
                      ? "#16a34a"
                      : "#b91c1c",
                  }}
                >
                  {storeMessage}
                </div>
              )}
            </div>

        <div className="form-grid" style={{ marginTop: "1rem" }}>
          <div className="form-field">
            <label>Filter by Name</label>
            <input
              value={filters.name}
              onChange={(e) =>
                setFilters((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="Name..."
            />
          </div>
          <div className="form-field">
            <label>Filter by Email</label>
            <input
              value={filters.email}
              onChange={(e) =>
                setFilters((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="Email..."
            />
          </div>
          <div className="form-field">
            <label>Filter by Address</label>
            <input
              value={filters.address}
              onChange={(e) =>
                setFilters((f) => ({ ...f, address: e.target.value }))
              }
              placeholder="Address..."
            />
          </div>
          {tab === "users" && (
            <div className="form-field">
              <label>Role</label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, role: e.target.value }))
                }
              >
                <option value="">All</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>
          )}
          <div className="form-field">
            <label>&nbsp;</label>
            <div className="stack-row">
              <button className="btn btn-secondary" onClick={applyFilters}>
                Apply Filters
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        {tab === "stores" ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="page-subtitle">
                    Loading stores...
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="page-subtitle">
                    No stores found.
                  </td>
                </tr>
              ) : (
                stores.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>{s.avgRating ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="page-subtitle">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="page-subtitle">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td>
                      <RoleBadge role={u.role} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div className="card-title">Add New User</div>
        <div className="card-subtitle">
          Create admin, normal users or store owners.
        </div>
        <form className="form-grid" onSubmit={handleCreateUser}>
          <div className="form-field">
            <label>Name</label>
            <input
              value={newUser.name}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Address</label>
            <input
              value={newUser.address}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, address: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, password: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Role</label>
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser((v) => ({ ...v, role: e.target.value }))
              }
            >
              <option value="USER">Normal User</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          <div className="form-field">
            <label>&nbsp;</label>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={creatingUser}
            >
              {creatingUser ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
        {userMessage && (
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: userMessage.includes("successfully")
                ? "#16a34a"
                : "#b91c1c",
            }}
          >
            {userMessage}
          </div>
        )}
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  if (role === "ADMIN") {
    return <span className="badge badge-role-admin">Admin</span>;
  }
  if (role === "STORE_OWNER") {
    return <span className="badge badge-role-owner">Store Owner</span>;
  }
  return <span className="badge badge-role-user">User</span>;
}

