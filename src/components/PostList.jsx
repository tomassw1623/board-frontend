import React from "react";

function PostList({ posts, onRowClick }) {
  return (
    <>
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
    </>
  );
}

export default PostList;
