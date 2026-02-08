import { db } from "./server/db.js";
import { committees } from "./drizzle/schema.js";
import { like, or, eq } from "drizzle-orm";

const chemMembers = await db.select({
  id: committees.id,
  fullName: committees.fullName,
  department: committees.department
}).from(committees)
.where(
  or(
    like(committees.department, '%Chemistry%'),
    like(committees.department, '%كيمياء%'),
    like(committees.fullName, '%Hamed%Eid%')
  )
);

console.log("Chemistry Department Members:");
console.log(JSON.stringify(chemMembers, null, 2));
