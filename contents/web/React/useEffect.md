# 함수형 컴포넌트에서의 사이클

`useEffect` 훅의 등장으로 함수형 컴포넌트도 클래스와 비스무리한 사이클을 가지게 되었다. 그 이전까지는 `props`를 넘겨받아서 수동적으로 그리는 일밖에 하지 못했다고 한다. (단, `useEffect`의 목적이 라이프 사이클을 만들어내는 것은 아니며, 임의의 사이드이펙트를 렌더와 동기화하기 위한 것에 더 가깝다)

`useEffect`는 넘겨받은 콜백을 DOM이 업데이트 된 직후에 **비동기로** 실행하도록 하는 훅이다. 다음 예제를 통해서 `useEffect`와 렌더 함수의 호출 순서를 잘 보자.

```javascript
const App = () => {
    const [count, setCount] = useState(0);
    
    // 매 render 직후에 호출된다.
    useEffect(() => {
        console.log('after render!');
        
        // 다음번 render 호출 때, useEffect로 넘긴 콜백이 호출되기 전 클린업으로 호출된다.
        // 또는 App이 디마운트 될 때 호출된다.
        return () => {
            console.log('on clean-up!');
        };
    });
    
    // 매번 새 콜백을 만들어서 렌더를 쓸데없이 호출하는걸 방지
    // 자세한 것은 useCallback을 공부해보자.
    const onClickButton = useCallback(() => {
        setCount(count => count + 1);
    }, []);
    
    console.log('on render!');
    
    return (
    	<div>
        	{count}
        	<input type='button' value='click-me' onClick={onClickButton} />
        </div>
    );
};
```

앱을 실행시키면 on render! → after render!순으로 초기 사이클이 실행된다. 그 후 버튼을 눌러서 상태를 변경시키면 렌더가 새로 호출되는데, 이때 콘솔에는 on render! → on clean-up! → after render! 순으로 찍힌다.



# 의존성 배열

`useEffect`의 의존성 배열(흔히 `deps`라고 부른다)에 상태값을 넘겨주면, 그 상태가 바뀔 때만 콜백을 호출할 수 있다. 복잡하게 상태가 여러 개 있는 경우에 도움된다.

```javascript
const App = () => {
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);
    
    // a가 변할 때만 호출된다.
    useEffect(() => {
        console.log('a has been changed!');
    }, [a]);
    
    // a를 1 증가시키는 콜백
    const onClickBtA = useCallback(() => {
        setA(a => a + 1);
    });
    
    // b를 1 증가시키는 콜백
    const onClickBtB = useCallback(() => {
        setB(b => b + 1);
    });
    
    return (
    	<div>
        	a = {a}, b = {b}
        	<input type='button' onClick={onClickBtA} value='a' />
        	<input type='button' onClick={onClickBtB} value='b' />
    	</div>
    );
};
```

의존성 배열에 아무 것도 집어넣지 않으면, `useEffect`의 콜백은 컴포넌트가 마운트될 때 한 번만 실행되며, 내부에서 반환하는 클린업 콜백은 컴포넌트가 디마운트 될 때 한 번만 실행된다.

```javascript
const TinyApp = ({name}) => {
    useEffect(() => {
        console.log('TinyApp has been mounted');
        
        return () => {
            console.log('TinyApp has been demounted');
        };
    }, []);
    
    return <span>{name}</span>;
};

const App = () => {
    const [isOn, setIsOn] = useState(false);
    
    // 토글 콜백
    const onButtonClick = useCallback(() => {
        setIsOn(isOn => !isOn);
    });
    
    // isOn이 true이면 TinyApp을 보여준다.
    return (
    	<div>
        	{isOn ? <TinyApp name='babo' /> : null}
        	<input type='button' value='click-me' onClick={onButtonClick} />
        </div>
    );
};
```



# 쓰임새

`useEffect`는 API 데이터를 끌어올 때 유용하게 쓰인다. 상태가 많아서 복잡할 때, `useEffect`를 쓰면 깔끔하게 코드를 작성할 수 있다.

```javascript
const App = () => {
    const [keywords, setKeywords] = useState([]);
    const debouncer = useRef(null);
    
    // keywords가 변경되면 데이터를 끌어온다.
    useEffect(() => {
        fetch('http://www.example.com')
        .then(response => response.json())
        .then(json => console.log(json));
    }, [keywords]);
    
    // 디바운싱
    const onChange = useCallback((event) => {
        if (debouncer.current)
            clearTimeout(debouncer.current);
        debouncer.current = setTimeout(() => {
            setKeywords(event.target.value.split(' '));
        }, 500);
    });
    
    return (
        <div>
        	<input type='search' onChange={onChange} />
        </div>
    );
};
```



# useLayoutEffect

앞에서 언급했듯 `useEffect`는 렌더 호출 후 **비동기로** 실행된다. 대부분의 경우 이는 문제가 되지 않지만, 간혹 `useEffect`에서 DOM에 직접접근을 해서 뭔가(크기나 스크롤 등)를 받아와야 할 때가 있다.

이 경우에는 `useEffect` 대신 **동기**로 실행되는 `useLayoutEffect`를 사용해야 한다. 후자를 쓰면 렌더가 끝난 직후 화면이 그려지기 전까지 전달받은 콜백을 실행시킨 뒤 기다린다. [이 글](https://daveceddia.com/useeffect-vs-uselayouteffect/)을 참고해보자.

사실 ... 실제로 이를 쓸 일은 거의 없는 것 같다.