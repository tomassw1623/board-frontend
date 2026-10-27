import { useState, useEffect } from "react";
import "./App.css";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";

function App() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  // 게시글 목록 불러오기 (검색어와 페이지 번호 반영)
  const fetchPosts = (page = 1, searchKeyword = "") => {
    fetch(
      `http://localhost:8080/api/posts?page=${page}&keyword=${encodeURIComponent(searchKeyword)}`,
    )
      .then((response) => response.json())
      .then((data) => {
        // 백엔드가 보내준 Map 객체에서 posts와 totalPages를 꺼내어 상태에 저장
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      })
      .catch((error) => console.error("목록 조회 실패:", error));
  };

  useEffect(() => {
    fetchPosts(currentPage, keyword);
  }, [currentPage, keyword]);

  // 상세 조회
  const handleRowClick = (id) => {
    fetch(`http://localhost:8080/api/posts/${id}`)
      .then((response) => response.json())
      .then((data) => setSelectedPost(data))
      .catch((error) => console.error("상세 조회 실패:", error));
  };

  // 글 등록 (POST)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !writer) {
      alert("제목과 작성자를 입력해주세요!");
      return;
    }

    fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author: writer }),
    })
      .then(() => {
        setTitle("");
        setContent("");
        setWriter("");
        setCurrentPage(1); // 글 등록 후 첫 페이지로 이동
        fetchPosts(1, keyword);
      })
      .catch((error) => console.error("글 작성 실패:", error));
  };

  // 글 삭제 (DELETE)
  const handleDelete = (id) => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      fetch(`http://localhost:8080/api/posts/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setSelectedPost(null);
          fetchPosts(currentPage, keyword);
        })
        .catch((error) => console.error("삭제 실패:", error));
    }
  };

  // 글 수정 완료 (PUT)
  const handleUpdate = (id, editTitle, editContent) => {
    fetch(`http://localhost:8080/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    })
      .then(() => {
        handleRowClick(id);
        fetchPosts(currentPage, keyword);
      })
      .catch((error) => console.error("수정 실패:", error));
  };

  // 검색 실행 핸들러
  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    setCurrentPage(1); // 검색 시 1페이지로 초기화
  };

  // 페이지 변경 핸들러
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

      {selectedPost ? (
        <PostDetail
          selectedPost={selectedPost}
          onBack={() => setSelectedPost(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ) : (
        <>
          <PostForm
            title={title}
            setTitle={setTitle}
            writer={writer}
            setWriter={setWriter}
            content={content}
            setContent={setContent}
            onSubmit={handleSubmit}
          />
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
