# js의 모듈 시스템

**모듈(Module)** 이란 격리된 공간에 존재하는 스크립트로, 독자적인 기능을 행하는 파일을 말한다. 언어마다 모듈을 가리키는 말이 조금씩 다르긴 하다. Python이나 Ruby에서는 모듈이라고 부르고, Java에서는 패키지라고 부른다.

ES6의 모듈 시스템이 나오기 전까지는 js에는 모듈 개념이 없었다. 그래서 아래와 같이 무식한 방식을 사용했어야 했다.

```javascript
// circle.js
function Circle(radius) {
	this.radius = radius;
}

Circle.prototype.area = function() {
    return this.radius * this.radius * Math.PI;
}

Circle.prototype.circumference = function() {
    return 2 * Math.PI * this.radius;
}

// rectangle.js
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype.area = function() {
    return this.width * this.height;
}

Rectangle.prototype.circumference = function() {
    return 2 * (this.width + this.height);
}

// index.js
var myCircle = new Circle(10);
var myRectangle = new Rectangle(100, 20);
console.log(myCircle.area());
console.log(myRectangle.circumference());
```

```html
<!-- index.html -->
<html>
    <head>
        <title>Module System</title>
    </head>
    <body>
    	<script src='./circle.js'></script>
        <script src='./rectangle.js'></script>
        <script src='./index.js'></script>
    </body>
</html>
```

이렇게 하면 안 좋은 이유는, 서버로 요청하는 HTTP 요청이 많아지기 때문이며, 파일의 순서에 매우 민감해지는데다, 서로 격리가 되지 않아 변수명 충돌이 날 수도 있기 때문이다.

그래서 인간들은 여러가지 방식을 고안해냈고, 다음과 같은 것들이 역사상 난립했었다.



## commonJS (CJS)

`Node.js`에서 채택한 방식으로 유명한 commonJS는 다음과 같은 형식으로 모듈을 선언하고 사용할 수 있다.

```javascript
// circle.js
... 생략 ...

module.exports = Circle;

// index.js
var circle = require('circle.js');
```

2021년 기준으로 이 방식은 여전히 `Node.js`에서 유효하다. 하지만 13버전부터 노드도 ES6 모듈 방식을 도입하기 시작했고, 언제까지 commonJS가 버틸 수 있을지는 불확실하다.



## Asynchronous Module Definition (AMD)

`RequireJS`로 유명한 AMD 방식은 다음과 같이 모듈을 선언하고 사용했다.

```javascript
// circle.js
define(function() {
    function Circle(radius) {
        ... 생략 ...
    };
    
    return Circle;
});
    
// index.js
require(['circle'], function(Circle) {
    var myCircle = new Circle(10);
    console.log(myCircle.area());
});
```

10년이나 지난 지금 보면 매우 하찮게(?) 보이지만, 당시에는 나름대로 인기가 있었던 모양이다.



## Universal Module Definition (UMD)

commonJS와 AMD 스타일을 모두 지원하기 위해서 또 다른 방식이 나왔었는데, 바로 UMD 방식이다. 끔찍한 가독성을 자랑하는 이 방식은 위에서 언급한 두 방식을 모두 포용할 수 있다는 점에서 주목을 받았었다.

```javascript
(function(root, factory) {
    if (typeof define === 'function' && define.amd)
        define(['circle'], factory);
    else if (typeof exports === 'object')
        module.exports = factory(require('circle'));
    else
        root.returnExports = factory(root.circle);
}(this, function(Circle) {
    var myCircle = new Circle(10);
    console.log(myCircle.area());
}));
```



## ES6 import & export

ES6에 들어서면서 본격적으로 모듈을 고려하기 시작했고, import & export 문법의 등장으로, 훨씬 현대적인 문법으로 모듈 시스템을 즐길 수 있게 되었다.

```javascript
// circle.js
class Circle {
    ... 생략 ...
}
export Circle;

// rectangle.js
class Rectangle {
    ... 생략 ...
}
export Rectangle;

// index.js
import { Circle } from './circle.js';
import * as Rect from './rectangle.js';

const myCircle = new Circle(10);
const myRectangle = new Rect.Rectangle(100, 20);
console.log(myCircle.area());
console.log(myRectangle.circumference());
```

export를 하게 되면 해당 변수/함수/클래스 들이 일종의 오브젝트에 포장되듯이 전달이 된다. 이를 import 할 때는 중괄호{} 내에 필요한 변수/함수/클래스의 이름을 적어주면 된다. 귀찮아서 전부 받아온 뒤 별도로 사용하고 싶다면, `* as alias` 문법을 사용하면 된다.

한편 ES6에는 `default`라는 특이한 키워드가 있는데, 이것을 사용해서 export한 변수/함수/클래스는 import 할 때 중괄호를 적지 않고 끄집어낼 수 있는 특징이 있다.

```javascript
// triangle.js
class Triangle {
	... 생략 ...
}
export default Triangle;

// index.js
import Triangle from './triangle.js';

const myTriangle = new Triangle(100);
console.log(myTriangle.area());
```

`export default`는 모듈 당 하나씩만 할 수 있으며, 다음과 같이 일반 `export` 시킨 것과 혼용할 수 있다.

```javascript
import Something, { Another } from './library.js';
```

한편 주의해야할 점은, 브라우저에서 ES6 스타일 모듈을 사용할 수 있지만 매 모듈마다 HTTP 요청을 따로 보내는 건 여전하다는 것이다. 그래서 여전히 웹팩 같은 번들러가 필요하다.



# 웹팩과의 관계

웹팩(Webpack)이 자체 최적화 기법인 트리쉐이킹을 수행할 때, ES6 스타일의 모듈만을 정리 대상으로 인식한다. 따라서 바벨 등으로 ES6 이전 방식으로 폴리필을 할 경우 트리쉐이킹이 정상적으로 적용되지 않는다.



# 타입스크립트와의 관계

타입스크립트는 ES6가 도입되기 전에 개발이 시작되었기 때문에, 위에서 난립한 CommonJS와 AMD를 모두 지원한다. 이 둘을 지원하기 위해 타입스크립트는 `export = `라는 문법을 제공한다.