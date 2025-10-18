# sc-crm-mongo-data

MongoDB collection data management repository for CRM systems. This repository contains JSON data files organized by application/entity and provides automated tools for importing data into MongoDB.

## 📁 Repository Structure

```
.
├── eduempower/          # EduEmpower CRM data
├── eduempower_admin/    # EduEmpower Admin data
├── jobdrive/            # JobDrive CRM data
├── poultry/             # Poultry management data
├── radyfy_entity/       # Radyfy entity data
├── sc_crm/              # SC CRM data
├── sc_crm_builder/      # SC CRM Builder data
├── zapu/                # Zapu data
├── zenspire/            # Zenspire data
└── scripts/             # Helper scripts
```

Each folder contains collections organized as subdirectories (e.g., `crm_api/`, `crm_grid/`, `crm_model/`, `account/`, etc.) with JSON files representing individual MongoDB documents.

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB instance (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/PlayTechServices/sc-crm-mongo-data.git
cd sc-crm-mongo-data

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
# MongoDB connection URI
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Database name to use
DB_NAME=your_database_name

# Folder name containing the JSON files to import
FOLDER_NAME=eduempower
```

**Environment Variables:**
- `MONGO_URI`: Your MongoDB connection string
- `DB_NAME`: Target database name
- `FOLDER_NAME`: Folder to import (e.g., `eduempower`, `sc_crm`, `radyfy_entity`)

### Local Usage

Run the import script:

```bash
node save_all_json_to_mongo.js
```

This will:
1. Connect to your MongoDB instance
2. Read all JSON files from the specified folder
3. Delete existing documents with matching `accountId`
4. Import all documents into their respective collections
5. Update timestamps automatically

## 🤖 GitHub Actions Automation

### Automated MongoDB Import Workflow

This repository includes a GitHub Actions workflow that automatically imports JSON data into MongoDB.

#### Setup GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Description | Required |
|------------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `DB_NAME` | Default database name | Optional* |
| `FOLDER_NAME` | Default folder name | Optional* |

*Required if not using manual trigger with custom inputs

#### Manual Trigger

1. Go to **Actions** tab
2. Select **Push MongoDB Collection Data**
3. Click **Run workflow**
4. Enter:
   - **folder_name**: e.g., `eduempower`, `sc_crm`, `radyfy_entity`
   - **db_name**: e.g., `eduempower_prod`
5. Click **Run workflow**

#### Auto-Trigger

The workflow automatically runs when:
- Changes are pushed to `main` or `master` branch
- Modified files include JSON files or the import script

📚 **Detailed workflow documentation**: [.github/workflows/README.md](.github/workflows/README.md)

## 📜 Available Scripts

### `save_all_json_to_mongo.js`
Main script for importing JSON files into MongoDB collections.

**Features:**
- Batch import from folder structure
- Automatic `accountId`-based cleanup (prevents duplicates)
- Timestamp management (`created` and `updated` fields)
- MongoDB ObjectId conversion
- Error handling and logging

### Other Scripts

- `create_json.js` - Create JSON files from data
- `fetch_json.js` - Fetch JSON data
- `sync_db_data.js` - Synchronize database data
- `get_last_commit.js` - Get last git commit info
- `add_section_info.js` - Add section information

## 🗂️ Data Collections

Common collections across applications:
- `account` - Account/organization data
- `account_tag` - Account tagging system
- `app` - Application configurations
- `app_menu` - Menu structures
- `crm_api` - API endpoint definitions
- `crm_grid` - Grid/table configurations
- `crm_model` - Data model definitions
- `ecom_account` - E-commerce account data
- `permission` - Permission settings
- `role` - Role definitions
- `user` - User data

## 🔒 Security Best Practices

- ✅ Never commit `.env` files or credentials
- ✅ Use GitHub Secrets for CI/CD
- ✅ Ensure MongoDB allows connections from GitHub Actions IPs
- ✅ Use MongoDB users with appropriate permissions only
- ✅ Enable IP whitelisting in MongoDB Atlas

## 🛠️ Troubleshooting

### Connection Issues
```
Error: Failed to connect to MongoDB
```
**Solution:** Verify `MONGO_URI` is correct and MongoDB is accessible

### Import Failures
```
Error importing file to collection
```
**Solutions:**
- Check JSON file validity
- Verify collection names match folder structure
- Ensure MongoDB user has insert/delete permissions

### Missing Environment Variables
```
Error: Cannot read properties of undefined
```
**Solution:** Ensure all required environment variables are set in `.env` or GitHub Secrets

## 📊 MongoDB Collection Structure

Each JSON file represents a document with this structure:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "accountId": "account_id_here",
  "created": "2024-01-15T10:30:00.000Z",
  "updated": "2024-01-15T10:30:00.000Z",
  // ... other fields
}
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally before pushing
4. Create a pull request

## 📝 License

ISC

## 🔗 Links

- [GitHub Repository](https://github.com/PlayTechServices/sc-crm-mongo-data)
- [Issues](https://github.com/PlayTechServices/sc-crm-mongo-data/issues)

## 📞 Support

For questions or issues, please open an issue on GitHub.
