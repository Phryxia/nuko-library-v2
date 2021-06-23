# nuko::library-v2

**nuko::library-v2**는 심심해서 만든 마크다운 기반 정적 블로그입니다. `contents` 폴더에 마크다운 파일을 추가한 뒤, 빌드를 하면 추가된 파일들을 HTML 파일로 변환합니다.

변환은 `node.js`를 이용하며, 빌드된 결과물들은 정적으로 제공됩니다.

사용한 기술은 다음과 같습니다.

- JavaScript
- markdown-it
- node.js
- ejs

원래 이 프로젝트는 [React를 써서 개발](https://github.com/Phryxia/nuko-library)한 적이 있는데, CSR만 지원하였기 때문에 SEO가 불가능했습니다.

그래서 SEO를 할 수 있으면서 난이도가 그렇게 높지 않은 기술들을 선택하게 되었습니다. 


## 개발환경설정

```
// 의존성 설치
npm i

// 새 콘텐츠 추가 시 빌드
npm run build 

// 테스트용 서버 (http-server 필요)
npm run boot
```
