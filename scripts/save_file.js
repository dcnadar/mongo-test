import fs from 'fs';
import path from 'path';

export function save_file(collection, jsonData) {
  try {
    fs.writeFileSync(
      path.join(
        path.join('sc_crm', collection),
        `${result.insertedId}.json`
      ),
      JSON.stringify(jsonData, null, 4)
    );
  } catch (err) {
    console.log(err);
  }
}
