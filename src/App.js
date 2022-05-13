import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
const startLocation = [5.1107969, 52.0700474];

class App extends React.Component {

  assembleQueryURL = () => {
    // Store the location of the truck in a constant called coordinates
    const coordinates = [startLocation, [5.109492, 52.0761757], [5.1164711, 52.0739468], [5.1226603, 52.0825339], [5.1193458, 52.0661634], [5.1051998, 52.0663328]];
  
    // Set the profile to `driving`
    // Coordinates will include the current location of the truck,
    return `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.join(
      ';'
    )}?overview=full&steps=true&geometries=geojson&source=first&access_token=${
      mapboxgl.accessToken
    }`;
  }


  componentDidMount() {
    fetch(this.assembleQueryURL())
    .then(response => response.json())
    .then(data => {
    // Creates new map instance
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [5.104480, 52.092876],
      zoom: 15
    });

    // Creates new directions control instance
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      
    });

    // Integrates directions control with map
    map.addControl(directions, 'top-left');
    map.on('load', async () => {
      const marker = document.createElement('div');
      marker.classList = 'truck';

      // Create a new marker
      new mapboxgl.Marker(marker).setLngLat(startLocation).addTo(map);
      directions.setOrigin(startLocation);
      for(let i = 0; i < data.waypoints.length; i++){
        let waypoint = data.waypoints[i];
        const storeMarker = document.createElement('div');
      storeMarker.classList = 'store';
        new mapboxgl.Marker(storeMarker).setLngLat(waypoint.location).addTo(map);
        directions.addWaypoint(waypoint.waypoint_index, waypoint.location);
      }
      directions.setDestination(startLocation);
    });
    });
  }

  render() {
    return (
      <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
    );
  }
}

export default App;
