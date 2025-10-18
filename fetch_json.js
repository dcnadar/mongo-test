import { MongoClient } from 'mongodb';
import { BSON, EJSON } from 'bson';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

// MongoDB Configuration
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const folderName = process.env.FOLDER_NAME;

// Helper to create safe filenames from _id
function idToFileBase(_id) {
  if (_id && typeof _id === 'object' && typeof _id.toHexString === 'function') {
    return _id.toHexString(); // ObjectId
  }
  if (typeof _id === 'string') {
    return _id.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
  }
  // Fallback: hash the BSON of _id for stable filename
  const buf = BSON.serialize({ _id });
  return Buffer.from(buf.subarray(0, 16)).toString('hex');
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

const fetchJson = async (database, accountId, collectionName, session) => {
  const directoryPath = path.join(folderName, collectionName);

  try {
    const collection = database.collection(collectionName);

    // Delete previous directory
    try {
      await fs.rm(directoryPath, { recursive: true, force: true });
    } catch (err) {
      // Directory might not exist
    }

    // Ensure the directory exists
    await ensureDir(directoryPath);

    // Save indexes (optional but handy)
    // try {
    //   const indexes = await collection.listIndexes({ session }).toArray();
    //   await fs.writeFile(
    //     path.join(directoryPath, 'indexes.json'),
    //     JSON.stringify(indexes, null, 2)
    //   );
    //   console.log(`[${collectionName}] Saved indexes`);
    // } catch (err) {
    //   console.log(`[${collectionName}] Could not save indexes:`, err.message);
    // }

    // Fetch all documents with accountId filter
    const filter = { accountId };
    const cursor = collection.find(filter, { session, batchSize: 1000 });

    let n = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const base = idToFileBase(doc._id);
      
      // Save as BSON for efficient import/export
      const bsonPath = path.join(directoryPath, `${base}.bson`);
      const bsonBuf = BSON.serialize(doc);
      await fs.writeFile(bsonPath, bsonBuf);
      
      // Save as readable JSON using EJSON (preserves types in readable format)
      const jsonPath = path.join(directoryPath, `${base}.json`);
      const ejsonString = EJSON.stringify(doc, null, 2, { relaxed: false });
      await fs.writeFile(jsonPath, ejsonString);
      
      n++;
      if (n % 500 === 0) {
        console.log(`[${collectionName}] ${n} documents exported...`);
      }
    }

    console.log(`[${collectionName}] Export complete. ${n} documents saved to '${directoryPath}'`);
  } catch (error) {
    console.error(`[${collectionName}] An error occurred:`, error);
    throw error;
  }
};

//trufal
// let accountId = '5d6590b3af790ca2bcc707b7';

// starcome
let accountId = "65e23e399013eda2edcd3f2e";

// poultry
// let accountId = "66629d6de2144644664d9bb4";

// zapu
// let accountId = "67d9625c6d85b3208a75ea5c";

// glamy
// let accountId = "682af97b6096fa4975cd6082";

// eduempower
// let accountId = "66066cd92ecf59ad3517dcdb";

// eduempower_admin
// let accountId = "67371ac55e032502464b63a0";

// jobdrive
// let accountId = "6703b44b30083226ac6affc0";

// meta collections
async function main() {
  const client = new MongoClient(mongoUri, { compressors: 'zstd' });
  await client.connect();
  const database = client.db(dbName);
  
  // Use snapshot for point-in-time consistency across all collections
  const session = client.startSession();
  session.startTransaction({ readConcern: { level: 'snapshot' } });

  try {
    console.log('Starting export with point-in-time snapshot...');
    
    await fetchJson(database, accountId, 'account_tag', session);
    await fetchJson(database, accountId, 'app_menu', session);
    await fetchJson(database, accountId, 'crm_model', session);
    await fetchJson(database, accountId, 'crm_grid', session);
    await fetchJson(database, accountId, 'crm_api', session);

    await session.commitTransaction();
    console.log('Export complete!');
  } catch (err) {
    await session.abortTransaction();
    console.error('Export failed:', err);
    throw err;
  } finally {
    await session.endSession();
    await client.close();
  }
}

// Radyfy entity collections
// async function main() {
//   const client = new MongoClient(mongoUri, { compressors: 'zstd' });
//   await client.connect();
//   const database = client.db(dbName);
//   const session = client.startSession();
//   session.startTransaction({ readConcern: { level: 'snapshot' } });
//   try {
//     await fetchJson(database, accountId, 'user', session);
//     await session.commitTransaction();
//   } catch (err) {
//     await session.abortTransaction();
//     throw err;
//   } finally {
//     await session.endSession();
//     await client.close();
//   }
// }

// let eduempowerCollections = ['account_settings', 'Account_temp', 'eduempower_academic_info', 'eduempower_academic_session', 'ecom_account', 'eduempower_alerts', 'eduempower_apply_leave', 'eduempower_attendance_mark', 'eduempower_book', 'eduempower_book_author', 'eduempower_book_publisher', 'eduempower_branch', 'eduempower_circulars', 'eduempower_class', 'eduempower_class_incharge', 'eduempower_class_subject', 'eduempower_class_type', 'eduempower_country', 'eduempower_department', 'eduempower_designation', 'eduempower_documents', 'eduempower_entity', 'eduempower_examination_board', 'eduempower_fee_challan', 'eduempower_fee_mark', 'eduempower_fee_category', 'eduempower_fee_concession', 'eduempower_fee_fine', 'eduempower_fee_fine_setting', 'eduempower_fee_schedule', 'eduempower_fee_structure', 'eduempower_fee_type', 'eduempower_inventory', 'eduempower_inventory_book', 'eduempower_issued_books', 'eduempower_leave', 'eduempower_leave_transaction_history', 'eduempower_leave_plan', 'eduempower_leave_type', 'eduempower_library', 'eduempower_library_membership', 'eduempower_library_shelves', 'eduempower_news', 'eduempower_previous_school', 'eduempower_school_asset', 'eduempower_school_building', 'eduempower_school_floor', 'eduempower_school_room', 'eduempower_school_room_type', 'eduempower_school_subject', 'eduempower_section', 'eduempower_state', 'eduempower_teacher_mapping', 'user', 'eduempower_user_history', 'eduempower_vendor', 'eduempower_visit', 'eduempower_visit_old', 'eduempower_work_experience', 'history2', 'import_table_data', 'eduempower_transaction', 'visit_history', 'role']
// async function main(){
//   const client = new MongoClient(mongoUri, { compressors: 'zstd' });
//   await client.connect();
//   const database = client.db(dbName);
//   const session = client.startSession();
//   session.startTransaction({ readConcern: { level: 'snapshot' } });
//   try {
//     for (let collection of eduempowerCollections) {
//       await fetchJson(database, accountId, collection, session);
//     }
//     await session.commitTransaction();
//   } catch (err) {
//     await session.abortTransaction();
//     throw err;
//   } finally {
//     await session.endSession();
//     await client.close();
//   }
// }

main();
