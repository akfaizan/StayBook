const photoIds = [
    "photo-1600585154340-be6161a56a0c", "photo-1600607687939-ce8a6c25118c", "photo-1600607687920-4e2a09cf159d",
    "photo-1613490493576-7fde63acd811", "photo-1613977257363-707ba9348227", "photo-1512917774080-9991f1c4c750",
    "photo-1510798831971-661eb04b3739", "photo-1449158743715-0a90ebb6d2d8", "photo-1518780664697-55e3ad937233",
    "photo-1505693416388-ac5ce068fe85", "photo-1600210492486-724fe5c67fb0", "photo-1600566753086-00f18fb6b3ea",
    "photo-1600566753190-17f0baa2a6c3", "photo-1615874959474-d609969a20ed", "photo-1616486338812-3dadae4b4ace",
    "photo-1590490360182-c33d57733427", "photo-1611892440504-42a792e24d32", "photo-1574362848149-11496d93a7c7",
    "photo-1551882547-ff40c63fe5fa", "photo-1542314831-068cd1dbfeeb", "photo-1511818966892-d7d671e672a2",
    "photo-1600210492493-0946911123ea", "photo-1600566752355-35792bedcfea", "photo-1598928506311-c55ded91a20c",
    "photo-1600573472591-ee6b68d14c68", "photo-1600047509782-20d39509f26d", "photo-1600121848594-d8644e57abab",
    "photo-1600210491369-e753d80a41f3", "photo-1600585154526-990dced4db0d", "photo-1566665797739-1674de7a421a",
    "photo-1582719508461-905c673771fd", "photo-1578683010236-d716f9a3f461", "photo-1540518614846-7eded433c457",
    "photo-1613977257592-4871e5fcd7c4", "photo-1523217582562-09d0def993a6", "photo-1564013799919-ab600027ffc6",
    "photo-1600047509807-ba8f99d2cdde", "photo-1535827841776-24afc1e255ac", "photo-1513584684374-8bab748fbf90",
    "photo-1502672260266-1c1ef2d93688", "photo-1602088113235-229c19758e9f", "photo-1517248135467-4c7edcad34c4",
    "photo-1522708323590-d24dbb6b0267", "photo-1596394516093-501ba68a0ba6", "photo-1601918774946-25832a4be0d6",
    "photo-1524758631624-e2822e304c36", "photo-1554995207-c18c203602cb", "photo-1560185008-b033106af5c3"
];

const imageUrl = id => `https://images.unsplash.com/${id.split("?")[0]}?auto=format&fit=crop&w=1400&q=82`;
const photoSets = Array.from({ length: 15 }, (_, index) => photoIds.slice(index * 3, index * 3 + 3).map(imageUrl));

const listings = [
    { title: "Kyoto Garden Townhouse", description: "Wake to a quiet garden in this warm, wood-lined townhouse. Temples, tea houses, and neighborhood cafés are close by.", price: 11500, location: "Kyoto", country: "Japan", category: "City", coordinates: [135.7681, 35.0116] },
    { title: "Glass Cabin above the Fjord", description: "A secluded cabin with wide-open views, a private deck, and cozy evenings beneath the northern sky.", price: 14200, location: "Hella", country: "Iceland", category: "Mountains", coordinates: [-20.2439, 63.8349] },
    { title: "Algarve Clifftop House", description: "Spend slow mornings on the terrace and follow the coastal path down to quiet coves and golden beaches.", price: 16800, location: "Lagos", country: "Portugal", category: "Beach", coordinates: [-8.6730, 37.1028] },
    { title: "Pink City Haveli Stay", description: "Settle into a restored courtyard home with carved details, rooftop sunsets, and Jaipur's old city at your door.", price: 7200, location: "Jaipur", country: "India", category: "Trending", coordinates: [75.7873, 26.9124] },
    { title: "Lake Bled Boathouse Retreat", description: "A peaceful lakeside base for early swims, island boat rides, and a restorative stay in the Julian Alps.", price: 13500, location: "Bled", country: "Slovenia", category: "Lakefront", coordinates: [14.1136, 46.3625] },
    { title: "Oaxaca Courtyard Casita", description: "Colorful rooms open onto a leafy courtyard, with galleries, markets, and excellent local food a short walk away.", price: 6800, location: "Oaxaca", country: "Mexico", category: "City", coordinates: [-96.7266, 17.0732] },
    { title: "Marrakech Riad of Lanterns", description: "A calm riad tucked behind the medina lanes, with a tiled plunge pool and a roof terrace for sunset tea.", price: 9800, location: "Marrakech", country: "Morocco", category: "Trending", coordinates: [-7.9811, 31.6295] },
    { title: "Patagonia Mountain Lodge", description: "Return from the trails to a welcoming timber lodge, warm meals, and broad views across the Patagonian landscape.", price: 15400, location: "El Calafate", country: "Argentina", category: "Mountains", coordinates: [-72.2768, -50.3408] },
    { title: "Ubud Jungle Canopy Villa", description: "A private open-air hideaway surrounded by green canopy, with a plunge pool and easy access to Ubud's cafés.", price: 12300, location: "Ubud", country: "Indonesia", category: "AmazingViews", coordinates: [115.2625, -8.5069] },
    { title: "Highland Stone Bothy", description: "A simple, characterful stone cottage made for long walks, quiet nights, and discovering the Scottish Highlands.", price: 8900, location: "Fort William", country: "United Kingdom", category: "Countryside", coordinates: [-5.1052, 56.8198] },
    { title: "Santorini Caldera Cave Suite", description: "Whitewashed rooms and a shaded terrace look out over the caldera, with the village paths just outside.", price: 19200, location: "Oia", country: "Greece", category: "Beach", coordinates: [25.4615, 36.3932] },
    { title: "Dolomites Alpine Chalet", description: "A snug timber chalet with mountain views, a sunny balcony, and trailheads within easy reach.", price: 17600, location: "Ortisei", country: "Italy", category: "Cabins", coordinates: [11.6714, 46.5756] },
    { title: "Kerala Backwater Houseboat", description: "Drift along palm-lined canals, enjoy freshly cooked Kerala meals, and watch village life pass from the deck.", price: 10500, location: "Alappuzha", country: "India", category: "Lakefront", coordinates: [76.3388, 9.4981] },
    { title: "Palm Springs Desert Modern", description: "A bright mid-century home with a private pool, mountain backdrops, and room to unwind in the desert sun.", price: 21800, location: "Palm Springs", country: "United States", category: "Desert", coordinates: [-116.5453, 33.8303] },
    { title: "Costa Rica Rainforest Ecolodge", description: "A low-impact lodge framed by rainforest, with open-air living spaces and wildlife-rich trails nearby.", price: 14700, location: "La Fortuna", country: "Costa Rica", category: "AmazingViews", coordinates: [-84.6435, 10.4670] }
];

module.exports = listings.map((listing, index) => ({ ...listing, photoUrls: photoSets[index] }));
