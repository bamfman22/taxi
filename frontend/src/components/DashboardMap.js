import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from 'react-google-maps';
import marker_icon from '../assets/images/location-marker.svg';
import other_marker_icon from '../assets/images/location-marker-other.svg';
import GoogleMapsStyle from './GoogleMapsStyle';

const DashboardMap = withScriptjs(
  withGoogleMap(props => {
    const center = props.position
      ? { lat: props.position.lat, lng: props.position.lng }
      : {
          lat: 37.3648,
          lng: -122.0046
        };
    const marker = props.position ? (
      <Marker position={props.position} icon={marker_icon} />
    ) : null;
    const other_marker = props.otherPosition ? (
      <Marker position={props.otherPosition} icon={other_marker_icon} />
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
        {marker}
        {other_marker}
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
