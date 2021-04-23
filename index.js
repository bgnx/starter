let = actualizeDOM = () => {
  ReactDOM.render(App(), document.body.firstElementChild);
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
  return React.createElement(`div`, {
    style: {
      boxSizing: `border-box`,
      position: `relative`,
      overflow: `hidden`,
      display: `flex`,
      flexShrink: 0,

      flexDirection: isHorizontal ? `row` : `column`,
      flexGrow: flexGrow,
      alignSelf: alignSelf,

      paddingLeft: `${paddingH}px`,
      paddingRight: `${paddingH}px`,
      paddingTop: `${paddingV}px`,
      paddingBottom: `${paddingV}px`,

      background: background,
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: `${borderRadius}px`,
    },
    children: children,
  });
};

let Text = ({ text = ``, color = `black`, fontSize = 16 }) => {
  return React.createElement(`div`, {
    style: {
      color: color,
      fontSize: `${fontSize}px`,
    },
    children: text,
  });
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