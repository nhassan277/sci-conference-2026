import { db } from './server/db.js';
import { committees } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

const result = await db.select().from(committees).where(eq(committees.committeeType, 'scientific'));
const grouped = result.reduce((acc, member) => {
  const dept = member.department || 'General';
  if (!acc[dept]) acc[dept] = [];
  acc[dept].push(member.fullName);
  return acc;
}, {});

console.log('Scientific Committee Grouped by Department:');
console.log(JSON.stringify(grouped, null, 2));
