"use client";
import { useState } from "react";

type PostEditorProps = {
  post: {
    id: string;
    content: string;
    created_at?: string;
    // add any other fields your post object includes
  };
  updatePostAction: (formData: FormData) => void;
  deletePostAction: (formData: FormData) => void;
  isOwner: boolean;
};

export default function PostEditor({
  post,
  updatePostAction,
  deletePostAction,
  isOwner,
}: PostEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);

  if (!isOwner) {
    return (
      <div>
        <p className="mb-2">{post.content}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isEditing && (
        <div className="flex justify-between items-start gap-4">
          <p className="mb-2 text-gray-800">{post.content}</p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="
              px-3 py-1 rounded font-medium
              bg-blue-600 text-white
              hover:bg-blue-700 transition
            "
            >
              Edit
            </button>

            <form action={deletePostAction}>
              <input type="hidden" name="postId" value={post.id} />
              <button
                className="
                px-3 py-1 rounded font-medium
                bg-red-600 text-white
                hover:bg-red-700 transition
              "
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditing && (
        <form action={updatePostAction} className="space-y-3 w-full">
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="
            w-full p-3 rounded-xl resize-none
            bg-white
            border border-gray-300
            text-gray-800
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
            style={{ minHeight: "120px" }}
          />

          <input type="hidden" name="postId" value={post.id} />

          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="
              px-3 py-1 rounded font-medium
              bg-green-600 text-white
              hover:bg-green-700 transition
            "
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="
              px-3 py-1 rounded font-medium
              bg-gray-200 text-gray-700
              hover:bg-gray-300 transition
            "
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
