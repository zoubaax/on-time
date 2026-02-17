# Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Production Checklist](#production-checklist)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

- ✅ Node.js 18+ installed on server
- ✅ Supabase project configured
- ✅ Domain name (optional but recommended)
- ✅ SSL certificate (Let's Encrypt recommended)
- ✅ Git repository

---

## Environment Setup

### 1. Production Environment Variables

Create a `.env.production` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# JWT Configuration (IMPORTANT: Use strong secrets in production)
JWT_SECRET=your_super_secure_production_secret_minimum_64_characters_long_random_string
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CLIENT_URL=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
```

### 2. Generate Secure JWT Secret

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Deployment Options

### Option 1: Heroku

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

#### Step 2: Create Heroku App
```bash
heroku create your-app-name
```

#### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
heroku config:set JWT_SECRET=your_secret
heroku config:set CLIENT_URL=https://yourdomain.com
heroku config:set GOOGLE_CLIENT_ID=your_id
heroku config:set GOOGLE_CLIENT_SECRET=your_secret
```

#### Step 4: Deploy
```bash
git push heroku main
```

#### Step 5: Verify
```bash
heroku logs --tail
heroku open
```

---

### Option 2: Railway

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

#### Step 2: Initialize Project
```bash
railway init
```

#### Step 3: Add Environment Variables
- Go to Railway dashboard
- Select your project
- Add all environment variables from `.env.production`

#### Step 4: Deploy
```bash
railway up
```

---

### Option 3: DigitalOcean App Platform

#### Step 1: Connect GitHub Repository
1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect your GitHub repository

#### Step 2: Configure Build Settings
- Build Command: `npm install`
- Run Command: `npm start`

#### Step 3: Add Environment Variables
Add all variables from `.env.production` in the App Platform dashboard

#### Step 4: Deploy
Click "Deploy" - automatic deployments on git push

---

### Option 4: AWS EC2 (Traditional VPS)

#### Step 1: Launch EC2 Instance
- Ubuntu 22.04 LTS
- t2.micro (or larger)
- Configure security groups (ports 22, 80, 443, 5000)

#### Step 2: Connect to Server
```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

#### Step 3: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

#### Step 4: Clone Repository
```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo/backend
npm install --production
```

#### Step 5: Configure Environment
```bash
nano .env
# Paste your production environment variables
```

#### Step 6: Start with PM2
```bash
pm2 start src/server.js --name "auth-api"
pm2 save
pm2 startup
```

#### Step 7: Setup Nginx Reverse Proxy
```bash
sudo apt-get install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/api
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 8: Setup SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

### Option 5: Vercel (Serverless)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Create `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Step 3: Deploy
```bash
vercel --prod
```

#### Step 4: Add Environment Variables
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
# ... add all other variables
```

---

## Production Checklist

### Security
- [ ] Use HTTPS only
- [ ] Set strong JWT_SECRET (64+ characters)
- [ ] Keep SUPABASE_SERVICE_ROLE_KEY secret
- [ ] Enable rate limiting (already configured)
- [ ] Set proper CORS origins
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable Helmet security headers (already configured)
- [ ] Implement request logging
- [ ] Set up firewall rules

### Database
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Create database backups
- [ ] Set up connection pooling
- [ ] Monitor database performance
- [ ] Create indexes for frequently queried fields

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up log aggregation (Loggly, Papertrail)
- [ ] Monitor API performance
- [ ] Set up alerts for errors

### Performance
- [ ] Enable gzip compression
- [ ] Implement caching where appropriate
- [ ] Use CDN for static assets
- [ ] Optimize database queries
- [ ] Set up load balancing (if needed)

### Documentation
- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create runbooks for common issues
- [ ] Document environment variables

---

## Nginx Configuration (Production)

### Full Nginx Config with SSL

```nginx
# /etc/nginx/sites-available/api

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint (no rate limiting)
    location /api/health {
        proxy_pass http://localhost:5000;
        access_log off;
    }
}
```

---

## PM2 Configuration

### ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'auth-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
};
```

Usage:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Monitoring & Maintenance

### 1. Health Checks

Set up automated health checks:
```bash
# Cron job to check API health
*/5 * * * * curl -f https://api.yourdomain.com/api/health || echo "API is down!"
```

### 2. Log Rotation

```bash
# Install logrotate
sudo apt-get install logrotate

# Create logrotate config
sudo nano /etc/logrotate.d/auth-api
```

Add:
```
/path/to/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. Database Backups

Set up automated Supabase backups:
- Go to Supabase Dashboard → Database → Backups
- Enable automatic backups
- Set retention period

### 4. Update Strategy

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install --production

# Run database migrations (if any)
# npm run migrate

# Restart with zero downtime
pm2 reload auth-api
```

---

## Troubleshooting

### Issue: API not responding
```bash
# Check if process is running
pm2 status

# Check logs
pm2 logs auth-api

# Restart
pm2 restart auth-api
```

### Issue: Database connection errors
```bash
# Check environment variables
pm2 env 0

# Test Supabase connection
node -e "require('./src/config/database').testConnection()"
```

### Issue: High memory usage
```bash
# Check memory
pm2 monit

# Restart if needed
pm2 restart auth-api
```

---

## Rollback Strategy

### Quick Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or checkout previous version
git checkout <previous-commit-hash>
pm2 restart auth-api
```

---

## Performance Optimization

### 1. Enable Clustering
Already configured in PM2 config (`instances: 'max'`)

### 2. Database Connection Pooling
Supabase handles this automatically

### 3. Caching
Consider implementing Redis for:
- Session storage
- Rate limiting
- API response caching

---

## Security Best Practices

1. **Never commit `.env` files**
2. **Rotate secrets regularly**
3. **Keep dependencies updated**: `npm audit fix`
4. **Monitor for vulnerabilities**: `npm audit`
5. **Use HTTPS everywhere**
6. **Implement proper CORS**
7. **Enable rate limiting**
8. **Log security events**
9. **Regular security audits**
10. **Keep Node.js updated**

---

## Cost Optimization

### Free Tier Options
- **Supabase**: 500MB database, 2GB bandwidth
- **Heroku**: 550 dyno hours/month
- **Railway**: $5 credit/month
- **Vercel**: Unlimited deployments

### Paid Recommendations
- **DigitalOcean**: $6/month droplet
- **AWS EC2**: t3.micro ~$8/month
- **Heroku Hobby**: $7/month

---

## Support & Resources

- [Supabase Docs](https://supabase.com/docs)
- [Express.js Docs](https://expressjs.com)
- [PM2 Docs](https://pm2.keymetrics.io)
- [Nginx Docs](https://nginx.org/en/docs)

---

**Deployment Complete!** 🚀

Your API should now be running in production with:
- ✅ HTTPS enabled
- ✅ Auto-restart on crashes
- ✅ Log rotation
- ✅ Security headers
- ✅ Rate limiting
- ✅ Monitoring
