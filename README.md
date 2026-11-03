# 게시판 프로젝트 - Frontend

React + Vite로 만든 게시판 프런트엔드입니다.
백엔드(Spring Boot) 저장소: https://github.com/tomassw1623/board-backend

## 기능

- 회원가입 / 로그인 / 로그아웃
- 게시글 목록 (검색, 페이징), 상세, 작성, 수정, 삭제
- 댓글 작성 / 삭제
- 로그인한 사용자만 글·댓글 작성, 본인 글·댓글에만 수정·삭제 버튼 표시

## 실행 방법

백엔드를 먼저 실행해 주세요 (http://localhost:8080).

```bash
npm install
npm run dev
```

접속 주소: http://localhost:5173

## 구조

```
src/
├── api.js            # 공통 응답 처리, 로그인 관련 API
├── App.jsx           # 상태 관리, 목록/상세 전환
└── components/
    ├── AuthForm.jsx      # 로그인 / 회원가입
    ├── PostForm.jsx      # 글 작성
    ├── PostList.jsx      # 목록, 검색, 페이징
    └── PostDetail.jsx    # 상세, 수정, 댓글
```
