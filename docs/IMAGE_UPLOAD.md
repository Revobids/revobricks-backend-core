# Project Image Upload API

This document describes how to use the project image upload functionality.

## Endpoints

### Upload Image
**POST** `/projects/{projectId}/upload-image`

Upload an image for a specific project. The image will be stored in AWS S3 and the URL will be saved in the project's images array.

#### Headers
- `Authorization: Bearer {jwt_token}`
- `Content-Type: multipart/form-data`

#### Form Data
- `image` (file): The image file to upload
- `type` (optional): Image type enum (EXTERIOR, INTERIOR, FLOOR_PLAN, AMENITY, LOCATION, CONSTRUCTION, OTHER)
- `caption` (optional): Caption for the image

#### File Restrictions
- **Allowed formats**: JPEG, JPG, PNG, WebP
- **Maximum size**: 5MB
- **Storage location**: `projects/{projectId}/images/` in S3

#### Response
```json
{
  "url": "https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/filename.jpg",
  "type": "EXTERIOR",
  "caption": "Front view of the building",
  "fileSize": 1024000,
  "mimeType": "image/jpeg"
}
```

### Delete Image
**DELETE** `/projects/{projectId}/images`

Remove an image from a project and delete it from S3.

#### Headers
- `Authorization: Bearer {jwt_token}`
- `Content-Type: application/json`

#### Body
```json
{
  "imageUrl": "https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/filename.jpg"
}
```

## Usage Examples

### Using cURL

#### Upload Image
```bash
curl -X POST \
  http://localhost:3000/projects/{projectId}/upload-image \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'image=@/path/to/your/image.jpg' \
  -F 'type=EXTERIOR' \
  -F 'caption=Beautiful front view'
```

#### Delete Image
```bash
curl -X DELETE \
  http://localhost:3000/projects/{projectId}/images \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "imageUrl": "https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/filename.jpg"
  }'
```

### Using JavaScript/Fetch

#### Upload Image
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('type', 'EXTERIOR');
formData.append('caption', 'Beautiful front view');

const response = await fetch(`/projects/${projectId}/upload-image`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log('Uploaded image URL:', result.url);
```

#### Delete Image
```javascript
const response = await fetch(`/projects/${projectId}/images`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageUrl: 'https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/filename.jpg'
  })
});
```

## Image Types

- `EXTERIOR`: Building exterior photos
- `INTERIOR`: Interior room photos
- `FLOOR_PLAN`: Floor plan images
- `AMENITY`: Amenity photos (gym, pool, etc.)
- `LOCATION`: Location and surrounding area photos
- `CONSTRUCTION`: Construction progress photos
- `OTHER`: Any other type of image

## Error Responses

### 400 Bad Request
- No image file provided
- Invalid file type
- File size too large (>5MB)

### 401 Unauthorized
- Missing or invalid JWT token

### 403 Forbidden
- User doesn't have permission (only ADMIN and MANAGER roles can upload)

### 404 Not Found
- Project not found
- Image not found (for delete operation)

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-north-1
AWS_S3_BUCKET_NAME=revobids-images
```

## Database Schema

The project entity stores image URLs as an array of strings:

```typescript
@Column({ type: 'json', nullable: true })
images: string[];
```

Each uploaded image URL is added to this array, and deleted images are removed from it.