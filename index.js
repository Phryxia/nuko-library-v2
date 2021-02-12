const fs = require('fs');
const nodepath = require('path');
const ejs = require('ejs');

// 마크다운 라이브러리
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const mk = require('@traptitech/markdown-it-katex');
const footnote = require('markdown-it-footnote');
const msup = require('markdown-it-sup');
const msub = require('markdown-it-sub');

// Markdown-it 설정
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      }
      catch (_) {}
      return '';
    }
  }
});

// Katex 지원
md.use(mk, {'errorColor': '#c41020'});

// Footnote 지원
md.use(footnote);

// Superscript
md.use(msup);

// Subsript
md.use(msub);

// md파일들의 구조를 object로 색인한다.
function preprocessDir(path) {
  const files = fs.readdirSync(path, { withFileTypes: true });
  const out = {
    path,
    files: [],
    children: []
  };

  files.forEach(file => {
    // 폴더가 아니면서 마크다운 파일이 아닌 것은 무조건 넘긴다
    if (!file.isDirectory() && !file.name.match(/\.md$/))
      return;
    
    if (file.isFile()) {
      out.files.push(nodepath.join(path, file.name));
    }

    if (file.isDirectory()) {
      out.children.push(preprocessDir(nodepath.join(path, file.name)));
    }
  });

  return out;
}

const index = preprocessDir('contents');
console.log(index);

function processDir(path) {
  const files = fs.readdirSync(path, { withFileTypes: true });

  files.forEach(file => {
    // 폴더가 아니면서 마크다운 파일이 아닌 것은 무조건 넘긴다
    if (!file.isDirectory() && !file.name.match(/\.md$/))
      return;
    
    // .md 파일을 발견하였으므로 렌더링 한다.
    if (file.isFile()) {
      render(file, path);
    }
    
    // 폴더인 경우 재귀적으로 탐색한다.
    if (file.isDirectory()) {
      processDir(nodepath.join(path, file.name));
    }
  });
}

/**
 * 시간을 리포매팅한다.
 * @param {string} birthtime 
 */
function formatBirthtime(birthtime) {
  const date = new Date(birthtime);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

/**
 * path에 있는 마크다운 파일 dirent를 렌더링한다. 
 * @param {fs.Dirent} dirent 
 * @param {string} path 
 */
function render(dirent, path) {
  console.log(`[System] Render ${dirent.name} on ${path}`);

  // 확장자 뗀 순수 이름
  const pureName = dirent.name.substring(0, dirent.name.length - 3);

  // ejs파일에 넣을 데이터
  const data = {
    title: pureName,
    lastModified: formatBirthtime(fs.statSync(path).birthtime),
    content: '',
    index
  };

  // 마크다운 파일을 읽는다
  fs.readFile(nodepath.join(path, dirent.name), { encoding: 'utf8' }, (err, markdown) => {
    // 에러 처리
    if (err)
    {
      console.log('[System] Render Error');
      console.log(err);
      return ;
    }

    data.content = md.render(markdown);

    ejs.renderFile('./src/template.ejs', data, (ejsError, html) => {
      // 에러 처리
      if (ejsError) {
        console.log('[System] EJS Error');
        console.log(ejsError);
        return;
      }
    
      // 폴더 만들기
      fs.mkdirSync(nodepath.join('./dist', path), { recursive: true });

      // HTML 처리
      const htmlFileName = pureName + '.html';
      fs.writeFile(nodepath.join('./dist', path, htmlFileName), html, (fsError) => {
        if (fsError) {
          console.log('[System] fs Error');
          console.log(fsError);
        }
      });
    });
  });
}

processDir('./contents');