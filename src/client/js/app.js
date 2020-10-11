////////////////////////////////////
// APIs Details
///////////////////////////////////
// GeoNames API
const geoNamesUser = 'maher_elsayed';



function handleSubmit(e) {
    e.preventDefault();

    let travelTo = document.getElementById('travelTo').value;

    try {
        fetchGeoNames(travelTo)
            .then((cityInfo) => {
                const cityLat = cityInfo.geonames[0].lat;
                const cityLng = cityInfo.geonames[0].lat;

                console.log(cityLat);
                console.log(cityLng);
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


document.getElementById("formSubmit").addEventListener("click", handleSubmit);


export { handleSubmit }