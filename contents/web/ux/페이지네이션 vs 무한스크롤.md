# 페이지네이션(Pagination)

**페이지네이션(Pagination)** 이란, 거대한 정보가 있을 때 이를 적절히 페이지로 나누어서 클라이언트에 띄우는 작업을 말한다. 

가령 서버에 100만장의 이미지가 있다고 가정하자. 이를 브라우저에 한 번에 띄우면 곤란할 것이다. 이때 1번 ~ 100번 그림을 1페이지에 띄우고, 101번 ~ 200번 그림을 2페이지에 띄우는 방식을 사용할 수 있다. 이것이 페이지네이션의 개념이다.



## 페이지네이션의 구현

페이지네이션을 구현하기 위해서는 API에서 페이지 ID 또는 오프셋 파라미터를 받을 수 있어야 한다. 예컨데 [Safebooru API](https://safebooru.org/index.php?page=help&topic=dapi)는 다음과 같은 파라미터를 받는다.

- `limit`: 한 페이지에 몇 개의 이미지를 불러올 것인가?
- `pid`: 몇 번째 페이지의 정보를 원하는가?

일단 페이지네이션을 구현하기 위해서는 데이터를 받아오는 함수가 있어야 할 것이다.

```javascript
function loadPage(pid, limit, onLoad) {
    // 몇 번째 데이터부터 받을지 계산 (API가 오프셋을 요구하는 경우)
    const offset = pid * limit;
    
	// 데이터를 받아와서 처리한다.
    fetch(`https://example.com/api?limit=${limit}&offset=${offset}`)
	.then(response => response.json())
	.then(json => onLoad(json))
	.catch(exception => handle(exception));
} 
```

이제 페이지네이션을 수행할 네비게이션을 간단하게 만들어보자. 아래의 경우 클라이언트 사이드 렌더링을 한다고 가정하고 코드를 짠 것이다.

```javascript
// pidStart ~ pidEnd 페이지로 이동하는 버튼들을 만든다.
function createNavigation(pidStart, pidEnd, pidCurrent) {
    // 페이지 이동 버튼들을 포함할 컨테이너
    const $container = document.createElement('div');
    
    // 각 페이지 별로
	for (let pid = pidStart; pid <= pidEnd; ++pid) {
        // 버튼을 만든다
        const $a = document.createElement('a');
        $a.innerText = `${pid}`;
        
        // 이벤트 리스너를 달아준다.
        $a.onclick = (event) => {
            loadPage(pid, 100, json => {
                process(json);
            });
        };
        
        // 현재 페이지의 경우 특별한 처리를 해준다.
        if (pid === pidCurrent)
	        $a.className = 'selected';
        
        // 컨테이너에 버튼을 등록한다
        $container.appendChild($a);
    }
    
    return $container;
}
```

여기서 조금 문제가 되는 점이, *마지막 페이지를 어떻게 아느냐*는 것이다. 이는 API가 제공하는 값에 따라 구현 가능 여부가 갈린다. Safebooru API의 경우, 검색결과에 대해 전체 콘텐츠가 몇 개인지 반환한다. 이 숫자를 알면 전체 페이지 수도 계산할 수 있다. 예를 들어 콘텐츠가 1000개 있고, 한 페이지에 100개씩 불러온다면, 최대 페이지는 10페이지가 될 것이다.



## 페이지네이션의 특징

- 구현이 쉽다.
- 콘텐츠가 앞으로 얼마나 남았는지를 파악하기 쉽다.
- 즐겨찾기가 가능하다.
- 무한스크롤에 비해 UX적인 측면에서는 다소 귀찮다.



# 무한스크롤(Infinite Scroll)

**무한 스크롤(Infinite Scroll)** 은 쪼개지지 않은 단일 공간에서 최하단까지 스크롤을 하여 콘텐츠를 다 읽을 때, 새로운 콘텐츠를 로드하는 방식의 UX이다.

페이지네이션과 다르게 페이지 개념이 없다.



## 무한 스크롤의 구현

무한 스크롤의 핵심은 스크롤이 최하단에 도달하면 새 콘텐츠를 불러온다는 것이다. 이를 위해 현재 어디까지 콘텐츠를 불러왔는지 오프셋 또는 페이지 ID를 저장해야 한다.

```javascript
let pidLast = 0;

// 최상위 document에서 스크롤을 하는 경우
document.onscroll = (event) => {
    const curY = document.documentElement.scrollTop;
    const curH = window.innerHeight;
    if (curY + curH >= document.body.scrollHeight)
        loadPage(pidLast++, 100, json => process(json));
};
```



## 무한 스크롤의 특징

- UX가 편리하고 부드럽다. (사용자는 별도의 버튼을 누를 필요가 없다)
- 콘텐츠로 압도당하는 느낌을 줄 수 있다.
- 즐겨찾기가 불가능하다.
- 검색엔진최적화(SEO)가 불가능하다.