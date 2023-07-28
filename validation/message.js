const user = {
  email: {
    'string.base': '이메일은 문자열 이여야 합니다.',
    'string.max': '이메일은 20자 이내로 입력해 주세요.',
    'string.pattern.base': '이메일 형식이 올바르지 않습니다',
    'any.required': '이메일을 입력해 주세요.',
  },
  name: {
    'string.base': '이름은 문자열 이여야 합니다',
    'string.max': '이름은 20자 이내로 입력해 주세요.',
    'string.pattern.base': '이름 형식이 올바르지 않습니다',
    'any.required': '이름을 입력해 주세요.',
  },
  password: {
    'string.base': '비밀번호는 문자열 이여야 합니다.',
    'string.min': '비밀번호는 최소 4자 이상 입력해 주세요.',
    'string.max': '비밀번호는 20자 이내로 입력해 주세요.',
    'any.required': '비밀번호를 입력해 주세요.',
  },
  confirmPassword: {
    'any.only': '입력한 비밀번호와 일치하지 않습니다.',
  },
  address: {
    'string.base': '주소는 문자열 이여야 합니다.',
    'any.required': '주소를 입력해 주세요.',
  },
  isSeller: {
    'boolean.base': '사업자 여부는 true, false 이여야 합니다.',
    'any.required': '사업자 여부를 입력해 주세요.',
  },
  businessRegistrationNumber: {
    'string.base': '사업자등록번호는 문자열 이여야 합니다.',
    'string.max': '사업자등록번호는 12자 이내로 입력해 주세요.',
  },
};

module.exports = user;
