import './css/styles.css';

import debounce from 'lodash.debounce';
import {fetchCountries} from './fetchCountries'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const BASE_URL = 'https://restcountries.com/v3.1/'

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');


// function fetchCountries(name){
//     return fetch(`${BASE_URL}name/${name}?fields=name,capital,population,flags,languages,`)
//     .then(response => {
//         if (!response.ok){
//             throw new Error(response.statusText)
//         }
//         const data = response.json()
//         return  data
//     })
// }


function createCountryListMarkup(countries) {
  const markup = countries.map(
      ({ name, flags}) =>
        `<li class="country-item">
        <img class="country-flag" 
        src="${flags.svg}" 
        alt="${name.official}">
        <p>${name.official}</p></li>`
    )
    .join('');
    // console.log(' -->', markup);
    
  countryListEl.innerHTML = markup;
}

function createCountryMarkup(country){
    const markup = country.map(
        ({
        name,
        capital,
        population,
        flags,
        languages,
    }) => `<div class="country-box">
    <img class="country-flag" 
    src="${flags.svg}" 
    alt="${name.official}">
    <p>${name.official}
    </p>
    </div>
    <p class="country-subtitle">Capital: <span class="country-text">${capital} </span> </p>
    <p class="country-subtitle">Population: <span class="country-text">${population} </span> </p>
    <p class="country-subtitle">Languages: <span class="country-text">${Object.values(languages)} </span> </p>`
    ).join('')
    countryInfoEl.innerHTML= markup
console.log(' -->', country.languages);

}

function handleCountryInput() {
    if (inputEl.value.trim() === ''){
        Notify.info('Please enter a search request.');
        return
    } else{ 
    fetchCountries(inputEl.value.trim())
    .then(data=>{
        if (data.length > 10){
            countryListEl.innerHTML= '';
            countryInfoEl.innerHTML = '';
            Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (data.length >= 2  && data.length <= 10){
            countryInfoEl.innerHTML = '';
            console.log(' -->',data);
        
            createCountryListMarkup(data);  
        } else if (data.length ===1 ){
            countryListEl.innerHTML = '';
           createCountryMarkup(data);  
    }
})
.catch(()=>{
    countryListEl.innerHTML= '';
    countryInfoEl.innerHTML = '';
    Notify.failure('Oops, there is no country with that name')})
}}
inputEl.addEventListener('input', debounce(handleCountryInput, DEBOUNCE_DELAY));
