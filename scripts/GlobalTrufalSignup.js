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

    // Basic Info Model and Form
    const basicInfoModelData = {
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalTrufalSignup BasicInfo',
      modelType: 'INNER',
      modelStatus: 'ACTIVE',
      properties: [
        {
          dataType: 'STRING',
          key: 'organisationNameLabel',
          name: 'Organisation Name Label',
        },
        { dataType: 'STRING', key: 'heading', name: 'Heading' },
        { dataType: 'STRING', key: 'description', name: 'Description' },
        { dataType: 'STRING', key: 'firstNamelabel', name: 'First Name Label' },
        { dataType: 'STRING', key: 'lastNamelabel', name: 'Last Name Label' },
        {
          dataType: 'STRING',
          key: 'emailaddresslabel',
          name: 'Email Address Label',
        },
        { dataType: 'STRING', key: 'buttonText', name: 'Button Text' },
        { dataType: 'STRING', key: 'image', name: 'Image' },
      ],
      created: new Date(),
    };
    const basicInfoModelResult = await modelCollection.insertOne(
      basicInfoModelData
    );
    save_file(modelCollectionName, {
      ...basicInfoModelData,
      _id: basicInfoModelResult.insertedId,
    });

    const basicInfoForm = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Organisation Name Label',
              id: 'organisationNameLabel',
              type: 'text',
              span: 12,
              o: false,
              info: 'The legal name of your organisation.',
            },
            {
              index: 1,
              title: 'Heading',
              id: 'heading',
              type: 'text',
              span: 12,
              o: false,
              info: 'Main heading for the section.',
            },
            {
              index: 2,
              title: 'Description',
              id: 'description',
              type: 'textarea',
              span: 24,
              o: false,
              info: 'Short description or subtitle.',
            },
            {
              index: 3,
              title: 'First Name Label',
              id: 'firstNamelabel',
              type: 'text',
              span: 8,
              o: false,
              info: 'Your first name.',
            },
            {
              index: 4,
              title: 'Last Name Label',
              id: 'lastNamelabel',
              type: 'text',
              span: 8,
              o: false,
              info: 'Your last name.',
            },
            {
              index: 5,
              title: 'Email Address Label',
              id: 'emailaddresslabel',
              type: 'text',
              span: 8,
              o: false,
              info: 'Your email address.',
            },
            {
              index: 6,
              title: 'Button Text',
              id: 'buttonText',
              type: 'text',
              span: 12,
              o: false,
              info: 'Text for the main action button.',
            },
            {
              index: 7,
              title: 'Image',
              id: 'image',
              type: 'upload',
              span: 12,
              o: false,
              info: "Image associated with the signup's basic info form.",
            },
          ],
        },
      ],
      edit: true,
      crmModelId: basicInfoModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalTrufalSignup BasicInfo',
    };
    const basicInfoFormResult = await formCollection.insertOne(basicInfoForm);

    save_file(formCollectionName, {
      ...basicInfoForm,
      _id: basicInfoFormResult.insertedId,
    });

    const passwordModelData = {
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalTrufalSignup Password',
      modelType: 'INNER',
      modelStatus: 'ACTIVE',
      properties: [
        { dataType: 'STRING', key: 'heading', name: 'Heading' },
        { dataType: 'STRING', key: 'description', name: 'Description' },
        { dataType: 'STRING', key: 'passwordlabel', name: 'Password Label' },
        {
          dataType: 'STRING',
          key: 'confirmPasswordLabel',
          name: 'Confirm Password Label',
        },
        { dataType: 'STRING', key: 'buttonText', name: 'Button Text' },
        { dataType: 'STRING', key: 'image', name: 'Image' },
      ],
      created: new Date(),
    };
    const passwordModelResult = await modelCollection.insertOne(
      passwordModelData
    );
    save_file(modelCollectionName, {
      ...passwordModelData,
      _id: passwordModelResult.insertedId,
    });

    const passwordForm = {
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
              info: 'Main heading for the password setup.',
            },
            {
              index: 1,
              title: 'Description',
              id: 'description',
              type: 'textarea',
              span: 12,
              o: false,
              info: 'Instructions for password criteria.',
            },
            {
              index: 2,
              title: 'Password Label',
              id: 'passwordlabel',
              type: 'password',
              span: 12,
              o: false,
              info: 'Enter your password.',
            },
            {
              index: 3,
              title: 'Confirm Password Label',
              id: 'confirmPasswordLabel',
              type: 'password',
              span: 12,
              o: false,
              info: 'Confirm your password.',
            },
            {
              index: 4,
              title: 'Button Text',
              id: 'buttonText',
              type: 'text',
              span: 12,
              o: false,
              info: 'Text for the submit button.',
            },
            {
              index: 5,
              title: 'Image',
              id: 'image',
              type: 'upload',
              span: 12,
              o: false,
              info: 'Image associated with the password setup form.',
            },
          ],
        },
      ],
      edit: true,
      crmModelId: passwordModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalTrufalSignup Password',
    };
    const passwordFormResult = await formCollection.insertOne(passwordForm);
    save_file(formCollectionName, {
      ...passwordForm,
      _id: passwordFormResult.insertedId,
    });

    const otpModelData = {
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalTrufalSignup OTP',
      modelType: 'INNER',
      modelStatus: 'ACTIVE',
      properties: [
        { dataType: 'STRING', key: 'title', name: 'Title' },
        { dataType: 'STRING', key: 'heading', name: 'Heading' },
        {
          dataType: 'STRING',
          key: 'emailaddresslabel',
          name: 'Email Address Label',
        },
        { dataType: 'STRING', key: 'otptitle', name: 'OTP Title' },
        { dataType: 'STRING', key: 'description', name: 'Description' },
        { dataType: 'STRING', key: 'buttonText', name: 'Button Text' },
        { dataType: 'STRING', key: 'image', name: 'Image' },
      ],
      created: new Date(),
    };
    const otpModelResult = await modelCollection.insertOne(otpModelData);
    save_file(modelCollectionName, {
      ...otpModelData,
      _id: otpModelResult.insertedId,
    });

    const otpForm = {
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
              span: 12,
              o: false,
              info: 'Title for the OTP verification.',
            },
            {
              index: 1,
              title: 'Heading',
              id: 'heading',
              type: 'text',
              span: 12,
              o: false,
              info: 'Main heading for the OTP verification.',
            },
            {
              index: 2,
              title: 'Description',
              id: 'description',
              type: 'textarea',
              span: 24,
              o: false,
              info: 'Additional details or instructions regarding OTP verification.',
            },
            {
              index: 3,
              title: 'Email Address Label',
              id: 'emailaddresslabel',
              type: 'email',
              span: 8,
              o: false,
              info: 'Email address for sending/receiving OTP.',
            },
            {
              index: 4,
              title: 'OTP Label',
              id: 'otptitle',
              type: 'number',
              span: 8,
              o: false,
              info: 'Field for entering the OTP.',
            },
            
            {
              index: 5,
              title: 'Button Text',
              id: 'buttonText',
              type: 'text',
              span: 12,
              o: false,
              info: 'Text for the verification button.',
            },
            {
              index: 6,
              title: 'Image',
              id: 'image',
              type: 'upload',
              span: 12,
              o: false,
              info: 'Image related to OTP verification.',
            },
          ],
        },
      ],
      edit: true,
      crmModelId: otpModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalTrufalSignup OTP',
    };
    const otpFormResult = await formCollection.insertOne(otpForm);
    save_file(formCollectionName, {
      ...otpForm,
      _id: otpFormResult.insertedId,
    });

    const mainModel = {
      accountId: '5d6590b3af790ca2bcc707b7',
      name: 'ReactGrid GlobalTrufalSignup',
      modelType: 'INNER',
      modelStatus: 'ACTIVE',
      properties: [
        {
          dataType: 'STRING',
          key: 'logo',
          name: 'Logo',
        },
        {
          dataType: 'INNER_MODEL',
          key: 'basicInfoForm',
          name: 'Basic Info Form',
          modelId: basicInfoModelResult.insertedId.toString(),
        },
        {
          dataType: 'INNER_MODEL',
          key: 'passwordForm',
          name: 'Password Form',
          modelId: passwordModelResult.insertedId.toString(),
        },
        {
          dataType: 'INNER_MODEL',
          key: 'otpForm',
          name: 'OTP Form',
          modelId: otpModelResult.insertedId.toString(),
        },
      ],
      created: new Date(),
    };
    const mainModelResult = await modelCollection.insertOne(mainModel);
    save_file(modelCollectionName, {
      ...mainModel,
      _id: mainModelResult.insertedId,
    });

    const mainForm = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Logo',
              id: 'logo',
              type: 'upload',
              span: 12,
              o: false,
              info: "Upload your organization's logo.",
            },
            {
              index: 1,
              title: 'Basic Info Form',
              id: 'basicInfoForm',
              type: 'inner_form',
              span: 24,
              o: false,
              meta: {
                crmFormId: basicInfoFormResult.insertedId.toString(),
              },
              info: 'Fill in the basic information form.',
            },
            {
              index: 2,
              title: 'Password Form',
              id: 'passwordForm',
              type: 'inner_form',
              span: 12,
              o: false,
              meta: {
                crmFormId: passwordFormResult.insertedId.toString(),
              },
              info: 'Set your password.',
            },
            {
              index: 3,
              title: 'OTP Form',
              id: 'otpForm',
              type: 'inner_form',
              span: 12,
              o: false,
              meta: {
                crmFormId: otpFormResult.insertedId.toString(),
              },
              info: 'Verify OTP for account security.',
            },
          ],
        },
      ],
      edit: true,
      crmModelId: mainModelResult.insertedId.toString(),
      gridTitle: 'ReactGrid GlobalTrufalSignup',
    };

    const mainFormResult = await formCollection.insertOne(mainForm);
    save_file(formCollectionName, {
      ...mainForm,
      _id: mainFormResult.insertedId,
    });

    console.log('ReactGrid GlobalTrufalSignup Models and Forms inserted successfully.');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
