흔히 타입스크립트 초심자가 겪는 문제로, 외부 라이브러리를 사용할 때 타입 에러가 발생하는 것이 있다. 타입스크립트의 인기 덕분에 많은 라이브러리가 자신 모듈의 타입을 정의해주지만, 그렇지 않은 라이브러리도 많기 때문이다.



# .d.ts

타입스크립트에서 js 라이브러리를 사용하려면 해당 모듈에서 export하는 것들에 대해 타입이 정의돼 있어야 한다. 이렇게 타입을 정의하는 파일을 *.d.ts 파일이라고 부른다.

예를 들어 `loadash`라는 라이브러리를 살펴보자. `loadash`는 각종 js 편의 기능을 제공하는 라이브러리로, 널리 쓰이는 편이다. 이걸 타입스크립트에서 사용하려고 다음과 같이 모듈을 가져오면 에러가 난다.

```
import _ from 'loadash';

// 에러 메시지
Could not find a declaration file for module 'lodash'. 'c:/devenv/projects/ts-without-babel/node_modules/lodash/lodash.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/lodash` if it exists or add a new declaration (.d.ts) file containing `declare module 'lodash';`ts(7016)
```

`loadash`는 순수 js 라이브러리이고, 타입스크립트 타입을 정의하지 않았기 때문에 위와 같은 에러가 발생한다. `tsconfig`에서 `implicitAny`를 `false`로 만들어서 모듈을 `any` 타입으로 사용하는 방법도 있지만, 그건 근본적인 해결책이 아니다.



## 방법 1. 누군가가 만들어놓은 타입선언을 다운받는다.

`loadash`처럼 많은 사람들이 쓰는 라이브러리는, 제작자가 타입 선언을 해놓지 않았더라도, 어떤 친절한 누군가가 타입 선언을 해서 공유하고 있을 가능성이 높다.

TypeScript 홈페이지에는 특정 라이브러리의 타입 선언이 공유되고 있는지 [검색하는 페이지](https://www.typescriptlang.org/dt/search?search=loadash)가 있다. 여기서 라이브러리 이름을 검색해보고, 나오면 npm 명령어를 이용하여 설치하면 된다.

```
npm i @types/lodash
```

명령어를 실행시키고 `node_modules`를 까보면, @types 폴더 밑에 lodash라는 폴더가 생기는 것을 확인할 수 있다.  그 안에 들어가보면, 각종 타입 선언 파일이 가득한 것을 볼 수 있다.



## 방법 2. 직접 .d.ts 파일을 선언해준다.

만약 타입 선언이 제공되지 않는다면? 프로젝트 내에 적당히 `lodash.d.ts`파일을 만들고 아래와 같이 적어준다.

```typescript
declare module 'loadash';
```

이유는 잘 모르겠으나, 이러면 컴파일 에러가 더이상 나지 않는다. 하지만 라이브러리가 제공하는 세부적인 함수에 대한 타입은 정의하지 않았기 때문에, IDE에서 코드 힌트를 볼 수는 없을 것이다.