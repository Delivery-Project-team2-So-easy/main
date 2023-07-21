//회원가입 form
const signUpSubmitBtn = document.querySelector('.signUpForm');
const sendEmailBtn = document.querySelector('.sendMail');
const emailAuthBtn = document.querySelector('.emailAuth');

async function signUp(event) {
  event.preventDefault();
  const form = new FormData();
  const name = document.querySelector('#signUpName').value;
  const password = document.querySelector('#signUpPwd').value;
  const confirmPassword = document.querySelector('#signUpConfirmPwd').value;
  const pet_name = document.querySelector('#signUpPetName').value;
  const email = document.querySelector('#signUpEmail').value;
  const newFile = document.querySelector('#newFile').files[0];

  if (document.querySelector('#signUpEmail').readOnly === false) {
    return alert('이메일 인증을 해주세요.');
  }

  if (newFile) {
    form.append('newFile', newFile);
  }
  form.append('email', email);
  console.log(email);
  form.append('name', name);
  form.append('password', password);
  form.append('confirmPassword', confirmPassword);
  form.append('pet_name', pet_name);
  $.ajax({
    type: 'POST',
    url: `/signup`,
    processData: false,
    contentType: false,
    data: form,
    error: function (error) {
      alert(error.responseJSON.errorMessage);
    },
    success: function (response) {
      alert(response.message);
      window.location.href = '/';
    },
  });
}
signUpSubmitBtn.addEventListener('submit', signUp);
