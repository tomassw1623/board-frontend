import { useState } from "react";
import { login, signup } from "../api";

function AuthForm({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "login") {
      login({ username, password })
        .then((member) => {
          setPassword("");
          onLogin(member);
        })
        .catch((error) => alert(error.message));
    } else {
      signup({ username, password, nickname })
        .then(() => {
          alert("회원가입이 완료되었습니다. 로그인해주세요.");
          setPassword("");
          setNickname("");
          setMode("login");
        })
        .catch((error) => alert(error.message));
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
    marginBottom: "10px",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>{mode === "login" ? "🔑 로그인" : "📝 회원가입"}</h3>

      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      {mode === "signup" && (
        <input
          type="text"
          placeholder="닉네임 (2~20자)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={inputStyle}
        />
      )}

      <button
        type="submit"
        style={{
          padding: "8px 15px",
          marginRight: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {mode === "login" ? "로그인" : "가입하기"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        style={{
          padding: "8px 15px",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {mode === "login" ? "회원가입으로" : "로그인으로"}
      </button>
    </form>
  );
}

export default AuthForm;