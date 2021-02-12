# 쿠키(Cookie)

**쿠키(Cookie)**는 서버에서 브라우저로 저장하는 작은 데이터 조각이다. 저장된 쿠키는 이후 같은 사이트를 이용할 때 서버로 전송된다.

쿠키를 이용하는 전형적인 시나리오로 자동 로그인이 있다. HTTP 통신 자체는 비상태적(Stateless)이기 때문에, 서버가 클라이언트의 상태를 식별하기 위해서 정보를 획득할 필요가 있다. 이 역할을 쿠키가 한다.

모던 웹 개발에서는 쿠키 대신 `localStorage`나 `sessionStorage 사용을 권장하고 있다. 쿠키는 세션이 유지되는 동안, 서버로 요청을 보낼 때 마다 전송되는 반면 후자는 그렇지 않기 때문이다.



## 쿠키 주고받기

기본적으로 쿠키는 서버에서 브라우저에게 생성하라고 요청할 수 있다. 이는 HTTP 헤더를 통해서 설정할 수 있다.

가령 google.com을 검색창에 치면(=GET 요청을 날리면), 구글 서버가 브라우저에 이런 응답을 보내는 것을 확인할 수 있다.

```
set-cookie: __Secure-3PSIDCC=AJi4QfFrx0TmwvOWg5xw7WcYaApbcTe3eDY6PPz5okzYer7pws1zkoYk1_EEKM64x-OppkyVgmA; expires=Fri, 11-Feb-2022 12:16:22 GMT; path=/; domain=.google.com; Secure; HttpOnly; priority=high; SameSite=none
```

이렇게 `set-cookie: key=value;` 형식의 헤더를 서버가 보내면, 브라우저는 자체적으로 쿠키를 저장해둔다.

그 후 구글에 다른 요청을 보낼 때(ex: 구글 로고 이미지 다운로드 요청) HTTP 헤더를 까보면, 저장된 쿠키를 보내는 부분을 볼 수 있다.

```
cookie: SEARCH_SAMESITE=CgQI5JAB; ANID=OPT_OUT; OGPC=19020770-1:; OGP=-19020770:; HSID=A0kNmtx1yeAePbjI5; SSID=AeTbS1F1E0uFbNHL_; APISID=qcPdF7I0_OcTtgjX/ASNb3HaU6mesmHNmM; SAPISID=7OhNvcM5rUq9PfHF/A9-plHit6BxODaTa-; (생략)
```



## 쿠키의 성질

쿠키는 크게 2종류로 나뉜다.

- 세션 쿠키: 현재 세션이 종료되면 자동으로 삭제
- 영속 쿠키: `Expires` 속성에 명시된 날짜에 삭제 또는 `Max-Age` 속성에 명시된 시간 이후 삭제

이때 날짜의 기준은 서버 시간이 아닌 브라우저 시간에서 결정된다.

예컨데 아래 쿠키는 브라우저에 저장된 이후 1시간 동안 생존한다.

```
Set-Cookie: id=babo; Max-Age=3600;
```



## JavaScript로 쿠키 건드리기

기본적으로 쿠키는 서버에서 설정을 요청하지만, JavaScript가 실행될 때 쿠키를 설정할 수도 있다.

```javascript
const currentCookie = document.cookie;

document.cookie = 'id=babo; Max-Age=3600;';
```

이때 주의할 점은, key나 value에 들어갈 수 없는 문자가 있다는 것이다.

- 공백 (ex: key=my word;)
- 세미콜론 (ex: message=weird;;)
- 콤마 (ex: coordinate=3,7;)

이런 값을 넣어야 할 경우 `encodeURIComponent` 함수를 이용하여 변환을 거친 후 넣으면 된다. 반대로 변환된 문자열을 원상태로 복구하려면 `decodeURIComponent` 함수를 이용하면 된다.

쿠키를 JavaScript로 조작할 때 주의할 점으로 다음과 같은 것들이 있다.

- 크롬의 경우, 로컬 파일에서 쿠키 조작을 시도하면 이를 무시한다.
- 너무 자주 쿠키를 설정하려고 할 경우, 비정상 작동하는 것이 보고된 적 있다. ([link](https://stackoverflow.com/a/36680074/3811223))



## 쿠키 조작 라이브러리

위에서 보듯 쿠키를 직접 문자열로 조작하는 것은 너무 버겁다는 것을 알 수 있다. 특히 어떤 값을 추가하거나 삭제하는 것이 너무 번거롭다.

이를 위해 여러가지 라이브러리가 있으며, 그 중 괜찮은 라이브러리로 `js-cookie`([link](https://github.com/js-cookie/js-cookie))가 있다. 쿠키 라이브러리 중 가장 진보하고 고도화된 것이다.

사용법을 맛만 보자면 다음과 같다.

```javascript
import Cookies from 'js-cookie';

// 쿠키 설정
Cookies.set('foo', 'bar');

// 쿠키 조회
Cookies.get('foo');

// 특정 키 삭제
Cookies.remove('foo');
```

관심이 있으면 깃허브 페이지를 방문해보자.