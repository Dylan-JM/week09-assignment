"use client";

import { useState } from "react";

type Profile = {
  nickname: string;
  bio: string | null;
  user_id: string;
};

type ProfileEditorProps = {
  profile: Profile;
  updateProfileAction: (formData: FormData) => void;
  isOwner: boolean;
};

export default function ProfileEditor({
  profile,
  updateProfileAction,
  isOwner,
}: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio || "");

  if (!isOwner) {
    return (
      <>
        <h1 className="text-3xl font-bold text-blue-500">{profile.nickname}</h1>
        {profile.bio && <p className="opacity-80">{profile.bio}</p>}
      </>
    );
  }

  return (
    <div className="space-y-3">
      {!isEditing && (
        <>
          <h1 className="text-3xl font-bold text-blue-500">
            {profile.nickname}
          </h1>
          {profile.bio && <p className="opacity-80">{profile.bio}</p>}

          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </>
      )}

      {isEditing && (
        <form
          action={updateProfileAction}
          className="space-y-4"
          onSubmit={(e) => {
            if (nickname.includes(" ")) {
              e.preventDefault();
              alert("Nickname must be a single word with no spaces.");
            }
          }}
        >
          <div className="flex flex-col">
            <label>Nickname</label>
            <input
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border p-2 rounded"
              pattern="^\S+$"
              title="Nickname must be a single word with no spaces."
              required
            />
          </div>

          <div className="flex flex-col">
            <label>Bio</label>
            <textarea
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save Profile
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
