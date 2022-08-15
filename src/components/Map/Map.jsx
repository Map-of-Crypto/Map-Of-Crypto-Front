/* eslint-disable no-undef */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";
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
  ReactDom.render(<MapApp />, document.getElementById("root"));
});

export const MapApp = () => {
  const [productsList, setProductsList] = useState([]);
  const [zoom, setZoom] = useState(3); // initial zoom
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });
  const [infoWindowID, setInfoWindowID] = useState("");

  const onIdle = (m) => {
    console.log("onIdle");
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  };

  const getProducts = useCallback(async () => {
    try {

      // checking all the users / merchants and their products

      const productsList = await fetch(
        "https://fakestoreapi.com/products"
      );


      const merchantsList = await fetch(
        "https://fakestoreapi.com/users"
      );

      // getting the relationship between products and merchants

      const merchantsByProduct = await fetch(
        "https://mapofcrypto-cdppi36oeq-uc.a.run.app/merchantByProduct"
      );

      const merchants = await merchantsList.json();
      const products = await productsList.json();
      const { merchantByProduct } = await merchantsByProduct.json();

      const productMetadataList = [];

      for (let i = 0; i < products.length; i++) {

        let productId = products[i]["id"];

        let merchantId = merchantByProduct.find(element => element.productId === productId) ? merchantByProduct.find(element => element.productId === productId)["merchantId"] : "";

        console.log("merchantId", merchantId);

        let productMetadata = {
          productId: productId,
          productAddress: merchantByProduct.find(element => element.productId === productId) ? merchantByProduct.find(element => element.productId === productId)["address"] : "",
          lattitude: merchants.find(element => element.id === merchantId) ? parseFloat(merchants.find(element => element.id === merchantId)["address"]["geolocation"]["lat"]) : "",
          longitude: merchants.find(element => element.id === merchantId) ? parseFloat(merchants.find(element => element.id === merchantId)["address"]["geolocation"]["long"]) : "",
          name: products[i]["category"],
          description: products[i]["title"],
          price: products[i]["price"]
        }
        if (productMetadata["productAddress"]) {
          productMetadataList.push(productMetadata);
        }

      }

      console.log("productMetadataList#", productMetadataList)

      setProductsList([...productMetadataList]);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        render={render}
      >
        <Map
          center={center}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {productsList.map((product, i) => (
            <Marker
              key={i}
              position={{


                lat: product.lattitude,
                lng: product.longitude,
              }}
              onClick={() => {
                setInfoWindowID(i + 1);
              }}
            >
              {infoWindowID === i + 1 && (
                <InfoWindow>
                  <>
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <p>
                      Price: {product.price} {product.currency}
                    </p>
                  </>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </Map>
      </Wrapper>
    </div>
  );
};
