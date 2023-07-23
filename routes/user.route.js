const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();

const authMiddleware = require('../middlewares/auth-middleware');
const uploadMiddleware = require('../middlewares/upload-middleware');

router.post('/users/signup', uploadMiddleware, userController.signUp);
router.post('/users/login', userController.login);
router.post('/users/logout', authMiddleware, userController.logout);
router.patch('/users', authMiddleware, userController.updateUser);
router.post('/users/checkEmail', userController.checkEmail);
//좋아요 조회
router.get('/user/store/:storeId/isliked', authMiddleware, userController.isStoreLiked);

router.post('/user/store/:storeId/like', authMiddleware, userController.storeLike);
router.get('/user/store/likeStores', authMiddleware, userController.getMyLike);
router.get('/user/myReviews', authMiddleware, userController.getMyReviews);
router.get('/user/myOrders', authMiddleware, userController.getMyOrders);
router.get('/userInfo', authMiddleware, userController.checkUserInfo);

//카카오
router.get('/users/kakao', userController.kakaoLogin); // 로그인 창
router.get('/users/kakao/callback', userController.kakaoCallBack); // 가져온 데이터로 로그인 or 회원가입
router.post('/users/kakao/signup/:kakaoEmail', uploadMiddleware, userController.kakaoSignUp); // 카카오 회원가입

module.exports = router;
