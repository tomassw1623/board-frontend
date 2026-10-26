import React from "react";

function PostForm({
  title,
  setTitle,
  writer,
  setWriter,
  content,
  setContent,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        marginBottom: "30px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>글 작성하기</h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="작성자"
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
            height: "80px",
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "8px 15px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        등록하기
      </button>
    </form>
  );
}

export default PostForm;
