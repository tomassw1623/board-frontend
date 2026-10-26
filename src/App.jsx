import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  // 게시글 목록을 불러오는 함수
  const fetchPosts = () => {
    fetch("http://localhost:8080/api/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("데이터를 불러오는데 실패했습니다:", error);
      });
  };

  // 컴포넌트가 처음 실행될 때 목록 조회
  useEffect(() => {
    fetchPosts();
  }, []);

  // 글 등록 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !writer) {
      alert("제목과 작성자를 입력해주세요!");
      return;
    }

    // 백엔드로 POST 요청 보내기 (writer를 author로 매핑)
    fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        author: writer,
      }),
    })
      .then(() => {
        // 입력창 초기화
        setTitle("");
        setContent("");
        setWriter("");
        // 목록 새로고침
        fetchPosts();
      })
      .catch((error) => {
        console.error("글 작성 실패:", error);
      });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2>📌 게시판 프로젝트</h2>

      {/* ✍️ 글 작성 폼 */}
      <form
        onSubmit={handleSubmit}
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

      {/* 📋 게시글 목록 테이블 */}
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
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                {/* 백엔드 필드명인 author와 createdAt(또는 날짜 관련 필드)에 맞춰 출력 */}
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
    </div>
  );
}

export default App;
