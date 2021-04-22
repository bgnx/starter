let = actualizeDOM = () => {
  document.body.replaceChild(App(), document.body.firstElementChild);
};

//атомарные компоненты
let Frame = ({
  children = [],
  background = `transparent`,
  isHorizontal = false,
  flexGrow = 0,
  width = `auto`,
  height = `auto`,
  borderRadius = 0,
  alignSelf = `stretch`,
  paddingH = 0,
  paddingV = 0
}) => {
  let el = document.createElement(`div`);
  el.style.boxSizing = `border-box`;
  el.style.position = `relative`;
  el.style.overflow = `hidden`;
  el.style.display = `flex`;
  el.style.flexShrink = 0;

  el.style.flexDirection = isHorizontal ? `row` : `column`;
  el.style.flexGrow = flexGrow;
  el.style.alignSelf = alignSelf;

  el.style.paddingLeft = el.style.paddingRight = `${paddingH}px`;
  el.style.paddingTop = el.style.paddingBottom = `${paddingV}px`;

  el.style.background = background;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.borderRadius = `${borderRadius}px`;

  children.forEach(childEl => el.appendChild(childEl));
  return el;
};

let Text = ({ text = ``, color = `black`, fontSize = 16 }) => {
  let el = document.createElement(`div`);
  el.style.color = color;
  el.style.fontSize = `${fontSize}px`;
  el.textContent = text;
  return el;
};

//приложение - состояние где будем хранить данные и компоненты приложения которые собираются из атомарных компонентов
let AppTheme = {
  blue_main: `rgba(2, 33, 104, 1)`,
};

let AppState = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
};
window.onresize = () => {
  AppState.screenWidth = window.innerWidth;
  AppState.screenHeight = window.innerHeight;
  actualizeDOM();
};

let App = () => {
  return Frame({
    width: AppState.screenWidth,
    height: AppState.screenHeight,
    background: `rgba(245, 247, 251, 1)`,
    isHorizontal: true,
    children: [
      Frame({
        background: `white`,
        paddingH: 24,
        paddingV: 33,
        children: [
          Frame({ alignSelf: `center`, height: 30, width: 168, background: `gray` }),
          Frame({ height: 58 }),
          Frame({ children: [MenuButton({ isActive: true, label: `Мой кабинет` })] }),
          Frame({ height: 12 }),
          Frame({ children: [MenuButton({ isActive: false, label: `Товары` })] })
        ]
      }),
    ]
  });
};

let MenuButton = ({ isActive = false, label = `` }) => {
  return Frame({
    flexGrow: 1,
    isHorizontal: true,
    background: isActive ? AppTheme.blue_main : `rgba(248, 248, 248, 1)`,
    borderRadius: 8,
    paddingH: 24,
    paddingV: 12,
    children: [
      Frame({ alignSelf: `center`, width: 24, height: 24, background: `white` }),
      Frame({ width: 8 }),
      Frame({ alignSelf: `center`, children: [Text({ text: label, color: isActive ? `white` : `rgba(185, 185, 195, 1)` })] }),
    ]
  });
};

actualizeDOM();