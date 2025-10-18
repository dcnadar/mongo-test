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
        "accountId": "5d6590b3af790ca2bcc707b7",
        "name": "Website Page Section Settings",
        "modelType": "INNER",
        "modelStatus": "ACTIVE",
        "properties": [
          {
            "dataType": "STRING",
            "key": "styles",
            "name": "Styles"
          },
          {
            "dataType": "STRING",
            "key": "backgroundImage",
            "name": "Background Image"
          }
        ],
        "created": new Date()
      };

    // Insert Section Model
    const modelResult = await modelCollection.insertOne(modelData);

    save_file(modelCollectionName, {
      ...modelData,
      _id: modelResult.insertedId,
    });

    // CommonProductList2 Form
    const formData = {
        "gridType": "form",
        "status": "ACTIVE",
        "accountId": "5d6590b3af790ca2bcc707b7",
        "created": new Date(),
        "rows": [
          {
            "fields": [
              {
                "index": 0,
                "title": "Styles",
                "id": "styles",
                "type": "textarea",
                "span": 16,
                "o": false,
                "hint": "Enter CSS styles for the page section."
              },
              {
                "index": 1,
                "title": "Background Image",
                "id": "backgroundImage",
                "type": "upload",
                "span": 8,
                "o": false,
                "hint": "Upload a background image for the page section."
              }
            ]
          }
        ],
        "edit": true,
        "crmModelId": modelResult.insertedId.toString(),
        "gridTitle": "Website Page Section Settings"
      }      

    const formResult = await formCollection.insertOne(formData);
    console.log('CommonProductList2 Form Inserted:', formResult.insertedId);
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
