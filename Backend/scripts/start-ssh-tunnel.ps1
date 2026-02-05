param(
  [string]$VpsUser = "user",
  [string]$VpsHost = "your-vps.example.com",
  [string]$RemoteDbHost = "db.host",
  [int]$LocalPort = 5432,
  [int]$RemotePort = 5432
)

Write-Host "Starting SSH tunnel: localhost:$LocalPort -> $RemoteDbHost:$RemotePort via $VpsUser@$VpsHost"

# Requires OpenSSH client available in PATH (Windows 10+ includes it).
# Keeps the tunnel open in the foreground until you cancel (Ctrl+C).
ssh -L ${LocalPort}:${RemoteDbHost}:${RemotePort} ${VpsUser}@${VpsHost}
