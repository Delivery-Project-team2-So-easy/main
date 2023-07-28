const addressInput = document.querySelector('#signUpAddress');
const signUpBtn = document.querySelector('#signUpBtn');

function openKakaoAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.querySelector('#signUpAddress').value = data.address;
    },
  }).open();
}

function signUpFromKAKAO(event) {
  event.preventDefault();
  const address = document.querySelector('#signUpAddress').value;
  const isSeller = $('input[type=radio][name=isSeller]:checked').val();
  const businessRegistrationNumber = document.querySelector('#businessRegistrationNumber').value;

  $.ajax({
    method: 'POST',
    url: '/socialLogin',
    data: {
      address,
      isSeller,
      businessRegistrationNumber,
    },
    success: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data.message,
      }).then(() => {
        window.location.href = '/';
      });
    },
    error: (error) => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
      return;
    },
  });
}

function home() {
  window.location.href = '/';
}
addressInput.addEventListener('click', openKakaoAddress);
signUpBtn.addEventListener('click', signUpFromKAKAO);
