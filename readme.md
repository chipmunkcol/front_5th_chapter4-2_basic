최초 성능
<img src="./images/readme/스크린샷 2025-06-04 164206.png" width=400 />

최적화 할것들

- main.js 에서 동적으로 country-bar 속성을 변경해 CLS에 영향을 주고 있음 opacity로 변경하면 CLS를 올리지 않을까?
- 적용 후 
<img src="./images/readme/스크린샷 2025-06-04 170711.png" width=400 />
아니 갑자기 너무 좋아진거 아니냐고..

1. FCP
    1) 렌더링 차단 리소스 제거하기
        - (내용) 리소스가 페이지의 첫 페인트를 차단하고 있음. 중요한 js/css를 인라인으로 전달하고 중요하지 않은 모든 js/style을 지연하는 것이 좋습니다. 이때 중요하지 않은 것의 판단은 아래 Coverage tab에서 확인 가능

            <img src="./images/readme/스크린샷 2025-06-04 173203.png" width=200 />
        
        - (적용)
            1. defer 적용 (DOMContentLoaded 이벤트 이후 실행됨, 스크립트 순서 보장) 
            2. css preload & media="print" 기법 (점진적 적용, fout 완화용)
            ```
            <script defer src="//www.freeprivacypolicy.com/public/cookie-consent/4.1.0/cookie-consent.js" charset="UTF-8"></script>
            <link
                rel="preload"
                href="https://fonts.googleapis.com/css?family=Heebo:300,400,600,700&display=swap"
                as="style"
                onload="this.onload=null;this.rel='stylesheet';"
            />
            <noscript>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Heebo:300,400,600,700&display=swap" />
            </noscript>
            ```
        - (적용 후)
            놀랍게도 성능이 쓰레기가 되었음!
            <img src="./images/readme/스크린샷 2025-06-04 173546.png" width=400 />
            원하던 fcp 의 성능은 약간 올라갔는데 LCP와 TBT이 급격히 증가했다. 근데 원인을 속성별로 확인해봐도 원인을 모르겠다 일단 진행해보자.

2. LCP
    1) 차세대 형식을 사용해 이미지 제공하기
        - jpg 이미지를 webp로 변환해 제공하자
        [무료 변환 사이트](https://convertio.co/kr/jpg-webp/) 이용


    