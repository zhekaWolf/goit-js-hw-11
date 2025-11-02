// src/main.js
import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showInfo,
  showSuccess,
  showError,
  smoothScrollAfterAppend,
} from './js/render-function.js';



const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-form [name="query"]'),
  gallery: document.querySelector('#gallery'),
  loadMore: document.querySelector('#load-more'),
};

let query = '';
let page = 1;
let totalHits = 0;

refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  query = refs.input.value.trim();
  if (!query) {
    showInfo('Enter a search term'); 
    return;
  }

  page = 1;
  totalHits = 0;
  clearGallery();
  toggleMore(false);

  showLoader();
  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (!totalHits) {
      showError('Sorry, no images match your search query.');
      return;
    }

    createGallery(data.hits);
    showSuccess(`Hooray! We found ${totalHits} images.`);

    if (page * PER_PAGE < totalHits) toggleMore(true);
  } catch (err) {
    console.error(err);
    showError('Something went wrong, try again later.');
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;
  toggleMore(false);
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    // кінець списку
    if (page * PER_PAGE >= totalHits) {
      showInfo("We're sorry, but you've reached the end of search results.");
    } else {
      toggleMore(true);
    }

    smoothScrollAfterAppend();
  } catch (err) {
    console.error(err);
    showError('Something went wrong, try again later.');
  } finally {
    hideLoader();
  }
}

function toggleMore(show) {
  refs.loadMore.hidden = !show;
}
