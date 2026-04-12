import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Drop old table (it was a payments-based table, not the request form table)
await conn.execute('DROP TABLE IF EXISTS `certificate_requests`');
console.log('Old table dropped');

// Create new table with correct schema including workshop_name
await conn.execute(`
  CREATE TABLE \`certificate_requests\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`name_on_certificate\` varchar(255) NOT NULL,
    \`email\` varchar(255) NOT NULL,
    \`affiliation\` varchar(255) NOT NULL,
    \`certificate_type\` varchar(50) NOT NULL,
    \`presentation_title\` text,
    \`presentation_type\` varchar(50),
    \`organization_role\` text,
    \`workshop_name\` text,
    \`additional_notes\` text,
    \`status\` varchar(30) NOT NULL DEFAULT 'pending',
    \`admin_notes\` text,
    \`processed_by\` varchar(255),
    \`processed_at\` timestamp NULL,
    \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`certificate_requests_id\` PRIMARY KEY(\`id\`)
  )
`);

const [rows] = await conn.execute('DESCRIBE certificate_requests');
console.log('New table columns:', rows.map(r => r.Field).join(', '));
await conn.end();
console.log('Done!');
