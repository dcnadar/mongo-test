import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const dbName = process.env.DB_NAME;

// MongoDB Configuration
const mongoUri = process.env.MONGO_URI;

const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export function save_file(collection, jsonData) {
  fs.writeFileSync(
    path.join(path.join(dbName, collection), `${jsonData._id}.json`),
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

    // Header Model
    const headerModelData = {
      properties: [
        { dataType: 'STRING', key: 'title', name: 'Title' },
        { dataType: 'STRING', key: 'heading', name: 'Heading' },
        { dataType: 'STRING', key: 'description', name: 'Description' },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalFeatureSection1 Header',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };
    const headerModelResult = await modelCollection.insertOne(headerModelData);
    headerModelData._id = headerModelResult.insertedId;
    save_file(modelCollectionName, headerModelData);

    // Header Form
    const headerFormData = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Title',
              id: 'title',
              type: 'text',
              span: 6,
              o: false,
            },
            {
              index: 1,
              title: 'Heading',
              id: 'heading',
              type: 'text',
              span: 6,
              o: false,
            },
            {
              index: 2,
              title: 'Description',
              id: 'description',
              type: 'textarea',
              span: 12,
              o: false,
            },
          ],
        },
      ],
      edit: true,
      crmModelId: headerModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalFeatureSection1 Header',
    };
    const headerFormDataResult = await formCollection.insertOne(headerFormData);
    headerFormData._id = headerFormDataResult.insertedId;
    save_file(formCollectionName, headerFormData);

    // Sections Model
    const sectionsModelData = {
      properties: [
        { dataType: 'STRING', key: 'title', name: 'Title' },
        { dataType: 'STRING', key: 'descriptions', name: 'Descriptions' },
        { dataType: 'STRING', key: 'svg', name: 'SVG' },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalFeatureSection1 Section',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };
    const sectionsModelResult = await modelCollection.insertOne(
      sectionsModelData
    );
    sectionsModelData._id = sectionsModelResult.insertedId;
    save_file(modelCollectionName, sectionsModelData);

    // Sections Form
    const sectionsFormData = {
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
              type: 'textarea',
              span: 6,
              o: false,
            },
            {
              index: 1,
              title: 'Title',
              id: 'title',
              type: 'text',
              span: 6,
              o: false,
            },
            {
              index: 2,
              title: 'Descriptions',
              id: 'descriptions',
              type: 'textarea',
              span: 12,
              o: false,
            },
          ],
        },
      ],
      edit: true,
      crmModelId: sectionsModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalFeatureSection1 Section',
    };
    const sectionsFormDataResult = await formCollection.insertOne(
      sectionsFormData
    );
    sectionsFormData._id = sectionsFormDataResult.insertedId;
    save_file(formCollectionName, sectionsFormData);

    // GlobalFeatureSection1 Model
    const globalFeatureSection1ModelData = {
      properties: [
        {
          dataType: 'INNER_MODEL',
          key: 'header',
          name: 'Header',
          modelId: headerModelResult.insertedId.toString(),
        },
        {
          dataType: 'LIST_OF',
          key: 'sections',
          name: 'Sections',
          listType: 'INNER_MODEL',
          modelId: sectionsModelResult.insertedId.toString(),
        },
        {
          dataType: 'STRING',
          key: 'image',
          name: 'Image URL',
        },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalFeatureSection1',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };
    const globalFeatureSection1ModelResult = await modelCollection.insertOne(
      globalFeatureSection1ModelData
    );
    globalFeatureSection1ModelData._id =
      globalFeatureSection1ModelResult.insertedId;
    save_file(modelCollectionName, globalFeatureSection1ModelData);

    // GlobalFeatureSection1 Form
    const globalFeatureSection1FormData = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Header',
              id: 'header',
              type: 'inner_form',
              span: 12,
              o: false,
              meta: {
                crmFormId: headerFormData._id.toString(),
              },
            },
            {
              index: 1,
              title: 'Sections',
              id: 'sections',
              type: 'form_array',
              span: 12,
              o: false,
            },
            {
              index: 2,
              title: 'Image URL',
              id: 'image',
              type: 'upload',
              span: 12,
              o: false,
            },
          ],
        },
      ],
      edit: true,
      crmModelId: globalFeatureSection1ModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalFeatureSection1',
    };
    const globalFeatureSection1FormDataResult = await formCollection.insertOne(
      globalFeatureSection1FormData
    );
    globalFeatureSection1FormData._id =
      globalFeatureSection1FormDataResult.insertedId;
    save_file(formCollectionName, globalFeatureSection1FormData);

    console.log(
      'Models and forms for GlobalFeatureSection1 inserted successfully.'
    );
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
