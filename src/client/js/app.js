const tripDetails = {}
////////////////////////////////////
// APIs Details
///////////////////////////////////
// GeoNames API
const geoNamesUser = 'maher_elsayed';

// weatherbit API
const wbKey = '894dbdeff2574675bc3ceb0d1216ae2d';

// Pixabay API
const pxKey = '18663834-58df2d9c77242d52fb0a4a16b';

// function to handle submit
function handleSubmit(e) {
    e.preventDefault();

    tripDetails.travelFrom = document.getElementById('travelFrom').value;
    tripDetails.travelTo = document.getElementById('travelTo').value;
    tripDetails.departDate = document.getElementById('departDate').value;
    tripDetails.returnDate = document.getElementById('returnDate').value;
    tripDetails.tripDuration = tripDuration(tripDetails.departDate, tripDetails.returnDate);

    try {
        fetchGeoNames(tripDetails.travelTo)
            .then((cityInfo) => {
                const cityLat = cityInfo.geonames[0].lat;
                const cityLng = cityInfo.geonames[0].lat;

                return fetchWeatherData(cityLat, cityLng, tripDetails.departDate);
            })
            .then((weatherDetails) => {
                tripDetails.temp = weatherDetails.data[0].temp;
                tripDetails.weatherDesc = weatherDetails.data[0].weather.description;

                return fetchPixabayData(tripDetails.travelTo);
            })
            .then((cityImage) => {
                if (cityImage.hits.length > 0) {
                    tripDetails.destinationImage = cityImage.hits[0].largeImageURL;
                }
                // post data to the server
                return postData(tripDetails);
            })
            .then(() => {
                console.log(tripDetails)
                updateUI();
            })
    } catch (err) {
        console.log('error', err)
    }
}

// function to fetch geonames data
const fetchGeoNames = async (destination) => {
    const response = await fetch(`http://api.geonames.org/searchJSON?q=${destination}&maxRows=1&username=${geoNamesUser}`);
    try {
        const geoData = await response.json();
        return geoData;
    } catch (error) {
        console.log("error", error);
    }
}

// function to fetch weather data
const fetchWeatherData = async (cityLat, cityLng, date) => {

    const tripTimestamp = Math.floor(new Date(date).getTime() / 1000);
    const today = new Date();
    const todayTimestamp = Math.floor(new Date(today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()).getTime() / 1000);

    let response;
    if (tripTimestamp < todayTimestamp) {
        let nextDate = new Date(date);
        nextDate.setDate(next_date.getDate() + 1);
        response = await fetch(`https://api.weatherbit.io/v2.0/history/daily?lat=${cityLat}&start_date=${date}&end_date=${nextDate}&key=${wbKey}`)
    } else {
        response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${cityLat}&lon=${cityLng}&key=${wbKey}`);
    }

    try {
        return await response.json();
    } catch (err) {
        console.log('error', err);
    }
}

// function to fetch an image from Pixabay API
const fetchPixabayData = async (city) => {
    const response = await fetch(`https://pixabay.com/api/?key=${pxKey}&q=${city} city&image_type=photo`);
    try {
        return await response.json();
    } catch (err) {
        console.log('error', err);
    }
}

const tripDuration = (dt1, dt2) => {
    const date1 = new Date(dt1);
    const date2 = new Date(dt2);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + " days";
}

// Function to post Data
const postData = async (details) => {
    const response = await fetch('http://localhost:8080/postData', {
        method: "POST",
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(details)
    });

    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

// function to update UI
const updateUI = () => {
    document.querySelector('.trip-info__from span').innerHTML = tripDetails.travelFrom;
    document.querySelector('.trip-info__to span').innerHTML = tripDetails.travelTo;
    document.querySelector('.trip-info__depart span').innerHTML = tripDetails.departDate;
    document.querySelector('.trip-info__return span').innerHTML = tripDetails.returnDate;
    document.querySelector('.trip-info__duration span').innerHTML = tripDetails.tripDuration;
    document.querySelector('.trip-info__weather span').innerHTML = tripDetails.temp + '&#8451; ' + tripDetails.weatherDesc;
    document.querySelector('.trip-info').style.backgroundImage = `url(${tripDetails.destinationImage})`;
    document.querySelector('.trip-info').classList.add('show');
}

// Events
document.getElementById("formSubmit").addEventListener("submit", handleSubmit);
document.querySelector('.close').addEventListener('click', function () {
    document.querySelector('.trip-info').classList.remove('show');
});

export { handleSubmit }