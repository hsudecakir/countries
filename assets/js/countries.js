const detailContainer = document.querySelector('.detail-container');
selectedRegion.addEventListener('click', showOptions);
modeSwitchBtn.addEventListener('click', changeMode);

async function init() {
  const data = await fetch('https://restcountries.com/v3.1/all').then(r => r.json());
  render(data);
  selectRegion(data);
  searchInput.addEventListener('input', (e) => filterCountries(e, data));
}

function render(countries){
  countriesList.innerHTML = `
    ${countries.map(country => `
        <div class="country" data-area="${country.area}">
          <img data-area="${country.area}" src="${country.flags.png}" alt="Flag">
          <h2 data-area="${country.area}">${country.name.common}</h2>
          <div class="country-infos" data-area="${country.area}">
            <p data-area="${country.area}">Population: <span data-area="${country.area}">${Number(country.population).toLocaleString('en-US')}</span></p>
            <p data-area="${country.area}">Region: <span data-area="${country.area}">${country.region}</span></p>
            <p data-area="${country.area}">Capital: <span data-area="${country.area}">${country.capital}</span></p>
          </div>
        </div>
      `).join('')}
  `;
  bindCountries(countries);
}

function bindCountries(data){
  const countries = document.querySelectorAll('.country');
  for (const country of countries) {
    country.addEventListener('click', (e) => showCountryDetail(e, data));
  }
}

function showCountryDetail(e, countries){
  document.body.classList.add('detail');
  const clickedCountry = countries.find(country => country.area == e.target.dataset.area);
  console.log(clickedCountry)
  const NativeNameFirstKey = Object.keys(clickedCountry.name.nativeName)[0];
  const currencyFirstKey = Object.keys(clickedCountry.currencies)[0];
  const languageKeys = Object.keys(clickedCountry.languages);
  const languages = languageKeys.map(key => clickedCountry.languages[key]).join(", ");
  detailContainer.innerHTML = `
    <button id="gobackBtn"><i class="fa-solid fa-arrow-left-long"></i> Back</button>
    <div class="detail-container--wrapper">
    <img class="detail-img" src="${clickedCountry.flags.png}" alt="Flag">
    <div class="detail-container__wrapper">
    <h2 class="detail-country-name">${clickedCountry.name.common}</h2>
    <div class="countries-infos">
    <div class="country-infos detail">
      <p>Native Name: <span>${clickedCountry.name.nativeName[NativeNameFirstKey].common}</span></p>
      <p>Population: <span>${Number(clickedCountry.population).toLocaleString('en-US')}</span></p>
      <p>Region: <span>${clickedCountry.region}</span></p>
      <p>Sub Region: <span>${clickedCountry.subregion}</span></p>
      <p>Capital: <span>${clickedCountry.capital}</span></p>
    </div>
    <div class="country-infos detail">
      <p>Top Level Domain: <span>${clickedCountry.tld.map(tld => tld).join(", ")}</span></p>
      <p>Currencies: <span>${clickedCountry.currencies[currencyFirstKey].name}</span></p>
      <p>Languages: <span>${languages}</span></p>
    </div>
    </div>
    ${'borders' in clickedCountry ? `
      <div class="border-countries">
        <h3>Border Countries:</h3>
        <div class="border-countries__wrapper">
        ${clickedCountry.borders.map(border => `<div class="border-country">${border}</div>`).join('')}
        </div>
      </div>
      </div>
      </div>` : ''}
  `;
  gobackBtn.addEventListener('click', () => {
    document.body.classList.remove('detail');
  });
}

function changeMode(){
  document.body.classList.toggle('dark-mode');
}

function showOptions(){
  region.classList.toggle('show-options');
}

function selectRegion(countries){
  const options = regionOptions.querySelectorAll('p');
  for (const option of options) {
      option.addEventListener('click', (e) => {
      selectedRegion.innerHTML = `${e.target.dataset.region} <i class="fa-solid fa-angle-down"></i>`;
      region.classList.remove('show-options');
      filterCountries(e, countries);
    })
  }
}

function filterCountries(e, countries){
  const filteredCountries = countries
  .filter(country => selectedRegion.innerText === 'Filter by Region' ? country : country.region === selectedRegion.innerText)
  .filter(country => searchInput.value.trim() === '' ? country : country.name.common.toLowerCase().includes(searchInput.value.toLowerCase()));
  render(filteredCountries);
  console.log(filteredCountries);
}

init();