import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const dbName = process.env.DB_NAME;
const folderName = process.env.FOLDER_NAME;

// MongoDB Configuration
const mongoUri = process.env.MONGO_URI;

const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export function save_file(collection, jsonData) {
  fs.writeFileSync(
    path.join(path.join(folderName, collection), `${jsonData._id}.json`),
    JSON.stringify(jsonData, null, 4)
  );
}

const modelCollectionName = 'crm_model';
const formCollectionName = 'crm_grid';

async function run() {
  try {
    await client.connect();
    const database = client.db(dbName);
    const modelCollection = database.collection(modelCollectionName);
    const formCollection = database.collection(formCollectionName);

    const modelData = {
      "properties": [
        {
          "dataType": "LIST_OF",
          "key": "images",
          "name": "Images",
          "listType": "STRING"
        }
      ],
      "accountId": "5d6590b3af790ca2bcc707b7",
      "name": "ReactGrid GlobalGallery",
      "modelType": "INNER",
      "modelStatus": "ACTIVE",
      "created": new Date()
    }

    // Insert Section Model
    const modelResult = await modelCollection.insertOne(modelData);

    save_file(modelCollectionName, {
      ...modelData,
      _id: modelResult.insertedId,
    });

    const formData = {
      "gridType": "form",
      "status": "ACTIVE",
      "accountId": "5d6590b3af790ca2bcc707b7",
      "created": new Date(),
      "rows": [
        {
          "fields": [
            {
              index: 0,
              id: 'images',
              title: 'Images',
              min: 1,
              max: 100,
              type: 'upload',
              span: 24,
              o: false,
              multiple: true,
              countTitle: 'No Media Added',
              add: true,
              delete: true,
            },
          ]
        }
      ],
      "edit": true,
      "crmModelId": modelResult.insertedId.toString(),  
      "gridTitle": "ReactGrid GlobalGallery"
    };    

    const formResult = await formCollection.insertOne(formData);
    console.log(' Form Inserted:', formResult.insertedId);
    save_file(formCollectionName, {
      ...formData,
      _id: formResult.insertedId,
    });
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
