# nuko::library-v2

**nuko::library-v2**는 심심해서 만든 마크다운 기반 정적 블로그입니다. `contents` 폴더에 마크다운 파일을 추가한 뒤, 빌드를 하면 추가된 파일들을 HTML 파일로 변환합니다.

변환은 `node.js`를 이용하며, 빌드된 결과물들은 정적으로 제공됩니다.

사용한 기술은 다음과 같습니다.

- JavaScript
- markdown-it
- node.js
- ejs



## 개발환경설정

```
// 의존성 설치
npm i

// 새 콘텐츠 추가 시 빌드
npm run build 

// 테스트용 서버 (http-server 필요)
npm run boot
```
