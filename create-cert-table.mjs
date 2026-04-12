import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';

// Read DATABASE_URL from the running process environment
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const conn = await createConnection(dbUrl);

// Check if table exists
const [rows] = await conn.query('SHOW TABLES LIKE "certificate_requests"');
if (rows.length > 0) {
  console.log('Table certificate_requests already exists.');
  await conn.end();
  process.exit(0);
}

// Create the table
await conn.query(`
  CREATE TABLE \`certificate_requests\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`name_on_certificate\` varchar(255) NOT NULL,
    \`email\` varchar(255) NOT NULL,
    \`affiliation\` varchar(255) NOT NULL,
    \`certificate_type\` varchar(50) NOT NULL,
    \`presentation_title\` text,
    \`presentation_type\` varchar(50),
    \`organization_role\` text,
    \`additional_notes\` text,
    \`status\` varchar(30) NOT NULL DEFAULT 'pending',
    \`admin_notes\` text,
    \`processed_by\` varchar(255),
    \`processed_at\` timestamp,
    \`created_at\` timestamp NOT NULL DEFAULT (now()),
    \`updated_at\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`certificate_requests_id\` PRIMARY KEY(\`id\`)
  );
`);

console.log('Table certificate_requests created successfully.');
await conn.end();
