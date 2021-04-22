Итак начнем с самого простого

Верстка это дерево дом-элементов с определенными свойствами стилей. Чтобы создать дом-элемент а также установить стили используем стандартный браузерный апи
```
let el = document.createElement(`div`);
el.style.height = `20px`;
el.style.background = `red`;
//...
```
Чтобы добавить вложенный дом-элемент то используем браузерный метод "el.appendChild(childEl)"

```
let el = document.createElement(`div`);
el.style.height = `20px`;
el.style.background = `red`;

let childEl = document.createElement(`div`);
childEl.style.height = `40px`;
childEl.style.background = `green`;

el.appendChild(childEl);
```
и таким образом мы можем создавать сколько угодно глубокое дерево дом-элеменов которое зачастую именуется как просто "верстка"

И наконец чтобы браузер отрендерил это дерево дом-элементов которые мы создали мы вызывааем метод replaceChild на элементе document.body и заменяем первый div-элемент внутри body-тега (в index.html у нас есть такая верстка `<body><div></div><script src="..."></script></body>`)
```
//let el = ...
//...
document.body.replaceChild(App(), document.body.firstElementChild);
```

Но создавать дом-дерево через ручную работу с таким браузерным api неудобно поэтому мы выносим этот болерплейт в соотвествующие функци которые будут нашими атомарными компонентами. И дальше мы будем как в фигме собирать весь дизайн из компонентов Frame (которые будут принимать массив children для вложенных элементов которые в свою очередь могут быть также Frame-компонентами) а также из компонентов Text и дальше по мере переноса дизайна в верстку будем добавлять новые необходимые компоненты (например Vector для векторных svg-фигур иконок)
```
let Frame = ({children = [], background = `transparent`, width = `auto`, height = `auto`}) => {
  let el = document.createElement(`div`);
  el.style.background = background;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;

  children.forEach(childEl => el.appendChild(childEl));
  return el;
};
//для текстового компонента текст устанавливается через свойство .textContent
let Text = ({ text = ``, color = `black`, fontSize = 16 }) => {
  let el = document.createElement(`div`);
  el.style.color = color;
  el.style.fontSize = `${fontSize}px`;
  el.textContent = text;
  return el;
};
```
и теперь мы можем собирать верстку приложения из дерева вызовов таких атомарных компонентов как Frame и Text
```
let App = () => {
  return Frame({
    width: 800,
    height: 800,
    background: `gray`,
    children: [
      Frame({
        width: 200,
        height: 40,
        background: `red`
      }),
      Text({
        text: `Hello world`,
        fontSize: 20,
      }),
      Frame({
        width: 200,
        height: 40,
        background: `blue`
      }),
      Frame({
        width: 200,
        children: [
          Frame({ /*...*/}),
          Frame({ /*...*/}),
          Frame({ /*...*/}),
          Text({ /*...*/}),
        ]
      }),
    ]
  })
};

document.body.replaceChild(App(), document.body.firstElementChild);
```

Мы конечно можем собрать всю верстку приложения внутри App-компонента но для удобства проще разбивать на отдельные высокоуровневые компоненты. Например если в приложении будет кнопка которая будет состоять из надписи и иконки то мы создаем компонент Button и дальше вставляем в главный компонент приложения App. И вместе с вынесением дерева атомарных компонентов в компоненты-функции мы также можем передать параметры. Например для кнопки может потребоваться передать параметр надписи label и флаг isActive который в зависимости от значения будет устанавливать нужный цвет
```
let MenuButton = ({ isActive = false, label = `` }) => {
  return Frame({
    height: 40,
    background: isActive ? `blue` : `gray`,
    children: [
      Frame({ /*...*/}),
      Frame({ /*...*/}),
      Text({ text: label }),
    ]
  });
};

let App = () => {
  return Frame({
    width: 800,
    height: 800,
    background: `gray`,
    children: [
      Frame({
        width: 200,
        height: 40,
        background: `red`
      }),
      MenuButton({isActive: true, text: `Мой кабинет`}),
      MenuButton({isActive: false, text: `Товары`}),
    ]
  })
};

document.body.replaceChild(App(), document.body.firstElementChild);
```

