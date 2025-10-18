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

async function runGlobalTabSection2() {
    try {
      await client.connect();
      const database = client.db(dbName);
      const modelCollection = database.collection(modelCollectionName);
      const formCollection = database.collection(formCollectionName);
  
      // Section Inner Model
      const sectionInnerModelData = {
        properties: [
          { dataType: 'STRING', key: 'svg', name: 'SVG' },
          { dataType: 'STRING', key: 'title', name: 'Title' },
          { dataType: 'STRING', key: 'heading', name: 'Heading' },
          { dataType: 'STRING', key: 'description', name: 'Description' },
          { dataType: 'STRING', key: 'image', name: 'Image' },
        ],
        accountId: '5d6590b3af790ca2bcc707b7',
        name: 'GlobalTabSection2 Inner Section',
        modelType: 'INNER',
        created: new Date(),
        modelStatus: 'ACTIVE',
      };
      const sectionInnerModelResult = await modelCollection.insertOne(sectionInnerModelData);
      console.log('Inner Section model for GlobalTabSection2 inserted with ID:', sectionInnerModelResult.insertedId);
      save_file(modelCollectionName, { ...sectionInnerModelData, _id: sectionInnerModelResult.insertedId });
  
      // GlobalTabSection2 Main Model
      const globalTabSection2ModelData = {
        properties: [
          { dataType: 'STRING', key: 'heading', name: 'Heading' },
          { dataType: 'STRING', key: 'description', name: 'Description' },
          {
            dataType: 'LIST_OF',
            key: 'section',
            name: 'Section',
            listType: 'INNER_MODEL',
            modelId: sectionInnerModelResult.insertedId.toString(),
          },
        ],
        accountId: '5d6590b3af790ca2bcc707b7',
        name: 'GlobalTabSection2',
        modelType: 'INNER',
        created: new Date(),
        modelStatus: 'ACTIVE',
      };
      const globalTabSection2ModelResult = await modelCollection.insertOne(globalTabSection2ModelData);
      console.log('GlobalTabSection2 Main model inserted with ID:', globalTabSection2ModelResult.insertedId);
      save_file(modelCollectionName, { ...globalTabSection2ModelData, _id: globalTabSection2ModelResult.insertedId });
  
    // Section Inner Form
    const sectionInnerFormData = {
        gridType: 'form',
        status: 'ACTIVE',
        accountId: '5d6590b3af790ca2bcc707b7',
        created: new Date(),
        rows: [
          {
            fields: [
              {
                index: 0,
                title: 'SVG',
                id: 'svg',
                type: 'text',
                span: 12,
                o: false,
                hint: "SVG markup for the section's icon."
              },
              {
                index: 1,
                title: 'Title',
                id: 'title',
                type: 'text',
                span: 12,
                o: false,
                hint: 'Title of the section.'
              },
              {
                index: 2,
                title: 'Heading',
                id: 'heading',
                type: 'text',
                span: 12,
                o: false,
                hint: 'Heading for the section.'
              },
              {
                index: 3,
                title: 'Description',
                id: 'description',
                type: 'textarea',
                span: 12,
                o: false,
                hint: 'Description for the section.'
              },
              {
                index: 4,
                title: 'Image',
                id: 'image',
                type: 'text',
                span: 12,
                o: false,
                hint: 'URL for the section image.'
              },
            ],
          },
        ],
        edit: true,
        crmModelId: sectionInnerModelResult.insertedId.toString(),
        gridTitle: 'GlobalTabSection2 Section',
      };
      const sectionInnerFormDataResult = await formCollection.insertOne(sectionInnerFormData);
      console.log('Inner Section form for GlobalTabSection2 inserted with ID:', sectionInnerFormDataResult.insertedId);
      save_file(formCollectionName, { ...sectionInnerFormData, _id: sectionInnerFormDataResult.insertedId });
  

      // GlobalTabSection2 Main Form
      const globalTabSection2FormData = {
        gridType: 'form',
        status: 'ACTIVE',
        accountId: '5d6590b3af790ca2bcc707b7',
        created: new Date(),
        rows: [
          {
            fields: [
              { index: 0, title: 'Heading', id: 'heading', type: 'text', span: 12, o: false },
              { index: 1, title: 'Description', id: 'description', type: 'textarea', span: 12, o: false },
              {
                index: 2,
                title: 'Section',
                id: 'section',
                type: 'form_array',
                span: 24,
                o: false,
                min: 2,
                max: 5,
                add: true,
                delete: true,
                "hint": "Tabs data",
              },
            ],
          },
        ],
        edit: true,
        crmModelId: globalTabSection2ModelResult.insertedId.toString(),
        gridTitle: 'GlobalTabSection2 Form',
      };
      const globalTabSection2FormDataResult = await formCollection.insertOne(globalTabSection2FormData);
      console.log('GlobalTabSection2 Main form inserted with ID:', globalTabSection2FormDataResult.insertedId);
      save_file(formCollectionName, { ...globalTabSection2FormData, _id: globalTabSection2FormDataResult.insertedId });
  
      console.log('Setup for GlobalTabSection2 with inner section model and form is completed.');
    } catch (err) {
      console.error('An error occurred:', err);
    } finally {
      await client.close();
    }
  }
  
  runGlobalTabSection2();
