import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// MongoDB Configuration
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const modelCollectionName = "crm_model";
const formCollectionName = "crm_grid";

async function run() {
  try {
    await client.connect();
    const database = client.db(dbName);
    const modelCollection = database.collection(modelCollectionName);
    const formCollection = database.collection(formCollectionName);

    // Model for GlobalCtaSection2
    const globalCtaSection2Model = {
      properties: [
        {
          dataType: "STRING",
          key: "title",
          name: "Title",
        },
        {
          dataType: "STRING",
          key: "heading",
          name: "Heading",
        },
        {
          dataType: "STRING",
          key: "description",
          name: "Description",
        },
        {
          dataType: "STRING",
          key: "image",
          name: "Image URL",
        },
        {
          dataType: "STRING",
          key: "buttonText",
          name: "Button Text",
        },
        {
          dataType: "INNER_MODEL",
          key: "buttonAction",
          name: "Button Action",
          modelId: "650d3713ac425a65d3141bcc",
        },
      ],
      accountId: "5d6590b3af790ca2bcc707b7",
      name: "GlobalCtaSection2",
      modelType: "INNER",
      created: new Date(),
      modelStatus: "ACTIVE",
    };

    // Insert Model
    const modelResult = await modelCollection.insertOne(globalCtaSection2Model);
    console.log("Model inserted with ID:", modelResult.insertedId);

    // Form for GlobalCtaSection2
    const globalCtaSection2Form = {
      gridType: "form",
      status: "ACTIVE",
      accountId: "5d6590b3af790ca2bcc707b7",
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: "Title",
              id: "title",
              type: "text",
              span: 12,
              o: false,
            },
            {
              index: 1,
              title: "Heading",
              id: "heading",
              type: "text",
              span: 12,
              o: false,
            },
            {
              index: 2,
              title: "Description",
              id: "description",
              type: "textarea",
              span: 12,
              o: false,
            },
            {
              index: 3,
              title: "Button Text",
              id: "buttonText",
              type: "text",
              span: 12,
              o: false,
            },
            {
              index: 4,
              title: "Image URL",
              id: "image",
              type: "image",
              span: 12,
              o: false,
            },
          ],
        },
      ],
      edit: true,
      crmModelId: modelResult.insertedId.toString(),
      gridTitle: "GlobalCtaSection2 Form",
    };

    // Insert Form
    await formCollection.insertOne(globalCtaSection2Form);
    console.log("Form inserted.");
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}

run();
