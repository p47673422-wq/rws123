import { google } from 'googleapis';

// Minimal typing to avoid heap issues
interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

interface DriveFile {
  id: string | null | undefined;
  name: string | null | undefined;
  mimeType?: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface DriveFolder {
  id: string | null | undefined;
  name: string | null | undefined;
  createdTime?: string;
  modifiedTime?: string;
}

/**
 * Initialize Google Drive client with service account credentials
 */
function getGoogleDriveClient() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set');
  }

  let credentials: ServiceAccountCredentials;
  try {
    credentials = JSON.parse(serviceAccountJson);
  } catch (error) {
    throw new Error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON');
  }

  // Use require to avoid type complexity
  const { JWT } = require('google-auth-library');
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });
  return { drive, auth };
}

/**
 * List all date-wise subfolders in a given drive folder
 */
export async function listDateFolders(driveFolderId: string): Promise<DriveFolder[]> {
  try {
    const { drive } = getGoogleDriveClient();

    const response = await drive.files.list({
      q: `'${driveFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name, createdTime, modifiedTime)',
      pageSize: 1000,
    });

    return (response.data.files as DriveFolder[]) || [];
  } catch (error) {
    console.error('Error listing date folders:', error);
    throw new Error('Failed to list date folders from Google Drive');
  }
}

/**
 * List all video files in a given folder
 */
export async function listVideoFiles(folderId: string): Promise<DriveFile[]> {
  try {
    const { drive } = getGoogleDriveClient();

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'video/' and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name, mimeType, size, createdTime, modifiedTime)',
      pageSize: 1000,
    });

    return (response.data.files as DriveFile[]) || [];
  } catch (error) {
    console.error('Error listing video files:', error);
    throw new Error('Failed to list video files from Google Drive');
  }
}

/**
 * Get a short-lived access token for a specific file
 * This token can be used to create a playback URL
 */
export async function getFileAccessToken(fileId: string): Promise<string> {
  try {
    const { auth } = getGoogleDriveClient();
    const accessToken = await auth.getAccessToken();
    return accessToken.token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get access token from Google Drive');
  }
}

/**
 * Recursively collect all allowed file IDs for a user based on their courses
 */
export async function getAllowedFileIds(driveFolderIds: string[]): Promise<Set<string>> {
  const allowedFileIds = new Set<string>();

  try {
    for (const driveFolderId of driveFolderIds) {
      const dateFolders = await listDateFolders(driveFolderId);

      for (const dateFolder of dateFolders) {
        if (!dateFolder.id) continue;
        const videoFiles = await listVideoFiles(dateFolder.id);

        for (const videoFile of videoFiles) {
          if (videoFile.id) {
            allowedFileIds.add(videoFile.id);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error collecting allowed file IDs:', error);
    throw error;
  }

  return allowedFileIds;
}
