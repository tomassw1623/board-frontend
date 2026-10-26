import { useState, useEffect } from "react";

function PostDetail({ selectedPost, onBack, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(selectedPost.title);
  const [editContent, setEditContent] = useState(selectedPost.content);

  // 댓글 관련 상태
  const [comments, setComments] = useState([]);
  const [commentWriter, setCommentWriter] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const fetchComments = (postId) => {
    fetch(`http://localhost:8080/api/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("댓글 조회 실패:", err));
  };

  useEffect(() => {
    fetchComments(selectedPost.id);
  }, [selectedPost.id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentWriter || !commentContent) {
      alert("작성자와 댓글 내용을 입력해주세요!");
      return;
    }

    fetch(`http://localhost:8080/api/posts/${selectedPost.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: commentWriter, content: commentContent }),
    })
      .then(() => {
        setCommentWriter("");
        setCommentContent("");
        fetchComments(selectedPost.id);
      })
      .catch((err) => console.error("댓글 작성 실패:", err));
  };

  const handleCommentDelete = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "DELETE",
      })
        .then(() => fetchComments(selectedPost.id))
        .catch((err) => console.error("댓글 삭제 실패:", err));
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
        <strong>작성자:</strong> {selectedPost.author || selectedPost.writer}
      </p>
      <p>
        <strong>작성일:</strong>{" "}
        {selectedPost.createdAt
          ? selectedPost.createdAt.replace("T", " ").substring(0, 19)
          : ""}
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
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            수정 완료
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            취소
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              backgroundColor: "#ffc107",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            수정하기
          </button>
          <button
            onClick={() => onDelete(selectedPost.id)}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            삭제하기
          </button>
          <button
            onClick={onBack}
            style={{
              padding: "8px 12px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            목록으로
          </button>
        </>
      )}

      {/* 💬 댓글 영역 */}
      <hr style={{ margin: "20px 0" }} />
      <h4>💬 댓글</h4>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleCommentSubmit} style={{ marginBottom: "15px" }}>
        <div style={{ marginBottom: "8px" }}>
          <input
            type="text"
            placeholder="작성자"
            value={commentWriter}
            onChange={(e) => setCommentWriter(e.target.value)}
            style={{ padding: "6px", width: "150px", marginRight: "10px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            style={{ padding: "6px", flex: "1" }}
          />
          <button
            type="submit"
            style={{
              padding: "6px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            댓글 등록
          </button>
        </div>
      </form>

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
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginLeft: "10px",
                  }}
                >
                  {comment.createdAt
                    ? comment.createdAt.replace("T", " ").substring(0, 19)
                    : ""}
                </span>
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  style={{
                    marginLeft: "auto",
                    padding: "2px 6px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
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
