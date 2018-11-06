import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from 'react-google-maps';
import marker from '../assets/images/location-marker.svg';
import GoogleMapsStyle from './GoogleMapsStyle';

const DashboardMap = withScriptjs(
  withGoogleMap(props => {
    const center = props.position
      ? { lat: props.position.lat, lng: props.position.lng }
      : {
          lat: 37.3648,
          lng: -122.0046
        };
    const location = props.position ? (
      <Marker position={center} icon={marker} />
    ) : null;
    const zoom = props.position ? 15 : 12;

    return (
      <GoogleMap
        defaultCenter={{
          lat: 37.3648,
          lng: -122.0046
        }}
        defaultZoom={12}
        clickableIcons={false}
        zoom={zoom}
        center={center}
        options={{
          disableDefaultUI: false,
          scaleControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: GoogleMapsStyle,
          gestureHandling: 'greedy'
        }}
      >
        {location}
        {props.directions && (
          <DirectionsRenderer
            directions={props.directions}
            options={{ suppressMarkers: true }}
          />
        )}
      </GoogleMap>
    );
  })
);

export default DashboardMap;
