리액트를 입문한 지 얼마 안되는 사람들이 저지르는 흔한 실수는, `onclick` 같은 이벤트 핸들러 함수를 인라인으로 작성하는 것이다.

```javascript
const App = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
        	<span>{count}</span>
        	<input type='button' onClick={() => setCount(count + 1)} value='click-me' />
        </div>
	);
};
```

사실 이런다고 죽진 않는다. 원래 의도한 대로 버튼을 클릭하면 count가 하나 증가할 것이고, 매 렌더마다 신선한 `count`를 물게 되므로 버그도 생기지 않는다. 

하지만 상태가 더 많아지고 렌더가 자주 호출된다면 어떨까?

```javascript
const App = () => {
    const [count, setCount] = useState(0);
    const [time, setTime] = useState(0);
    
    // 1ms마다 time을 업데이트한다.
    useEffect(() => {
        setInterval(() => setTime(time => time + 1), 1);
    }, []);
    
    return (
        <div>
        	<span>{time}, {count}</span>
        	<input type='button' onClick={() => setCount(count + 1)} value='click-me' />
        </div>
    );
};
```

겉으로는 아무 문제 없어 보이지만... 코드를 자세히 보라. `input` 엘리먼트의 `onClick` 속성에서 함수가 **매 렌더마다 계속 생성**된다. 내용물은 같을지 모르겠지만, 새로 생성된 함수는 이전 함수와 다른 객체다. 결국 `input` 엘리먼트의 props가 바뀐 것이므로, `input`은 가상DOM에 새로 렌더링된다.

예제에서는 `input` 엘리먼트를 예로 들었지만, 만약 그것 대신 다른 무거운 컴포넌트를 사용한다면 문제가 심각해질 수 있다.



# 문제 해결

`useCallback` 훅을 사용하면 위와 같은 문제를 해결할 수 있다. 버튼 클릭 이벤트 핸들러 함수가 물고 있는 `count`가 바뀔 때에만 콜백 함수를 교체해주면 되며, 다른 일이 벌어질 때는 굳이 콜백 함수를 바꿔줄 필요가 없다. 다음 코드를 살펴보자.

```javascript
const App = () => {
    const [count, setCount] = useState(0);
    const [time, setTime] = useState(0);
    
    // count가 변한 경우에만 onButtonClick에 새 콜백을 넣어준다.
    // 그 이외의 경우 (time이 변해서 렌더가 된 경우) onButtonClick은 이전의 함수로의 레퍼런스를 유지한다.
    const onButtonClick = useCallback(() => setCount(count + 1), [count]);
    
    // 1ms마다 time을 업데이트한다.
    useEffect(() => {
        setInterval(() => setTime(time => time + 1), 1);
    }, []);
    
    return (
        <div>
        	<span>{time}, {count}</span>
        	<input type='button' onClick={onButtonClick} value='click-me' />
        </div>
    );
};
```

`useState`로 만든 setter 함수의 인자로 함수를 전달하면, 아예 `App`이 마운트되고 나서 한 번만 콜백 함수를 설정하게 만들 수 있다.

```javascript
const App = () => {
    const [count, setCount] = useState(0);
    const [time, setTime] = useState(0);
    
    // 최초 렌더 시에만 콜백 함수를 설정한다.
    // 그 이외의 경우 (time이 변해서 렌더가 된 경우) onButtonClick은 이전의 함수로의 레퍼런스를 유지한다.
    const onButtonClick = useCallback(() => setCount(count => count + 1), []);
    
    // 1ms마다 time을 업데이트한다.
    useEffect(() => {
        setInterval(() => setTime(time => time + 1), 1);
    }, []);
    
    return (
        <div>
        	<span>{time}, {count}</span>
        	<input type='button' onClick={onButtonClick} value='click-me' />
        </div>
    );
};
```

`useCallback`의 의존성 배열을 주지 않을 경우, 매 렌더마다 레퍼런스가 갱신되므로 주의하자.

