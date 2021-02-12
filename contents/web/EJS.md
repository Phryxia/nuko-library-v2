# Embeded JavaScript(EJS)

**EJS**는 순수 JavaScript를 활용한 SSR 템플릿 스크립트이다. 백엔드에서 `node.js`를 사용할 경우 js를 사용한다는 점에서 궁합이 좋다. 배우기 쉽고 간단하다는 장점이 있다.



# 맛보기

터미널을 열고 아래 명령어를 실행하여 `ejs`를 설치한다.

```
npm i ejs
```



설치가 끝나면 먼저 템플릿을 작성한 뒤 `template.ejs`라고 저장하자.

```ejs
<!DOCTYPE html>
<html>
    <head>
        <title><%= title %></title>
    </head>
    <body>
        <!-- 제목 -->
        <h1><%= title %></h1>
        
        <!-- 이름들 -->
        <% list.forEach(entry => { %>
        <div><%= entry %></div>
        <% }) %>
    </body>
</html>
```



그 후 `node.js`를 위한 스크립트를 작성한다. 이 예제는 템플릿을 사용하여 웹페이지 사전 렌더링을 한다.

```javascript
const fs = require('fs');
const ejs = require('ejs');

// 템플릿에 밀어넣을 데이터 준비
const data = {
    title: 'Hello World', 
	list: ['민수', '철수', '영희', '지수']
};

// 템플릿 파일을 열어서 HTML 파일로 저장한다.
ejs.renderFile('template.ejs', data, (ejserror, html) => {
	// 에러 체크
    if (ejserror) {
        console.log(ejserror);
        return;
    }
    
    // HTML 파일로 저장
    fs.writeFile('output.html', html, (fserror) => {
        if (fserror)
            console.log(fserror);
    });
});
```



SSR로 제공하고 싶으면 `express.js`같은 걸 써서 동적으로 요청에 응답하면 된다. 용도에 따라 유연하게 쓸 수 있는 것이 `ejs`의 장점이다. 아래와 같이 다양한 함수로 HTML을 템플릿으로부터 뽑아낼 수 있다.

```javascript
const template = ejs.compile('<%= name %>');
template({ name: '누꼬' }); // HTML 문자열 반환

ejs.render('<%s= name %>', { name: '누꼬' }); // HTML 문자열 반환

ejs.renderFile('template.ejs', { name: '누꼬' }, (err, html) => {
    // HTML 문자열을 콜백으로 전달
});
```



쉽고 편리하다! EJS에 관심이 생겼다면 [공식 홈페이지](https://ejs.co/)에서 배워보도록 하자. 여담으로 이 블로그도 EJS를 사용한 사전 렌더링 방식으로 제공되고 있다.