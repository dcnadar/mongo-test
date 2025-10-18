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

    // Header Model
    const headerModelData = {
      properties: [
        { dataType: 'STRING', key: 'heading', name: 'Heading' },
        { dataType: 'STRING', key: 'description', name: 'Description' },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalBlogCards Header',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };
    const headerModelResult = await modelCollection.insertOne(headerModelData);
    headerModelData._id = headerModelResult.insertedId;
    save_file(modelCollectionName, headerModelData);

    // User Model
    const userModelData = {
      properties: [
        { dataType: 'STRING', key: 'thumb', name: 'Thumbnail' },
        { dataType: 'STRING', key: 'name', name: 'Name' },
        { dataType: 'STRING', key: 'description', name: 'Description' },
        {
            "dataType": "INNER_MODEL",
            "key": "buttonAction",
            "name": "Button Action",
            "modelId": "650d3713ac425a65d3141bcc"
        }
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalBlogCards User',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };
    const userModelResult = await modelCollection.insertOne(userModelData);
    userModelData._id = userModelResult.insertedId;
    save_file(modelCollectionName, userModelData);

    // Sections Model
    const sectionsModelData = {
      properties: [
        { dataType: 'STRING', key: 'data', name: 'Date' },
        { dataType: 'STRING', key: 'tag', name: 'Tag' },
        { dataType: 'STRING', key: 'path', name: 'Path' },
        { dataType: 'STRING', key: 'title', name: 'Title' },
        { dataType: 'STRING', key: 'descriptions', name: 'Descriptions' },
        {
          dataType: 'INNER_MODEL',
          key: 'user',
          name: 'User',
          modelId: userModelResult.insertedId.toString(),
        },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalBlogCards Section',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };
    const sectionsModelResult = await modelCollection.insertOne(sectionsModelData);
    sectionsModelData._id = sectionsModelResult.insertedId;
    save_file(modelCollectionName, sectionsModelData);

    // GlobalBlogCards Model
    const globalBlogCardsModelData = {
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
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalBlogCards',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };
    const globalBlogCardsModelResult = await modelCollection.insertOne(globalBlogCardsModelData);
    globalBlogCardsModelData._id = globalBlogCardsModelResult.insertedId;
    save_file(modelCollectionName, globalBlogCardsModelData);

    console.log('Models for GlobalBlogCards inserted successfully.');

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
                title: 'Heading',
                id: 'heading',
                type: 'text',
                span: 12,
                o: false,
                info: 'Title of the blog section',
              },
              {
                index: 1,
                title: 'Description',
                id: 'description',
                type: 'textarea',
                span: 12,
                o: false,
                info: 'Brief description of the blog section',
              },
            ],
          },
        ],
        edit: true,
        crmModelId: headerModelResult.insertedId.toString(), // Replace with actual Header Model ID
        gridTitle: 'ReactGrid GlobalBlogCards Header',
      };
      const headerFormResult = await formCollection.insertOne(headerFormData);
      headerFormData._id = headerFormResult.insertedId;
      save_file(formCollectionName, headerFormData);
  
      // User Form
      const userFormData = {
        gridType: 'form',
        status: 'ACTIVE',
        accountId: '5d6590b3af790ca2bcc707b7',
        created: new Date(),
        rows: [
          {
            fields: [
              {
                index: 0,
                title: 'Thumbnail',
                id: 'thumb',
                type: 'text',
                span: 12,
                o: false,
                info: 'User profile image URL',
              },
              {
                index: 1,
                title: 'Name',
                id: 'name',
                type: 'text',
                span: 12,
                o: false,
                info: 'Name of the user',
              },
              {
                index: 2,
                title: 'Description',
                id: 'description',
                type: 'text',
                span: 12,
                o: false,
                info: 'User role or bio',
              },
              {
                "index": 3,
                "title": "Click Action",
                "id": "buttonAction",
                "type": "inner_form",
                "span": 24,
                "o": false,
                "meta": {
                    "crmFormId": "6517ad7d581c417ed1d0dd4c"
                },
                "hint": "Define the action for the button. For example, you could set it to navigate to a user page, open a modal, etc."
            }
            ],
          },
        ],
        edit: true,
        crmModelId: userModelResult.insertedId.toString(), // Replace with actual User Model ID
        gridTitle: 'ReactGrid GlobalBlogCards User',
      };
      const userFormResult = await formCollection.insertOne(userFormData);
      userFormData._id = userFormResult.insertedId;
      save_file(formCollectionName, userFormData);
  
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
                title: 'Date',
                id: 'data',
                type: 'text',
                span: 6,
                o: false,
                info: 'Date of the blog post',
              },
              {
                index: 1,
                title: 'Tag',
                id: 'tag',
                type: 'text',
                span: 6,
                o: false,
                info: 'Category or tag of the blog post',
              },
              {
                index: 2,
                title: 'Path',
                id: 'path',
                type: 'text',
                span: 6,
                o: false,
                info: 'Link to the blog post',
              },
              {
                index: 3,
                title: 'Title',
                id: 'title',
                type: 'text',
                span: 6,
                o: false,
                info: 'Title of the blog post',
              },
              {
                index: 4,
                title: 'Descriptions',
                id: 'descriptions',
                type: 'textarea',
                span: 12,
                o: false,
                info: 'Summary or excerpt of the blog post',
              },
              {
                index: 5,
                title: 'User',
                id: 'user',
                type: 'inner_form',
                span: 12,
                o: false,
                meta: {
                  crmFormId: userFormData._id.toString(),
                },
                info: 'Details about the author or related user',
              },
            ],
          },
        ],
        edit: true,
        crmModelId: sectionsModelResult.insertedId.toString(), // Replace with actual Sections Model ID
        gridTitle: 'ReactGrid GlobalBlogCards Section',
      };
      const sectionsFormResult = await formCollection.insertOne(sectionsFormData);
      sectionsFormData._id = sectionsFormResult.insertedId;
      save_file(formCollectionName, sectionsFormData);
  
      console.log('Forms for GlobalBlogCards inserted successfully.');

      const globalBlogCardsFormData = {
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
                  crmFormId: headerFormResult.insertedId.toString(), // Replace with actual Header Form ID
                },
                info: 'Header details including heading and description'
              },
              {
                index: 1,
                title: 'Sections',
                id: 'sections',
                type: 'form_array',
                span: 12,
                o: false,
                info: 'Collection of sections with blog cards'
              },
            ],
          },
        ],
        edit: true,
        crmModelId: globalBlogCardsModelResult.insertedId.toString(), // Replace with actual GlobalBlogCards Model ID
        gridTitle: 'ReactGrid GlobalBlogCards',
      };
      const globalBlogCardsFormResult = await formCollection.insertOne(globalBlogCardsFormData);
      globalBlogCardsFormData._id = globalBlogCardsFormResult.insertedId;
      save_file(formCollectionName, globalBlogCardsFormData);
  
      console.log('GlobalBlogCards form inserted successfully.');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
