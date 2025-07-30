# Test Credentials for Backend-Core

## Database Seeding Information

The database has been seeded with test data using the script: `npm run seed`

## Login Credentials

All test accounts use the same password for convenience.

### Employee Accounts (Red Portal)

| Role | Username | Password | Email | Access Level |
|------|----------|----------|--------|--------------|
| Admin | `admin` | `admin123` | admin@dlf.in | Full system access |
| Manager 1 | `manager1` | `admin123` | manager1@dlf.in | Project management |
| Manager 2 | `manager2` | `admin123` | manager2@dlf.in | Project management |
| Sales Manager | `sales1` | `admin123` | sales1@dlf.in | Sales operations |
| Sales Manager | `sales2` | `admin123` | sales2@dlf.in | Sales operations |

### Test Data Created

- **Real Estate Developer**: DLF
- **Office**: DLF Head Office (New Delhi)
- **Projects**: 10 published projects across various cities
  - Mix of Residential, Commercial, and Mixed-Use properties
  - Different property types: Apartments, Villas, Plots, Offices, Shops, Warehouses
  - Cities: Gurugram, New Delhi, Noida, Faridabad

### API Endpoints

- **Employee Login**: `POST /auth/login`
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

### Notes

- All projects are published and ready for frontend testing
- Each project has assigned managers and sales executives
- Projects include floor plans, images, amenities, and pricing information
- The seeding script can be run again to reset the test data

### Re-seeding Database

To reset the test data, run:
```bash
npm run seed
```

---
⚠️ **WARNING**: These are test credentials only. Never use these in production!