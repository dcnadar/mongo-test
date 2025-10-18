import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Configuration
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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
          dataType: 'STRING',
          key: 'description',
          name: 'Description',
        },
        {
          dataType: 'STRING',
          key: 'buttonText',
          name: 'Button Text',
        },
        {
          dataType: 'STRING',
          key: 'title',
          name: 'Title',
        },
        {
          dataType: 'STRING',
          key: 'mainImage',
          name: 'Main Image',
        },
        {
          dataType: 'LIST_OF',
          key: 'images',
          name: 'Images',
          listType: 'STRING',
        },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'GlobalHeroSection4',
      modelType: 'INNER',
      created: new Date(),
      modelStatus: 'ACTIVE',
    };

    // Insert Model
    const modelResult = await modelCollection.insertOne(
      globalHeroSection4Model
    );
    console.log('Model inserted with ID:', modelResult.insertedId);

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
              title: 'Description',
              id: 'description',
              type: 'textarea',
              span: 12,
              o: false,
            },
            {
              index: 2,
              title: 'Button Text',
              id: 'buttonText',
              type: 'text',
              span: 12,
              o: false,
            },
            {
              index: 3,
              title: 'Title',
              id: 'title',
              type: 'text',
              span: 12,
              o: false,
            },
            {
              index: 4,
              title: 'Main Image',
              id: 'mainImage',
              type: 'image',
              span: 12,
              o: false,
            },
            {
              index: 5,
              id: 'images',
              name: 'Images',
              min: 1,
              max: 8,
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
      gridTitle: 'GlobalHeroSection4 Form',
    };

    // Insert Form
    await formCollection.insertOne(globalHeroSection4Form);
    console.log('Form inserted.');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
