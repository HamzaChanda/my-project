    // mapboxgl.accessToken =mapToken;
    // const map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     style: 'mapbox://styles/mapbox/streets-v11', // style URL
    //     center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //     zoom: 9 // starting zoom
    // });
    // const marker=new mapboxgl.Marker()
    // .setLngLat(listing.geometry.coordinates)
    // .setPopup(
    //     new mapboxgl.Popup({ offset: 25 })
    //     .setHTML(`<h4>${listing.location}</h4><p>Exact Location will provided after booking</p>`)
    //     )
    // .addTo(map);
//     mapboxgl.accessToken = mapToken;

// // Parse the coordinates
// let parsedCoordinates;
// try {
//     parsedCoordinates = JSON.parse(coordinates);
//     console.log("Parsed Coordinates:", parsedCoordinates); // Debugging line
// } catch (e) {
//     console.error("Invalid coordinates format:", coordinates);
//     parsedCoordinates = [77.2090, 28.6139]; // Default coordinates
// }

// // Initialize the map with parsed coordinates
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     style: 'mapbox://styles/mapbox/streets-v11', // style URL
//     center: parsedCoordinates, // starting position [lng, lat]
//     zoom: 9 // starting zoom
// });

// // Add marker with popup
// const marker = new mapboxgl.Marker()
//     .setLngLat(parsedCoordinates)
//     .setPopup(
//         new mapboxgl.Popup({  })
//             .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`)
//     )
//     .addTo(map);
// mapboxgl.accessToken = mapToken;

// // Parse the coordinates
// let parsedCoordinates;
// try {
//     parsedCoordinates = JSON.parse(coordinates);
//     console.log("Parsed Coordinates:", parsedCoordinates); // Debugging line
// } catch (e) {
//     console.error("Invalid coordinates format:", coordinates);
//     parsedCoordinates = [77.2090, 28.6139]; // Default coordinates
// }

// // Initialize the map
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     style: 'mapbox://styles/mapbox/dark-v11', // style URL
//     center: parsedCoordinates, // starting position [lng, lat]
//     zoom: 9 // starting zoom
// });
// // Add marker with popup after the map loads
// map.on('load', function() {
//     if (parsedCoordinates && parsedCoordinates.length === 2) {
//         const marker = new mapboxgl.Marker({color:"red"})
//             .setLngLat(parsedCoordinates)
//             .setPopup(
//                 new mapboxgl.Popup({  })
//                 .setHTML(`<p>Exact Location will be provided after booking</p>`))
//             .addTo(map);
//         console.log("Marker added at:", parsedCoordinates); // Debugging line
//     } else {
//         console.error("Invalid coordinates for marker:", parsedCoordinates);
//     }
// });
mapboxgl.accessToken = mapToken;

if (!coordinates) {
    console.warn("No coordinates found, using default location.");
    coordinates = JSON.stringify([77.2090, 28.6139]);
}

let parsedCoordinates;
try {
    parsedCoordinates = JSON.parse(coordinates);
    if (!Array.isArray(parsedCoordinates) || parsedCoordinates.length !== 2) {
        throw new Error("Parsed coordinates not a valid [lng, lat] array.");
    }
    console.log("Parsed Coordinates:", parsedCoordinates);
} catch (e) {
    console.error("Invalid coordinates format:", coordinates);
    parsedCoordinates = [77.2090, 28.6139]; // Default
}

if (typeof mapboxgl === "undefined") {
    console.error("Mapbox GL JS is not loaded.");
}

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: parsedCoordinates,
    zoom: 9
});

map.on('load', function () {
    const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(parsedCoordinates)
        .setPopup(
            new mapboxgl.Popup()
                .setHTML(`<p>Exact Location will be provided after booking</p>`)
        )
        .addTo(map);

    console.log("Marker added at:", parsedCoordinates);
});
