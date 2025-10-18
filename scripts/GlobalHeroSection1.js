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
  
      const globalHeroSection3ModelData = {
        properties: [

          { dataType: 'STRING', key: 'title', name: 'Title' },
          { dataType: 'STRING', key: 'titleButtonText', name: 'Title Buttton Text' },
          { dataType: 'BOOLEAN', key: 'titleButtonEnabled', name: 'Title Button Enabled' },
          {
            "dataType": "INNER_MODEL",
            "key": "titleButtonAction",
            "name": "Title Button Action",
            "modelId": "650d3713ac425a65d3141bcc"
        },
        { dataType: 'STRING', key: 'heading', name: 'Heading' },
          { dataType: 'STRING', key: 'description', name: 'Description' },
          {
            "dataType": "LIST_OF",
            "listType": "INNER_MODEL",
            "key": "buttons",
            "name": "Buttons",
            "modelId": "65b0b2b014cae9d8eba5398a"
        },
        ],
        accountId: '5d6590b3af790ca2bcc707b7',
        name: 'ReactGrid GlobalHeroSection1',
        modelType: 'INNER',
        created: new Date(),
        modelStatus: 'ACTIVE',
      };
      
      
      // Insert GlobalHeroSection3 Model
      const globalHeroSection3ModelResult = await modelCollection.insertOne(globalHeroSection3ModelData);
      console.log('GlobalHeroSection3 model inserted with ID:', globalHeroSection3ModelResult.insertedId);
      save_file(modelCollectionName, { ...globalHeroSection3ModelData, _id: globalHeroSection3ModelResult.insertedId });
  
  
      const globalHeroSection3FormData = {
        gridType: 'form',
        status: 'ACTIVE',
        accountId: '5d6590b3af790ca2bcc707b7',
        created: new Date(),
        rows: [
          {
            fields: [
              { index: 0, title: 'Title', id: 'title', type: 'text', span: 8, o: false, hint: 'Title of the Section' },
              { index: 1, title: 'Title Button Enable', id: 'titleButtonEnabled', type: 'bool', span: 8, o: false, hint: 'Enable Button in Title' },
              { index: 2, title: 'Title Buttton Text', id: 'titleButtonText', type: 'text', span: 8, o: false, hint: 'Text for the button with title', "showCondition": "return this.titleButtonEnabled;" },
                {
                    "index": 3,
                    "title": "Button Action",
                    "id": "titleButtonAction",
                    "type": "inner_form",
                    "span": 24,
                    "o": false,
                    "meta": {
                        "crmFormId": "6517ad7d581c417ed1d0dd4c"
                    },
                    "showCondition": "return this.titleButtonEnabled;"
                },
              { index: 4, title: 'Heading', id: 'heading', type: 'text', span: 8, o: false, hint: 'Heading of the section' },
              { index: 5, title: 'Description', id: 'description', type: 'textarea', span: 24, o: false, hint: 'Description of the section' },
              {
                "index": 6,
                "title": "Buttons",
                "id": "buttons",
                "type": "form_array",
                "span": 24,
                "o": false,
                "min": 1,
                "max": 2,
                "add": true,
                "delete": true,
                "countTitle": "No Button Added"
            }
            ],
          },
        ],
        edit: true,
        crmModelId: globalHeroSection3ModelResult.insertedId.toString(), // This will be set after the model is inserted
        gridTitle: 'ReactGrid GlobalHeroSection1',
      };
      // Insert GlobalHeroSection3 Form
      const globalHeroSection3FormResult = await formCollection.insertOne(globalHeroSection3FormData);
      console.log('GlobalHeroSection3 form inserted with ID:', globalHeroSection3FormResult.insertedId);
      save_file(formCollectionName, { ...globalHeroSection3FormData, _id: globalHeroSection3FormResult.insertedId });
      
  
    } catch (err) {
      console.error('An error occurred:', err);
    } finally {
      await client.close();
    }
  }
  
  run();