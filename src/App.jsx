import { useState, useEffect } from "react";
import "./App.css";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  // 게시글 목록 불러오기
  const fetchPosts = () => {
    fetch("http://localhost:8080/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("목록 조회 실패:", error));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
        fetchPosts();
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
          fetchPosts();
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
        fetchPosts();
      })
      .catch((error) => console.error("수정 실패:", error));
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
          <PostList posts={posts} onRowClick={handleRowClick} />
        </>
      )}
    </div>
  );
}

export default App;
