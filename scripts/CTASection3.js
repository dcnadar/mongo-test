import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Configuration
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const modelCollectionName = "crm_model";
const formCollectionName = "crm_grid";

async function run() {
    try {
        await client.connect();
        const database = client.db(dbName);
        const modelCollection = database.collection(modelCollectionName);
        const formCollection = database.collection(formCollectionName);

        // Content Model
        const contentModel = {
            properties: [
                {
                    dataType: "STRING",
                    key: "title",
                    name: "Title"
                },
                {
                    dataType: "STRING",
                    key: "description",
                    name: "Description"
                },
                {
                    dataType: "LIST_OF",
                    key: "section",
                    name: "Section",
                    listType: "STRING"
                }
            ],
            accountId: "5d6590b3af790ca2bcc707b7",
            name: "ReactGrid CTASection3 Inner Content",
            modelType: "INNER",
            created: new Date(),
            modelStatus: "ACTIVE"
        };

        // Insert Content Model
        const contentModelResult = await modelCollection.insertOne(contentModel);
        console.log("Content Model inserted with ID:", contentModelResult.insertedId);

        // Main Model (Using Content Model ID)
        const mainModel = {
            properties: [
                {
                    dataType: "STRING",
                    key: "imageUrl",
                    name: "Image URL"
                },
                {
                    dataType: "INNER_MODEL",
                    key: "content",
                    name: "Content",
                    modelId: contentModelResult.insertedId.toString()
                },
                {
                    dataType: "STRING",
                    key: "buttonHref",
                    name: "Button Href"
                },
                {
                    dataType: "STRING",
                    key: "buttonText",
                    name: "Button Text"
                }
            ],
            accountId: "5d6590b3af790ca2bcc707b7",
            name: "ReactGrid CTASection3",
            modelType: "INNER",
            created: new Date(),
            modelStatus: "ACTIVE"
        };

        // Insert Main Model
        const mainModelResult = await modelCollection.insertOne(mainModel);
        console.log("Main Model inserted with ID:", mainModelResult.insertedId);

        // Content Form
        const contentForm = {
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
                            o: false
                        },
                        {
                            index: 1,
                            title: "Description",
                            id: "description",
                            type: "textarea",
                            span: 12,
                            o: false
                        },
                        {
                            index: 2,
                            title: "Section",
                            id: "section",
                            type: "strings",
                            span: 12,
                            o: false
                        }
                    ]
                }
            ],
            edit: true,
            crmModelId: contentModelResult.insertedId.toString(),
            created: new Date(),
            gridTitle: "ReactGrid CTASection3 Inner Content"
        };

        // Insert Content Form
        await formCollection.insertOne(contentForm);
        console.log("Content Form inserted.");

        // Main Form
        const mainForm = {
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
                            id: "imageUrl",
                            type: "text",
                            span: 12,
                            o: false
                        },
                        {
                            index: 1,
                            title: "Content",
                            id: "content",
                            type: "inner_form",
                            span: 12,
                            o: false,
                            meta: {
                                crmFormId: contentForm._id.toString()
                            }
                        },
                        {
                            index: 2,
                            title: "Button Href",
                            id: "buttonHref",
                            type: "text",
                            span: 12,
                            o: false
                        },
                        {
                            index: 3,
                            title: "Button Text",
                            id: "buttonText",
                            type: "text",
                            span: 12,
                            o: false
                        }
                    ]
                }
            ],
            edit: true,
            crmModelId: mainModelResult.insertedId.toString(),
            gridTitle: "ReactGrid CTASection3"
        };

        // Insert Main Form
        await formCollection.insertOne(mainForm);
        console.log("Main Form inserted.");
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        await client.close();
    }
}

run();
