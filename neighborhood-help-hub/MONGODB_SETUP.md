# MongoDB Local Installation Guide

## Installing MongoDB on Your Laptop

### For Windows:

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI installer
   - Click "Download"

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service
   - Use the default data directory: `C:\Program Files\MongoDB\Server\data`
   - Install MongoDB Compass (GUI tool - recommended)

3. **Verify Installation**
   Open PowerShell or Command Prompt and run:
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**
   MongoDB should start automatically. If not, run:
   ```bash
   net start MongoDB
   ```

5. **Connect to MongoDB**
   The default connection string is:
   ```
   mongodb://localhost:27017
   ```

### For macOS:

1. **Install using Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB Service**
   ```bash
   brew services start mongodb-community
   ```

### For Linux (Ubuntu/Debian):

1. **Install MongoDB**
   ```bash
   sudo apt-get install -y mongodb
   ```

2. **Start MongoDB Service**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## Database Configuration

The application will automatically create a database named `neighborhood-help-hub` when you first start the server.

### Connection String
```
mongodb://localhost:27017/neighborhood-help-hub
```

### Verify MongoDB is Running

1. Open MongoDB Compass (GUI)
2. Connect to: `mongodb://localhost:27017`
3. You should see your databases

Or use the command line:
```bash
mongo
# or
mongosh
```

Then in the mongo shell:
```javascript
show dbs
use neighborhood-help-hub
show collections
```

## Environment Variables

Update the `.env` file in the `server` folder:

```env
# MongoDB Local Connection
MONGODB_URI=mongodb://localhost:27017/neighborhood-help-hub

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=neighborhood-help-hub-secret-key-2024
JWT_REFRESH_SECRET=neighborhood-help-hub-refresh-secret-key-2024
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

## Starting the Application

### 1. Start MongoDB (if not running as a service)
```bash
mongod
```

### 2. Start the Backend Server
```bash
cd server
npm install
npm run dev
```

### 3. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```

## Troubleshooting

### MongoDB Won't Start

**Windows:**
```bash
net start MongoDB
```

If this fails, check the MongoDB logs:
```
C:\Program Files\MongoDB\Server\data\log\mongod.log
```

**Linux/macOS:**
```bash
sudo systemctl status mongod
sudo journalctl -u mongod -f
```

### Connection Refused Error

1. Verify MongoDB is running
2. Check if port 27017 is not blocked by firewall
3. Ensure the connection string is correct

### Database Not Created

The database is created automatically when you first use the application. If it doesn't appear:
1. Verify MongoDB is running
2. Check server logs for errors
3. Ensure the connection string is correct

## MongoDB GUI Tools

### MongoDB Compass (Recommended)
- Download: https://www.mongodb.com/products/compass
- Features: View data, run queries, manage indexes

### Studio 3T (Alternative)
- Download: https://studio3t.com/
- Features: Advanced query builder, data import/export

## Next Steps

Once MongoDB is installed and running:

1. ✅ MongoDB installed
2. ✅ Server running (`npm run dev` in server folder)
3. ✅ Client running (`npm run dev` in client folder)
4. ✅ Application ready to use!

The application will automatically create all necessary collections:
- `users` - User profiles
- `posts` - Help requests/offers
- `messages` - Chat messages
- `notifications` - User notifications
- `ratings` - User ratings

## Backup and Restore

### Backup Database
```bash
mongodump --db=neighborhood-help-hub --out=/path/to/backup
```

### Restore Database
```bash
mongorestore --db=neighborhood-help-hub /path/to/backup/neighborhood-help-hub
```

## Security Notes

- MongoDB by default has no authentication on localhost
- For production, enable authentication
- Never expose MongoDB to the internet without proper security
- Use strong passwords for production databases
















