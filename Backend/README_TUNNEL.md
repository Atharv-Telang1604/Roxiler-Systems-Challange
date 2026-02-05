SSH tunnel for local development
===============================

When your external Wi‑Fi blocks outbound Postgres (TCP/5432), create an SSH tunnel via a VPS you control. The tunnel forwards a local port (e.g. `localhost:5432`) to your database host:5432 so your app can connect as if the DB were local.

Prerequisites
- A VPS or remote machine with SSH access (`user@your-vps.example.com`).
- OpenSSH client on your local machine (Windows 10+ includes it) or PuTTY installed.

Quick PowerShell command
------------------------
Run (replace placeholders):

```powershell
ssh -L 5432:<DB_HOST>:5432 user@your-vps.example.com
```

Keep that terminal open. In `Backend/.env` set:

```
DB_HOST=localhost
DB_PORT=5432
```

Then start your backend as usual.

Using the provided helper script (Windows PowerShell)
--------------------------------------------------
Edit `Backend/scripts/start-ssh-tunnel.ps1` parameters or run:

```powershell
.
\Backend\scripts\start-ssh-tunnel.ps1 -VpsUser myuser -VpsHost my-vps.example.com -RemoteDbHost db.supabase.co
```

Using PuTTY (GUI)
------------------
1. In PuTTY, open your session to the VPS (`my-vps.example.com`).
2. In the left tree, go to Connection → SSH → Tunnels.
3. Source port: `5432`  Destination: `<DB_HOST>:5432`  Select "Local" and click Add.
4. Open the session and keep it running.
5. Set `DB_HOST=localhost` in `Backend/.env` and start the app.

Notes
- The tunnel routes traffic through your VPS — data and credentials pass through it. Use only trusted servers.
- This is a short-term workaround. For a permanent fix, consider using Supabase HTTP APIs (`@supabase/supabase-js`) or deploying the backend to a cloud host.
