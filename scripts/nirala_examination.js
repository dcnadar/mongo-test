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

    // Examination Model
    const examinationModelData = {
      properties: [
        { dataType: 'STRING', key: 'name', name: 'Examination Name' },
        { dataType: 'STRING', key: 'centerName', name: 'Center Name' },
        { dataType: 'STRING', key: 'guidelines', name: 'Guidelines' },
        {
          dataType: 'DOUBLE',
          key: 'registrationFee',
          name: 'Registration Fee',
        },
        { dataType: 'STRING', key: 'contactEmail', name: 'Contact Email' },
        { dataType: 'STRING', key: 'contactPhone', name: 'Contact Phone' },
        { dataType: 'STRING', key: 'examPattern', name: 'Exam Pattern' },
        { dataType: 'STRING', key: 'syllabus', name: 'Syllabus' },
        {
          dataType: 'DATE',
          key: 'registrationStarts',
          name: 'Registration Starts',
        },
        {
          dataType: 'DATE',
          key: 'lastDateOfSignup',
          name: 'Last Date of Signup',
        },
        {
          dataType: 'DATE',
          key: 'examStartDateTime',
          name: 'Exam Start DateTime',
        },
        { dataType: 'DATE', key: 'examEndDateTime', name: 'Exam End DateTime' },
        {
          dataType: 'DATE',
          key: 'admitCardRelease',
          name: 'Admit Card Release',
        },
        {
          dataType: 'DATE',
          key: 'resultDeclaration',
          name: 'Result Declaration',
        },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      collectionName: 'niralafoundation_examination',
      baseModelId: '64822a187d5f915dc103d271',
      modelType: 'COLLECTION',
      modelStatus: 'ACTIVE',
      name: 'Examination',
      created: new Date(),
    };
    const examinationModelResult = await modelCollection.insertOne(
      examinationModelData
    );
    console.log(
      `Examination model inserted with ID: ${examinationModelResult.insertedId}`
    );
    save_file(modelCollectionName, {
      ...examinationModelData,
      _id: examinationModelResult.insertedId,
    });

    // Examination Table with defined columns
    const examinationTableData = {
      gridType: 'table',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      crmModelId: examinationModelResult.insertedId.toString(),
      gridTitle: 'All Examinations',
      apiUrl: '/admin/exams',
      columns: [
        {
          index: 0,
          name: 'Name',
          key: 'name',
          type: 'text',
          sort: true,
        },
        {
          index: 1,
          name: 'Center Name',
          key: 'centerName',
          type: 'text',
          sort: true,
        },

        {
          index: 2,
          name: 'Registration Fee',
          key: 'registrationFee',
          type: 'number',
          sort: true,
          valueCondition: "return '<b>₹</b>' + this.registrationFee;",
        },
        {
          index: 3,
          name: 'Registration Starts',
          key: 'registrationStarts',
          type: 'date',
          sort: true,
        },
        {
          index: 4,
          name: 'Last Date of Signup',
          key: 'lastDateOfSignup',
          type: 'date',
          sort: true,
        },
        {
          index: 7,
          name: 'Admit Card Release',
          key: 'admitCardRelease',
          type: 'date',
          sort: true,
        },
        {
          index: 8,
          name: 'Result Declaration',
          key: 'resultDeclaration',
          type: 'date',
          sort: true,
        },
        {
          index: 9,
          name: 'Status',
          key: 'status',
          type: 'tag',
          sort: true,
        },

        {
          index: 3,
          name: 'Edit',
          key: 'edit',
          type: 'actions',
          show: true,
          align: 'right',
          sort: false,
          width: 100,
          actions: [
            {
              value: 'Edit',
              slug: '/admin/exams/update?id=:_id _id',
              type: 'icon_button',
              icon: 'https://cdn-icons-png.flaticon.com/512/10015/10015359.png',
            },
          ],
        },
      ],
      createButton: {
        value: 'Add Examination',
        slug: '/admin/exams/create',
      },
      search: {
        placeHolder: 'Search by Examination name',
      },
      created: new Date(),
    };

    const examinationTableResult = await formCollection.insertOne(
      examinationTableData
    );
    console.log(
      `Examination table inserted with ID: ${examinationTableResult.insertedId}`
    );
    save_file(formCollectionName, {
      ...examinationTableData,
      _id: examinationTableResult.insertedId,
    });

    // Examination Form with defined rows and fields
    const examinationFormData = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      rows: [
        {
          label: 'Examination Details',
          fields: [
            {
              index: 0,
              title: 'Examination Name',
              id: 'name',
              type: 'text',
              span: 8,
              o: false,
              info: 'Name of the examination.',
            },
            {
              index: 1,
              title: 'Center Name',
              id: 'centerName',
              type: 'text',
              span: 8,
              o: false,
              info: 'Name of the center hosting the examination.',
            },
            {
              index: 2,
              title: 'Registration Fee',
              id: 'registrationFee',
              type: 'number',
              span: 8,
              o: false,
              meta: {
                addonBefore: '₹',
              },
              info: 'Fee for registering for the examination.',
            },
            {
              index: 3,
              title: 'Guidelines',
              id: 'guidelines',
              type: 'text_editor',
              span: 24,
              o: false,
              info: 'Examination guidelines.',
            },
            {
              index: 4,
              title: 'Exam Pattern',
              id: 'examPattern',
              type: 'text_editor',
              span: 12,
              o: false,
              info: 'Pattern or format of the examination.',
            },
            {
              index: 5,
              title: 'Syllabus',
              id: 'syllabus',
              type: 'text_editor',
              span: 12,
              o: false,
              info: 'Detailed syllabus for the examination.',
            },
          ],
        },
        {
          label: 'Contact Information',
          fields: [
            {
              index: 6,
              title: 'Contact Email',
              id: 'contactEmail',
              type: 'email',
              span: 12,
              o: false,
              info: 'Email address for examination related queries.',
            },
            {
              index: 7,
              title: 'Contact Phone',
              id: 'contactPhone',
              type: 'string',
              span: 12,
              o: false,
              info: 'Phone number for examination related queries.',
            },
          ],
        },
        {
          label: 'Important Dates',
          fields: [
            {
              index: 8,
              title: 'Registration Starts',
              id: 'registrationStarts',
              type: 'date',
              span: 6,
              o: false,
              info: 'Start date for registration.',
            },
            {
              index: 9,
              title: 'Last Date of Signup',
              id: 'lastDateOfSignup',
              type: 'date',
              span: 6,
              o: false,
              info: 'Last date to sign up for the examination.',
            },
            {
              index: 10,
              title: 'Exam Start DateTime',
              id: 'examStartDateTime',
              type: 'datetime-local',
              span: 6,
              o: false,
              info: 'Start date and time of the examination.',
            },
            {
              index: 11,
              title: 'Exam End DateTime',
              id: 'examEndDateTime',
              type: 'datetime-local',
              span: 6,
              o: false,
              info: 'End date and time of the examination.',
            },
            {
              index: 12,
              title: 'Admit Card Release',
              id: 'admitCardRelease',
              type: 'date',
              span: 6,
              o: false,
              info: 'Date when admit cards will be released.',
            },
            {
              index: 13,
              title: 'Result Declaration',
              id: 'resultDeclaration',
              type: 'date',
              span: 6,
              o: false,
              info: 'Date when results will be declared.',
            },
          ],
        },
      ],
      edit: true,
      crmModelId: examinationModelResult.insertedId.toString(),
      backUrl: '/admin/exams',
      gridTitle: 'Add Examination',
    };

    const examinationFormResult = await formCollection.insertOne(
      examinationFormData
    );
    console.log(
      `Examination form inserted with ID: ${examinationFormResult.insertedId}`
    );
    save_file(formCollectionName, {
      ...examinationFormData,
      _id: examinationFormResult.insertedId,
    });

    const examinationFormCreateGetAPI = {
      name: 'Create Examination',
      action: 'CRM_GRID',
      sourceId: examinationFormResult.insertedId.toString(),
      gridType: 'form',
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'GET',
      path: '/admin/exams/create',
      created: new Date(),
    };
    const examinationFormCreateGetAPIResult = await apiCollection.insertOne(
      examinationFormCreateGetAPI
    );
    console.log(
      `Examination form create API inserted with ID: ${examinationFormCreateGetAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...examinationFormCreateGetAPI,
      _id: examinationFormCreateGetAPIResult.insertedId,
    });

    const examinationFormCreatePostAPI = {
      name: 'Create Examination POST',
      action: 'FORM_SAVE',
      sourceId: examinationFormResult.insertedId.toString(),
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'POST',
      path: '/admin/exams/create',
      created: new Date(),
    };
    const examinationFormCreatePostAPIResult = await apiCollection.insertOne(
      examinationFormCreatePostAPI
    );
    console.log(
      `Examination form create POST API inserted with ID: ${examinationFormCreatePostAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...examinationFormCreatePostAPI,
      _id: examinationFormCreatePostAPIResult.insertedId,
    });

    const examinationFormUpdateGetAPI = {
      name: 'Update Examination',
      action: 'CRM_GRID',
      sourceId: examinationFormResult.insertedId.toString(),
      gridType: 'form',
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'GET',
      path: '/admin/exams/update',
      created: new Date(),
    };
    const examinationFormUpdateGetAPIResult = await apiCollection.insertOne(
      examinationFormUpdateGetAPI
    );
    console.log(
      `Examination form update API inserted with ID: ${examinationFormUpdateGetAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...examinationFormUpdateGetAPI,
      _id: examinationFormUpdateGetAPIResult.insertedId,
    });

    const examinationFormUpdatePostAPI = {
      name: 'Update Examination POST',
      action: 'FORM_SAVE',
      sourceId: examinationFormResult.insertedId.toString(),
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'POST',
      path: '/admin/exams/update',
      created: new Date(),
    };
    const examinationFormUpdatePostAPIResult = await apiCollection.insertOne(
      examinationFormUpdatePostAPI
    );
    console.log(
      `Examination form update POST API inserted with ID: ${examinationFormUpdatePostAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...examinationFormUpdatePostAPI,
      _id: examinationFormUpdatePostAPIResult.insertedId,
    });

    const examinationTableAPI = {
      name: 'All Examination',
      action: 'CRM_GRID',
      sourceId: examinationTableResult.insertedId.toString(),
      gridType: 'table',
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'GET',
      path: '/admin/exams',
      created: new Date(),
    };
    const examinationTableAPIResult = await apiCollection.insertOne(
      examinationTableAPI
    );
    console.log(
      `Examination table API inserted with ID: ${examinationTableAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...examinationTableAPI,
      _id: examinationTableAPIResult.insertedId,
    });

    console.log('Examination model and form inserted successfully.');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
