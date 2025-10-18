import { MongoClient } from "mongodb";
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

    // Model for GlobalGetStarted1
    const globalGetStarted1Model = {
      properties: [
        {
          dataType: "STRING",
          key: "image",
          name: "Image URL",
        },
        {
          dataType: "STRING",
          key: "backGround",
          name: "Background",
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
          key: "buttonText",
          name: "Button Text",
        },
        {
          index: 3,
          title: "Button Action",
          id: "clickAction",
          type: "inner_form",
          span: 24,
          o: false,
          meta: {
            crmFormId: "6517ad7d581c417ed1d0dd4c",
          },
          showCondition: "return this.enableButton;",
        },
      ],
      accountId: "5d6590b3af790ca2bcc707b7",
      name: "GlobalGetStarted1",
      modelType: "INNER",
      created: new Date(),
      modelStatus: "ACTIVE",
    };

    // Insert Model
    const modelResult = await modelCollection.insertOne(globalGetStarted1Model);
    console.log("Model inserted with ID:", modelResult.insertedId);

    // Form for GlobalGetStarted1
    const globalGetStarted1Form = {
      gridType: "form",
      status: "ACTIVE",
      accountId: "5d6590b3af790ca2bcc707b7",
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: "Image URL",
              id: "image",
              type: "image",
              span: 12,
              o: false,
            },
            {
              index: 1,
              title: "Background",
              id: "backGround",
              type: "text",
              span: 12,
              o: false,
            },
            {
              index: 2,
              title: "Heading",
              id: "heading",
              type: "text",
              span: 12,
              o: false,
            },
            {
              index: 3,
              title: "Description",
              id: "description",
              type: "textarea",
              span: 12,
              o: false,
            },
            {
              index: 4,
              title: "Button Text",
              id: "buttonText",
              type: "text",
              span: 12,
              o: false,
            },
          ],
        },
      ],
      edit: true,
      crmModelId: modelResult.insertedId.toString(),
      gridTitle: "GlobalGetStarted1 Form",
    };

    // Insert Form
    await formCollection.insertOne(globalGetStarted1Form);
    console.log("Form inserted.");
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}

run();
