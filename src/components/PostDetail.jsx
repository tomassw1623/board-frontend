import { useState, useEffect } from "react";
import { checkResponse } from "../api";

const btn = (bg, color = "#fff") => ({
  marginRight: "10px",
  padding: "8px 12px",
  backgroundColor: bg,
  color,
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
});

function PostDetail({ selectedPost, member, onBack, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(selectedPost.title);
  const [editContent, setEditContent] = useState(selectedPost.content);

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");

  // ★ 내가 쓴 글인지 (화면 표시용. 실제 권한 검사는 서버가 한다)
  const isMyPost = member && member.id === selectedPost.memberId;

  const fetchComments = (postId) => {
    fetch(`http://localhost:8080/api/posts/${postId}/comments`)
      .then(checkResponse)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("댓글 조회 실패:", err));
  };

  useEffect(() => {
    fetchComments(selectedPost.id);
  }, [selectedPost.id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요!");
      return;
    }

    fetch(`http://localhost:8080/api/posts/${selectedPost.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ★
      body: JSON.stringify({ content: commentContent }), // ★ author 삭제
    })
      .then(checkResponse)
      .then(() => {
        setCommentContent("");
        fetchComments(selectedPost.id);
      })
      .catch((err) => alert(err.message));
  };

  const handleCommentDelete = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include", // ★
      })
        .then(checkResponse)
        .then(() => fetchComments(selectedPost.id))
        .catch((err) => alert(err.message));
    }
  };

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        border: "1px solid #007bff",
        borderRadius: "5px",
        backgroundColor: "#e7f1ff",
      }}
    >
      <h3>{isEditing ? "✏️ 게시글 수정" : "📖 게시글 상세 보기"}</h3>

      <p>
        <strong>번호:</strong> {selectedPost.id}
      </p>

      <div style={{ marginBottom: "10px" }}>
        <strong>제목: </strong>
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: "100%", padding: "6px", marginTop: "5px" }}
          />
        ) : (
          <span>{selectedPost.title}</span>
        )}
      </div>

      <p>
        <strong>작성자:</strong> {selectedPost.author}
      </p>
      <p>
        <strong>작성일:</strong>{" "}
        {selectedPost.createdAt
          ? selectedPost.createdAt.replace("T", " ").substring(0, 19)
          : ""}
      </p>
      <p>
        <strong>조회수:</strong> {selectedPost.views}
      </p>
      <hr />

      <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>
        <strong>내용:</strong>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              padding: "6px",
              marginTop: "5px",
            }}
          />
        ) : (
          <p>{selectedPost.content}</p>
        )}
      </div>

      {/* 버튼 영역 */}
      {isEditing ? (
        <>
          <button
            onClick={() => {
              onUpdate(selectedPost.id, editTitle, editContent);
              setIsEditing(false);
            }}
            style={btn("#28a745")}
          >
            수정 완료
          </button>
          <button
            onClick={() => {
              setEditTitle(selectedPost.title);
              setEditContent(selectedPost.content);
              setIsEditing(false);
            }}
            style={btn("#6c757d")}
          >
            취소
          </button>
        </>
      ) : (
        <>
          {/* ★ 내 글일 때만 수정/삭제 버튼 표시 */}
          {isMyPost && (
            <>
              <button onClick={() => setIsEditing(true)} style={btn("#ffc107", "#000")}>
                수정하기
              </button>
              <button onClick={() => onDelete(selectedPost.id)} style={btn("#dc3545")}>
                삭제하기
              </button>
            </>
          )}
          <button onClick={onBack} style={btn("#6c757d")}>
            목록으로
          </button>
        </>
      )}

      {/* 💬 댓글 영역 */}
      <hr style={{ margin: "20px 0" }} />
      <h4>💬 댓글</h4>

      {/* ★ 로그인했을 때만 댓글 작성 폼 표시 */}
      {member ? (
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: "15px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder={`${member.nickname}(으)로 댓글 작성`}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              style={{ padding: "6px", flex: "1" }}
            />
            <button
              type="submit"
              style={{ ...btn("#007bff"), marginRight: 0, padding: "6px 12px" }}
            >
              댓글 등록
            </button>
          </div>
        </form>
      ) : (
        <p style={{ color: "#666", fontSize: "14px" }}>
          댓글을 작성하려면 로그인해주세요.
        </p>
      )}

      {/* 댓글 목록 */}
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong>{comment.author}</strong>
                <span
                  style={{ fontSize: "12px", color: "#666", marginLeft: "10px" }}
                >
                  {comment.createdAt
                    ? comment.createdAt.replace("T", " ").substring(0, 19)
                    : ""}
                </span>
                {/* ★ 내 댓글일 때만 삭제 버튼 표시 */}
                {member && member.id === comment.memberId && (
                  <button
                    onClick={() => handleCommentDelete(comment.id)}
                    style={{
                      ...btn("#dc3545"),
                      marginLeft: "auto",
                      marginRight: 0,
                      padding: "2px 6px",
                      fontSize: "11px",
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
              <p style={{ margin: "5px 0 0 0", whiteSpace: "pre-wrap" }}>
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#666", fontSize: "14px" }}>
            작성된 댓글이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default PostDetail;