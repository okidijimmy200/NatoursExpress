// js for maps to run on client side

// getting access to location from server side



export const displayMap = (locations) => {
     
mapboxgl.accessToken = 'pk.eyJ1IjoiamltbXlqb25lc29raWRpIiwiYSI6ImNrZHk4anE3NjB2eWEyeW94Zm1iZ2ZqYnMifQ.ruP0R6CCf0vK4VYBS7X6SA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jimmyjonesokidi/ckdy9b3gg46op19p8od9njsxm',
    scrollZoom: false
    // // mapbox jst like mongodb requires lng then lat
    // center: [-118.415900, 34.194133],
    // zoom: 10,
    // interactive: false // to make the map not interactive
});

const bounds = new mapboxgl.LngLatBounds() // we included the mapbox library

// all locations in our locations array

locations.forEach(loc => {
    // create marker 
    // adding new html element
    const el = document.createElement('div');
    el.className = 'marker'; // we do have a class for the marker in our css
    
    // new marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom' // this is the bottom of the pin located at the exact gps location, we cld put it at the center or top
    }) //setting gps coordinates
    .setLngLat(loc.coordinates) // array of lng and lat
    .addTo(map) //map variable

    // adding a pop-up 
    new mapboxgl.Popup({
        //offset property
        offset: 30
    }) 
    .setLngLat(loc.coordinates) // array of lng and lat
    // adding html contet
    .setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`)
    .addTo(map);

    // extends the map bounds to include the current location
    bounds.extend(loc.coordinates) 
});


// to make mark fit the current location
map.fitBounds(bounds, {
    padding: {
        // specify padding to the bounds
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
    }
})
}
