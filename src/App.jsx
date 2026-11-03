import { useState, useEffect } from "react";
import "./App.css";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import AuthForm from "./components/AuthForm";
import { checkResponse, fetchMe, logout } from "./api";

function App() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [member, setMember] = useState(null); // 로그인한 회원 (없으면 null)

  // 게시글 목록 불러오기 (검색어와 페이지 번호 반영)
  const fetchPosts = (page = 1, searchKeyword = "") => {
    fetch(
      `http://localhost:8080/api/posts?page=${page}&keyword=${encodeURIComponent(searchKeyword)}`,
    )
      .then(checkResponse)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      })
      .catch((error) => console.error("목록 조회 실패:", error));
  };

  useEffect(() => {
    fetchPosts(currentPage, keyword);
  }, [currentPage, keyword]);

  // 페이지를 열 때 이미 로그인된 상태인지 확인
  useEffect(() => {
    fetchMe().then(setMember);
  }, []);

  const handleLogout = () => {
    logout()
      .then(() => setMember(null))
      .catch((error) => alert(error.message));
  };

  // 상세 조회
  const handleRowClick = (id) => {
    fetch(`http://localhost:8080/api/posts/${id}`)
      .then(checkResponse)
      .then((response) => response.json())
      .then((data) => setSelectedPost(data))
      .catch((error) => {
        alert(error.message);
        fetchPosts(currentPage, keyword);
      });
  };

  // 글 등록 (POST)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요!");
      return;
    }

    fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ★ 세션 쿠키 전송
      body: JSON.stringify({ title, content }), // ★ author 삭제
    })
      .then(checkResponse)
      .then(() => {
        setTitle("");
        setContent("");
        setCurrentPage(1);
        fetchPosts(1, keyword);
      })
      .catch((error) => alert(error.message));
  };

  // 글 삭제 (DELETE)
  const handleDelete = (id) => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      fetch(`http://localhost:8080/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include", // ★
      })
        .then(checkResponse)
        .then(() => {
          setSelectedPost(null);
          fetchPosts(currentPage, keyword);
        })
        .catch((error) => alert(error.message));
    }
  };

  // 글 수정 완료 (PUT)
  const handleUpdate = (id, editTitle, editContent) => {
    fetch(`http://localhost:8080/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ★
      body: JSON.stringify({ title: editTitle, content: editContent }),
    })
      .then(checkResponse)
      .then((response) => response.json())
      .then((updated) => {
        setSelectedPost(updated);
        fetchPosts(currentPage, keyword);
      })
      .catch((error) => alert(error.message));
  };

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
      <h2>📌 게시판 프로젝트 (검색 & 페이징)</h2>

      {member ? (
        <div style={{ marginBottom: "20px" }}>
          <strong>{member.nickname}</strong>님 환영합니다.{" "}
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <AuthForm onLogin={setMember} />
      )}

      {selectedPost ? (
        <PostDetail
          selectedPost={selectedPost}
          member={member} // ★ 추가
          onBack={() => {
            setSelectedPost(null);
            fetchPosts(currentPage, keyword);
          }}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ) : (
        <>
          {/* ★ 로그인했을 때만 글쓰기 폼 표시 */}
          {member && (
            <PostForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              onSubmit={handleSubmit}
            />
          )}
          <PostList
            posts={posts}
            onRowClick={handleRowClick}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
          />
        </>
      )}
    </div>
  );
}

export default App;