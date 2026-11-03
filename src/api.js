// src/api.js
const MEMBER_URL = "http://localhost:8080/api/members";

// 응답이 실패(4xx, 5xx)면 서버가 준 메시지로 예외를 던진다
export const checkResponse = async (response) => {
  if (response.ok) return response;
  const err = await response.json().catch(() => null);
  const detail = err?.errors ? Object.values(err.errors).join("\n") : "";
  throw new Error(detail || err?.message || "요청에 실패했습니다.");
};

// 회원가입
export const signup = (data) =>
  fetch(`${MEMBER_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(checkResponse);

// 로그인 (credentials: "include" → 세션 쿠키를 주고받는다)
export const login = (data) =>
  fetch(`${MEMBER_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(checkResponse)
    .then((res) => res.json());

// 로그아웃
export const logout = () =>
  fetch(`${MEMBER_URL}/logout`, {
    method: "POST",
    credentials: "include",
  }).then(checkResponse);

// 내 정보 (로그인 안 했으면 null)
export const fetchMe = () =>
  fetch(`${MEMBER_URL}/me`, { credentials: "include" })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);