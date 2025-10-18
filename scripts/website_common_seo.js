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
const apiCollectionName = 'crm_api';

async function run() {
  try {
    await client.connect();
    const database = client.db(dbName);
    const modelCollection = database.collection(modelCollectionName);
    const formCollection = database.collection(formCollectionName);
    const apiCollection = database.collection(apiCollectionName);


    const websiteSchemaModelData = {
      "properties": [
        { "dataType": "STRING", "key": "schema", "name": "Schema Object" },
      ],
      "accountId": "5d6590b3af790ca2bcc707b7",
      "name": "Website CommonSEO Schema",
      "modelType": "INNER",
      "modelStatus": "ACTIVE",
      "created": new Date()
    }
        // save to mongodb
        const websiteSchemaModelDataResult = await modelCollection.insertOne(
          websiteSchemaModelData
        );
        console.log(
          `Website CommonSeo Schema model inserted with ID: ${websiteSchemaModelDataResult.insertedId}`
        );
        save_file(modelCollectionName, {
          ...websiteSchemaModelData,
          _id: websiteSchemaModelDataResult.insertedId,
        });


    const websiteSeoModelData = {
      "properties": [
        { "dataType": "STRING", "key": "title", "name": "Title" },
        { "dataType": "STRING", "key": "description", "name": "Description" },
        { "dataType": "LIST_OF", "listType": "STRING", "key": "keywords", "name": "Keywords" },
        {
          "dataType": "LIST_OF",
          "key": "schemas",
          "name": "Schemas",
          "listType": "INNER_MODEL",
          "modelId": websiteSchemaModelDataResult.insertedId.toString()
        }
      ],
      "accountId": "5d6590b3af790ca2bcc707b7",
      "name": "Website CommonSEO",
      "modelType": "INNER",
      "modelStatus": "ACTIVE",
      "created": new Date()
    }
        // save to mongodb
        const websiteSeoModelDataResult = await modelCollection.insertOne(
          websiteSeoModelData
        );
        console.log(
          `Website CommonSeo model inserted with ID: ${websiteSeoModelDataResult.insertedId}`
        );
        save_file(modelCollectionName, {
          ...websiteSeoModelData,
          _id: websiteSeoModelDataResult.insertedId,
        });


    const websiteSeoSchemaFormData = {
      "accountId": "5d6590b3af790ca2bcc707b7",
      "created": new Date(),
      "gridType": "form",
      "status": "ACTIVE",
      "rows": [
        {
          "fields": [
            {
              "index": 0,
              "title": "Schema Object",
              "id": "schema",
              "type": "textarea",
              "span": 24,
              "o": false,
            }
          ]
        }
      ],
      "edit": true,
      "crmModelId": websiteSchemaModelDataResult.insertedId.toString(),
      "gridTitle": "Website CommonSEO Schema"
    }
    const websiteSeoSchemaFormDataResult = await formCollection.insertOne(
      websiteSeoSchemaFormData
    );
    console.log(
      `Website CommonSeo Schema form inserted with ID: ${websiteSeoSchemaFormDataResult.insertedId}`
    );
    save_file(formCollectionName, {
      ...websiteSeoSchemaFormData,
      _id: websiteSeoSchemaFormDataResult.insertedId,
    });

    const websiteSeoFormData = {
      "gridType": "form",
      "status": "ACTIVE",
      "accountId": "5d6590b3af790ca2bcc707b7",
      "created": new Date(),
      "rows": [
        {
          "fields": [
            {
              "index": 0,
              "title": "Title",
              "id": "title",
              "type": "text",
              "span": 8,
              "o": false,
              "max": 70,
            },
            {
              "index": 1,
              "title": "Description",
              "id": "description",
              "type": "textarea",
              "span": 16,
              "o": false,
              "max": 160,
              "hint": "Max 160 characters. Use the keyword in the description."
            },
            {
              "index": 2,
              "title": "Keywords",
              "id": "keywords",
              "type": "strings",
              "span": 8,
              "o": false,
              
            },
            {
              "index": 3,
              "title": "Schemas",
              "id": "schemas",
              "type": "form_array",
              "span": 16,
              "o": true,
              "min": 0,
              "max": 20,
              "add": true,
              "delete": true,
              "countTitle": "No Schema Added",
              "hint": "Add Schema Object for SEO purpose (e.g. BreadcrumbList, Organization, etc.)",
            }
          ]
        }
      ],
      "edit": true,
      "crmModelId": websiteSeoModelDataResult.insertedId.toString(),
      "gridTitle": "Website CommonSEO"
    }
    const websiteSeoFormDataResult = await formCollection.insertOne(
      websiteSeoFormData
    );
    console.log(
      `Website CommonSeo form inserted with ID: ${websiteSeoFormDataResult.insertedId}`
    );
    save_file(formCollectionName, {
      ...websiteSeoFormData,
      _id: websiteSeoFormDataResult.insertedId,
    });
    

    const websiteCommonSeoFormGetApiData = {
      name: 'Common SEO Setting (applied on all pages)',
      action: 'CRM_GRID',
      gridType: 'form',
      apiType: 'GET',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      sourceId: websiteSeoFormDataResult.insertedId.toString(),
      path: '/admin/website/seo',
      created: new Date(),
    };
    const websiteCommonSeoFormGetApiResult = await apiCollection.insertOne(
      websiteCommonSeoFormGetApiData
    );
    console.log(
      `Website Common SEO form GET API inserted with ID: ${websiteCommonSeoFormGetApiResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...websiteCommonSeoFormGetApiData,
      _id: websiteCommonSeoFormGetApiResult.insertedId,
    });

    const websiteCommonSeoFormPostApiData = {
      name: 'Common SEO Setting (applied on all pages)',
      action: 'FORM_SAVE',
      apiType: 'POST',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      sourceId: websiteSeoFormDataResult.insertedId.toString(),
      path: '/admin/website/seo',
      created: new Date(),
    };
    const websiteCommonSeoFormPostApiResult = await apiCollection.insertOne(
      websiteCommonSeoFormPostApiData
    );
    console.log(
      `Website Common SEO form POST API inserted with ID: ${websiteCommonSeoFormPostApiResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...websiteCommonSeoFormPostApiData,
      _id: websiteCommonSeoFormPostApiResult.insertedId,
    });

    console.log('Website Common SEO setting created successfully');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
