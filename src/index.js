import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { errorMsg } from './js/notiflix';

const loading = document.querySelector('.load-more');
const searchForm = document.querySelector('.search-form');
const bodyBuilding = document.querySelector('.gallery');

axios.defaults.baseURL = 'https://pixabay.com/api/';

loading.classList.add('is-hidden');

let page = 1;
let q = '';

const lightbox = new SimpleLightbox(' .gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const apiKey = '39442093-f355f33fb27509f62e93d1955';

async function getUl(userRequest, page) {
  const pictureArray = await axios.get(
    `?key=${apiKey}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return pictureArray.data;
}

function picturesCreator(pictureArray) {
  const allPictures = pictureArray.hits
    .map(
      gallery => `<a class= "gallery-link" href="${gallery.largeImageURL}"><div class="photo-card">
      <img src="${gallery.webformatURL}" alt="${gallery.tags}" loading="lazy" />
      <div class="info">
      <p class="info-item">
  <b>Likes</b> ${gallery.likes}
</p>
<p class="info-item">
  <b>Views</b> ${gallery.views}
</p>
<p class="info-item">
  <b>Comments</b> ${gallery.comments}
</p>
<p class="info-item">
  <b>Downloads</b> ${gallery.downloads}
</p>
      </div>
      </div></a>`
    )
    .join('');
  bodyBuilding.insertAdjacentHTML('beforeend', allPictures);
  lightbox.refresh();
}

function loadMorePics() {
  page += 1;
  q = searchForm.searchQuery.value;

  getUl(q, page).then(pictureArray => {
    picturesCreator(pictureArray);
    const allPages = Math.ceil(pictureArray.totalHits / 40);
    if (page >= allPages) {
      loading.classList.add('is-hidden');
      return errorMsg;
    }
  });
}

function galleryCreator(e) {
  e.preventDefault();
  bodyBuilding.innerHTML = '';
  loading.classList.add('is-hidden');
  page = 1;
  q = searchForm.searchQuery.value;

  getUl(q, page).then(pictureArray => {
    if (pictureArray.totalHits === 0) {
      return errorMsg;
    } else {
      picturesCreator(pictureArray);
      if (pictureArray.totalHits > 40) {
        loading.classList.remove('is-hidden');
      }
    }
  });
}

searchForm.addEventListener('submit', galleryCreator);
loading.addEventListener('click', loadMorePics);
