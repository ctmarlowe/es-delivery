# Cloud SQL Connection String

## Your Connection Details:
- **Public IP**: 35.241.222.164
- **Username**: postgres
- **Database**: delivery-planner
- **Port**: 5432 (default PostgreSQL port)

## Connection String Format:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@35.241.222.164:5432/delivery-planner?sslmode=require"
```

## Next Steps:
1. Get your password from GCP Console:
   - Go to Cloud SQL → Your Instance → Users tab
   - If you don't remember it, click on the `postgres` user and reset the password
   - Copy the password immediately (it won't be shown again)

2. Replace `YOUR_PASSWORD` in the connection string above with your actual password

3. Add to your `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@35.241.222.164:5432/delivery-planner?sslmode=require"
   ```

## Example (with placeholder password):
```
DATABASE_URL="postgresql://postgres:changeme123@35.241.222.164:5432/delivery-planner?sslmode=require"
```
