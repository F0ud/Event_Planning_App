"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditProfileFormProps {
  name: string;
  bio: string;
  location: string;
}

export default function EditProfileForm({
  name: initialName,
  bio: initialBio,
  location: initialLocation,
}: EditProfileFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, location }),
      });

      if (res.ok) {
        setEditing(false);
        router.refresh();
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-700"
      >
        Edit Profile
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Tell others about yourself..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g., Oaxaca, Mexico"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setName(initialName);
            setBio(initialBio);
            setLocation(initialLocation);
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
