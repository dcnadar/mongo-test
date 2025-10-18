import AWS from 'aws-sdk';
const s3 = new AWS.S3();

/**
 * Copies all objects from a specific folder in a source branch (prefix) to the same folder in a destination branch.
 * 
 * @param {string} folderName - The folder name to be copied.
 * @param {string} sourceBucket - The source branch (prefix) where the folder exists.
 * @param {string} destinationBucket - The destination branch (prefix) where the folder should be copied.
 */
async function copyS3Folder(folderName, sourceBucket, destinationBucket) {
  // Construct source and destination prefixes.
  const sourcePrefix = `${folderName}/`;
  const destinationPrefix = `${folderName}/`;
  
  let continuationToken = null;
  
  do {
    // List objects under the source prefix.
    const listParams = {
      Bucket: sourceBucket,
      Prefix: sourcePrefix,
      ContinuationToken: continuationToken
    };
    
    const data = await s3.listObjectsV2(listParams).promise();
    
    if (!data.Contents || data.Contents.length === 0) {
      console.log('No objects found under:', sourcePrefix);
      return;
    }
    
    // Iterate over each object and copy it to the destination prefix.
    for (const object of data.Contents) {
      const sourceKey = object.Key;
      // Replace the source prefix with the destination prefix.
      const destinationKey = sourceKey.replace(sourcePrefix, destinationPrefix);
      
      const copyParams = {
        Bucket: destinationBucket,
        CopySource: encodeURIComponent(`${sourceBucket}/${sourceKey}`),
        Key: destinationKey
      };
      
      await s3.copyObject(copyParams).promise();
      console.log(`Copied ${sourceKey} to ${destinationKey}`);
    }
    
    // Check if there are more objects to process.
    continuationToken = data.IsTruncated ? data.NextContinuationToken : null;
  } while (continuationToken);
}

// Example usage:
// copyS3Folder('myFolder', 'source-bucket', 'destination-bucket')
//   .then(() => console.log('Copy complete'))
//   .catch(err => console.error('Error copying folder:', err));

// Copy the 'dato' folder from one bucket to another
copyS3Folder('66629d6de2144644664d9bb4', 'trufal-staging', 'trlm-poultry')
  .then(() => console.log('Copy complete'))
  .catch(err => console.error('Error copying folder:', err));
