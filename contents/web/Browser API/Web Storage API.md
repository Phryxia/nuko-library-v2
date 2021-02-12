HTTP 통신은 상태를 가정하지 않는다. 그 때문에 상태(ex: 로그인 여부, 사용자 개인화 등)를 갖는 웹 어플리케이션을 개발하기 위해서는 클라이언트에 데이터를 저장할 필요가 있다.

현대 브라우저는 클라이언트 측 데이터 저장을 다음 3가지를 통해서 지원한다.

1. `cookie`
2. `localStorage`
3. `sessionStorage`

이 중 쿠키는 과거부터 널리 쓰여왔었으나 다음과 같은 한계점을 가지고 있다.

- 조작이 어렵고 귀찮다.
- 서버에 요청을 보낼 때마다 전송된다.
- 최대 300건, 호스트당 20건, 용량 4KB만 저장할 수 있다.

이제 `localStorage`와 `sessionStorage`에 대해서 알아보자.



# localStorage

**localStorage**는 특정 HTML 문서의 origin에 대하여 데이터를 키-값 쌍으로 저장하는 간단한 API이다. 브라우저를 종료해도 데이터가 남아있어, 영속성을 갖는 데이터를 저장할 때 적합하다.

키-값 쌍은 UTF-16 DOMString 형식을 사용하며, `number`나 `object` 같은 다른 타입은 자동으로 형변환이 일어난다.

사용법은 다음과 같이 매우 간단하다.

```javascript
// 저장
localStorage.setItem('foo', 'bar');

// 불러오기
const myFoo = localStorage.getItem('foo');

// 삭제
localStorage.removeItem('foo');

// 전체 삭제
localStorage.clear();
```

localStorage는 최대 5MB의 데이터를 저장할 수 있다. 



# sessionStorage

**sessionStorage**는 localStorage와 성질은 동일하지만 세션이 종료되면 데이터가 휘발되는 특성을 갖는 API이다. 또한 세션을 열 때마다 별개의 저장소가 생긴다는 점에서 `cookie`나 `localStorage`와는 다르다.

사용법은 `localStorage`와 동일하다.



# StorageEvent

`localStorage`나 `sessionStorage`에 변화가 생길 경우 발생하는 이벤트로, 다음과 같이 사용할 수 있다.

```javascript
window.addEventListener('storage', (event) => {
    console.log(`value ${event.oldValue} is changed to ${event.newValue} at ${event.storageArea}.`);
});

window.onsotrage = (event) => {
    ...
}
```

`StorageEvent`에 대해서는 MDN [문서](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent)를 참조하자.



# 주의사항

`localStorage`든 `sessionStorage`든 데이터를 암호화하지 않고 평문 그대로 저장하기 때문에, 보안에 민감한 정보를 저장할 때는 여전히 주의를 해야 한다.