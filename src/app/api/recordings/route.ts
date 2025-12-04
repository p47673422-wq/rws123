import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';
import { listDateFolders, listVideoFiles } from '@/lib/googleDrive';

const prisma = new PrismaClient();

interface VideoFile {
  fileId: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
}

interface Folder {
  folderId: string;
  folderName: string;
  files: VideoFile[];
}

interface CourseData {
  courseCode: string;
  courseName: string;
  folders: Folder[];
}

interface RecordingsResponse {
  courses: CourseData[];
}

export async function GET(): Promise<NextResponse<RecordingsResponse | { error: string }>> {
  try {
    // 1. Get current user
    const { userId } = await getCurrentUser();

    // 2. Query user_course to get all course_code for this user
    const userCourses = await prisma.userCourse.findMany({
      where: { userId },
      include: { course: true },
    });

    if (userCourses.length === 0) {
      return NextResponse.json({ courses: [] });
    }

    // 3. Query course_drive_map to get (course_name, drive_folder_id) for those course_code
    const coursesWithDrives = await Promise.all(
      userCourses.map(async (uc) => {
        const driveMap = await prisma.courseDriveMap.findUnique({
          where: { courseCode: uc.course.courseCode },
        });
        return {
          courseCode: uc.course.courseCode,
          courseName: uc.course.courseName,
          driveFolderId: driveMap?.driveFolderId,
        };
      })
    );

    // 4. For each course, list subfolders and video files
    const courses: CourseData[] = [];

    for (const courseData of coursesWithDrives) {
      if (!courseData.driveFolderId) {
        continue; // Skip if no drive folder ID
      }

      try {
        const dateFolders = await listDateFolders(courseData.driveFolderId);

        const folders: Folder[] = [];

        for (const dateFolder of dateFolders) {
          const videoFiles = await listVideoFiles(dateFolder.id!);

          const files: VideoFile[] = videoFiles.map((file) => ({
            fileId: file.id!,
            name: file.name!,
            mimeType: file.mimeType || '',
            size: file.size,
            createdTime: file.createdTime,
          }));

          if (files.length > 0) {
            folders.push({
              folderId: dateFolder.id!,
              folderName: dateFolder.name!,
              files,
            });
          }
        }

        courses.push({
          courseCode: courseData.courseCode,
          courseName: courseData.courseName,
          folders,
        });
      } catch (error) {
        console.error(
          `Error listing recordings for course ${courseData.courseCode}:`,
          error
        );
        // Continue with other courses even if one fails
      }
    }

    return NextResponse.json({ courses });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Invalid session') {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    console.error('Error in /api/recordings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
