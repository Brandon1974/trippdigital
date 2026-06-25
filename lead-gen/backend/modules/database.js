const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, '../data/prospects.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('Database connection error:', err);
      else console.log('Connected to SQLite database');
    });
  }

  init() {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS prospects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT,
          website TEXT,
          address TEXT,
          emails TEXT,
          source TEXT,
          rating TEXT,
          contacted BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('Database tables initialized');
    });
  }

  addBusiness(business) {
    const { id, name, phone, website, address, source, rating } = business;

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO prospects (id, name, phone, website, address, source, rating)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, name, phone, website, address, source, rating],
        function(err) {
          if (err) {
            console.error('Insert error:', err);
            reject(err);
          } else {
            resolve({ id, name });
          }
        }
      );
    });
  }

  updateBusinessEmails(prospectId, emails) {
    const emailsJson = JSON.stringify(emails);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE prospects SET emails = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [emailsJson, prospectId],
        function(err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  getAllProspects() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT id, name, phone, website, address, emails, source, rating, contacted, created_at FROM prospects ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const prospects = rows.map(row => ({
              ...row,
              emails: row.emails ? JSON.parse(row.emails) : []
            }));
            resolve(prospects);
          }
        }
      );
    });
  }

  getProspect(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM prospects WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            if (row) {
              row.emails = row.emails ? JSON.parse(row.emails) : [];
            }
            resolve(row);
          }
        }
      );
    });
  }

  markAsContacted(prospectId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE prospects SET contacted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [prospectId],
        function(err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  deleteProspect(prospectId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM prospects WHERE id = ?`,
        [prospectId],
        function(err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  clearAllProspects() {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM prospects`,
        function(err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  getStats() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT
          COUNT(*) as total,
          SUM(CASE WHEN emails IS NOT NULL AND emails != '[]' THEN 1 ELSE 0 END) as with_emails,
          SUM(CASE WHEN contacted = 1 THEN 1 ELSE 0 END) as contacted
         FROM prospects`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const stats = rows[0] || { total: 0, with_emails: 0, contacted: 0 };
            resolve({
              total_prospects: stats.total,
              prospects_with_emails: stats.with_emails,
              prospects_contacted: stats.contacted
            });
          }
        }
      );
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
