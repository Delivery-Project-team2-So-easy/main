# 🛵Delivery Project

![MAIN]()

## 프로젝트 목적

> 직접 개발 환경을 마련하고 실제 서비스를 개발하면서 경험을 쌓는 것이 목적입니다.  
> 간접적으로 실제 work flow에 대해 맛보기로 경험하고 이해해보는 과정이라고 할 수 있습니다.  
> node.js 기반 express 프레임워크를 활용하여 음식 배달 서비스를 구현했습니다.

## ERD

![ERD]

## API 명세

| Path                                 | API Method | Verify |             Description              |
| ------------------------------------ | :--------: | :----: | :----------------------------------: |
| /users/signup                        |    POST    |        |               회원가입               |
| /users/login                         |    POST    |        |                로그인                |
| /users/kakao                         |    GET     |        |             카카오로그인             |
| /users/kakao/callback                |    GET     |        |       카카오로그인 or 회원가입       |
| /users/kakao/signup/:kakaoEmail      |    POST    |        |            카카오회원가입            |
| /users/logout                        |    POST    |        |               로그아웃               |
| /users                               |   PATCH    |   ✔    |            유저정보 수정             |
| /user/myReviews                      |    GET     |   ✔    |           내 리뷰목록 조회           |
| /user/myOrders                       |    GET     |   ✔    |           내 주문목록 조회           |
| /user/store/:storeId/like            |    POST    |   ✔    |             매장 좋아요              |
| /user/store/likeStores               |    GET     |   ✔    |           좋아요 매장 조회           |
| /stores/search                       |    POST    |        |              매장 검색               |
| /stores/ranking                      |    POST    |        | 기간별 매장 랭킹조회(주문 건수 기준) |
| /stores/reorderRanking               |    GET     |        |        매장별 재주문 랭킹조회        |
| /store/registration                  |    POST    |   ✔    |            매장정보 등록             |
| /store/registration                  |   PATCH    |   ✔    |            매장정보 수정             |
| /store/registration                  |   DELETE   |   ✔    |            매장정보 삭제             |
| /store/menu                          |    POST    |   ✔    |              메뉴 등록               |
| /store/menu/:menuId                  |   PATCH    |   ✔    |              메뉴 수정               |
| /store/menu/:menuId                  |   DELETE   |   ✔    |               메뉴삭제               |
| /store/:storeId/menus                |    GET     |        |          매장 메뉴 전체조회          |
| /store/:storeId/review               |    POST    |   ✔    |               리뷰등록               |
| /store/:storeId/review/:reviewId     |   PATCH    |   ✔    |               리뷰수정               |
| /store/:storeId/review:reviewId      |   DELETE   |   ✔    |               리뷰삭제               |
| /store/:storeId/review:reviewId/like |   DELETE   |   ✔    |             리뷰 좋아요              |
| /order/:orderId                      |    GET     |   ✔    |            배달상태 확인             |
| /order/:orderId/refundRequest        |    GET     |   ✔    |         주문취소(환불) 요청          |
| /order/:orderId/refundComplete       |    GET     |   ✔    |              환불 완료               |
| /order/:orderId/refundRefuse         |    GET     |   ✔    |       주문취소(환불) 요청 거절       |
| /order/store/:storeId                |    POST    |   ✔    |          음식 주문(여러개)           |

[상세 API 명세보기](https://charming-castanet-ba9.notion.site/17e5fa0a09b94064a39e9c468625352a?v=7ca9b026f7c4438ba77a6186aa7dbcb6)

## 역할 분담

| 이름   | 기능 구현 및 역할                                                                                                                             |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 박성민 | 메뉴주문, 주문확인 및 배달 완료처리, 환불기능, 매장 즐겨찾기, 배달관련 실시간 알림기능 구현(socket.io) / 각 프론트엔드 병합 및 CSS style 통일 |
| 류원희 | 매장 및 메뉴 CRUD 일체 기능 구현 / 프론트엔드 연결, 매장 및 메뉴 CSS 작업                                                                     |
| 이승준 | 회원가입 및 로그인, 유저 CRUD, 이메일인증, 소셜로그인, 검색 기능 구현 / 프론트엔드 연결, CSS 작업                                             |
| 이상훈 | 리뷰 CRUD, 리뷰 좋아요, 주문 건수별/재주문율 기준 간단한 매장 랭킹기능 구현/ 프론트엔드 연결, CSS작업                                         |

> ⭕'COMPLTED LIST'
>
> - [x] 프로젝트 요구사항 중 필수구현 사항 구현
> - [x] nodemailer를 사용하여 이메일 인증 구현
> - [x] AWS S3를 사용하여 매장/유저/리뷰 이미지 업로드 및 프론트 출력 구현
> - [x] 소셜로그인 구현
> - [x] 에러 문구 모듈화
> - [x] socket.io를 활용한 실시간 알림기능 구현
> - [x] 랭킹기능(주문건수별, 재주문율) 구현

---

## Problems

### 공통사항

-
-
-
