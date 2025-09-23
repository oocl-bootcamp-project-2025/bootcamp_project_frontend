import { Outlet } from "react-router";
import React from 'react';
import { JourneyProvider } from '../context/JourneyContext';
import { AppProvider } from '../context/AppProvider';
import ModalManager from '../components/common/ModalManager';

const DefaultLayOut = () => {
    return (
        <div>
            {/* Your layout header, nav, etc. */}
            <AppProvider>
                <JourneyProvider>
                    <Outlet/> {/* This renders the child route, e.g., AMapComponent for /map */}
                    <ModalManager />
                </JourneyProvider>
            </AppProvider>
            <Outlet/> {/* This renders the child route, e.g., AMapComponent for /map */}
        </div>
    );
}

export default DefaultLayOut;
