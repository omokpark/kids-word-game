# Kids Word Game - Claude 지침

## 프로젝트 개요
한국 어린이 대상 영어 단어 학습 게임. React + Vite, 외부 라이브러리 없음.
배포: https://omokpark.github.io/kids-word-game/

## 기술 스택
- React 18 + Vite (JSX)
- Web Speech API (발음), Web Audio API (효과음)
- localStorage (진행 저장)
- GitHub Pages 자동 배포 (master, v2-update 브랜치 push 시)

## 코드 구조
- 모든 컴포넌트와 로직이 `src/App.jsx` 한 파일에 집중
- 외부 라이브러리 추가 금지 (현재 구조 유지)

## Git 작업 규칙
- **작업 시작 전 반드시 `git pull` 먼저** (집↔회사 PC 이동 시 필수)
- 기능 하나당 브랜치 하나: `feature/기능명`
- master에 직접 커밋 금지 — 브랜치 작업 후 머지
- 자리 뜨기 전 반드시 commit + push

## 대화 트리거
- 사용자가 **"작업 시작할게"** 라고 하면 → `git pull` 실행 후 현재 브랜치/상태 보고
- 사용자가 **"마무리 해줘"** 라고 하면 → 변경사항 커밋 + push + 배포 URL 안내

## 배포
- master 또는 v2-update에 push하면 GitHub Actions가 자동 배포
- 배포까지 약 1~2분 소요

## UX 원칙
- 아동 친화적 문구 (비속어, 어려운 단어 금지)
- 큰 버튼, 터치 친화적 UI 유지
- 한국어 UI + 영어 단어 학습 구조 유지
