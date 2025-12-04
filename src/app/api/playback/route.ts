import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';
import { getAllowedFileIds, getFileAccessToken } from '@/lib/googleDrive';

const prisma = new PrismaClient();

interface PlaybackResponse {
  playbackUrl: string;
}

export async function GET(request: Request): Promise<NextResponse<PlaybackResponse | { error: string }>> {
  try {
    // 1. Get current user
    const { userId } = await getCurrentUser();

    // 2. Extract fileId from query parameters
    const url = new URL(request.url);
    const fileId = url.searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'Missing fileId parameter' },
        { status: 400 }
      );
    }

    // 3. Get all courses for this user
    const userCourses = await prisma.userCourse.findMany({
      where: { userId },
      include: { course: true },
    });

    if (userCourses.length === 0) {
      return NextResponse.json(
        { error: 'User has no courses' },
        { status: 403 }
      );
    }

    // 4. Get drive folder IDs for all user's courses
    const driveFolderIds: string[] = [];

    for (const uc of userCourses) {
      const driveMap = await prisma.courseDriveMap.findUnique({
        where: { courseCode: uc.course.courseCode },
      });

      if (driveMap) {
        driveFolderIds.push(driveMap.driveFolderId);
      }
    }

    if (driveFolderIds.length === 0) {
      return NextResponse.json(
        { error: 'No drive folders found for user courses' },
        { status: 403 }
      );
    }

    // 5. Build set of allowed file IDs
    const allowedFileIds = await getAllowedFileIds(driveFolderIds);

    // 6. Validate that the requested fileId belongs to one of the user's courses
    if (!allowedFileIds.has(fileId)) {
      return NextResponse.json(
        { error: 'Access denied to this file' },
        { status: 403 }
      );
    }

    // 7. Get short-lived access token
    const accessToken = await getFileAccessToken(fileId);

    // 8. Return playback URL
    const playbackUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${accessToken}`;

    return NextResponse.json({ playbackUrl });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Invalid session') {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    console.error('Error in /api/playback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
