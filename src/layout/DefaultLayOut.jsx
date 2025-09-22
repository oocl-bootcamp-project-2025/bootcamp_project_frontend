import React from 'react';
import { Outlet } from "react-router";
import { JourneyProvider } from '../context/JourneyContext';



const DefaultLayOut = () => {

    return (
        <div>
            {/* Your layout header, nav, etc. */}
            <JourneyProvider>
                <Outlet/> {/* This renders the child route, e.g., AMapComponent for /map */}
            </JourneyProvider>
        </div>

    );
}

export default DefaultLayOut;
