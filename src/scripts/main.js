
import ApiService from './apiService'
import cardPhotoTpl from '../templates/cardPhoto.hbs'
import * as basicLightbox from 'basiclightbox'
import 'basiclightbox/dist/basicLightbox.min.css';
import {  error } from '@pnotify/core';
import"@pnotify/core/dist/BrightTheme.css"
import "@pnotify/core/dist/PNotify.css";




var debounce = require('lodash.debounce');

const gallery = document.querySelector('.gallery')
const searchField = document.querySelector('.search-field')
const LoadMoreBtn = document.querySelector('.button')



const apiService = new ApiService()
searchField.addEventListener('input', debounce(onSearchImg,1000))
gallery.addEventListener('click', function (e) {
    if (e.target.nodeName !== 'IMG') {
      return;
    }
    const largeImageURL = e.target.dataset.source
  if (largeImageURL) {
    const instance = basicLightbox.create(`
      <img src="${largeImageURL}" width="1200" height="800">
  `)
      instance.show()
  }
}
)

function onSearchImg(e) {
    e.preventDefault()
    apiService.query = e.target.value

    apiService.resetPage()
    apiService.fetchArticles().then(hits => {
        if (!hits.length) {
            onError('"Not found. Please enter a more specific query!"')
        }
        clearMarkupPhotoCard()
        renderMarkupPhotoCard(hits)
        
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.2,
        }
        
        const intersectionCallback =  async(entries, observer) => {
            const observeElement = entries[0];
            if (observeElement.isIntersecting) {
                observer.unobserve(observeElement.target)
                await onLoadMore()
                const lastEl = document.querySelector('.gallery-photo-item:last-child')
                console.log(lastEl)
                observer.observe(lastEl)
            }
        }

        const observer = new IntersectionObserver(intersectionCallback, options)
        const lastElement = document.querySelector('.gallery-photo-item:last-child')

        observer.observe(lastElement)
    })
}


async function onLoadMore() {
    const result = await apiService.fetchArticles();
   
        renderMarkupPhotoCard(result);     
    
    
}


function renderMarkupPhotoCard(hits) {
    const markup = cardPhotoTpl(hits)
    gallery.insertAdjacentHTML('beforeend', markup)

}

function clearMarkupPhotoCard() {
    gallery.innerHTML = ''
}



function onError(message) {
    error({
        text: message
    })
 }





        




