'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, X, AlertCircle, Loader2, Home } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface VideoFile {
  fileId: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  viewerUrl: string;
}

interface Folder {
  folderId: string;
  folderName: string;
  files: VideoFile[];
}

interface Course {
  courseCode: string;
  courseName: string;
  folders: Folder[];
}

interface RecordingsResponse {
  courses: Course[];
}

interface PlaybackResponse {
  playbackUrl: string;
}

// ============================================================================
// Main Component
// ============================================================================

export default function RecordingsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [selectedVideoName, setSelectedVideoName] = useState<string | null>(null);
  const [playbackLoading, setPlaybackLoading] = useState(false);

  // Fetch recordings on mount
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/recordings');

        if (!response.ok) {
          throw new Error(`Failed to fetch recordings: ${response.statusText}`);
        }

        const data: RecordingsResponse = await response.json();
        setCourses(data.courses);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  // Close playback modal
  const closePlayback = () => {
    setPlaybackUrl(null);
    setSelectedVideoName(null);
  };

  // Get selected course
  const selectedCourse = courses.find((c) => c.courseCode === selectedCourseCode);

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 relative overflow-hidden">
      {/* Spiritual watermark background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 text-9xl font-bold text-amber-900">
          Sita Ram
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-2">
            📚 Your Recordings
          </h1>
          <p className="text-lg text-amber-700">
            {selectedCourse
              ? 'Browse and watch your course lectures'
              : 'Secure access to course recordings'}
          </p>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
            <p className="text-lg text-amber-700 font-semibold">
              Loading your recordings… Sita Ram 🙏
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4 text-5xl">📭</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              No recordings assigned yet
            </h2>
            <p className="text-amber-700">
              Please contact the course coordinator to get access to course recordings.
            </p>
          </div>
        )}

        {/* Your Courses View */}
        {!loading && courses.length > 0 && !selectedCourse && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <button
                key={course.courseCode}
                onClick={() => setSelectedCourseCode(course.courseCode)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-900 mb-1">
                      {course.courseName}
                    </h3>
                    <p className="text-sm text-amber-600 mb-3">
                      Zoom recordings – secure access
                    </p>
                  </div>
                  <div className="text-2xl">🎥</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                  <span className="text-sm text-amber-700 font-semibold">
                    {course.folders.length} {course.folders.length === 1 ? 'Lecture' : 'Lectures'}
                  </span>
                  <span className="text-amber-600 font-bold">→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Course Detail View */}
        {!loading && selectedCourse && (
          <div>
            {/* Back button / breadcrumb */}
            <button
              onClick={() => {
                setSelectedCourseCode(null);
                setExpandedFolders(new Set());
              }}
              className="mb-6 inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to your courses
            </button>

            {/* Course header */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-8 mb-8 border border-amber-200">
              <h2 className="text-3xl font-bold text-amber-900 mb-2">
                {selectedCourse.courseName}
              </h2>
              <p className="text-amber-700">
                {selectedCourse.folders.length} {selectedCourse.folders.length === 1 ? 'lecture folder' : 'lecture folders'}
              </p>
            </div>

            {/* Folders and files */}
            <div className="space-y-4">
              {selectedCourse.folders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-amber-700">No lectures available in this course.</p>
                </div>
              ) : (
                selectedCourse.folders.map((folder) => (
                  <div
                    key={folder.folderId}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* Folder header */}
                    <button
                      onClick={() => toggleFolder(folder.folderId)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-amber-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <ChevronDown
                          className={`w-5 h-5 text-amber-600 transition-transform ${
                            expandedFolders.has(folder.folderId) ? 'rotate-180' : ''
                          }`}
                        />
                        <div className="text-left">
                          <h3 className="font-semibold text-amber-900">
                            📅 {folder.folderName}
                          </h3>
                          <p className="text-sm text-amber-600">
                            {folder.files.length} {folder.files.length === 1 ? 'video' : 'videos'}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Folder content */}
                    {expandedFolders.has(folder.folderId) && (
                      <div className="border-t border-amber-100 bg-amber-50 px-6 py-4 space-y-3">
                        {folder.files.map((file) => {
                          const createdDate = file.createdTime
                            ? new Date(file.createdTime).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Unknown date';

                          return (
                            <button
                              key={file.fileId}
                              onClick={() => window.open(file.viewerUrl, "_blank")}
                              className="w-full flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group cursor-pointer border border-amber-100 hover:border-amber-300"
                            >
                              <Play className="w-5 h-5 text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="text-left flex-1 min-w-0">
                                <h4 className="font-semibold text-amber-900 truncate">
                                  {file.name}
                                </h4>
                                <p className="text-sm text-amber-600">
                                  {createdDate}
                                </p>
                              </div>
                              <span className="text-amber-600 text-xl">→</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Playback Modal */}
      {playbackUrl && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-amber-900 truncate">
                  {selectedVideoName}
                </h3>
              </div>
              <button
                onClick={closePlayback}
                className="ml-4 p-2 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-amber-600" />
              </button>
            </div>

            {/* Video player */}
            <div className="bg-black relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                src={playbackUrl}
                controls
                autoPlay
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-amber-50 text-sm text-amber-700">
              <p>🔒 Secure playback – Access is restricted to your enrolled courses.</p>
            </div>
          </div>
        </div>
      )}

      {/* Playback Loading State */}
      {playbackLoading && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-amber-700 font-semibold">
              Preparing secure playback…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