Сама верстка начинается с того что мы устанавливаем рутовому дом-элементу (в который мы будем рендерить компонент App) полную высоту и ширину окна страницы браузера (поскольку мы хотим чтобы пространство страницы распределялось между вложенными дом-элементами) Но просто установить на этот рутовый div-элемент "width: 100%; height: 100%" недостаточно и нужно будет также установить эти значения на все родительские элементы - на тег body и тег html. Другим вариантом является установка не 100% значения а значения в пикселях. Значение ширины и высоты окна страницы браузера можно узнать из соотвествующих свойств window.innerWidth и window.innerHeight. И теперь если мы установим на рутовый элемент конкретное значение то уже не придется дублировать "width: 100%; height: 100%" на родительские элементы body и html. А учитывая что нам все равно потребуется знать конкретное значение ширины экрана в пикселях для адаптивной верстки то второй вариант становится предпочтительным.

Сохраним ширину и высоту окна страницы в переменную AppState (где потом будут храниться также и другие данные от которых будет зависеть верстка) а дальше установим рутовому элементу нужное значение 
```
let AppState = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
};
let App = () => {
  return Frame({
    width: AppState.screenWidth,
    height: AppState.screenHeight,
    background: `gray`,
    children: [
      //....
    ]
  })
};

document.body.replaceChild(App(), document.body.firstElementChild);
```

Поскольку значение высоты и ширины окна страницы браузера не являются постоянными значениями то нам нужно будет подписаться на событие resize установив обработчик на window.onresize и обновить переменные AppState.screenWidth и AppState.screenHeight где мы будем хранить значение ширины и высоты страницы и после этого пересоздать дерево элементов заново вызвав функцию-компонент всего приложения App 
```
let AppState = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
};
window.onresize = () => {
  AppState.screenWidth = window.innerWidth;
  AppState.screenHeight = window.innerHeight;
  document.body.replaceChild(App(), document.body.firstElementChild);
};

let App = () => {
  return Frame({
    width: AppState.screenWidth,
    height: AppState.screenHeight,
    background: `gray`,
    children: [
      //....
    ]
  })
};

document.body.replaceChild(App(), document.body.firstElementChild);
```
Но теперь у нас появляется дублирование - мы выполняем обновление верстки (создаем дерево дом-элементов вызывая функцию-компонент App а после этого заменяем новый элемент с предыдущим) в двух местах - в обработчике события resize и в самом конце файла для первого рендера страницы - то есть дублируется строчка "document.body.replaceChild(App(), document.body.firstElementChild);". Уберем дублирования путем вынесения этого кода в функцию actualizeDOM которую будем вызывать каждый раз когда у нас будут происходит изменения данных от которые зависит верстка
```
let = actualizeDOM = () => {
  document.body.replaceChild(App(), document.body.firstElementChild);
};
let AppState = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
};
window.onresize = () => {
  AppState.screenWidth = window.innerWidth;
  AppState.screenHeight = window.innerHeight;
  actualizeDOM()
};

let App = () => {
  return Frame({
    width: AppState.screenWidth,
    height: AppState.screenHeight,
    background: `gray`,
    children: [
      //....
    ]
  })
};

actualizeDOM()
```

