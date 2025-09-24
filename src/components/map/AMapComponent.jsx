import MapContainer from './MapContainer';

const AMapComponent = ({ selectedTab, itinerary, searchData, routeData }) => {

    return <MapContainer selectedTab={selectedTab} itinerary={itinerary} searchData={searchData} routeData={routeData} />;
};

export default AMapComponent;
