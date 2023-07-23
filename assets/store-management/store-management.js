const params = new URLSearchParams(window.location.search);
let storeId = params.get('storeId');
//매장정보 불러오기
storeId = 1;
if (storeId) {
  window.addEventListener('DOMContentLoaded', async () => {
    fetch(`/store/${storeId}`)
      .then((response) => response.json())
      .then((data) => {
        const store_name = data.data.store_name;
        const store_img = data.data.store_img;
        const temp_html = `<img class="store-img" src="${store_img}"
        />
        <div class="store-name">${store_name}</div> `;
        const store_overview = document.querySelector('.store-overview');
        store_overview.insertAdjacentHTML('beforeend', temp_html);
      });
  });
  const update_field = document.querySelector('#update-field');
  const register_field = document.querySelector('#register-field');
  update_field.style.display = 'block';
  register_field.style.display = 'none';
} else {
  const update_field = document.querySelector('#update-field');
  const register_field = document.querySelector('#register-field');
  update_field.style.display = 'none';
  register_field.style.display = 'block';
}

document.querySelector('.update-btn').addEventListener('click', function () {
  const storeName = document.querySelector('#store-name').value;
  const storeAddress = document.querySelector('#store-address').value;
  const storeImg = document.querySelector('#image');
  let formData = new FormData();
  formData.append('storeName', storeName);
  formData.append('storeAddress', storeAddress);
  formData.append('newFile', storeImg.files[0]);

  fetch('/store/registration', {
    method: 'PATCH',
    cache: 'no-cache',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errorMessage) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.errorMessage,
        });
      }
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
    });
});

document.querySelector('.delete-btn').addEventListener('click', function () {
  const storeName = document.querySelector('#store-name').value;
  const storeAddress = document.querySelector('#store-address').value;
  const storeImg = document.querySelector('#image');
  let formData = new FormData();
  formData.append('storeName', storeName);
  formData.append('storeAddress', storeAddress);
  formData.append('newFile', storeImg.files[0]);

  fetch('/store/registration', {
    method: 'PATCH',
    cache: 'no-cache',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errorMessage) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.responseJSON.errorMessage,
        });
      }
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      });
    })
    .then(window.location.reload());
});

document.querySelector('.register-btn').addEventListener('click', function () {});

document.querySelector('.register-btn').addEventListener('click', function () {
  const storeName = document.querySelector('#rg-store-name').value;
  const storeAddress = document.querySelector('#rg-store-address').value;
  const openingDate = document.querySelector('#rg-opening-date').value;
  const storeImg = document.querySelector('#rg-image');
  let formData = new FormData();
  formData.append('storeName', storeName);
  formData.append('storeAddress', storeAddress);
  formData.append('openingDate', openingDate);
  formData.append('newFile', storeImg.files[0]);

  fetch('/store/registration', {
    method: 'POST',
    cache: 'no-cache',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errorMessage) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.responseJSON.errorMessage,
        });
      }
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      });
    })
    .then(window.location.reload());
});
