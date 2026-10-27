import React, { useState } from "react";

function PostList({
  posts,
  onRowClick,
  totalPages,
  currentPage,
  onPageChange,
  onSearch,
}) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <div>
      {/* 🔍 검색창 영역 */}
      <form
        onSubmit={handleSearchSubmit}
        style={{ marginBottom: "15px", display: "flex", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="제목 또는 내용 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: "6px", flex: "1", maxWidth: "300px" }}
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
          검색
        </button>
      </form>

      <h3>게시글 목록</h3>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr
                key={post.id}
                onClick={() => onRowClick(post.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.author || post.writer}</td>
                <td>
                  {post.createdAt
                    ? post.createdAt.replace("T", " ").substring(0, 19)
                    : ""}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                등록된 게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* 📄 페이지네이션 (페이지 번호 버튼) 영역 */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNum = index + 1;
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              style={{
                padding: "6px 12px",
                backgroundColor: isCurrent ? "#007bff" : "#fff",
                color: isCurrent ? "#fff" : "#333",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: isCurrent ? "bold" : "normal",
              }}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PostList;
