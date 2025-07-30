# Folder Structure

This document explains the organized folder structure of the backend-core project.

## Root Directory Structure

```
backend-core/
├── docs/                    # Documentation files
│   ├── DATABASE_SETUP.md    # Database setup instructions
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── TEST_CREDENTIALS.md  # Test login credentials
│   └── FOLDER_STRUCTURE.md  # This file
├── deployment/              # Deployment related files
│   ├── docker-compose.yml   # Docker compose configuration
│   └── render-build.sh      # Render.com build script
├── config/                  # Configuration files
│   └── revobricks-firebase-adminsdk.json  # Firebase admin SDK
├── scripts/                 # Database and utility scripts
│   └── rename-users-to-employees.sql      # SQL migration script
├── src/                     # Source code (main application)
├── test/                    # Test files
├── .env                     # Environment variables
├── package.json             # Project dependencies and scripts
└── README.md                # Main project documentation
```

## Key Folders

### `/docs`
Contains all documentation files including setup guides, deployment instructions, and test credentials.

### `/deployment`  
Contains deployment-related files like Docker configurations and build scripts.

### `/config`
Contains configuration files that are not part of the main source code.

### `/scripts`
Contains utility scripts like database migrations and setup scripts.

### `/src`
Main application source code - organized by NestJS conventions with modules, entities, services, etc.

## Environment Files

- `.env` - Contains only essential environment variables
- Removed unused TypeORM and Firebase configuration variables
- Simplified structure for clarity