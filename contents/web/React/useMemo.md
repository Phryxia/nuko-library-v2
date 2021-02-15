함수형 컴포넌트의 특징은 그 자신이 렌더 시 마다 호출되는 함수라는 점이다. 이런 특징 때문에, 함수형 컴포넌트에서 별다른 조치 없이 그냥 코딩을 하면, 그 로직이 매 렌더마다 실행된다는 문제가 있다.

가끔은 한 번 값을 계산하면, 특별한 이유가 없는 한 그 값을 그대로 쓸 때가 있다. 특히 자주 업데이트되지는 않지만, 계산할 때 비용이 비싼 상황을 생각해볼 수 있다.

다음 코드는 자주 렌더되는데, 매 렌더마다 변하지도 않은 점수 합을 구하는 문제가 있다. (너무 억지스러운가...?)

```javascript
const App = () => {
    const [scores, setScores] = useState([10, 20, 30, 40]);
    const [time, setTime] = useState(0);
    
    // 1ms에 한 번씩 time을 증가시킨다.
    useEffect(() => {
        setInterval(() => setTime(time => time + 1), 1);
    }, []);
    
    // 점수 합계를 구한다
    const sum = scores.reduce((acc, val) => acc + val, 0);
    
    return (
    	<div>
        	<div>{time}, sum = {sum}</div>
        	{scores.map(score => <div>{score}</div>)}
    	</div>
    );
};
```

이럴 때 `useMemo` 훅을 사용하면, 특정 값이 바뀔 때에만 계산을 할 수 있다. 특정 값을 자주 계산하지는 않지만, 한 번 계산할 때 비용이 비싼 경우 이 훅을 사용하면 좋겠다.

```javascript
const App = () => {
    const [scores, setScores] = useState([10, 20, 30, 40]);
    const [time, setTime] = useState(0);
    
    // 1ms에 한 번씩 time을 증가시킨다.
    useEffect(() => {
        setInterval(() => setTime(time => time + 1), 1);
    }, []);
    
    // scores가 변하면 점수 합계를 구한다
    const sum = useMemo(() => {
    	return scores.reduce((acc, val) => acc + val, 0);
    }, [scores]);
    
    return (
    	<div>
        	<div>{time}, sum = {sum}</div>
        	{scores.map(score => <div>{score}</div>)}
    	</div>
    );
};
```



# useCallback과의 관계

사실 `useCallback`은 `useMemo`와 본질적으로 크게 다르지 않다. `useMemo`는 의존성 배열에 명시한 값이 바뀌었을 때, 전달받은 콜백을 호출시켜서 값을 계산하고, `useCallback`은 인자로 받은 콜백을 그대로 반환해준다.

```javascript
const myLazyValue = useMemo(() => someValue, [dep]);
const myCallback = useCallback(someCallback, [dep]);
```

그래서 `useCallback`은 `useMemo(() => someCallback)`과도 같다.