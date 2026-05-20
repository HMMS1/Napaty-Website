import React, { useState, useEffect, useRef } from "react";
import { FaImage, FaPaperPlane, FaUserTie, FaUser, FaRegSmile } from "react-icons/fa";
import "../style/Community.css";

const REACTION_TYPES = [
  { id: 'like', emoji: '👍', label: 'إعجاب' },
  { id: 'love', emoji: '❤️', label: 'أحببته' },
  { id: 'helpful', emoji: '💡', label: 'مفيد' }
];

const Community = ({ language }) => {
  const isArabic = language === "ar";
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await fetch("https://hamzamostafa20.pythonanywhere.com/api/community/posts/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedImage) return;

    const token = localStorage.getItem("access");
    const formData = new FormData();
    if (newPostText.trim()) formData.append("content", newPostText);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const res = await fetch("https://hamzamostafa20.pythonanywhere.com/api/community/posts/", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setNewPostText("");
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchPosts(); 
      }
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    const token = localStorage.getItem("access");
    try {
      const res = await fetch(`https://hamzamostafa20.pythonanywhere.com/api/community/posts/${postId}/react/`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reaction_type: reactionType }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error reacting:", error);
    }
  };

  return (
    <div className="community-page-wrapper">
      <div className="community-header-banner">
        <h2>{isArabic ? "المجتمع الزراعي التفاعلي" : "Interactive Agri Community"}</h2>
        <p>{isArabic ? "شارك خبرتك، اسأل الخبراء والمزارعين، وتفاعل مع المجتمع" : "Share your experience, ask experts, and interact with others"}</p>
      </div>

      {/* صندوق النشر الإبداعي */}
      <div className="community-create-card">
        <form onSubmit={submitPost}>
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={isArabic ? "بم تفكر؟ شارك تجربتك أو اسأل المجتمع الزراعي..." : "What's on your mind? Share your agri experience..."}
          />
          
          {imagePreview && (
            <div className="community-preview-wrapper">
              <img src={imagePreview} alt="Preview" className="community-upload-preview" />
              <button type="button" className="community-remove-preview" onClick={() => { setSelectedImage(null); setImagePreview(null); }}>×</button>
            </div>
          )}

          <div className="community-card-actions">
            <div className="community-upload-btn-wrapper">
              <input type="file" accept="image/*" onChange={handleImageSelect} ref={fileInputRef} style={{ display: "none" }} id="community-img-file" />
              <label htmlFor="community-img-file" className="community-file-label">
                <FaImage /> 
                <span>{selectedImage ? (isArabic ? "تغيير الصورة" : "Change Image") : (isArabic ? "إضافة صورة" : "Add Image")}</span>
              </label>
            </div>
            <button type="submit" className="community-submit-button" disabled={!newPostText.trim() && !selectedImage}>
              <FaPaperPlane /> <span>{isArabic ? "نشر الآن" : "Post Now"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* خلاصة المنشورات الـ Feed */}
      <div className="community-posts-stream">
        {posts.length === 0 ? (
          <div className="community-empty-state">
            <FaRegSmile size={40} />
            <p>{isArabic ? "لا توجد منشورات بعد، كن أول من ينشر!" : "No posts yet, be the first to share!"}</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="community-post-node">
              
              {/* رأس المنشور */}
              <div className="community-node-header">
                <div className={`community-avatar-icon ${post.author_type === "expert" ? "expert-badge" : "user-badge"}`}>
                  {post.author_type === "expert" ? <FaUserTie size={18} /> : <FaUser size={18} />}
                </div>
                <div className="community-node-meta">
                  <h4>
                    {post.author_name}
                    {post.author_type === "expert" && (
                      <span className="community-expert-tag">{isArabic ? "خبير زراعي" : "Agri Expert"}</span>
                    )}
                  </h4>
                  <small>{new Date(post.created_at).toLocaleString(isArabic ? 'ar-EG' : 'en-US')}</small>
                </div>
              </div>

              {/* محتوى البوست */}
              {post.content && <p className="community-node-body">{post.content}</p>}
              
              {post.image && (
                <div className="community-node-image-container">
                  <img src={`https://hamzamostafa20.pythonanywhere.com${post.image}`} alt="Post Media" className="community-node-img" />
                </div>
              )}

              {/* شريط التفاعلات Reactions */}
              <div className="community-node-footer">
                {REACTION_TYPES.map(reaction => {
                  const count = post.reactions_count[reaction.id] || 0;
                  const isMyReaction = post.user_reaction === reaction.id;
                  
                  return (
                    <button
                      key={reaction.id}
                      type="button"
                      onClick={() => handleReaction(post.id, reaction.id)}
                      className={`community-reaction-trigger ${isMyReaction ? "active-reaction" : ""}`}
                    >
                      <span className="reaction-emoji">{reaction.emoji}</span>
                      <span className="reaction-counter">{count}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
