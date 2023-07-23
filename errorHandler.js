class CustomError {
  constructor(status, errorMessage) {
    this.status = status;
    this.errorMessage = errorMessage;
  }
}

// status 코드 구글링 후 수정필요
const errorHandler = {
  // signup
  emailFormat: new CustomError(400, '이메일 형식이 올바르지 않습니다. 다시 입력해 주세요'),
  passwordFormat: new CustomError(
    400,
    '패스워드는 4자리 이상이고 이메일과 같은 값이 포함될 수 없습니다.'
  ),
  checkPassword: new CustomError(412, '비밀번호가 일치하지 않습니다.'),
  // login
  checkUser: new CustomError(412, '회원가입되지 않은 이메일이거나 비밀번호가 다릅니다.'),
  // user common error
  existEmail: new CustomError(409, '이미 존재하는 이메일입니다.'),
  // kakaoCallBack
  nonToken: new CustomError(409, '토큰이 존재하지 않습니다.'),

  // registerStore
  existStore: new CustomError(409, '이미 존재하는 매장 이름입니다.'),
  addStoreForbidden: new CustomError(401, '매장을 추가로 등록할 수 없습니다.'),

  // getStoreRanking
  periodError: new CustomError(400, '기간은 숫자만 들어올 수 있으며 31일을 초과할 수 없습니다.'),

  // store common error
  noStore: new CustomError(404, '보유한 매장이 없습니다.'),
  duplicateMenu: new CustomError(409, '이미 등록된 메뉴입니다.'),
  noSeller: new CustomError(401, '사장으로 로그인한 계정만 이용할 수 있는 기능입니다.'),

  // orderMenu
  pointLess: new CustomError(400, '잔여포인트가 부족해 주문 할 수 없습니다.'),
  nonList: new CustomError(400, '주문할 음식이 없습니다.'),
  // isDelivered
  noOrder: new CustomError(404, '주문 내역이 없습니다.'),
  completedOrder: new CustomError(400, '이미 배달이 완료된 주문입니다.'),
  refundOrder: new CustomError(400, '고객님이 환불 요청한 주문입니다.'),
  cancelledOrder: new CustomError(400, '이미 환불된 주문입니다.'),
  // refundRequest
  completedRefund: new CustomError(400, '이미 환불된 주문입니다.'),
  requestingRefund: new CustomError(400, '이미 환불 요청 중인 주문입니다.'),
  // refundCompleted
  notRequestRefund: new CustomError(400, '주문 환불 요청이 들어온 주문이 아닙니다.'),
  // order common error
  notRegistered: new CustomError(404, '등록한 사업장이 없습니다.'),
  orderNotFound: new CustomError(404, '해당 주문을 찾을 수 없습니다.'),

  // postReivew
  duplicateReview: new CustomError(409, '해당 주문에 대한 리뷰를 이미 작성하셨습니다.'),
  noOrderHistory: new CustomError(400, '주문 내역이 없어 리뷰를 작성 할 수 없습니다.'),
  // updateReview
  nonExistReview: new CustomError(404, '작성된 리뷰가 존재하지 않습니다.'),

  // common error
  nonExistStore: new CustomError(404, '해당 매장이 존재하지 않습니다.'),
  nonExistMenu: new CustomError(404, '존재하지 않는 메뉴입니다.'),
  noPermissions: new CustomError(401, '해당 권한이 없습니다.'),
  emptyContent: new CustomError(400, '내용을 모두 입력해주세요.'),
  noUpdateContent: new CustomError(400, '변경내역이 없습니다.'),
};
module.exports = errorHandler;
