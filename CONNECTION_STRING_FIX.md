# Fixing Invalid Port Number Error

## Problem
The error "invalid port number in database URL" usually means:
1. **Special characters in password** need URL encoding
2. **Missing or incorrect port** in connection string
3. **Malformed connection string** format

## Solution

### Step 1: URL Encode Your Password

If your password contains special characters like `@`, `:`, `/`, `?`, `#`, `[`, `]`, `%`, `&`, `=`, they MUST be URL-encoded.

**Common special characters and their encoding:**
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`
- `%` → `%25`
- `&` → `%26`
- `=` → `%3D`

### Step 2: Use the Helper Script

Run the helper script to automatically encode your password:

```bash
node fix-connection-string.js
```

### Step 3: Manual Encoding (Alternative)

If you prefer to do it manually, use JavaScript's `encodeURIComponent()`:

```javascript
// In Node.js or browser console:
encodeURIComponent('your-password-with-special-chars')
```

### Step 4: Correct Connection String Format

**Template:**
```
postgresql://USERNAME:ENCODED_PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

**Your specific format:**
```
postgresql://postgres:ENCODED_PASSWORD@35.241.222.164:5432/delivery-planner?sslmode=require
```

### Example

If your password is `my@pass:word#123`:

1. **Encode it:** `my%40pass%3Aword%23123`
2. **Connection string:**
   ```
   DATABASE_URL="postgresql://postgres:my%40pass%3Aword%23123@35.241.222.164:5432/delivery-planner?sslmode=require"
   ```

### Quick Test

You can test URL encoding online at:
- https://www.urlencoder.org/
- Or use Node.js: `node -e "console.log(encodeURIComponent('your-password'))"`

## Common Issues

1. **Password with @ symbol**: Must be encoded as `%40`
2. **Password with colon**: Must be encoded as `%3A`
3. **Missing port**: Always include `:5432` after the IP
4. **Database name with hyphen**: Should work fine (delivery-planner is OK)

## Final .env File

Your `.env` file should contain:
```
DATABASE_URL="postgresql://postgres:YOUR_URL_ENCODED_PASSWORD@35.241.222.164:5432/delivery-planner?sslmode=require"
```

Replace `YOUR_URL_ENCODED_PASSWORD` with your properly encoded password.
