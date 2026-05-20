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
  { id: "like", emoji: "👍" },
  { id: "love", emoji: "❤️" },
  { id: "helpful", emoji: "💡" },
];

const API_BASE = "https://hamzamostafa20.pythonanywhere.com";

const Community = ({ language }) => {
  const isArabic = language === "ar";

  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    postId: null,
  });

  const fileInputRef = useRef(null);
  const commentInputRefs = useRef({});

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  const buildImageUrl = (raw) => {
    if (!raw) return null;

    const clean = raw
      .replace("http://hamzamostafa20.pythonanywhere.com", "")
      .replace("https://hamzamostafa20.pythonanywhere.com", "");

    return `${API_BASE}${clean.startsWith("/") ? clean : `/${clean}`}`;
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/community/posts/`, {
        headers: authHeader(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (!newPostText.trim() && !selectedImage) return;

    const formData = new FormData();

    if (newPostText.trim()) {
      formData.append("content", newPostText);
    }

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch(`${API_BASE}/api/community/posts/`, {
        method: "POST",
        headers: authHeader(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setNewPostText("");
      setSelectedImage(null);
      setImagePreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchPosts();
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/community/posts/${postId}/react/`,
        {
          method: "POST",
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
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
      console.error("Reaction error:", error);
    }
  };

  const handleDeletePost = (postId) => {
    setDeleteModal({
      open: true,
      postId,
    });
  };

  const confirmDeletePost = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/community/posts/${deleteModal.postId}/delete/`,
        {
          method: "DELETE",
          headers: authHeader(),
        }
      );

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }

    setDeleteModal({
      open: false,
      postId: null,
    });
  };

  const cancelDeletePost = () => {
    setDeleteModal({
      open: false,
      postId: null,
    });
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleReplyClick = (postId, authorName) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: `@${authorName} `,
    }));

    commentInputRefs.current[postId]?.focus();
  };

  const submitComment = async (postId) => {
    const text = commentInputs[postId];

    if (!text?.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/community/posts/${postId}/comment/`,
        {
          method: "POST",
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
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
      console.error("Comment error:", error);
    }
  };

  const formatCommentText = (text) => {
    if (!text) return null;

    return text.split(/(@\S+)/g).map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="mention-tag">
            {part}
          </span>
        );
      }

      return part;
    });
  };

  return (
    <div className="community-page-wrapper">

      {deleteModal.open && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-box">

            <div className="delete-modal-icon-wrapper">
  <div className="delete-modal-icon">
    <FaTrash />
  </div>
</div>

            <h3>
              {isArabic ? "حذف المنشور" : "Delete Post"}
            </h3>

            <p>
              {isArabic
                ? "هل أنت متأكد من حذف هذا المنشور؟"
                : "Are you sure you want to delete this post?"}
            </p>

            <div className="delete-modal-actions">

              <button
                className="cancel-delete-btn"
                onClick={cancelDeletePost}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>

              <button
                className="confirm-delete-btn"
                onClick={confirmDeletePost}
              >
                {isArabic ? "حذف" : "Delete"}
              </button>

            </div>
          </div>
        </div>
      )}

      <div className="community-header-banner">
        <h2>
          {isArabic
            ? "مجتمع نباتي "
            : "Napaty Community"}
        </h2>

        <p>
          {isArabic
            ? "شارك خبرتك، اسأل الخبراء والمزارعين، "
            : "Share your experience, ask experts, and interact with others"}
        </p>
      </div>

      <div className="community-create-card">
        <form onSubmit={submitPost}>

          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={
              isArabic
                ? "بم تفكر؟ شارك تجربتك    ..."
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
                onChange={handleImageSelect}
                ref={fileInputRef}
                style={{ display: "none" }}
                id="community-img-file"
              />

              <label
                htmlFor="community-img-file"
                className="community-file-label"
              >
                <FaImage />

                <span>
                  {selectedImage
                    ? isArabic
                      ? "تغيير الصورة"
                      : "Change Image"
                    : isArabic
                    ? "إضافة صورة"
                    : "Add Image"}
                </span>
              </label>

            </div>

            <button
              type="submit"
              className="community-submit-button"
              disabled={!newPostText.trim() && !selectedImage}
            >
              <FaPaperPlane />

              <span>
                {isArabic ? "نشر الآن" : "Post Now"}
              </span>
            </button>

          </div>
        </form>
      </div>

      <div className="community-posts-stream">

        {posts.length === 0 ? (
          <div className="community-empty-state">

            <FaRegSmile size={40} />

            <p>
              {isArabic
                ? "لا توجد منشورات بعد"
                : "No posts yet"}
            </p>

          </div>
        ) : (
          posts.map((post) => {
            const imageUrl = buildImageUrl(post.image);

            return (
              <div key={post.id} className="community-post-node">

                <div className="community-node-header">

                  <div className="community-node-user">

                    <div
                      className={`community-avatar-icon ${
                        post.author_type === "expert"
                          ? "expert-badge"
                          : "user-badge"
                      }`}
                    >
                      {post.author_type === "expert" ? (
                        <FaUserTie size={18} />
                      ) : (
                        <FaUser size={18} />
                      )}
                    </div>

                    <div className="community-node-meta">

                      <h4>
                        {post.author_name}

                        {post.author_type === "expert" && (
                          <span className="community-expert-tag">
                            {isArabic
                              ? "خبير زراعي"
                              : "Agri Expert"}
                          </span>
                        )}
                      </h4>

                      <small>
                        {new Date(post.created_at).toLocaleString(
                          isArabic ? "ar-EG" : "en-US"
                        )}
                      </small>

                    </div>
                  </div>

                  {post.is_author && (
                    <button
                      type="button"
                      className="community-delete-post-btn"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <FaTrash size={16} />
                    </button>
                  )}

                </div>

                {post.content && (
                  <p className="community-node-body">
                    {post.content}
                  </p>
                )}

                {imageUrl && (
                  <div className="community-node-image-container">
                    <img
                      src={imageUrl}
                      alt="Post"
                      className="community-node-img"
                    />
                  </div>
                )}

                <div className="community-node-footer">

                  <div className="reactions-group">

                    {REACTION_TYPES.map((reaction) => {
                      const count =
                        post.reactions_count?.[reaction.id] || 0;

                      const isMyReaction =
                        post.user_reaction === reaction.id;

                      return (
                        <button
                          key={reaction.id}
                          type="button"
                          onClick={() =>
                            handleReaction(post.id, reaction.id)
                          }
                          className={`community-action-btn ${
                            isMyReaction
                              ? "active-reaction"
                              : ""
                          }`}
                        >
                          <span className="reaction-emoji">
                            {reaction.emoji}
                          </span>

                          <span className="reaction-counter">
                            {count}
                          </span>
                        </button>
                      );
                    })}

                  </div>

                  <button
                    type="button"
                    className="community-action-btn comment-trigger-btn"
                    onClick={() => toggleComments(post.id)}
                  >
                    <FaRegCommentDots size={18} />

                    <span>
                      {post.comments?.length || 0}{" "}
                      {isArabic ? "تعليقات" : "Comments"}
                    </span>
                  </button>

                </div>

                {openComments[post.id] && (
                  <div className="community-comments-section">

                    <div className="comments-list">

                      {(post.comments || []).map((comment) => (
                        <div
                          key={comment.id}
                          className="comment-bubble-wrapper"
                        >
                          <div className="comment-bubble">

                            <div
                              className={`comment-avatar ${
                                comment.author_type === "expert"
                                  ? "expert"
                                  : ""
                              }`}
                            >
                              {comment.author_type === "expert" ? (
                                <FaUserTie size={12} />
                              ) : (
                                <FaUser size={12} />
                              )}
                            </div>

                            <div className="comment-content">

                              <h5>
                                {comment.author_name}

                                {comment.author_type === "expert" && (
                                  <span className="expert-star">
                                    ★
                                  </span>
                                )}
                              </h5>

                              <p>
                                {formatCommentText(comment.content)}
                              </p>

                            </div>
                          </div>

                          <div className="comment-actions-row">

                            <small>
                              {new Date(
                                comment.created_at
                              ).toLocaleString(
                                isArabic ? "ar-EG" : "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </small>

                            <button
                              className="reply-text-btn"
                              onClick={() =>
                                handleReplyClick(
                                  post.id,
                                  comment.author_name
                                )
                              }
                            >
                              {isArabic ? "رد" : "Reply"}
                            </button>

                          </div>
                        </div>
                      ))}

                    </div>

                    <div className="comment-input-area">

                      <input
                        type="text"
                        ref={(el) =>
                          (commentInputRefs.current[post.id] = el)
                        }
                        placeholder={
                          isArabic
                            ? "اكتب تعليقاً..."
                            : "Write a comment..."
                        }
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({
                            ...commentInputs,
                            [post.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            submitComment(post.id);
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => submitComment(post.id)}
                      >
                        <FaPaperPlane />
                      </button>

                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}

      </div>
    </div>
  );
};

export default Community;
