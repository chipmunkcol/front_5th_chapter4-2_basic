최초 성능
<img src="./images/readme/스크린샷 2025-06-04 164206.png" width=400 />

최적화 할것들

- main.js 에서 동적으로 country-bar 속성을 변경해 CLS에 영향을 주고 있음 opacity로 변경하면 CLS를 올리지 않을까?

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
        - (적용) jpg 이미지를 webp로 변환해 제공하자
        [무료 변환 사이트](https://convertio.co/kr/jpg-webp/) 이용

        - (적용 후) 다시 조금 정상화된듯
            <img src="./images/readme/스크린샷 2025-06-04 213948.png" width=400 />

    2) 오픈스크린 이미지 지연하기
        - (내용) 반응형 이미지를 모두 불러와서 해당안되는 이미지를 css에서 display: none 처리해서 불필요한 네트워킹이 발생함
        - (적용) picture source 태그를 사용해 기기에 따라 적합한 이미지를 선택하게함
            picture은 다양한 화면 크기와 해상도에 맞춰 최적의 이미지를 제공하기 위해 사용됨.
            작동 원리) 브라우저는 picture 요소를 만나면, 사용자의 화면 크기 등을 기반으로 media 쿼리를 판단하고, 가장 먼저 일치하는 source 요소의 이미지를 선택하여 표시함.
            만약 어떤 source 요소에도 일치하는 미디어 쿼리가 없다면 마지막에 있는 img 요소의 이미지를 사용함.
            ```
            <picture>
                <source media="(min-width: 960px)" srcset="images/Hero_Desktop.webp" />
                <source media="(min-width: 576px)" srcset="images/Hero_Tablet.webp" />
                <img src="images/Hero_Mobile.webp" alt="Hero Image" style="display: block; width: 100%; height: auto;" />
            </picture>
            ```

        - (적용 후)
            <img src="./images/readme/스크린샷 2025-06-04 223636.png" width=400 />
            
            이미지만 변경해줘도 많은 부분이 해결되는걸 알수있다.

        
3. TBT (Total Blocking Time)
<img src="./images/readme/스크린샷 2025-06-04 224610.png"  width=400 />
    1) lazy loading
    2) DOM 추가 시 Fragment 사용
    3) Web Worker 로 무거운 연산 백그라운드에서 진행 

    (적용후)
    <img src="./images/readme/스크린샷 2025-06-05 000106.png"  width=400 />
    TBT 0 밀리초가 나온다 (0밀리초..?)

4. CLS (Cumulative Layout Shift)
    1) 브라우저에게 이미지의 height 값을 알려주자 
    - aspect-ratio 설정 (width & object-fit: cover 속성화 함께할것!)

        ```
        <picture style="width: 100%; aspect-ratio: 16/9;">
            <source media="(min-width: 960px)" srcset="images/Hero_Desktop.webp" />
            <source media="(min-width: 576px)" srcset="images/Hero_Tablet.webp" />
            <img src="images/Hero_Mobile.webp" alt="Hero Image" style="width: 100%; object-fit: cover;" />
        </picture>

        .product-picture .img {
        width: 100px;
        aspect-ratio: 1/1;
        object-fit: cover;
        }

        @media (max-width: 576px) {
            .product-picture .img {
                width: 145px;

            }
        }
        ```

    (적용 후) CLS 지표가 조금 나아졌다. (0.497 -> 0.441) 
    <img src="./images/readme/스크린샷 2025-06-05 114917.png" width=400 /> 
    이 부분이 CLS 악영향의 원인인듯

    2) 해당하는 부분에 height 값을 줘봤다 해결이 되려나?
        ```
        .container-best {
            width: 1440px;
            max-width: 90%;
            height: 421px;
            margin: auto;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        @media screen and (max-width: 576px) {
            .container-best {
                height: 100%;

                display: flex;
                flex-direction: column;
                align-items: center;
            }
        }
        ```