Теперь нужно прийти к соглашению как мы будем верстать - поскольку html/css позволяют заверстать один и тот же дизайн сотнями способами нужно выбрать только то необходимое подмножество css-свойсв (из 517 штук которые поддерживаются последним хромом) без которого нельзя обойтись при переноса дизайна из фигмы в код а также нужно согласиться какой способ раскладки выбрать для позиционирования. Поскольку в html/css таблицы или флоаты или блоки+инлайн-блоки это старое легаси которое уже можно выбросить на свалку то у нас остаются варианты либо флексбоксы либо гриды. Поскольку флексбоксы концептуально проще чем гриды а также поскольку я еще не встречал ситуаций когда нельзя обойтись флексбоксами (или в редких случаях флексбоксы+js) то мы будем везде использовать флексбоксы. Соотвественно в атомарном-компоненте Frame (из которого мы будем выстривать верстку нашего приложения) по дефолnу устанавливаем "el.style.display = 'flex'"
```
let Frame = ({children = [], background = `transparent`, width = `auto`, height = `auto`}) => {
  let el = document.createElement(`div`);
  el.style.display = `flex`;
  //...

  children.forEach(childEl => el.appendChild(childEl));
  return el;
};
``` 
Ну и также помимо установки "display: flex" для всех div-элементов (внутри атомарного компонента Frame) из которых будет собираться наша верстка мы также можем исправить браузерные неконсистентности путем установки дополнительных дефолтных стилей
```
//для того чтобы более удобно считать размеры элементов
el.style.boxSizing = `border-box`;

//для того чтобы позиционировать элементы по абсолютным позициям относительно родительского элемента по дефолту
el.style.position = `relative`;

//для того чтобы жестче контролировать выход за пределы размеров родительского элемента - по умолчанию это свойство имеет значения visible что значит что браузер будет рисовать поверх (знакомый всем мем "css is awesome" на кружке) а с помощью свойства hidden браузер будет обрезать элемент
el.style.overflow = `hidden`;

//!todo
el.style.flexShrink = 0;
```
Ну и также добавялем нужные параметры для расположения элементов. Вместо передачи параметра flexDirection мы сделаем более удобный boolean-параметр isHorizontal который по умолчанию будет иметь значение false (поскольку вертикальные лейауты встречаютс чаще чем горизонтальные) и в зависимости от значение установим нужное свойство flexDirection 
```
el.style.flexDirection = isHorizontal ? `row` : `column`;
```
Ну и также добавим необходимые параметры для расположения элементов flexGrow и alignSelf
```
el.style.flexGrow = flexGrow;
el.style.alignSelf = alignSelf;
```
Помимо этого в компоненте-функции Frame мы добавляем только самые необходимые параметры без которых не обойтись - width, height, background, borderRadius, alignSelf и другие
Дальше появляется вопрос касательно установки стилей maring-... и padding-... Можно ли без них обойтись? Можно - вместо установки padding или margin-стилей всегда можем добавить в нужном пустой вложенный Frame который просто будет иметь нужное значение ширины или высоты например Frame({width: 10}) или Frame({height: 10}) для паддинга или маржина в 10 пикселей (в зависимости от положения этого компонента - если внутри то это паддинг а если рядом то марджин)
Но дальше можно заметить что этот подход довольно неудобен для замены padding-свойств (хотя при замене margin-свойств неудобств нет) - нам нужно создавать еще один Frame-слой для дополнительного уровня. Например есть левая панель-пеню с вертикальным списком кнопок и если них повторяется смещение позиции от левого и правого края левой панели то соотвественно хочется установить padding-свойство на родительском элементе левой панели. C подходом когда место padding свойств мы используем дополнительные Frame-компоненты с нужной шириной мы получаем примерно такую структуру
```
let SidePanel = () => {
  return Frame({
    isHorizontal: true
    children: [
      Frame({width: 15}), //левый паддинг в 15px
      //... тут мы записываем вложенные элементы
      Frame({width: 15}), //правый паддинг в 15px
    ]
  })
};
```
Но поскольку у нас меню где кнопки располагаются вертикально (а задание левого и правого паддинга потребовало задать горизонтальную раскладку - isHorizontal: true) то придется создать дополнительный Frame-уровень где мы будем уже располагать кнопки вертикально
```
let SidePanel = () => {
  return Frame({
    isHorizontal: true
    children: [
      Frame({width: 15}), //левый паддинг в 15px
      Frame({
        children: [
          MenuButton(),
          MenuButton(),
          MenuButton(),
          //...
        ]
      })
      Frame({width: 15}), //правый паддинг в 15px
    ]
  })
};
```
И поскольку такие ситуации встречаются часто то решаем все же добавить сахар padding-свойств для большего удобства записи но вместо того чтобы добавлять все 4 параметры (paddingLeft, paddingRight, paddingTop, paddingBottom) ограничим передачей одинакового паддинга - paddingH для задания горизонтального паддинга 
```
el.style.paddingLeft = el.style.paddingRight = `${paddingH}px`;
```
и paddingV для задания вертикального паддинга 
```
el.style.paddingTop = el.style.paddingBottom = `${paddingV}px`;
```
