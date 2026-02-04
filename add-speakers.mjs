import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import 'dotenv/config';

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
});

const db = drizzle(connection, { schema, mode: 'default' });

// Add Prof. Dr. Khalid Taalab
const speaker1 = await db.insert(schema.keynoteSpeakers).values({
  name: 'Prof. Dr. Khalid Muhammad Taalab',
  title: 'Nuclear Medicine Professor at Military Medical Academy',
  affiliation: 'Military Medical Academy, Egypt Centre of Research and Regenerative Medicine (ECRRM)',
  presentationTitle: 'Radiopharmaceuticals and Precision Medicine',
  bio: 'Prof. Dr. Khalid Taalab is a Nuclear Medicine Professor at the Military Medical Academy and Nuclear Medicine Consultant at Saudi German Hospital-Egypt. He holds an M.D. in Nuclear Medicine from Cairo University (1997) and completed fellowships at London University (1995), BWZKH Koblenz Germany (2000), and St Louis University Hospital USA (2006). He serves as Deputy President of the Military Medical Academy (since 2022), ESNMS General Secretariat (since 2023), and is affiliated with the Egypt Centre of Research and Regenerative Medicine (ECRRM) since August 2023. He is also an ESNMS Council and Journal Editing Board Member and co-editor of "A Concise Guide to Nuclear Medicine, 3rd Edition" (2026).',
  photoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/118031311/CJOlJspBxtzmzqxr.png',
  displayOrder: 3
});

console.log('Added Prof. Dr. Khalid Taalab');

// Add Prof. Dr. Osama Azmy
const speaker2 = await db.insert(schema.keynoteSpeakers).values({
  name: 'Prof. Dr. Osama Azmy',
  title: 'Consultant to President of National Research Centre',
  affiliation: 'National Research Centre, Egypt Centre of Research and Regenerative Medicine (ECRRM)',
  presentationTitle: 'Management of the Rosy Years of Life',
  bio: 'Prof. Dr. Osama Azmy graduated from Cairo University in 1986 and joined the National Research Centre in 1989. He obtained his Master\'s Degree in Obstetrics and Gynecology from Cairo University (1993), RCOG membership (1996), and MD from Cairo University (2000). He was upgraded to RCOG Fellowship in 2008. Currently, he serves as Consultant to the President of National Research Center for medical clinical trials (since 2010), Consultant to the Head of Medical Research Center and Regenerative Medicine in stem cells (since 2019), Head of Medical Ethics Research Committee (since 2020), and Member of Egypt Center of Research and Regenerative Medicine ethics committee (since 2020). He is the founder and head of the Regenerative Medicine Unit at NRC (since 2009) and former Dean of Institute of Medical Research and Clinical Studies at NRC (2016-2019). His expertise includes reproductive medicine, assisted reproductive techniques, stem cell research, and regenerative medicine.',
  photoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/118031311/tJBhqIPoNtnFzgeF.png',
  displayOrder: 4
});

console.log('Added Prof. Dr. Osama Azmy');

await connection.end();
console.log('Done!');
