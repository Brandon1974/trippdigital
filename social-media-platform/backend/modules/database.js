const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, '../data/social-media.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('Database connection error:', err);
      else console.log('Connected to Social Media Platform database');
    });
  }

  init() {
    this.db.serialize(() => {
      // Clients table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS clients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          industry TEXT,
          monthly_budget REAL,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Social accounts table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS social_accounts (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL,
          platform TEXT NOT NULL,
          account_name TEXT NOT NULL,
          account_id TEXT,
          access_token TEXT,
          connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )
      `);

      // Posts table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL,
          content TEXT NOT NULL,
          platforms TEXT NOT NULL,
          scheduled_time DATETIME,
          status TEXT DEFAULT 'scheduled',
          performance TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          published_at DATETIME,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )
      `);

      console.log('Database tables initialized');
    });
  }

  // ========== CLIENTS ==========
  addClient(data) {
    const id = uuidv4();
    const { name, email, phone, industry, monthlyBudget } = data;

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO clients (id, name, email, phone, industry, monthly_budget)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, name, email, phone, industry, monthlyBudget],
        function(err) {
          if (err) reject(err);
          else resolve({ id, name, email, phone, industry, monthlyBudget });
        }
      );
    });
  }

  getClient(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getAllClients() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM clients ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  updateClient(id, data) {
    const updates = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (key !== 'id') {
        updates.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (updates.length === 0) return Promise.resolve(null);

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE clients SET ${updates.join(', ')} WHERE id = ?`,
        values,
        (err) => {
          if (err) reject(err);
          else this.getClient(id).then(resolve).catch(reject);
        }
      );
    });
  }

  deleteClient(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM clients WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  // ========== SOCIAL ACCOUNTS ==========
  addSocialAccount(clientId, data) {
    const id = uuidv4();
    const { platform, accountName, accessToken, accountId } = data;

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO social_accounts (id, client_id, platform, account_name, account_id, access_token)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, clientId, platform, accountName, accountId, accessToken],
        function(err) {
          if (err) reject(err);
          else resolve({ id, clientId, platform, accountName });
        }
      );
    });
  }

  getClientAccounts(clientId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, client_id, platform, account_name FROM social_accounts WHERE client_id = ?',
        [clientId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  deleteSocialAccount(accountId) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM social_accounts WHERE id = ?', [accountId], function(err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  // ========== POSTS ==========
  createPost(data) {
    const id = uuidv4();
    const { clientId, content, platforms, scheduledTime, status } = data;

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO posts (id, client_id, content, platforms, scheduled_time, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, clientId, content, platforms, scheduledTime, status],
        function(err) {
          if (err) reject(err);
          else resolve({
            id,
            clientId,
            content,
            platforms: JSON.parse(platforms),
            scheduledTime,
            status
          });
        }
      );
    });
  }

  getPost(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getClientPosts(clientId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM posts WHERE client_id = ? ORDER BY scheduled_time DESC',
        [clientId],
        (err, rows) => {
          if (err) reject(err);
          else {
            const posts = (rows || []).map(p => ({
              ...p,
              platforms: JSON.parse(p.platforms)
            }));
            resolve(posts);
          }
        }
      );
    });
  }

  getAllPosts(status = null) {
    return new Promise((resolve, reject) => {
      const query = status
        ? 'SELECT * FROM posts WHERE status = ? ORDER BY scheduled_time DESC'
        : 'SELECT * FROM posts ORDER BY scheduled_time DESC';

      const params = status ? [status] : [];

      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else {
          const posts = (rows || []).map(p => ({
            ...p,
            platforms: JSON.parse(p.platforms)
          }));
          resolve(posts);
        }
      });
    });
  }

  updatePost(id, data) {
    const updates = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (key !== 'id') {
        if (key === 'platforms') {
          updates.push('platforms = ?');
          values.push(JSON.stringify(data[key]));
        } else {
          updates.push(`${key} = ?`);
          values.push(data[key]);
        }
      }
    });

    if (updates.length === 0) return Promise.resolve(null);

    values.push(id);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE posts SET ${updates.join(', ')} WHERE id = ?`,
        values,
        (err) => {
          if (err) reject(err);
          else this.getPost(id).then(resolve).catch(reject);
        }
      );
    });
  }

  deletePost(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  // ========== STATS ==========
  getStats() {
    return new Promise((resolve, reject) => {
      Promise.all([
        new Promise((res, rej) => {
          this.db.get('SELECT COUNT(*) as count FROM clients', (err, row) => {
            if (err) rej(err);
            else res(row.count);
          });
        }),
        new Promise((res, rej) => {
          this.db.get('SELECT COUNT(*) as count FROM posts WHERE status = "published"', (err, row) => {
            if (err) rej(err);
            else res(row.count);
          });
        }),
        new Promise((res, rej) => {
          this.db.get('SELECT COUNT(*) as count FROM posts WHERE status = "scheduled"', (err, row) => {
            if (err) rej(err);
            else res(row.count);
          });
        })
      ]).then(([totalClients, publishedPosts, scheduledPosts]) => {
        resolve({
          total_clients: totalClients,
          total_posts_published: publishedPosts,
          total_posts_scheduled: scheduledPosts
        });
      }).catch(reject);
    });
  }

  getClientStats(clientId) {
    return new Promise((resolve, reject) => {
      Promise.all([
        new Promise((res, rej) => {
          this.db.get('SELECT COUNT(*) as count FROM posts WHERE client_id = ?', [clientId], (err, row) => {
            if (err) rej(err);
            else res(row.count);
          });
        }),
        new Promise((res, rej) => {
          this.db.get('SELECT COUNT(*) as count FROM posts WHERE client_id = ? AND status = "published"', [clientId], (err, row) => {
            if (err) rej(err);
            else res(row.count);
          });
        }),
        new Promise((res, rej) => {
          this.db.get('SELECT COUNT(*) as count FROM social_accounts WHERE client_id = ?', [clientId], (err, row) => {
            if (err) rej(err);
            else res(row.count);
          });
        })
      ]).then(([totalPosts, publishedPosts, connectedAccounts]) => {
        resolve({
          total_posts: totalPosts,
          published_posts: publishedPosts,
          connected_accounts: connectedAccounts
        });
      }).catch(reject);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = Database;
