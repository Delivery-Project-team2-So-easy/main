// const params = new URLSearchParams(window.location.search);
// const storeId = params.get('storeId');
//매장정보 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  storeId = 1; // 추후 삭제 필요. URLSearchParams로 storeId 받을것
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
      alert(data.message);
    });
});
