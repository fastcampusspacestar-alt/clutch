# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based blog site using the official Astro blog starter template. The project uses Astro's Content Collections for managing blog posts with support for both Markdown and MDX formats.

## Development Commands

All commands run from the project root:

- `npm install` - Install dependencies
- `npm run dev` - Start development server at `localhost:4321`
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview production build locally
- `npm run astro ...` - Run Astro CLI commands (e.g., `npm run astro add`, `npm run astro check`)

## Architecture

### Content Collections System

Blog posts are managed through Astro's Content Collections API (defined in `src/content.config.ts`):

- Collection name: `blog`
- Location: `src/content/blog/`
- Supported formats: `.md` and `.mdx` files
- Frontmatter schema includes: `title`, `description`, `pubDate`, `updatedDate` (optional), `heroImage` (optional)
- Uses glob loader pattern: `**/*.{md,mdx}`

### Routing Architecture

- **File-based routing**: Pages in `src/pages/` automatically become routes
- **Dynamic blog routes**: `src/pages/blog/[...slug].astro` handles all blog post URLs using `getStaticPaths()`
- Blog post IDs from Content Collections map directly to URL slugs (`/blog/{post.id}/`)

### Layout System

- `src/layouts/BlogPost.astro` - Main blog post layout wrapper that accepts Collection Entry data as props
- All blog posts use this layout which includes header, footer, hero image support, and formatted dates
- Blog content is rendered via `render(post)` which returns a `<Content />` component

### Global Configuration

- `src/consts.ts` - Centralized site metadata (`SITE_TITLE`, `SITE_DESCRIPTION`)
- `astro.config.mjs` - Site URL configuration (currently set to `https://example.com`) and integrations (MDX, sitemap)

### RSS Feed

- Generated at `/rss.xml` via `src/pages/rss.xml.js`
- Automatically includes all blog posts from the Content Collections
- Uses site metadata from `src/consts.ts`

### Image Handling

Astro's built-in `Image` component from `astro:assets` is used for optimized image processing. Images can be:
- Imported from `src/assets/` (processed at build time)
- Referenced in blog post frontmatter as `heroImage`

## TypeScript Configuration

- Uses Astro's strict TypeScript preset (`astro/tsconfigs/strict`)
- `strictNullChecks` enabled
- Type safety for Content Collections via `CollectionEntry<'blog'>` type

---

## 블로그 작성 규칙 (Blog Writing Guidelines)

### 블로그 주제
이 블로그는 **목발 안전 정보 웹사이트**를 홍보하기 위한 콘텐츠 마케팅 블로그입니다.
- 목발 사용법, 안전 수칙, 일상생활 팁, 응급 대처, 재활 정보 등을 다룹니다
- 목발을 처음 사용하는 분들과 장기 사용자 모두를 대상으로 합니다

### 자동 블로그 생성 트리거
사용자가 **"새글작성"**이라고 입력하면, 자동으로 새로운 블로그 포스트를 생성합니다.

### 필수 작성 규칙

1. **파일 형식**
   - `.md` (마크다운) 포맷으로 작성
   - 파일 위치: `src/content/blog/`
   - 파일명: 영문 소문자와 하이픈 사용 (예: `crutch-safety-winter.md`)

2. **글자 수**
   - 최소 **5000자 이상** 작성 (공백 포함)
   - 충분한 정보와 깊이 있는 내용 제공

3. **SEO 최적화**
   - 제목에 키워드 자연스럽게 포함
   - 메타 description을 120-160자로 작성
   - H2, H3 헤딩 태그 적절히 사용
   - 내부 링크 포함 (이전 포스트나 서비스 페이지)
   - 롱테일 키워드 활용
   - 검색 의도에 맞는 콘텐츠 구성

4. **이미지 삽입 (필수)**
   - 글 중간에 **최소 1개 이상** 이미지 삽입
   - 이미지는 **Unsplash**에서 검색해서 사용
   - Unsplash 이미지 URL 형식: `https://images.unsplash.com/photo-[id]?w=800&q=80`
   - 이미지에 적절한 alt 텍스트 추가 (SEO 및 접근성)
   - 마크다운 이미지 문법: `![alt text](image-url)`

5. **작성 톤 & 스타일**
   - 자연스러운 구어체 사용 (AI 느낌 최소화)
   - 독자에게 말 걸듯이 친근하게 작성
   - 개인적인 경험이나 사례 포함
   - 과도한 전문 용어 지양, 쉬운 설명 우선
   - 이모지는 적절히 사용 (과하지 않게)

6. **주제 다양성**
   - 매번 **새로운 주제**로 작성
   - 이전에 작성한 포스트와 중복되지 않도록 주의
   - 계절, 시기, 독자 상황에 맞는 주제 선택

7. **콘텐츠 구조**
   - 도입부: 독자의 공감과 관심 유도
   - 본문: 구체적인 정보와 팁 (리스트, 체크리스트 활용)
   - 결론: 목발 안전 정보 웹사이트 자연스럽게 홍보
   - CTA(Call to Action): 서비스 이용 권유

8. **Frontmatter 필수 항목**
   ```yaml
   ---
   title: 'SEO 최적화된 제목 (키워드 포함)'
   description: '120-160자 메타 설명'
   pubDate: YYYY-MM-DD (작성일)
   ---
   ```

### 주제 아이디어 카테고리

- **기본 사용법**: 높이 조절, 보행법, 계단 이용, 자세 교정
- **일상생활**: 집안 안전, 요리, 청소, 목욕, 옷 입기
- **외출 준비**: 대중교통, 날씨 대비, 쇼핑, 외식
- **건강 관리**: 스트레칭, 근력 운동, 통증 관리, 피부 관리
- **계절별**: 여름/겨울 안전, 장마철 대비, 눈길 보행
- **심리/동기부여**: 회복 과정, 긍정적 마인드, 경험담
- **응급 대처**: 위험 신호, 응급 상황, 병원 연락 타이밍
- **제품 정보**: 목발 종류, 액세서리, 관리 방법

### 예시 워크플로우

사용자 입력: "새글작성"

→ Claude 작업:
1. 기존 블로그 포스트 확인 (주제 중복 방지)
2. 새로운 주제 선정
3. SEO 키워드 리서치
4. Unsplash에서 관련 이미지 검색
5. 5000자 이상 블로그 포스트 작성 (자연스러운 톤)
6. `src/content/blog/` 폴더에 `.md` 파일 생성
7. 작성 완료 알림 및 미리보기 URL 제공
