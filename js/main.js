const api_Key = 'acd05665bce0986219382761f564c784';
const baseUrl = 'https://api.themoviedb.org/3';
const basePosterUrl = 'https://image.tmdb.org/t/p/original';

// defining some end points to be used later.
const requestsEndPoints = {
	fetchTrending: `/trending/all/week?api_key=${api_Key}&language=en-US`,
	fetchNetflixOriginals: `/discover/tv?api_key=${api_Key}&with_networks=213`,
	fetchTopRated: `/movie/top_rated?api_key=${api_Key}&language=en-US`,
	fetchActionMovies: `/discover/movie?api_key=${api_Key}&with_genres=28`,
	fetchComedyMovies: `/discover/movie?api_key=${api_Key}&with_genres=35`,
	fetchHorrorMovies: `/discover/movie?api_key=${api_Key}&with_genres=27`,
	fetchRomanceMovies: `/discover/movie?api_key=${api_Key}&with_genres=10749`,
	fetchDocumentaries: `/discover/movie?api_key=${api_Key}&with_genres=99`
};

// create the app.
const constructApp = (endPoints) => {
	const main = document.querySelector('#main');
	main.innerHTML = `
	<nav class="nav"></nav>
    <header></header>
    <div class="app">
	<Row title='NetflixOriginals' fetchUrl=${endPoints.fetchNetflixOriginals}></Row>

    <Row title='Trending' fetchUrl=${endPoints.fetchTrending}></Row>
    <Row title='TopRated' fetchUrl=${endPoints.fetchTopRated}></Row>
    <Row title='ActionMovies' fetchUrl=${endPoints.fetchActionMovies}></Row>
    <Row title='ComedyMovies' fetchUrl=${endPoints.fetchComedyMovies}></Row>
    <Row title='HorrorMovies' fetchUrl=${endPoints.fetchHorrorMovies}></Row>
    <Row title='RomanceMovies' fetchUrl=${endPoints.fetchRomanceMovies}></Row>
    <Row title='Documentaries' fetchUrl=${endPoints.fetchDocumentaries}></Row>
    </div>`;
};

constructApp(requestsEndPoints);

// get the data from external api using the endpoints.
const makeRequest = async (base, Url) => {
	const requestData = await axios.get(`${base}${Url}`);
	return requestData.data.results;
};

//make the navbar.
const makeNavBar = () => {
	const navBarDiv = document.querySelector('.nav');

	const logo = document.createElement('img');
	logo.setAttribute('src', '../images/logo.png');
	logo.setAttribute('alt', 'MoFlix Logo');
	logo.classList.add('nav__logo');

	navBarDiv.append(logo);

	window.addEventListener('scroll', () => {
		if (window.scrollY > 100) {
			navBarDiv.classList.add('nav_Back_Black');
		} else {
			navBarDiv.classList.remove('nav_Back_Black');
		}
	});
};
makeNavBar();

//make banner.
const makeBanner = async () => {
	const netFlixriginals = requestsEndPoints.fetchNetflixOriginals;
	const bannerData = await makeRequest(baseUrl, netFlixriginals);

	const randNum = Math.floor(Math.random() * bannerData.length);

	const choosenMovie = bannerData[randNum];

	const header = document.querySelector('header');
	header.classList.add('banner');
	header.style.backgroundImage = `url(${basePosterUrl}${choosenMovie.poster_path})`;

	const bannerContentDiv = document.createElement('div');
	bannerContentDiv.classList.add('banner__contents');

	header.append(bannerContentDiv);

	bannerContentDiv.innerHTML = `
        <h1 class="banner__title">${choosenMovie.name}</h1>    
        <div class="banner__buttons">
            <a href="https://www.netflix.com/eg-en/login" target="new"><button class='banner__button'>Play</button></a>
            <a href="https://media.netflix.com/en/" target="new"><button class='banner__button'>My List</button></a>
        </div>
        <h1 class='banner__discription'>${choosenMovie.overview}</h1>               
	`;

	//for fading the bottom od the banner

	const emptyDivForFadeEffect = document.createElement('div');
	emptyDivForFadeEffect.classList.add('banner--fadeBottom');
	header.append(emptyDivForFadeEffect);
};

makeBanner();

//making each row data
const makeRowData = () => {
	const rows = document.querySelectorAll('row');
	rows.forEach(async (row) => {
		//constructig row
		row.innerHTML = `
        <div class="row">
         <h2>${row.title}</h2>
         <div id="${row.title}" class="row__posters"></div>
        </div>`;

		//making data Dynamically
		const urls = row.getAttribute('fetchUrl');
		const data = await makeRequest(baseUrl, urls);
		const contentDiv = document.querySelector(`#${row.title}`);

		data.forEach((element) => {
			if (element.poster_path) {
				const movie = document.createElement('div');
				const poster = document.createElement('img');
				const trailerLink = document.createElement('a');
				trailerLink.setAttribute('target', 'new');

				poster.setAttribute('src', `${basePosterUrl}${element.poster_path}`);
				poster.setAttribute('alt', 'Poster');
				poster.setAttribute('key', element.id);
				poster.classList.add('row__poster');

				trailerLink.append(poster);

				movie.append(trailerLink);

				contentDiv.append(movie);

				poster.addEventListener('click', async () => {
					if (element.name) {
						const term = element.name;
						const searchTerm = term.replace(/\s/g, '') + 'Trailer';
						trailerLink.setAttribute('href', `https://www.youtube.com/results?search_query=${searchTerm}`);
					} else {
						const term = element.title;
						await movieTrailer(`${term}`)
							.then((res) => {
								trailerLink.setAttribute('href', `${res}`);
							})
							.catch(() => {
								console.log('Trailer Not found');
							});
					}
				});
			}
		});
	});
};
makeRowData();
