# 국가유산 AI 기반 서비스 백문불여일견 프론트 레포지토리입니다.

백문불여일견은 AI를 활용하여 국가유산에 대한 접근성을 높이고 
사용자들이 보다 쉽게 국가유산을 경험할 수 있는 서비스입니다.

## 디렉토리 구조

HAI_React/
├── public/
│   ├── index.html                 # 앱의 진입점이 되는 HTML 파일
│   ├── mainfest.json              # 웹앱 매니페스트 파일, PWA 설정에 사용
│   └── images/
│       └── logo.png               # 로딩 화면에서 사용되는 로고 이미지
├── src/
│   ├── assets/                    # 각종 아이콘 및 이미지 파일 모음
│   │   ├── book.svg               # 'Book' 메뉴 아이콘
│   │   ├── chat.svg               # 'Chat' 메뉴 아이콘
│   │   ├── chatbutton.png         # 채팅 전송 버튼 아이콘
│   │   ├── profile.svg            # 'Profile' 메뉴 아이콘
│   │   ├── trips.svg              # 'Trips' 메뉴 아이콘
│   ├── components/                # 각 페이지와 컴포넌트 파일
│   │   ├── Book.js                # 'Book' 페이지 컴포넌트
│   │   ├── BottomNavigation.js    # 하단 네비게이션 바 컴포넌트
│   │   ├── Chat.js                # 'Chat' 페이지 및 채팅 기능 컴포넌트
│   │   ├── ChatMenu.js            # 햄버거 메뉴에 지난 채팅 기록을 표시하는 컴포넌트
│   │   ├── Header.js              # 상단 햄버거 메뉴를 포함한 헤더 컴포넌트
│   │   ├── LoadingScreen.js       # 앱 로딩 시 표시되는 화면 컴포넌트
│   │   ├── Profile.js             # 'Profile' 페이지 컴포넌트
│   │   ├── Trips.js               # 'Trips' 페이지 컴포넌트
│   │   └── styles/                # 컴포넌트별 CSS 스타일 파일
│   │       ├── BottomNavigation.css
│   │       ├── Chat.css
│   │       ├── ChatMenu.css
│   │       ├── Header.css
│   │       └── LoadingScreen.css
│   ├── App.js                     # 전체 애플리케이션의 루트 컴포넌트
│   ├── index.js                   # ReactDOM을 통해 애플리케이션을 렌더링하는 진입점
│   ├── serviceWorkerRegistration.js # PWA 설정을 위한 서비스 워커 파일
│   └── App.css                    # 전역 스타일을 정의하는 CSS 파일
├── package.json                   # 프로젝트 종속성과 스크립트 정의
└── README.md                      # 프로젝트 설명과 실행 방법에 대한 문서


### 설치 및 실행 방법

프로젝트 클론:
git clone [저장소 URL]

패키지 설치:
npm install

프로젝트 실행:
npm start

### 프로젝트 구조 설명

public/: 앱의 기본적인 HTML 구조를 정의하고, 로딩 화면 이미지를 포함.
src/: 애플리케이션의 핵심 로직 및 컴포넌트가 위치.
components/: 페이지별, 기능별로 나눠진 React 컴포넌트들.
assets/: 아이콘 및 이미지 파일들이 포함된 디렉토리.
styles/: 각 컴포넌트별 CSS 스타일 파일.

### 주요 컴포넌트 설명

Chat.js: 사용자와 챗봇 간의 대화를 관리하는 컴포넌트.
BottomNavigation.js: 하단 네비게이션 바로 각 페이지 간의 이동을 담당.
Header.js: 상단 헤더 컴포넌트로 햄버거 메뉴를 통해 지난 채팅 기록 확인 가능.

### 사용된 주요 기술 스택

React.js: UI 컴포넌트 기반 프레임워크.
CSS3: 사용자 인터페이스의 스타일링.
PWA: Progressive Web App 설정을 위해 서비스 워커 사용.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
