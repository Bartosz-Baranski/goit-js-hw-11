export function galeryCreator(e) {
  e.preventDefault();
  bodyOdy.innerHTML = '';
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
      bodyOdy.insertAdjacentHTML('beforeend', allPictures);
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
