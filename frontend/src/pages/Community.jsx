import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  FaImage,
  FaPaperPlane,
  FaUserTie,
  FaUser,
  FaRegSmile,
  FaRegCommentDots,
  FaTrash,
} from "react-icons/fa";

import "../style/Community.css";

const REACTION_TYPES = [
  { id: "like", emoji: "👍", label: "إعجاب" },
  { id: "love", emoji: "❤️", label: "أحببته" },
  { id: "helpful", emoji: "💡", label: "مفيد" },
];

const API_BASE = "https://hamzamostafa20.pythonanywhere.com";

// ================= DELETE MODAL =================
const DeleteConfirmModal = ({
  isOpen,
  isArabic,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon-wrapper">
          <FaTrash size={22} />
        </div>

        <h3 className="modal-title">
          {isArabic ? "حذف المنشور" : "Delete Post"}
        </h3>

        <p className="modal-body">
          {isArabic
            ? "هل أنت متأكد من حذف هذا المنشور؟"
            : "Are you sure you want to delete this post?"}
        </p>

        <div className="modal-actions">
          <button
            className="modal-btn-cancel"
            onClick={onCancel}
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>

          <button
            className="modal-btn-confirm"
            onClick={onConfirm}
          >
            <FaTrash size={13} />
            <span>{isArabic ? "حذف" : "Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Community = ({ language }) => {
  const isArabic = language === "ar";

  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [selectedImage, setSelectedImage] =
    useState(null);
  const [imagePreview, setImagePreview] =
    useState(null);
  const [openComments, setOpenComments] =
    useState({});
  const [commentInputs, setCommentInputs] =
    useState({});

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    postId: null,
  });

  const fileInputRef = useRef(null);
  const commentInputRefs = useRef({});

  // ================= AUTH =================
  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem(
      "access"
    )}`,
  });

  // ================= IMAGE URL =================
  const buildImageUrl = (raw) => {
    if (!raw) return null;

    const clean = raw
      .replace(
        "http://hamzamostafa20.pythonanywhere.com",
        ""
      )
      .replace(
        "https://hamzamostafa20.pythonanywhere.com",
        ""
      );

    return `${API_BASE}${
      clean.startsWith("/") ? clean : `/${clean}`
    }`;
  };

  // ================= FETCH POSTS =================
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/community/posts/`,
        {
          headers: authHeader(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Error fetching posts:",
        error
      );
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ================= IMAGE SELECT =================
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ================= SUBMIT POST =================
  const submitPost = async (e) => {
    e.preventDefault();

    if (
      !newPostText.trim() &&
      !selectedImage
    )
      return;

    const formData = new FormData();

    if (newPostText.trim()) {
      formData.append(
        "content",
        newPostText
      );
    }

    if (selectedImage) {
      formData.append(
        "image",
        selectedImage
      );
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/community/posts/`,
        {
          method: "POST",
          headers: authHeader(),
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create post"
        );
      }

      setNewPostText("");
      setSelectedImage(null);
      setImagePreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchPosts();
    } catch (error) {
      console.error(
        "Error posting:",
        error
      );
    }
  };

  // ================= REACTIONS =================
  const handleReaction = async (
    postId,
    reactionType
  ) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/community/posts/${postId}/react/`,
        {
          method: "POST",
          headers: {
            ...authHeader(),
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            reaction_type: reactionType,
          }),
        }
      );

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error(
        "Reaction error:",
        error
      );
    }
  };

  // ================= DELETE POST =================
  const handleDeletePost = (postId) => {
    setDeleteModal({
      open: true,
      postId,
    });
  };

  const confirmDelete = async () => {
    const postId = deleteModal.postId;

    setDeleteModal({
      open: false,
      postId: null,
    });

    try {
      const response = await fetch(
        `${API_BASE}/api/community/posts/${postId}/delete/`,
        {
          method: "DELETE",
          headers: authHeader(),
        }
      );

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );
    }
  };

  const cancelDelete = () => {
    setDeleteModal({
      open: false,
      postId: null,
    });
  };

  // ================= COMMENTS =================
  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const submitComment = async (
    postId
  ) => {
    const text =
      commentInputs[postId];

    if (!text?.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/community/posts/${postId}/comment/`,
        {
          method: "POST",
          headers: {
            ...authHeader(),
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            content: text,
          }),
        }
      );

      if (response.ok) {
        setCommentInputs((prev) => ({
          ...prev,
          [postId]: "",
        }));

        fetchPosts();
      }
    } catch (error) {
      console.error(
        "Comment error:",
        error
      );
    }
  };

  return (
    <div className="community-page-wrapper">
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        isArabic={isArabic}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <div className="community-header-banner">
        <h2>
          {isArabic
            ? "المجتمع الزراعي التفاعلي"
            : "Interactive Agri Community"}
        </h2>

        <p>
          {isArabic
            ? "شارك خبرتك مع المجتمع"
            : "Share your experience"}
        </p>
      </div>

      <div className="community-create-card">
        <form onSubmit={submitPost}>
          <textarea
            value={newPostText}
            onChange={(e) =>
              setNewPostText(
                e.target.value
              )
            }
            placeholder={
              isArabic
                ? "اكتب منشور..."
                : "Write a post..."
            }
          />

          {imagePreview && (
            <div className="community-preview-wrapper">
              <img
                src={imagePreview}
                alt="Preview"
                className="community-upload-preview"
              />
            </div>
          )}

          <div className="community-card-actions">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              ref={fileInputRef}
            />

            <button type="submit">
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>

      <div className="community-posts-stream">
        {posts.map((post) => (
          <div
            key={post.id}
            className="community-post-node"
          >
            <h4>{post.author_name}</h4>

            <p>{post.content}</p>

            <div className="community-node-footer">
              {REACTION_TYPES.map(
                (reaction) => (
                  <button
                    key={reaction.id}
                    onClick={() =>
                      handleReaction(
                        post.id,
                        reaction.id
                      )
                    }
                  >
                    {reaction.emoji}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
