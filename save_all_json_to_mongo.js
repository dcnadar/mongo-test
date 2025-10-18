import { MongoClient } from 'mongodb';
import { BSON } from 'bson';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const baseFolderName = process.env.FOLDER_NAME;
const accountId = '65e23e399013eda2edcd3f2e';
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '1000', 10);
// const APPLY_INDEXES = process.env.APPLY_INDEXES !== 'false'; // default true

// Determine the directory name in an ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    compressors: 'zstd',
    retryWrites: true,
  });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return { db: client.db(dbName), client };
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

async function* walkBsonFiles(colDir) {
  const entries = await fs.readdir(colDir, { withFileTypes: true });
  const files = [];
  
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith('.bson')) {
      files.push(path.join(colDir, e.name));
    }
  }
  
  // Sort for deterministic order
  files.sort();
  
  for (const file of files) {
    yield file;
  }
}

async function importFilesToCollection(db, collectionFolderName) {
  const folderPath = path.join(__dirname, baseFolderName, collectionFolderName);
  
  try {
    // Check if folder exists
    try {
      await fs.access(folderPath);
    } catch {
      console.log(`[${collectionFolderName}] Folder not found, skipping`);
      return;
    }

    const collection = db.collection(collectionFolderName);

    // Only process certain collections
    if (!["crm_grid", "crm_api", "crm_model", "app_menu", "account_tag"].includes(collectionFolderName)) {
      console.log(`[${collectionFolderName}] Skipping - not in allowed list`);
      return;
    }

    // Recreate indexes if present
    // if (APPLY_INDEXES) {
    //   try {
    //     const idxPath = path.join(folderPath, 'indexes.json');
    //     const raw = await fs.readFile(idxPath, 'utf8');
    //     const indexes = JSON.parse(raw).filter(i => i.name !== '_id_');
        
    //     if (indexes.length) {
    //       console.log(`[${collectionFolderName}] Ensuring ${indexes.length} indexes...`);
    //       for (const i of indexes) {
    //         try {
    //           await collection.createIndex(i.key, {
    //             name: i.name,
    //             unique: !!i.unique,
    //             sparse: !!i.sparse,
    //             expireAfterSeconds: i.expireAfterSeconds,
    //             partialFilterExpression: i.partialFilterExpression,
    //           });
    //         } catch (err) {
    //           console.log(`[${collectionFolderName}] Index ${i.name} already exists or error:`, err.message);
    //         }
    //       }
    //     }
    //   } catch (err) {
    //     console.log(`[${collectionFolderName}] No indexes.json or error:`, err.message);
    //   }
    // }

    // Delete existing documents with this accountId before upserting
    const deleteResult = await collection.deleteMany({ accountId });
    console.log(`[${collectionFolderName}] Removed ${deleteResult.deletedCount} existing documents with accountId: ${accountId}`);

    // Upsert documents in batches
    let batch = [];
    let totalProcessed = 0;

    const flush = async () => {
      if (!batch.length) return;
      
      const ops = batch.map(doc => ({
        replaceOne: {
          filter: { _id: doc._id },
          replacement: doc,
          upsert: true,
        },
      }));

      const result = await collection.bulkWrite(ops, { ordered: false });
      console.log(`[${collectionFolderName}] Upserted ${result.upsertedCount + result.modifiedCount} documents`);
      totalProcessed += batch.length;
      batch = [];
    };

    for await (const filePath of walkBsonFiles(folderPath)) {
      try {
        const buf = await fs.readFile(filePath);
        const doc = BSON.deserialize(buf);
        
        // Ensure accountId is set
        doc.accountId = accountId;
        
        batch.push(doc);
        
        if (batch.length >= BATCH_SIZE) {
          await flush();
        }
      } catch (err) {
        console.error(`[${collectionFolderName}] Error reading ${filePath}:`, err.message);
      }
    }

    // Flush remaining documents
    await flush();

    console.log(`[${collectionFolderName}] Import complete. Total processed: ${totalProcessed}`);
  } catch (err) {
    console.error(`[${collectionFolderName}] Error importing files:`, err);
    throw err;
  }
}

async function main() {
  const { db, client } = await connectToMongoDB();
  if (!db) return;

  try {
    const baseFolderPath = path.join(__dirname, baseFolderName);
    const collectionFolders = await fs.readdir(baseFolderPath, {
      withFileTypes: true,
    });

    for (const folder of collectionFolders) {
      if (folder.isDirectory()) {
        await importFilesToCollection(db, folder.name);
      }
    }

    console.log('All imports complete!');
  } catch (err) {
    console.error('Import failed:', err);
    throw err;
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main().catch(console.error);
