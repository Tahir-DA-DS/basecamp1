const db = require('../config/database');

const ProjectUser = {
    async assign(userId, projectId) {
        const sql = `INSERT INTO ProjectUser (UserId, ProjectId) VALUES (?, ?)`;
        await db.execute(sql, [userId, projectId]);
    },
};

module.exports = ProjectUser;