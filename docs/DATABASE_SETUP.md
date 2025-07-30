# Database Setup and Management

## Neon.tech Database Configuration

This project uses Neon.tech as the cloud PostgreSQL database for development and production.

### Database Connection Details

- **Host**: `ep-sparkling-dust-a17fmz3t-pooler.ap-southeast-1.aws.neon.tech`
- **Database**: `revobricks_db`
- **User**: `neondb_owner`
- **Port**: `5432`
- **Connection URL**: `postgresql://neondb_owner:npg_fTRpCg80xbEM@ep-sparkling-dust-a17fmz3t-pooler.ap-southeast-1.aws.neon.tech/revobricks_db?sslmode=require&channel_binding=require`

## Environment Setup

### 1. Copy Environment File
```bash
cp .env.development .env
```

### 2. Environment Variables
The `.env.development` file contains the Neon.tech database configuration. Make sure these variables are set:

```env
NODE_ENV=development
DATABASE_URL=postgresql://neondb_owner:npg_fTRpCg80xbEM@ep-sparkling-dust-a17fmz3t-pooler.ap-southeast-1.aws.neon.tech/revobricks_db?sslmode=require&channel_binding=require
TYPEORM_SYNCHRONIZE=true
```

## Database Management Scripts

### 🔄 Sync Database Schema (After Entity Changes)
When you modify entities, run this to sync the database schema:
```bash
npm run db:sync
```
This will:
- Apply entity changes to the database
- Add new columns/tables
- Update indexes and constraints
- **Preserve existing data**

### 🗑️ Reset Database (Complete Reset)
To completely reset the database and start fresh:
```bash
npm run db:reset
```
⚠️ **WARNING**: This will delete ALL data!

### 🌱 Seed Test Data
To populate the database with test data:
```bash
npm run seed
```

### 🚀 Complete Setup (Reset + Seed)
To reset database and add test data in one command:
```bash
npm run db:setup
```

## Development Workflow

### When You Change Entities:

1. **Modify your entity files** (e.g., add new columns, relationships)
2. **Sync the database**: `npm run db:sync`
3. **Test your changes**: `npm run start:dev`

### When You Need Fresh Test Data:

1. **Reset and seed**: `npm run db:setup`
2. **Or just seed**: `npm run seed`

### When Starting Fresh:

1. **Set up environment**: `cp .env.development .env`
2. **Install dependencies**: `npm install`
3. **Setup database**: `npm run db:setup`
4. **Start development**: `npm run start:dev`

## Direct Database Access

### Using psql
```bash
psql 'postgresql://neondb_owner:npg_fTRpCg80xbEM@ep-sparkling-dust-a17fmz3t-pooler.ap-southeast-1.aws.neon.tech/revobricks_db?sslmode=require&channel_binding=require'
```

### Using Database GUI Tools
- **Host**: `ep-sparkling-dust-a17fmz3t-pooler.ap-southeast-1.aws.neon.tech`
- **Port**: `5432`
- **Database**: `revobricks_db`
- **Username**: `neondb_owner`
- **Password**: `npg_fTRpCg80xbEM`
- **SSL**: Required

## TypeORM Configuration

The TypeORM configuration automatically:
- Uses `DATABASE_URL` if available (recommended for Neon.tech)
- Falls back to individual DB parameters
- Enables synchronization in development
- Uses SSL for production/cloud databases

## Troubleshooting

### Connection Issues
1. Check your internet connection
2. Verify the DATABASE_URL is correct in your `.env` file
3. Ensure SSL is enabled for Neon.tech connections

### Schema Sync Issues
1. Try `npm run db:reset` for a fresh start
2. Check entity definitions for TypeScript errors
3. Review console output for detailed error messages

### Seed Data Issues
1. Ensure database is synced first: `npm run db:sync`
2. Check that all entities are properly registered in `typeorm.config.ts`
3. Review seed script logs for specific errors

## Available Scripts Summary

| Script | Purpose | Data Safety |
|--------|---------|-------------|
| `npm run db:sync` | Sync schema changes | ✅ Preserves data |
| `npm run db:reset` | Reset database | ❌ Deletes all data |
| `npm run seed` | Add test data | ✅ Adds to existing |
| `npm run db:setup` | Reset + Seed | ❌ Deletes then adds |

---

💡 **Tip**: Use `npm run db:sync` most of the time when developing. Only use `npm run db:reset` when you need a completely fresh start.