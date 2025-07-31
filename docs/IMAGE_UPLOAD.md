# Project Image Upload API

This document describes how to use the project image upload functionality.

## Endpoints

### Upload Multiple Images

**POST** `/projects/{projectId}/upload-images`

Upload multiple images for a specific project. All images will be stored in AWS S3 and saved in the project's images array with the same type and caption.

#### Headers

- `Authorization: Bearer {jwt_token}`
- `Content-Type: multipart/form-data`

#### Form Data

- `images` (files): Multiple image files to upload (up to 10 files)
- `type` (optional): Image type enum applied to all images (EXTERIOR, INTERIOR, FLOOR_PLAN, AMENITY, LOCATION, CONSTRUCTION, OTHER)
- `caption` (optional): Caption applied to all images

#### File Restrictions

- **Allowed formats**: JPEG, JPG, PNG, WebP
- **Maximum size**: 5MB per file
- **Maximum files**: 10 files per request
- **Storage location**: `projects/{projectId}/images/` in S3

#### Response

```json
[
  {
    "url": "https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/filename1.jpg",
    "type": "EXTERIOR",
    "caption": "Front view of the building",
    "fileSize": 1024000,
    "mimeType": "image/jpeg"
  },
  {
    "url": "https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/filename2.jpg",
    "type": "EXTERIOR",
    "caption": "Front view of the building",
    "fileSize": 856000,
    "mimeType": "image/jpeg"
  }
]
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

#### Response

```json
{
  "message": "Image deleted successfully",
  "deletedImageUrl": "https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/filename.jpg",
  "remainingImagesCount": 4
}
```

## Usage Examples

### Using cURL

#### Upload Multiple Images

```bash
curl -X POST \
  http://localhost:3000/projects/{projectId}/upload-images \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'images=@/path/to/your/image1.jpg' \
  -F 'images=@/path/to/your/image2.jpg' \
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

#### Upload Multiple Images

```javascript
const formData = new FormData();
// Add multiple files
for (let i = 0; i < fileInput.files.length; i++) {
  formData.append('images', fileInput.files[i]);
}
formData.append('type', 'EXTERIOR');
formData.append('caption', 'Beautiful front view');

const response = await fetch(`/projects/${projectId}/upload-images`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const results = await response.json();
console.log(
  'Uploaded images:',
  results.map((r) => r.url),
);
```

#### Delete Image

```javascript
const response = await fetch(`/projects/${projectId}/images`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    imageUrl:
      'https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/filename.jpg',
  }),
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

The project entity stores image data as an array of objects with url, type, and caption:

```typescript
@Column({ type: 'json', nullable: true })
images: {
  url: string;
  type: string;
  caption: string;
}[];
```

Each uploaded image creates an object with the S3 URL, image type, and caption that gets added to this array. When images are deleted, the corresponding objects are removed from the array.
