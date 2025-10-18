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

    // Section Model for GlobalTabSection1
const sectionModelData = {
    properties: [
      { dataType: 'STRING', key: 'title', name: 'Title' },
      { dataType: 'STRING', key: 'description', name: 'Description' },
      { dataType: 'STRING', key: 'image', name: 'Image' },
    ],
    accountId: '5d6590b3af790ca2bcc707b7',
    name: 'ReactGrid GlobalTabSection1 Section',
    modelType: 'INNER',
    created: new Date(),
    modelStatus: 'ACTIVE',
  };
  const sectionModelResult = await modelCollection.insertOne(sectionModelData);
  console.log('Section model inserted with ID:', sectionModelResult.insertedId);
  save_file(modelCollectionName, { ...sectionModelData, _id: sectionModelResult.insertedId });
  

    // GlobalTabSection1 Model
    const globalTabSection1ModelData = {
      properties: [
        { dataType: 'STRING', key: 'heading', name: 'Heading' },
        { dataType: 'STRING', key: 'description', name: 'Description' },
        { dataType: 'STRING', key: 'image', name: 'Image' },
        { dataType: 'LIST_OF', key: 'sections', name: 'Sections', listType: 'INNER_MODEL', modelId: sectionModelResult.insertedId.toString() },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalTabSection1',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };
    const globalTabSection1ModelResult = await modelCollection.insertOne(globalTabSection1ModelData);
    console.log('Model inserted with ID:', globalTabSection1ModelResult.insertedId);
    save_file(modelCollectionName, { ...globalTabSection1ModelData, _id: globalTabSection1ModelResult.insertedId });

    // Section Form for GlobalTabSection1
const sectionFormData = {
    gridType: 'form',
    status: 'ACTIVE',
    accountId: '5d6590b3af790ca2bcc707b7',
    created: new Date(),
    rows: [
      {
        fields: [
          { index: 0, title: 'Title', id: 'title', type: 'text', span: 12, o: false, info: 'Title for the section' },
          { index: 1, title: 'Description', id: 'description', type: 'textarea', span: 12, o: false, info: 'Description for the section' },
          { index: 2, title: 'Image', id: 'image', type: 'upload', span: 12, o: false, info: 'Image URL for the section' },
        ],
      },
    ],
    edit: true,
    crmModelId: sectionModelResult.insertedId.toString(),
    gridTitle: 'ReactGrid GlobalTabSection1 Section',
  };
  const sectionFormDataResult = await formCollection.insertOne(sectionFormData);
  console.log('Section form inserted with ID:', sectionFormDataResult.insertedId);
  save_file(formCollectionName, { ...sectionFormData, _id: sectionFormDataResult.insertedId });
  

    // GlobalTabSection1 Form
    const globalTabSection1FormData = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            { index: 0, title: 'Heading', id: 'heading', type: 'text', span: 8, o: false, info: 'Main heading of the tab section' },
           { index: 1, title: 'Description', id: 'description', type: 'textarea', span: 8, o: false, info: 'Short description below the heading' },
            { index: 2, title: 'Image', id: 'image', type: 'upload', span: 8, o: false, info: 'Background image URL' },
            { index: 3, title: 'Sections', id: 'sections', type: 'form_array', span: 24, o: false, info: 'Dynamic sections with title, description, and image' },
          ],
        },
      ],
      edit: true,
      crmModelId: globalTabSection1ModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalTabSection1',
    };
    const globalTabSection1FormDataResult = await formCollection.insertOne(globalTabSection1FormData);
    console.log('Form inserted with ID:', globalTabSection1FormDataResult.insertedId);
    save_file(formCollectionName, { ...globalTabSection1FormData, _id: globalTabSection1FormDataResult.insertedId });

    console.log('ReactGrid GlobalTabSection1 model and form inserted successfully.');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
