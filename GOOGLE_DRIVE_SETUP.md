# Google Drive Video Recordings Integration - Setup Guide

## Installation

Add `googleapis` to your `package.json` dependencies:

```bash
npm install googleapis
```

Or manually add to `package.json`:
```json
"googleapis": "^144.0.0"
```

## Environment Variables

Set the following environment variable in your `.env.local` or deployment configuration:

```
GOOGLE_SERVICE_ACCOUNT_JSON=<your-service-account-json-as-string>
```

The service account JSON should contain:
- `type`: "service_account"
- `project_id`: your Google Cloud project ID
- `private_key`: the private key for the service account
- `client_email`: the service account email

Example:
```
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project","private_key":"-----BEGIN PRIVATE KEY-----...","client_email":"...@...iam.gserviceaccount.com"}
```

## Files Created

### 1. `/src/lib/googleDrive.ts`
- **getGoogleDriveClient()**: Initializes JWT authentication with Google Drive API
- **listDateFolders()**: Lists all subfolders (date-wise) in a drive folder
- **listVideoFiles()**: Lists all video files in a folder
- **getFileAccessToken()**: Obtains short-lived access token for file playback
- **getAllowedFileIds()**: Recursively collects all allowed file IDs for a user

### 2. `/src/lib/auth.ts`
- **getCurrentUser()**: Extracts and validates user from session cookie
- Uses JWT verification with `process.env.JWT_SECRET`

### 3. `/src/app/api/recordings/route.ts` (GET)
- Authenticates the user
- Queries `UserCourse` to get all courses for the user
- Queries `CourseDriveMap` to get drive folder IDs
- Lists all date folders and video files from Google Drive
- Returns structured JSON with courses, folders, and videos

**Response:**
```json
{
  "courses": [
    {
      "courseCode": "CS101",
      "courseName": "Computer Science 101",
      "folders": [
        {
          "folderId": "drive-folder-id",
          "folderName": "2024-12-04",
          "files": [
            {
              "fileId": "video-file-id",
              "name": "Lecture 1.mp4",
              "mimeType": "video/mp4",
              "size": "524288000",
              "createdTime": "2024-12-04T10:30:00Z"
            }
          ]
        }
      ]
    }
  ]
}
```

### 4. `/src/app/api/playback/route.ts` (GET)
- Accepts query parameter: `fileId`
- Authenticates the user
- Validates that the file belongs to one of the user's courses
- Obtains short-lived access token
- Returns playback URL

**Query Parameters:**
- `fileId` (required): The Google Drive file ID to play

**Response:**
```json
{
  "playbackUrl": "https://www.googleapis.com/drive/v3/files/FILE_ID?alt=media&access_token=TOKEN"
}
```

**Error Responses:**
- `400`: Missing fileId parameter
- `401`: User not authenticated
- `403`: Access denied to this file or no courses found
- `500`: Internal server error

## Database Models (Already Exist)

The implementation uses these existing Prisma models:

- **User_a**: User with id, name, email, mobile
- **Course**: Contains courseCode, courseName, description
- **CourseDriveMap**: Maps courseCode to driveFolderId
- **UserCourse**: Junction table linking userId to courseCode

## Usage

### Get all recordings for authenticated user:
```bash
curl -H "Cookie: session=<jwt-token>" \
  http://localhost:3000/api/recordings
```

### Get playback URL for a specific video:
```bash
curl -H "Cookie: session=<jwt-token>" \
  "http://localhost:3000/api/playback?fileId=GOOGLE_DRIVE_FILE_ID"
```

## Security Notes

✅ **Implemented:**
- JWT authentication via session cookie
- Access control: Users can only access files from their enrolled courses
- Short-lived access tokens (standard Google OAuth 2.0 behavior)
- Private keys not exposed in responses
- Read-only scope for Google Drive

⚠️ **Important:**
- Never expose `GOOGLE_SERVICE_ACCOUNT_JSON` in client-side code
- The service account should have minimal permissions (read-only Drive access)
- Access tokens are short-lived (typically 1 hour by default)
- For production, ensure proper CORS and rate limiting

## Deployment (Vercel)

1. Add environment variable in Vercel project settings:
   - Name: `GOOGLE_SERVICE_ACCOUNT_JSON`
   - Value: Your service account JSON string

2. No additional setup needed - googleapis works on Vercel serverless functions

## Error Handling

All endpoints include comprehensive error handling:
- Authentication errors return 401
- Authorization errors return 403
- Invalid parameters return 400
- Server errors return 500 with descriptive messages
