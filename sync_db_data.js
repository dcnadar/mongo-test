import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// MongoDB Configuration
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const folderName = process.env.FOLDER_NAME;

const mongoUriDes = process.env.MONGO_URI_DES;
const dbNameDes = process.env.DB_NAME_DES;

export function save_file(collection, jsonData) {
  fs.writeFileSync(
    path.join(path.join(folderName, collection), `${jsonData._id}.json`),
    JSON.stringify(jsonData, null, 4)
  );
}

const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clientDes = new MongoClient(mongoUriDes, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const collectionName = 'crm_model';

async function run() {
  try {
    await client.connect();
    await clientDes.connect();
    const database = client.db(dbName);
    const databaseDes = clientDes.db(dbNameDes);

    //
    let crmModelFolderPath = path.join(folderName, collectionName);
    // get all json in array
    let crmModelFiles = fs.readdirSync(crmModelFolderPath);
    // loop through each file

    // for loop
    for (let i = 0; i < crmModelFiles.length; i++) {
      let file = crmModelFiles[i];
      // read file
      let crmModelFile = fs.readFileSync(path.join(crmModelFolderPath, file));
      // parse file
      let crmModelJson = JSON.parse(crmModelFile);
      // check   "modelType": "COLLECTION",
      if (crmModelJson.modelType === 'COLLECTION') {
        console.log(
          'Inserting crm model collection :',
          crmModelJson.collectionName
        );

        // get collection name
        let crmModelCollectionName = crmModelJson.collectionName;
        // get collection
        const collection = database.collection(crmModelCollectionName);
        const collectionDes = databaseDes.collection(crmModelCollectionName);
        
        // delete all documents from the collectionDes
        await collectionDes.deleteMany({});

        // get all documents from the collection
        const documents = await collection
          .find({ accountId: crmModelJson.accountId })
          .toArray();
        // save all documents to collectionDes
        documents.forEach((doc) => {
          collectionDes.insertOne(doc);
          console.log('Inserted crm model with ID : ', doc._id);
        });
        console.log(
          'Inserted all crm model collection :',
          crmModelCollectionName
        );
      }
    }
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    await clientDes.close();
  }
}

run();
