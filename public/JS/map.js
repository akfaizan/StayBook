
    const map = new mapboxgl.Map({
        // TO MAKE THE MAP APPEAR YOU MUST
        // ADD YOUR ACCESS TOKEN FROM
        // https://account.mapbox.com
        accessToken: mapToken,
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    console.log(coordinates);

     // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({offset: 25, className: 'markerpopup'})
            .setHTML("Exact location is revealed after booking")
        )
        .addTo(map);