import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";

  
  interface MarkerData {
    position: [number, number];
    text: string;
  }

  const PhilippineMap = () => {
  
    const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  
// Define a custom marker icon
const customMarkerIcon = new L.Icon({
    iconUrl: "/marker.png", // Replace with your custom marker image path
    iconSize: [32, 32], // Size of the marker icon
    iconAnchor: [16, 32], // Anchor the icon to the bottom center
    popupAnchor: [0, -32], // Position the popup above the marker
  });
  
    // Center position for the map
    const mapCenter: [number, number] = [7.188559177058451, 125.49113793170541]; // Example: London
  
    // Dynamic marker data
    const markers: MarkerData[] = useMemo(
      () => [
        { position: [8.167892386524807, 123.28865103497571], text: "Improvement/Concreting of Junction Tamurayan to Macasing FMR, Dumingag, Zamboanga del Sur" },
        { position: [8.338201136267228, 126.04721180813691], text: "Improvement/Concreting of NRJ Purok Ocite to Bahi FMR Municipality of Rosario, Agusan del Sur" },
        { position: [6.3953716062573855, 124.34789294525619], text: "IMPROVEMENT/CONCRETING OF BARANGAY NATI AND TINALON: NATIONAL HIGHWAY JUNCTION - SITIO TAGBAKTAGBAK -SITIO BALITE – SITIO MULAWIN FMR" },
        { position: [7.0885177538278255, 125.24333152717006], text: "Improvement/Concreting of Brgy. Manovisa: So. Mabato - So. Timodas Farm-to-Market Road, Municipality of Magpet, Cotabato" },
        { position: [7.137855565904243, 125.18160931635563], text: "Rubber Cup Lump Productions, Consolidation and Marketing Imamaling, Magpet, Cotabato" },
        { position: [6.504863763590235, 124.28967886058803], text: "Green Coffee Beans Production, Consolidation and Marketing Kulaman" },
      ],
      []
    );
  
  
    return (
   
        isMounted && (
            <div className="w-full h-96">
            <MapContainer
              center={mapCenter}
              zoom={7}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
    
              {markers.map((marker, index) => (
                <Marker key={index} position={marker.position} icon={customMarkerIcon}>
                  <Popup>{marker.text}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )
     
    );
  };
  
  export default PhilippineMap;