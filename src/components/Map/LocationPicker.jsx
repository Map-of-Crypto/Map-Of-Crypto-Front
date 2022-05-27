/* eslint-disable no-undef */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";

const render = (status) => {
  return <h1>{status}</h1>;
};

const Map = ({ onClick, onIdle, children, style, ...options }) => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
  return deepEqual(a, b);
});

function useDeepCompareMemoize(value) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(callback, dependencies) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

window.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(<LocationPicker />, document.getElementById("root"));
});

const Marker = (options) => {
  const [marker, setMarker] = React.useState();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);
  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);
  return null;
};

export const LocationPicker = ({ setPosition }) => {
  const [location, setLocation] = useState(null);
  const [zoom, setZoom] = useState(3); // initial zoom
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });

  const onClick = (e) => {
    setLocation(e.latLng);
    setPosition(JSON.parse(JSON.stringify(e.latLng.toJSON(), null, 2)));
  };

  const onIdle = (m) => {
    console.log("onIdle");
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        render={render}
      >
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {location && <Marker position={location} />}
        </Map>
      </Wrapper>
    </div>
  );
};
