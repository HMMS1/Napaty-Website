import React, { useState, useEffect, useRef } from "react";
import {
  FaImage, FaPaperPlane, FaUserTie, FaUser,
  FaRegSmile, FaRegCommentDots, FaTrash
} from "react-icons/fa";
import "../style/Community.css";

const REACTION_TYPES = [
  { id: 'like',    emoji: '👍', label: 'إعجاب'  },
  { id: 'love',    emoji: '❤️', label: 'أحببته' },
  { id: 'helpful', emoji: '💡', label: 'مفيد'   },
];

const Community = ({ language }) => {
  const isArabic = language === "ar";

  const [posts, setPosts]               = useState([]);
  const [newPostText, setNewPostText]   = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const fileInputRef      = useRef(null);
  const commentInputRefs  = useRef({});

  // ─── helpers ────────────────────────────────────────────────────────────────
  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  /** تصحيح رابط الصورة ومنع تكرار النطاق أو مشكلة الـ SSL */
  const buildImageUrl = (raw) => {
    if (!raw) return null;
    const clean = raw
      .replace("http://hamzamostafa20.pythonanywhere.com", "")
      .replace("https://hamzamostafa20.pythonanywhere.com", "");
    return `https://hamzamostafa20.pythonanywhere.com${clean.startsWith("/") ? clean : "/" + clean}`;
  };

  // ─── fetch ──────────────────────────────────────────────────────────────────
  const fetchPosts = async () => {
    try {
      const res = await fetch(
        "https://hamzamostafa20.pythonanywhere.com/api/community/posts/",
        { headers: authHeader() }
      );
      if (res.ok) setPosts(await res.json());
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // ─── create post ────────────────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedImage) return;

    const formData = new FormData();
    if (newPostText.trim()) formData.append("content", newPostText);
    if (selectedImage)      formData.append("image",   selectedImage);

    try {
      const res = await fetch(
        "https://hamzamostafa20.pythonanywhere.com/api/community/posts/",
        { method: "POST", headers: authHeader(), body: formData }
      );
      if (res.ok) {
        setNewPostText("");
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchPosts();
      }
    } catch (err) {
      console.error("Error posting:", err);
    }
  };

  // ─── reactions ──────────────────────────────────────────────────────────────
  const handleReaction = async (postId, reactionType) => {
    try {
      const res = await fetch(
        `https://hamzamostafa20.pythonanywhere.com/api/community/posts/${postId}/react/`,
        {
          method: "POST",
          headers: { ...authHeader(), "Content-Type": "application/json" },
          body: JSON.stringify({ reaction_type: reactionType }),
        }
      );
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error("Error reacting:", err);
    }
  };

  // ─── delete post ────────────────────────────────────────────────────────────
  const handleDeletePost = async (postId) => {
    const msg = isArabic
      ? "هل أنت متأكد من حذف هذا المنشور؟"
      : "Are you sure you want to delete this post?";
    if (!window.confirm(msg)) return;

    try {
      const res = await fetch(
        `https://hamzamostafa20.pythonanywhere.com/api/community/posts/${postId}/delete/`,
        { method: "DELETE", headers: authHeader() }
      );
      if (res.ok) {
        fetchPosts();
      } else {
        alert(isArabic ? "فشل حذف المنشور" : "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // ─── comments ───────────────────────────────────────────────────────────────
  const toggleComments = (postId) =>
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const handleReplyClick = (postId, authorName) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: `@${authorName} ` }));
    commentInputRefs.current[postId]?.focus();
  };

  const submitComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    try {
      const res = await fetch(
        `https://hamzamostafa20.pythonanywhere.com/api/community/posts/${postId}/comment/`,
        {
          method: "POST",
          headers: { ...authHeader(), "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        }
      );
      if (res.ok) {
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        fetchPosts();
      }
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  // ─── format @mention ────────────────────────────────────────────────────────
  const formatCommentText = (text) => {
    if (!text) return "";
    return text.split(/(@\S+)/g).map((part, i) =>
      part.startsWith("@")
        ? <span key={i} className="mention-tag">{part}</span>
        : part
    );
  };

  // ─── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="community-page-wrapper">
      {/* Header */}
      <div className="community-header-banner">
        <h2>{isArabic ? "المجتمع الزراعي التفاعلي" : "Interactive Agri Community"}</h2>
        <p>
          {isArabic
            ? "شارك خبرتك، اسأل الخبراء والمزارعين، وتفاعل مع المجتمع"
            : "Share your experience, ask experts, and interact with others"}
        </p>
      </div>

      {/* Create post */}
      <div className="community-create-card">
        <form onSubmit={submitPost}>
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={
              isArabic
                ? "بم تفكر؟ شارك تجربتك أو اسأل المجتمع الزراعي..."
                : "What's on your mind? Share your agri experience..."
            }
          />

          {imagePreview && (
            <div className="community-preview-wrapper">
              <img src={imagePreview} alt="Preview" className="community-upload-preview" />
              <button
                type="button"
                className="community-remove-preview"
                onClick={() => { setSelectedImage(null); setImagePreview(null); }}
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
              <label htmlFor="community-img-file" className="community-file-label">
                <FaImage />
                <span>
                  {selectedImage
                    ? (isArabic ? "تغيير الصورة" : "Change Image")
                    : (isArabic ? "إضافة صورة"  : "Add Image")}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="community-submit-button"
              disabled={!newPostText.trim() && !selectedImage}
            >
              <FaPaperPlane />
              <span>{isArabic ? "نشر الآن" : "Post Now"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts stream */}
      <div className="community-posts-stream">
        {posts.length === 0 ? (
          <div className="community-empty-state">
            <FaRegSmile size={40} />
            <p>
              {isArabic
                ? "لا توجد منشورات بعد، كن أول من ينشر!"
                : "No posts yet, be the first to share!"}
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const imageUrl = buildImageUrl(post.image);

            return (
              <div key={post.id} className="community-post-node">

                {/* Post header */}
                <div
                  className="community-node-header"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div className={`community-avatar-icon ${post.author_type === "expert" ? "expert-badge" : "user-badge"}`}>
                      {post.author_type === "expert" ? <FaUserTie size={18} /> : <FaUser size={18} />}
                    </div>
                    <div className="community-node-meta">
                      <h4>
                        {post.author_name}
                        {post.author_type === "expert" && (
                          <span className="community-expert-tag">
                            {isArabic ? "خبير زراعي" : "Agri Expert"}
                          </span>
                        )}
                      </h4>
                      <small>
                        {new Date(post.created_at).toLocaleString(isArabic ? "ar-EG" : "en-US")}
                      </small>
                    </div>
                  </div>

                  {/* ✅ زر الحذف - يظهر فقط لصاحب المنشور */}
                  {post.is_author && (
                    <button
                      type="button"
                      className="community-delete-post-btn"
                      onClick={() => handleDeletePost(post.id)}
                      title={isArabic ? "حذف المنشور" : "Delete Post"}
                    >
                      <FaTrash size={16} />
                    </button>
                  )}
                </div>

                {/* Post body */}
                {post.content && (
                  <p className="community-node-body">{post.content}</p>
                )}

                {imageUrl && (
                  <div className="community-node-image-container">
                    <img src={imageUrl} alt="Post Media" className="community-node-img" />
                  </div>
                )}

                {/* Post footer: reactions + comments toggle */}
                <div className="community-node-footer">
                  <div className="reactions-group">
                    {REACTION_TYPES.map((reaction) => {
                      const count       = post.reactions_count?.[reaction.id] || 0;
                      const isMyReaction = post.user_reaction === reaction.id;
                      return (
                        <button
                          key={reaction.id}
                          type="button"
                          onClick={() => handleReaction(post.id, reaction.id)}
                          className={`community-action-btn ${isMyReaction ? "active-reaction" : ""}`}
                        >
                          <span className="reaction-emoji">{reaction.emoji}</span>
                          <span className="reaction-counter">{count}</span>
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

                {/* Comments section */}
                {openComments[post.id] && (
                  <div className="community-comments-section">
                    <div className="comments-list">
                      {post.comments?.map((comment) => (
                        <div key={comment.id} className="comment-bubble-wrapper">
                          <div className="comment-bubble">
                            <div className={`comment-avatar ${comment.author_type === "expert" ? "expert" : ""}`}>
                              {comment.author_type === "expert"
                                ? <FaUserTie size={12} />
                                : <FaUser size={12} />}
                            </div>
                            <div className="comment-content">
                              <h5>
                                {comment.author_name}
                                {comment.author_type === "expert" && (
                                  <span className="expert-star">★</span>
                                )}
                              </h5>
                              <p>{formatCommentText(comment.content)}</p>
                            </div>
                          </div>
                          <div className="comment-actions-row">
                            <small>
                              {new Date(comment.created_at).toLocaleString(
                                isArabic ? "ar-EG" : "en-US",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </small>
                            <button
                              className="reply-text-btn"
                              onClick={() => handleReplyClick(post.id, comment.author_name)}
                            >
                              {isArabic ? "رد" : "Reply"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comment input */}
                    <div className="comment-input-area">
                      <input
                        type="text"
                        ref={(el) => (commentInputRefs.current[post.id] = el)}
                        placeholder={isArabic ? "اكتب تعليقاً..." : "Write a comment..."}
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyPress={(e) => e.key === "Enter" && submitComment(post.id)}
                      />
                      <button type="button" onClick={() => submitComment(post.id)}>
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
