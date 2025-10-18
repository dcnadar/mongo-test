import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Define the collections and the fields you want to index
const collectionsToIndex = [
  {
    collectionName: 'crm_api',
    fields: {
      accountId: 1,
      ecomAccountId: 1,
      path: 1,
      apiType: 1,
    },
    options: {
      v: 2,
      name: 'unique_accountId_ecomAccountId_path_apiType',
      unique: true,
    },
  },

  {
    collectionName: 'crm_grid',
    fields: {
      accountId: 1,
      gridType: 1,
      gridTitle: 1,
    },
    options: {
      v: 2,
      name: 'unique_accountId_gridType_gridTitle',
      unique: true,
    },
  },

  {
    collectionName: 'crm_model',
    fields: {
      accountId: 1,
      collectionName: 1,
    },
    options: {
      v: 2,
      name: 'unique_accountId_collectionName',
      unique: true,
      partialFilterExpression: {
        accountId: {
          $exists: true,
        },
        collectionName: {
          $exists: true,
        },
      },
    },
  },

  {
    collectionName: 'website_page_section_info',
    fields: {
      accountId: 1,
      reactGrid: 1,
    },
    options: {
      v: 2,
      name: 'unique_accountId_reactGrid',
      unique: true,
    },
  },
];

async function createIndexForCollection(
  client,
  collectionName,
  fields,
  options
) {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  try {
    await collection.createIndex(fields, options);
    console.log(
      `Index created for ${collectionName} on fields: ${JSON.stringify(fields)}`
    );
  } catch (error) {
    console.error(`Failed to create index for ${collectionName}:`, error);
  }
}

async function main() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    for (const { collectionName, fields, options } of collectionsToIndex) {
      await createIndexForCollection(client, collectionName, fields, options);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main().catch(console.error);
