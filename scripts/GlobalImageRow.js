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

    // Model for GlobalHeroSection4
    const globalHeroSection4Model = {
      properties: [
        {
          dataType: 'STRING',
          key: 'heading',
          name: 'Heading',
        },
        {
          dataType: 'LIST_OF',
          key: 'images',
          name: 'Images',
          listType: 'STRING',
        },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalImageRow',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };

    // Insert Model
    const modelResult = await modelCollection.insertOne(
      globalHeroSection4Model
    );
    console.log('Model inserted with ID:', modelResult.insertedId);
    save_file(modelCollectionName, { ...globalHeroSection4Model, _id: modelResult.insertedId });

    // Form for GlobalHeroSection4
    const globalHeroSection4Form = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Heading',
              id: 'heading',
              type: 'text',
              span: 12,
              o: false,
            },
            {
              index: 1,
              id: 'images',
              name: 'Images',
              min: 1,
              max: 20,
              type: 'upload',
              span: 12,
              o: false,
              multiple: true,
              countTitle: 'No Media Added',
              add: true,
              delete: true,
            },
          ],
        },
      ],
      edit: true,
      crmModelId: modelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalImageRow',
    };

    // Insert Form
    const globalHeroSection4FormResult = await formCollection.insertOne(globalHeroSection4Form);
    save_file(formCollectionName, { ...globalHeroSection4Form, _id: globalHeroSection4FormResult.insertedId });
    console.log('Form inserted.');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
