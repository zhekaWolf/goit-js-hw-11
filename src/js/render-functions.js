import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const gallery = document.querySelector('#gallery');
const loader  = document.querySelector('#loader');

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true, captionsData: 'alt', captionDelay: 250,
});

export function createGallery(images) {
  const markup = images.map(cardTpl).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() { loader.hidden = false; }
export function hideLoader() { loader.hidden = true; }

export function showInfo(message) {
  iziToast.info({ message, position: 'topRight' });
}
export function showSuccess(message) {
  iziToast.success({ message, position: 'topRight' });
}
export function showError(message) {
  iziToast.error({ message, position: 'topRight' });
}

export function smoothScrollAfterAppend() {
  const first = gallery.firstElementChild;
  if (!first) return;
  const { height } = first.getBoundingClientRect();
  window.scrollBy({ top: height * 2, behavior: 'smooth' });
}

function cardTpl({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `
<li class="photo-card">
  <a href="${largeImageURL}" class="gallery__link">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p><b>Likes</b> ${likes}</p>
    <p><b>Views</b> ${views}</p>
    <p><b>Comments</b> ${comments}</p>
    <p><b>Downloads</b> ${downloads}</p>
  </div>
</li>`;
}

