# Troubleshooting Cloud SQL Connection Issues

## Problem: Can't reach database server

The connection is timing out, which means either:
1. **Firewall rules** are blocking your IP
2. **Authorized networks** are not configured
3. **Database server** is not running
4. **SSL requirements** are not met

## Solution Steps

### Step 1: Check Authorized Networks in GCP

1. Go to **Cloud SQL** in GCP Console
2. Click on your instance (`delivery-planner`)
3. Go to **Connections** tab
4. Under **Authorized networks**, check if your IP is listed

### Step 2: Add Your IP to Authorized Networks

1. In the **Connections** tab, click **Add network**
2. Get your current IP address:
   ```bash
   curl ifconfig.me
   ```
   Or visit: https://whatismyipaddress.com/
3. Add your IP address (e.g., `123.45.67.89/32`)
4. Give it a name (e.g., "My Development Machine")
5. Click **Save**

### Step 3: Verify Database is Running

1. In Cloud SQL Console, check the instance status
2. It should show **RUNNABLE** status
3. If it's stopped, click **Start**

### Step 4: Check SSL Settings

1. Go to **Overview** tab
2. Check if **Require SSL** is enabled
3. If enabled, make sure your connection string includes `?sslmode=require`

### Step 5: Alternative - Use Cloud SQL Proxy (Recommended)

Instead of connecting directly, use Cloud SQL Proxy for better security:

#### Install Cloud SQL Proxy:
```bash
# For macOS
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.darwin.amd64
chmod +x cloud-sql-proxy
```

#### Get Connection Name:
1. In Cloud SQL Console → Your Instance → Overview
2. Find **Connection name** (format: `PROJECT_ID:REGION:INSTANCE_NAME`)
3. Example: `my-project:us-central1:delivery-planner`

#### Run the Proxy:
```bash
./cloud-sql-proxy PROJECT_ID:REGION:INSTANCE_NAME
```

#### Update Connection String:
```
DATABASE_URL="postgresql://postgres:ENCODED_PASSWORD@127.0.0.1:5432/delivery-planner"
```

### Step 6: Test Connection

After adding your IP, test the connection:
```bash
npm run db:generate
npm run db:push
```

## Quick Checklist

- [ ] Database instance is **RUNNABLE** (not stopped)
- [ ] Your IP address is in **Authorized networks**
- [ ] Connection string has correct **encoded password**
- [ ] Port **5432** is correct
- [ ] SSL mode is set if required: `?sslmode=require`

## Get Your Current IP

Run this command to get your IP:
```bash
curl ifconfig.me
```

Then add it to Cloud SQL → Your Instance → Connections → Authorized networks
