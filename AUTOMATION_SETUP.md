# 자동 블로그 포스트 생성 설정 가이드

이 가이드는 매일 3회 (00시, 08시, 16시) 자동으로 블로그 포스트를 생성하고 GitHub에 커밋하는 시스템을 설정하는 방법을 안내합니다.

## 📋 사전 준비

### 1. Anthropic API 키 발급

1. [Anthropic Console](https://console.anthropic.com/)에 접속
2. 계정 생성 또는 로그인
3. **API Keys** 메뉴에서 새 API 키 생성
4. 생성된 API 키를 안전한 곳에 복사 (다시 볼 수 없습니다!)

> **참고:** API 사용에는 비용이 발생합니다. [요금 정보](https://www.anthropic.com/pricing)를 확인하세요.

### 2. GitHub Secrets 설정

1. GitHub 저장소로 이동
2. **Settings** > **Secrets and variables** > **Actions** 클릭
3. **New repository secret** 버튼 클릭
4. Secret 추가:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** 위에서 복사한 Anthropic API 키
5. **Add secret** 클릭

## 🚀 사용 방법

### 자동 실행 (스케줄)

GitHub Actions가 다음 시간에 자동으로 실행됩니다:
- **매일 00시** (KST)
- **매일 08시** (KST)
- **매일 16시** (KST)

추가 설정 없이 자동으로 동작합니다!

### 수동 실행

필요시 수동으로 블로그 포스트를 생성할 수 있습니다:

1. **GitHub Actions에서 실행:**
   - GitHub 저장소 > **Actions** 탭
   - **Auto Generate Blog Post** 워크플로우 선택
   - **Run workflow** 버튼 클릭

2. **로컬에서 실행:**
   ```bash
   # 환경 변수 설정 (Windows PowerShell)
   $env:ANTHROPIC_API_KEY="your-api-key-here"

   # 또는 환경 변수 설정 (Linux/Mac)
   export ANTHROPIC_API_KEY="your-api-key-here"

   # 의존성 설치 (처음 한 번만)
   npm install

   # 블로그 포스트 생성
   npm run generate-post
   ```

## 📁 파일 구조

```
clutch/
├── .github/
│   └── workflows/
│       └── auto-blog-post.yml       # GitHub Actions 워크플로우
├── scripts/
│   └── generate-blog-post.js        # 블로그 생성 스크립트
├── src/
│   └── content/
│       └── blog/                    # 생성된 블로그 포스트 저장 위치
├── package.json                     # 프로젝트 설정
└── AUTOMATION_SETUP.md              # 이 파일
```

## ⚙️ 작동 방식

1. **스케줄 트리거:** 설정된 시간(00시, 08시, 16시)에 GitHub Actions가 자동 실행
2. **기존 포스트 확인:** 중복되지 않도록 기존 블로그 제목 수집
3. **AI 생성:** Claude API를 사용하여 5000자 이상의 새 블로그 포스트 생성
4. **이미지 추가:** Unsplash에서 관련 이미지 자동 삽입
5. **파일 저장:** `src/content/blog/` 디렉토리에 마크다운 파일 저장
6. **Git 커밋 & 푸시:** 변경사항을 자동으로 커밋하고 GitHub에 푸시

## 🔧 커스터마이징

### 스케줄 시간 변경

`.github/workflows/auto-blog-post.yml` 파일에서 cron 표현식을 수정:

```yaml
schedule:
  # 원하는 시간으로 변경 (UTC 기준)
  - cron: '0 15 * * *'  # KST 00:00
  - cron: '0 23 * * *'  # KST 08:00
  - cron: '0 7 * * *'   # KST 16:00
```

> **참고:** GitHub Actions는 UTC 시간을 사용합니다. KST는 UTC+9입니다.

### 생성 규칙 수정

`scripts/generate-blog-post.js` 파일의 `claudeInstructions` 변수를 수정하여:
- 최소 글자 수 변경
- 작성 톤 조정
- 주제 카테고리 추가/제거

### Claude 모델 변경

`scripts/generate-blog-post.js`의 `model` 파라미터 변경:

```javascript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',  // 다른 모델로 변경 가능
  // ...
});
```

사용 가능한 모델:
- `claude-sonnet-4-20250514` (추천, 균형잡힌 성능)
- `claude-opus-4-20250514` (최고 품질, 더 비쌈)
- `claude-haiku-4-20250514` (빠르고 저렴, 품질 낮음)

## 💰 비용 예상

- **Claude Sonnet 4:**
  - 입력: ~1,000 토큰 = $0.003
  - 출력: ~10,000 토큰 = $0.15
  - **포스트당 약 $0.15**

- **하루 3회 × 30일 = 월 약 $13.50**

> 실제 비용은 생성되는 포스트 길이에 따라 달라집니다.

## 🐛 문제 해결

### 워크플로우가 실행되지 않아요

1. GitHub Secrets에 `ANTHROPIC_API_KEY`가 올바르게 설정되었는지 확인
2. Actions 탭에서 워크플로우가 활성화되어 있는지 확인
3. 저장소 Settings > Actions > General에서 "Allow all actions" 선택 확인

### API 키 오류가 발생해요

- API 키가 유효한지 확인
- [Anthropic Console](https://console.anthropic.com/)에서 API 사용량 및 한도 확인
- 결제 정보가 등록되어 있는지 확인

### 포스트가 생성되지 않아요

1. Actions 탭에서 워크플로우 로그 확인
2. 로컬에서 수동 실행하여 오류 메시지 확인:
   ```bash
   npm run generate-post
   ```

### 같은 주제가 반복돼요

- Claude에게 더 구체적인 지시사항 추가
- `scripts/generate-blog-post.js`의 주제 카테고리 확장

## 📚 참고 자료

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Anthropic API 문서](https://docs.anthropic.com/)
- [Cron 표현식 생성기](https://crontab.guru/)

## 🔒 보안 주의사항

- ⚠️ **절대로 API 키를 코드에 직접 입력하지 마세요**
- ⚠️ `.env` 파일을 사용하는 경우 `.gitignore`에 추가하세요
- ✅ GitHub Secrets를 통해서만 API 키를 관리하세요
- ✅ API 키가 노출된 경우 즉시 폐기하고 새로 발급하세요

## 📞 지원

문제가 발생하거나 질문이 있으면:
1. [Issues](../../issues)에 문의
2. 워크플로우 로그 확인
3. Anthropic Console에서 API 상태 확인

---

**Happy Blogging! 🎉**
