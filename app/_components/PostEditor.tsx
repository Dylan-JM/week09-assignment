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
          <p className="mb-2">{post.content}</p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Edit
            </button>

            <form action={deletePostAction}>
              <input type="hidden" name="postId" value={post.id} />
              <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
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
            className="w-full border p-2 rounded bg-gray-700 text-white"
          />
          <input type="hidden" name="postId" value={post.id} />
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
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
