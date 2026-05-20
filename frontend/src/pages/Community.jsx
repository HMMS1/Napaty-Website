import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  FaPaperPlane,
  FaTrash,
} from "react-icons/fa";

import "../style/Community.css";

const REACTION_TYPES = [
  { id: "like", emoji: "👍" },
  { id: "love", emoji: "❤️" },
  { id: "helpful", emoji: "💡" },
];

const API_BASE =
  "https://hamzamostafa20.pythonanywhere.com";

// ================= DELETE MODAL =================

const DeleteConfirmModal = ({
  isOpen,
  isArabic,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="modal-card"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-icon-wrapper">
          <FaTrash size={22} />
        </div>

        <h3 className="modal-title">
          {isArabic
            ? "حذف المنشور"
            : "Delete Post"}
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

            <span>
              {isArabic ? "حذف" : "Delete"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= MAIN COMPONENT =================

const Community = ({ language }) => {
  const isArabic = language === "ar";

  const [posts, setPosts] = useState([]);

  const [newPostText, setNewPostText] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [deleteModal, setDeleteModal] =
    useState({
      open: false,
      postId: null,
    });

  const fileInputRef = useRef(null);

  // ================= AUTH =================

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem(
      "access"
    )}`,
  });

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
        throw new Error(
          "Failed to fetch posts"
        );
      }

      const data = await response.json();

      setPosts(
        Array.isArray(data) ? data : []
      );
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

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // ================= SUBMIT POST =================

  const submitPost = async (e) => {
    e.preventDefault();

    if (
      !newPostText.trim() &&
      !selectedImage
    ) {
      return;
    }

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

  // ================= REACTION =================

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
            reaction_type:
              reactionType,
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

  // ================= DELETE =================

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
      } else {
        alert(
          isArabic
            ? "فشل حذف المنشور"
            : "Failed to delete post"
        );
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

  // ================= RENDER =================

  return (
    <div className="community-page-wrapper">
      {/* MODAL */}

      <DeleteConfirmModal
        isOpen={deleteModal.open}
        isArabic={isArabic}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* HEADER */}

      <div className="community-header-banner">
        <h2>
          {isArabic
            ? "المجتمع الزراعي التفاعلي"
            : "Interactive Agri Community"}
        </h2>

        <p>
          {isArabic
            ? "شارك خبرتك وتفاعل مع المجتمع"
            : "Share your experience with the community"}
        </p>
      </div>

      {/* CREATE POST */}

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
                ? "بم تفكر؟"
                : "What's on your mind?"
            }
          />

          {imagePreview && (
            <div className="community-preview-wrapper">
              <img
                src={imagePreview}
                alt="Preview"
                className="community-upload-preview"
              />

              <button
                type="button"
                className="community-remove-preview"
                onClick={() => {
                  setSelectedImage(null);

                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
          )}

          <div className="community-card-actions">
            <div className="community-upload-btn-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageSelect
                }
                ref={fileInputRef}
                style={{
                  display: "none",
                }}
                id="community-img-file"
              />

              <label
                htmlFor="community-img-file"
                className="community-file-label"
              >
                {isArabic
                  ? "إضافة صورة"
                  : "Add Image"}
              </label>
            </div>

            <button
              type="submit"
              className="community-submit-button"
              disabled={
                !newPostText.trim() &&
                !selectedImage
              }
            >
              <FaPaperPlane />

              <span>
                {isArabic
                  ? "نشر"
                  : "Post"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* POSTS */}

      <div className="community-posts-stream">
        {posts.length === 0 ? (
          <div className="community-empty-state">
            <p>
              {isArabic
                ? "لا توجد منشورات"
                : "No posts yet"}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="community-post-node"
            >
              {/* HEADER */}

              <div className="community-node-header">
                <div>
                  <div className="community-node-meta">
                    <h4>
                      {
                        post.author_name
                      }
                    </h4>

                    <small>
                      {new Date(
                        post.created_at
                      ).toLocaleString(
                        isArabic
                          ? "ar-EG"
                          : "en-US"
                      )}
                    </small>
                  </div>
                </div>

                {post.is_author && (
                  <button
                    type="button"
                    className="community-delete-post-btn"
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        postId:
                          post.id,
                      })
                    }
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>

              {/* BODY */}

              {post.content && (
                <p className="community-node-body">
                  {post.content}
                </p>
              )}

              {/* IMAGE */}

              {post.image && (
                <div className="community-node-image-container">
                  <img
                    src={`${API_BASE}${post.image}`}
                    alt="Post"
                    className="community-node-img"
                  />
                </div>
              )}

              {/* FOOTER */}

              <div className="community-node-footer">
                <div className="reactions-group">
                  {REACTION_TYPES.map(
                    (reaction) => {
                      const count =
                        post
                          .reactions_count?.[
                          reaction.id
                        ] || 0;

                      const isMyReaction =
                        post.user_reaction ===
                        reaction.id;

                      return (
                        <button
                          key={
                            reaction.id
                          }
                          type="button"
                          onClick={() =>
                            handleReaction(
                              post.id,
                              reaction.id
                            )
                          }
                          className={`community-action-btn ${
                            isMyReaction
                              ? "active-reaction"
                              : ""
                          }`}
                        >
                          <span className="reaction-emoji">
                            {
                              reaction.emoji
                            }
                          </span>

                          <span className="reaction-counter">
                            {count}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
