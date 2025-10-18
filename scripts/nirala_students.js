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

    // Student Model
    const studentModelData = {
      properties: [
        { dataType: 'STRING', key: 'photoUrl', name: 'Photo URL' },
        { dataType: 'STRING', key: 'name', name: 'Student Name' },
        { dataType: 'STRING', key: 'fatherName', name: "Father's Name" },
        { dataType: 'STRING', key: 'class', name: 'Class' },
        { dataType: 'STRING', key: 'schoolName', name: 'School Name' },
        { dataType: 'STRING', key: 'mobileNo', name: 'Mobile No' },
        { dataType: 'STRING', key: 'address', name: 'Address' },
        { dataType: 'STRING', key: 'emailId', name: 'Email ID' },
      ],
      accountId: '5d6590b3af790ca2bcc707b7',
      collectionName: 'niralafoundation_student',
      baseModelId: '64822a187d5f915dc103d271',
      modelType: 'COLLECTION',
      modelStatus: 'ACTIVE',
      name: 'NiralaFoundation Student',
      created: new Date(),
    };
    // save to mongodb
    const studentModelDataResult = await modelCollection.insertOne(
      studentModelData
    );
    console.log(
      `Examination model inserted with ID: ${studentModelDataResult.insertedId}`
    );
    save_file(modelCollectionName, {
      ...studentModelData,
      _id: studentModelDataResult.insertedId,
    });

    const studentTableData = {
      gridType: 'table',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      crmModelId: studentModelDataResult.insertedId.toString(),
      gridTitle: 'All Students',
      apiUrl: '/admin/students',
      columns: [
        {
          index: 0,
          name: 'Photo',
          key: 'photoUrl',
          type: 'thumb',
          sort: false,
        },
        {
          index: 1,
          name: 'Name',
          key: 'name',
          type: 'text',
          sort: true,
        },
        {
          index: 2,
          name: "Father's Name",
          key: 'fatherName',
          type: 'text',
          sort: true,
        },
        {
          index: 3,
          name: 'Class',
          key: 'class',
          type: 'text',
          sort: true,
        },
        {
          index: 4,
          name: 'School Name',
          key: 'schoolName',
          type: 'text',
          sort: true,
        },
        {
          index: 5,
          name: 'Mobile No',
          key: 'mobileNo',
          type: 'text',
          sort: true,
        },
        {
          index: 6,
          name: 'Email ID',
          key: 'emailId',
          type: 'text',
          sort: true,
        },
        {
          index: 7,
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
              slug: '/admin/students/update?id=:_id',
              type: 'icon_button',
              icon: 'https://cdn-icons-png.flaticon.com/512/10015/10015359.png',
            },
          ],
        },
      ],
      createButton: {
        value: 'Add Student',
        slug: '/admin/students/create',
      },
      search: {
        placeHolder: 'Search by Student name or School',
      },
      created: new Date(),
    };

    // save to mongodb
    const studentTableDataResult = await formCollection.insertOne(
      studentTableData
    );

    console.log(
      `Student table inserted with ID: ${studentTableDataResult.insertedId}`
    );
    save_file(formCollectionName, {
      ...studentTableData,
      _id: studentTableDataResult.insertedId,
    });

    const studentFormData = {
      gridType: 'form',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      created: new Date(),
      edit: true,
      crmModelId: studentModelDataResult.insertedId.toString(),
      gridTitle: 'Student Form',
      rows: [
        {
          fields: [
            {
              index: 0,
              title: 'Photo',
              id: 'photoUrl',
              type: 'text',
              span: 8,
              o: false,
              info: "Upload the student's photo.",
            },
            {
              index: 1,
              title: 'Student Name',
              id: 'name',
              type: 'text',
              span: 8,
              o: false,
              info: 'Full name of the student.',
            },
            {
              index: 2,
              title: "Father's Name",
              id: 'fatherName',
              type: 'text',
              span: 8,
              o: false,
              info: "Father's full name.",
            },
            {
              index: 3,
              title: 'Class',
              id: 'class',
              type: 'text',
              span: 8,
              o: false,
              info: 'Class the student is enrolled in.',
            },
            {
              index: 4,
              title: 'School Name',
              id: 'schoolName',
              type: 'text',
              span: 16,
              o: false,
              info: 'Name of the school the student attends.',
            },
            {
              index: 5,
              title: 'Mobile No',
              id: 'mobileNo',
              type: 'text',
              span: 12,
              o: false,
              info: 'Contact mobile number.',
            },
            {
              index: 6,
              title: 'Email ID',
              id: 'emailId',
              type: 'email',
              span: 12,
              o: false,
              info: 'Email address of the student.',
            },
            {
              index: 7,
              title: 'Address',
              id: 'address',
              type: 'object',
              span: 24,
              o: false,
              info: 'Complete address of the student.',
            },
          ],
        },
      ],
      edit: true,
      backUrl: '/admin/students',
    };

    // save to mongodb
    const studentFormDataResult = await formCollection.insertOne(
      studentFormData
    );
    console.log(
      `Student form inserted with ID: ${studentFormDataResult.insertedId}`
    );
    save_file(formCollectionName, {
      ...studentFormData,
      _id: studentFormDataResult.insertedId,
    });

    const studentFormCreateGetApiData = {
      name: 'Add Student',
      action: 'CRM_GRID',
      gridType: 'form',
      apiType: 'GET',
      status: 'ACTIVE',
      accountId: '5d6590b3af790ca2bcc707b7',
      sourceId: studentFormDataResult.insertedId.toString(),
      path: '/admin/students/add',
      created: new Date(),
    };

    const studentFormCreateGetApiResult = await apiCollection.insertOne(
      studentFormCreateGetApiData
    );
    console.log(
      `Student form create API inserted with ID: ${studentFormCreateGetApiResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...studentFormCreateGetApiData,
      _id: studentFormCreateGetApiResult.insertedId,
    });

    const studentFormCreatePostAPI = {
      name: 'Create Student POST',
      action: 'FORM_SAVE',
      sourceId: studentFormDataResult.insertedId.toString(),
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'POST',
      path: '/admin/students/create',
      created: new Date(),
    };
    const studentFormCreatePostAPIResult = await apiCollection.insertOne(
      studentFormCreatePostAPI
    );
    console.log(
      `Student form create POST API inserted with ID: ${studentFormCreatePostAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...studentFormCreatePostAPI,
      _id: studentFormCreatePostAPIResult.insertedId,
    });

    const studentFormUpdateGetAPI = {
      name: 'Update Student',
      action: 'CRM_GRID',
      sourceId: studentFormDataResult.insertedId.toString(),
      gridType: 'form',
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'GET',
      path: '/admin/students/update',
      created: new Date(),
    };
    const studentFormUpdateGetAPIResult = await apiCollection.insertOne(
      studentFormUpdateGetAPI
    );
    console.log(
      `Student form update API inserted with ID: ${studentFormUpdateGetAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...studentFormUpdateGetAPI,
      _id: studentFormUpdateGetAPIResult.insertedId,
    });

    // student update post api
    const studentFormUpdatePostAPI = {
      name: 'Update Student POST',
      action: 'FORM_SAVE',
      sourceId: studentFormDataResult.insertedId.toString(),
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'POST',
      path: '/admin/students/update',
      created: new Date(),
    };
    const studentFormUpdatePostAPIResult = await apiCollection.insertOne(
      studentFormUpdatePostAPI
    );
    console.log(
      `Student form update POST API inserted with ID: ${studentFormUpdatePostAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...studentFormUpdatePostAPI,
      _id: studentFormUpdatePostAPIResult.insertedId,
    });

    // Create similar for student
    const studentTableAPI = {
      name: 'All Students',
      action: 'CRM_GRID',
      sourceId: studentTableDataResult.insertedId.toString(),
      gridType: 'table',
      accountId: '5d6590b3af790ca2bcc707b7',
      apiType: 'GET',
      path: '/admin/students',
      created: new Date(),
    };
    const studentTableAPIResult = await apiCollection.insertOne(
      studentTableAPI
    );
    console.log(
      `Student table API inserted with ID: ${studentTableAPIResult.insertedId}`
    );
    save_file(apiCollectionName, {
      ...studentTableAPI,
      _id: studentTableAPIResult.insertedId,
    });
    
    const studentsTablePostAPI = {
      "name": "All Students POST",
      "action": "CRM_GRID",
      "sourceId": "65c8a8ee49292ef0296fcba5",
      "gridType": "table",
      "accountId": "5d6590b3af790ca2bcc707b7",
      "apiType": "POST",
      "path": "/admin/students",
      "created": new Date()
  }
  const studentsTablePostAPIResult = await apiCollection.insertOne(
      studentsTablePostAPI
  );
  console.log(`Examination table API inserted with ID: ${studentsTablePostAPIResult.insertedId}`);
  save_file(apiCollectionName, {...studentsTablePostAPI, _id: studentsTablePostAPIResult.insertedId});


    console.log('Examination model and form inserted successfully.');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run();
