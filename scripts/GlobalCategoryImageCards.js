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

    const sectionModelData = {
      properties: [
        { dataType: 'STRING', key: 'title', name: 'Title' },
        { dataType: 'STRING', key: 'image', name: 'Image' },
        {
          name: 'Enable Button',
          key: 'enableButton',
          dataType: 'BOOLEAN',
        },
        {
          dataType: 'INNER_MODEL',
          key: 'buttonAction',
          name: 'Button Action',
          modelId: '650d3713ac425a65d3141bcc',
        },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalCategoryImageCards Section',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };

    // Insert Section Model
    const sectionModelResult = await modelCollection.insertOne(
      sectionModelData
    );
    console.log(
      'Section model inserted with ID:',
      sectionModelResult.insertedId
    );
    save_file(modelCollectionName, {
      ...sectionModelData,
      _id: sectionModelResult.insertedId,
    });

    const commonProductListModelData = {
      properties: [
        {
          dataType: 'LIST_OF',
          key: 'sections',
          name: 'Sections',
          listType: 'INNER_MODEL',
          modelId: sectionModelResult.insertedId.toString(),
        },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalCategoryImageCards',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };

    // Insert GlobalCategoryImageCards Model
    const commonProductListModelResult = await modelCollection.insertOne(
      commonProductListModelData
    );
    console.log(
      'GlobalCategoryImageCards model inserted with ID:',
      commonProductListModelResult.insertedId
    );
    save_file(modelCollectionName, {
      ...commonProductListModelData,
      _id: commonProductListModelResult.insertedId,
    });

    // Section Form
    const sectionFormData = {
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
              span: 8,
              o: false,
            },
            {
              index: 2,
              title: 'Image',
              id: 'image',
              type: 'upload',
              span: 8,
              o: false,
            },

            {
              index: 5,
              title: 'Enable Click',
              id: 'enableButton',
              type: 'bool',
              span: 6,
              o: false,
            },
            {
              index: 6,
              title: 'Click Action',
              id: 'buttonAction',
              type: 'inner_form',
              span: 12,
              o: false,
              meta: {
                crmFormId: '6517ad7d581c417ed1d0dd4c',
              },
              showCondition: 'return this.enableButton;',
            },
          ],
        },
      ],
      edit: true,
      crmModelId: sectionModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalCategoryImageCards Section',
    };
    const sectionFormResult = await formCollection.insertOne(sectionFormData);
    console.log('Section Form Inserted:', sectionFormResult.insertedId);
    save_file(formCollectionName, {
      ...sectionFormData,
      _id: sectionFormResult.insertedId,
    });

    // GlobalCategoryImageCards Form
    const commonProductList2FormData = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Sections',
              id: 'sections',
              type: 'form_array',
              span: 24,
              o: false,
              min: 1,
              max: 20,
              add: true,
              delete: true,
              info: 'Category data',
            },
          ],
        },
      ],
      edit: true,
      crmModelId: commonProductListModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalCategoryImageCards',
    };
    const commonProductList2FormResult = await formCollection.insertOne(
      commonProductList2FormData
    );
    console.log(
      'GlobalCategoryImageCards Form Inserted:',
      commonProductList2FormResult.insertedId
    );
    save_file(formCollectionName, commonProductList2FormData);
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
