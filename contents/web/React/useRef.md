# 순수한 멤버변수 만들기

DOM을 렌더링하는 것과 관계없는 변수를 만들어야 할 때가 종종 있다. 예를 들면 `setTimeout`을 설정하고 나서 나온 `id`를 저장해둬야 한다던가.

`useState`를 사용해서 이 값들을 변수로 만들어도 돌아는 간다만, 렌더 사이클과 관련하여 아무래도 변수를 사용하는데 많은 제약사항이 생길 것이다.

함수형 컴포넌트에서 순수한 멤버변수를 만들려면 `useRef`를 쓰면 된다. 

```javascript
// 마지막 버튼 클릭 후 1초가 지난 뒤 콘솔에 hi!를 찍는 컴포넌트
const App = () => {
    const tid = useRef(null);
    
    const onClickButton = useCallback(() => {
        // 만약 이미 세팅된 타이머가 있으면 취소한다.
        if (tid.current)
            clearTimeout(tid.current);
       
        // 1초 뒤에 hi!를 콘솔에 찍는다.
        tid.current = setTimeout(() => console.log('hi!'), 1000);
    }, []);
    
    return <input type='button' onClick={onClickButton} value='hi' />;
};
```

`useRef`가 하는 정확한 일은, 순수한 js 객체를 하나 만든 뒤, 매번 `useRef`가 호출될 때마다 그 객체를 반환하는 것이 전부이다. 순수한 객체기 때문에 값을 수정한다고 해서 렌더가 호출되지 않으며, `useState`처럼 별도의 setter 함수를 사용하지 않아도 된다.



# DOM에 직접 접근해야 할 때

다음과 같은 여러가지 이유로 인해, DOM 객체에 직접 접근해야 할 때가 있다.

- 스크롤바 위치를 조회
- 특정 엘리먼트의 크기를 조회
- 특정 엘리먼트를 포커싱
- 외부 라이브러리 스크립트의 실행 타겟 제공

`useRef` 훅을 사용하면 리액트로 생성하는 DOM에 별도 id를 걸지 않아도 레퍼런스에 접근할 수 있다. 사용법은 다음과 같다.

```javascript
const App = () => {
    const myButton = useRef();
    
    useEffect(() => {
        // 렌더가 끝나면 버튼에 포커싱을 준다
	    myButton.current.focus();
    }, []);
    
    return <input type='button' ref={myButton} value='click' />;
};
```

엘리먼트의 `ref` 속성으로 `useRef`가 반환한 오브젝트를 넣어주면, 렌더가 이루어지고 나서 오브젝트의 `.current` 속성이 해당 HTMLElement로 설정된다.