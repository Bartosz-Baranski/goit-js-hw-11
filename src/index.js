import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { errorMsg } from './js/notiflix';
// import { galleryCreator } from './js/gallery';

const loading = document.querySelector('.load-more');
const searchForm = document.querySelector('.search-form');
const bodyBuilding = document.querySelector('.gallery');

axios.defaults.baseURL = 'https://pixabay.com/api/';

loading.classList.add('is-hidden');

let lightbox;
let page = 1;
let q = '';

const apiKey = '39442093-f355f33fb27509f62e93d1955';

async function getUl(userRequest, page) {
  const pictureArray = await axios.get(
    `?key=${apiKey}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return pictureArray.data;
}

function loadMorePics() {
  page += 1;
  lightbox.destroy();
  q = searchForm.searchQuery.value;
  console.log(page);
  getUl(q, page).then(pictureArray => {
    const Pictures = pictureArray.hits
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
    bodyBuilding.insertAdjacentHTML('beforeend', Pictures);
    lightbox = new SimpleLightbox('a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
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
      errorMsg;
    } else {
      const allPictures = pictureArray.hits
        .map(
          galleryItem => `<a class= "gallery-link" href="${galleryItem.largeImageURL}"><div class="photo-card">
          <img src="${galleryItem.webformatURL}" alt="${galleryItem.tags}" loading="lazy" />
          <div class="info">
          <p class="info-item">
      <b>Likes</b> ${galleryItem.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${galleryItem.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${galleryItem.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${galleryItem.downloads}
    </p>
          </div>
          </div></a>`
        )
        .join('');
      console.log(pictureArray);
      bodyBuilding.insertAdjacentHTML('beforeend', allPictures);
      lightbox = new SimpleLightbox('a', {
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();
      if (pictureArray.totalHits > 40) {
        loading.classList.remove('is-hidden');
      }
    }
  });
}

searchForm.addEventListener('submit', galleryCreator);
loading.addEventListener('click', loadMorePics);
