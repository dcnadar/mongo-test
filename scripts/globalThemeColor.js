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

    // ColorSet Model
    const colorSetModelData = {
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'GlobalThemeColors Set',
      modelType: 'INNER',
      modelStatus: 'ACTIVE',
      properties: [
        { dataType: 'STRING', key: 'bg', name: 'Background Color' },
        { dataType: 'STRING', key: 'text', name: 'Text Color' },
        { dataType: 'STRING', key: 'border', name: 'Border Color' },
        { dataType: 'STRING', key: 'accent', name: 'Accent Color' },
      ],
      created: new Date(),
    };
    const colorSetModelResult = await modelCollection.insertOne(
      colorSetModelData
    );
    console.log(
      `ColorSet model inserted with ID: ${colorSetModelResult.insertedId}`
    );
    save_file(modelCollectionName, {
      ...colorSetModelData,
      _id: colorSetModelResult.insertedId,
    });

    // ColorSet Form
    const colorSetFormData = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Background Color',
              id: 'bg',
              type: 'color',
              span: 6,
              o: false,
            },
            {
              index: 1,
              title: 'Text Color',
              id: 'text',
              type: 'color',
              span: 6,
              o: false,
            },
            {
              index: 2,
              title: 'Border Color',
              id: 'border',
              type: 'color',
              span: 6,
              o: false,
            },
            {
              index: 3,
              title: 'Accent Color',
              id: 'accent',
              type: 'color',
              span: 6,
              o: false,
            },
          ],
        },
      ],
      edit: true,
      crmModelId: colorSetModelResult.insertedId.toString(),
      gridTitle: 'GlobalThemeColors Set',
    };
    const colorSetFormResult = await formCollection.insertOne(colorSetFormData);
    console.log(
      `ColorSet form inserted with ID: ${colorSetFormResult.insertedId}`
    );
    save_file(formCollectionName, {
      ...colorSetFormData,
      _id: colorSetFormResult.insertedId,
    });

    console.log('ColorSet model and form inserted successfully.');

    // GlobalThemeColors Model
    const globalThemeColorsModelData = {
      properties: [
        {
          dataType: 'INNER_MODEL',
          key: 'primary',
          name: 'Primary Colors',
          modelId: colorSetModelResult.insertedId.toString(),
        },
        {
          dataType: 'INNER_MODEL',
          key: 'secondary',
          name: 'Secondary Colors',
          modelId: colorSetModelResult.insertedId.toString(),
        },
        {
          dataType: 'INNER_MODEL',
          key: 'tertiary',
          name: 'Tertiary Colors',
          modelId: colorSetModelResult.insertedId.toString(),
        },
        {
          dataType: 'INNER_MODEL',
          key: 'quaternary',
          name: 'Quaternary Colors',
          modelId: colorSetModelResult.insertedId.toString(),
        },
        {
          dataType: 'INNER_MODEL',
          key: 'quinary',
          name: 'Quinary Colors',
          modelId: colorSetModelResult.insertedId.toString(),
        },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'GlobalThemeColors',
      modelType: 'INNER',
      modelStatus: 'ACTIVE',
      created: new Date(),
    };
    const globalThemeColorsModelResult = await modelCollection.insertOne(
      globalThemeColorsModelData
    );
    console.log(
      `GlobalThemeColors model inserted with ID: ${globalThemeColorsModelResult.insertedId}`
    );
    save_file(modelCollectionName, {
      ...globalThemeColorsModelData,
      _id: globalThemeColorsModelResult.insertedId,
    });

    // GlobalThemeColors Form
    const globalThemeColorsFormData = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Primary Colors',
              id: 'primary',
              type: 'inner_form',
              span: 24,
              o: false,
              "meta": {
                "crmFormId": colorSetFormResult.insertedId.toString(),
              }
            },
            {
              index: 1,
              title: 'Secondary Colors',
              id: 'secondary',
              type: 'color_set',
              span: 24,
              o: false,
              "meta": {
                "crmFormId": colorSetFormResult.insertedId.toString(),
              }
            },
            {
              index: 2,
              title: 'Tertiary Colors',
              id: 'tertiary',
              type: 'color_set',
              span: 24,
              o: false,
              "meta": {
                "crmFormId": colorSetFormResult.insertedId.toString(),
              }
            },
            {
              index: 3,
              title: 'Quaternary Colors',
              id: 'quaternary',
              type: 'color_set',
              span: 24,
              o: false,
              "meta": {
                "crmFormId": colorSetFormResult.insertedId.toString(),
              }
            },
            {
              index: 4,
              title: 'Quinary Colors',
              id: 'quinary',
              type: 'color_set',
              span: 24,
              o: false,
              "meta": {
                "crmFormId": colorSetFormResult.insertedId.toString(),
              }
            },
          ],
        },
      ],
      edit: true,
      crmModelId: globalThemeColorsModelResult.insertedId.toString(),
      gridTitle: 'GlobalThemeColors',
    };
    const globalThemeColorsFormResult = await formCollection.insertOne(
      globalThemeColorsFormData
    );
    console.log(
      `GlobalThemeColors form inserted with ID: ${globalThemeColorsFormResult.insertedId}`
    );
    save_file(formCollectionName, {
      ...globalThemeColorsFormData,
      _id: globalThemeColorsFormResult.insertedId,
    });

    console.log('GlobalThemeColors model and form inserted successfully.');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
