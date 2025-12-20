"use client";
import { X, Download, RefreshCcw } from "lucide-react";

export default function PWASnackbar({
  type,
  onAction,
  onClose,
}: {
  type: "install" | "update";
  onAction: () => void;
  onClose: () => void;
}) {
  const isInstall = type === "install";

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[92%] max-w-md">
      <div className="flex items-center gap-3 rounded-xl bg-white/95 backdrop-blur shadow-lg px-4 py-3 border">
        {isInstall ? (
          <Download className="text-pink-600" />
        ) : (
          <RefreshCcw className="text-yellow-600" />
        )}

        <div className="flex-1 text-sm">
          <p className="font-semibold">
            {isInstall ? "Install App" : "Update Available"}
          </p>
          <p className="text-gray-600">
            {isInstall
              ? "Get krishna touch"
              : "New version is ready"}
          </p>
        </div>

        <button
          onClick={onAction}
          className={`px-3 py-1.5 rounded-lg text-white text-sm ${
            isInstall ? "bg-pink-600" : "bg-yellow-500 text-black"
          }`}
        >
          {isInstall ? "Install" : "Update"}
        </button>

        <button onClick={onClose}>
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
