# Real Estate Developer Logo Upload

This document describes the logo upload functionality for real estate developers.

## Overview

The logo upload feature allows users to upload a logo image for a real estate developer. The image is stored in AWS S3 and the URL is saved in the developer's record.

## Endpoint

```
POST /real-estate-developers/:id/upload-logo
```

## Request

- **Method**: POST
- **Content-Type**: multipart/form-data
- **Authentication**: Bearer token required
- **Parameters**:
  - `id` (path parameter): Real estate developer ID (UUID)
  - `logo` (form field): Image file

## File Requirements

- **Supported formats**: JPEG, PNG, GIF, WebP
- **Maximum file size**: 5MB
- **Field name**: `logo`

## Response

```json
{
  "url": "https://cdn.example.com/logos/developers/uuid/logo.jpg",
  "fileSize": 1024000,
  "mimeType": "image/jpeg",
  "developerId": "uuid"
}
```

## S3 Storage Structure

Logo images are stored in the following S3 structure:
```
logos/
  developers/
    {developerId}/
      {filename}.{extension}
```

## Features

- **Automatic replacement**: If a developer already has a logo, the old one is automatically deleted when a new one is uploaded
- **CDN support**: Returns CDN URL if CloudFront is configured
- **Metadata**: Stores upload metadata including developer ID and upload type
- **Validation**: Validates file type and size before upload

## Usage Example

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "logo=@/path/to/logo.jpg" \
  http://localhost:3000/real-estate-developers/uuid/upload-logo
```

## Database Changes

The `real_estate_developers` table now includes a `logoUrl` column to store the logo URL.