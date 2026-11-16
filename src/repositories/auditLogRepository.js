// src/repositories/auditLogRepository.js
// Pencatatan audit trail aksi administrator (BR-13). HANYA SQL di sini.

const db = require('../db/connection');

class AuditLogRepository {
  logAction({ adminId, action, targetUserId = null, details = '', ipAddress = '' }) {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (admin_id, action, target_user_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(adminId, action, targetUserId, details, ipAddress);
  }

  getAll(limit = 100) {
    const stmt = db.prepare(`
      SELECT al.*, u.name as admin_name, u.email as admin_email
      FROM audit_logs al
      LEFT JOIN users u ON al.admin_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ?
    `);
    return stmt.all(limit);
  }
}

module.exports = new AuditLogRepository();
