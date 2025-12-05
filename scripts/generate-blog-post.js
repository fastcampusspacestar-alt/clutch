import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Anthropic API 클라이언트 초기화
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 기존 블로그 포스트 목록 가져오기
async function getExistingPosts() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  try {
    const files = await fs.readdir(blogDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    const posts = await Promise.all(
      mdFiles.map(async (file) => {
        const content = await fs.readFile(path.join(blogDir, file), 'utf-8');
        const titleMatch = content.match(/title:\s*['"](.+)['"]/);
        return {
          filename: file,
          title: titleMatch ? titleMatch[1] : file,
        };
      })
    );

    return posts;
  } catch (error) {
    console.error('기존 포스트를 불러오는 중 오류:', error);
    return [];
  }
}

// Unsplash 이미지 URL 생성 (랜덤)
function getRandomUnsplashImage(topic) {
  const imageIds = {
    subway: '1514565131-fce0801e5785',
    bus: '1544620347-c4fd4a3d5957',
    transportation: '1449965325223-d87d00624c6b',
    crutches: '1576091160399-112ba8d25d1d',
    safety: '1583947215259-38e31be8751f',
    medical: '1631549916768-4119b2e5f926',
    health: '1505751172876-fa1923c5c528',
    stairs: '1483664852095-d6cc6870702d',
    accessibility: '1573496359142-b8d87734a5a2',
  };

  const keys = Object.keys(imageIds);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return `https://images.unsplash.com/photo-${imageIds[randomKey]}?w=800&q=80`;
}

// 파일명 생성 (영문 소문자와 하이픈)
function generateFilename(title) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `crutch-blog-${timestamp}-${random}.md`;
}

// Claude에게 블로그 포스트 생성 요청
async function generateBlogPost(existingPosts) {
  const existingTitles = existingPosts.map(p => `- ${p.title}`).join('\n');

  const claudeInstructions = `당신은 목발 안전 정보 웹사이트를 위한 블로그 작성자입니다.

## 작성 규칙
1. **최소 5000자 이상** 작성 (공백 포함)
2. **자연스러운 구어체** 사용 (AI 느낌 최소화)
3. 개인적인 경험이나 사례 포함
4. **새로운 주제** 선정 (아래 기존 포스트와 중복 금지)

## 기존 포스트 목록
${existingTitles}

## 주제 카테고리
- 기본 사용법: 높이 조절, 보행법, 계단 이용, 자세 교정
- 일상생활: 집안 안전, 요리, 청소, 목욕, 옷 입기
- 외출 준비: 대중교통, 날씨 대비, 쇼핑, 외식
- 건강 관리: 스트레칭, 근력 운동, 통증 관리, 피부 관리
- 계절별: 봄/여름/가을 안전, 장마철 대비
- 심리/동기부여: 회복 과정, 긍정적 마인드, 경험담
- 응급 대처: 위험 신호, 응급 상황, 병원 연락 타이밍
- 제품 정보: 목발 종류, 액세서리, 관리 방법

## 반환 형식 (JSON)
다음 JSON 형식으로 **정확하게** 반환하세요:

\`\`\`json
{
  "title": "SEO 최적화된 제목 (키워드 포함)",
  "description": "120-160자 메타 설명",
  "content": "마크다운 형식의 본문 내용 (최소 5000자)",
  "imageUrl": "{{IMAGE_PLACEHOLDER}}"
}
\`\`\`

**중요:**
- JSON만 반환하고 다른 설명은 넣지 마세요
- content에는 frontmatter를 포함하지 마세요 (title, description, pubDate 제외)
- 본문은 마크다운 형식으로 작성
- 제목은 실용적이고 검색 친화적으로
- 독자에게 말 걸듯이 친근하게 작성
- 이모지는 적절히 사용 (과하지 않게)

지금 새로운 블로그 포스트를 작성해주세요.`;

  try {
    console.log('Claude에게 블로그 포스트 생성 요청 중...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: claudeInstructions,
        },
      ],
    });

    const responseText = message.content[0].text;
    console.log('Claude 응답 수신 완료');

    // JSON 파싱
    const jsonMatch = responseText.match(/```json\n([\s\S]+?)\n```/) ||
                      responseText.match(/\{[\s\S]+\}/);

    if (!jsonMatch) {
      throw new Error('JSON 형식을 찾을 수 없습니다');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const blogData = JSON.parse(jsonStr);

    // 이미지 URL 삽입
    const imageUrl = getRandomUnsplashImage('crutches');
    blogData.content = blogData.content.replace('{{IMAGE_PLACEHOLDER}}', imageUrl);

    // 이미지가 없으면 중간에 삽입
    if (!blogData.content.includes('![')) {
      const paragraphs = blogData.content.split('\n\n');
      const middleIndex = Math.floor(paragraphs.length / 2);
      paragraphs.splice(
        middleIndex,
        0,
        `\n![목발 사용 관련 이미지](${imageUrl})\n\n*안전한 목발 사용을 위한 정보를 제공합니다.*\n`
      );
      blogData.content = paragraphs.join('\n\n');
    }

    return blogData;
  } catch (error) {
    console.error('블로그 포스트 생성 오류:', error);
    throw error;
  }
}

// 블로그 포스트 파일 저장
async function saveBlogPost(blogData) {
  const filename = generateFilename(blogData.title);
  const filePath = path.join(__dirname, '../src/content/blog', filename);

  const today = new Date().toISOString().split('T')[0];

  const frontmatter = `---
title: '${blogData.title}'
description: '${blogData.description}'
pubDate: ${today}
---

`;

  const fullContent = frontmatter + blogData.content;

  await fs.writeFile(filePath, fullContent, 'utf-8');
  console.log(`✅ 블로그 포스트 저장 완료: ${filename}`);

  return filename;
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 자동 블로그 포스트 생성 시작');

    // API 키 확인
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다');
    }

    // 기존 포스트 확인
    console.log('📚 기존 블로그 포스트 확인 중...');
    const existingPosts = await getExistingPosts();
    console.log(`기존 포스트 ${existingPosts.length}개 발견`);

    // 블로그 포스트 생성
    const blogData = await generateBlogPost(existingPosts);

    // 파일 저장
    const filename = await saveBlogPost(blogData);

    console.log('✨ 블로그 포스트 생성 완료!');
    console.log(`   제목: ${blogData.title}`);
    console.log(`   파일: ${filename}`);
    console.log(`   글자 수: ${blogData.content.length}자`);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

// 실행
main();
