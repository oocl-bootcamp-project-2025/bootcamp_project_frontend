import React from 'react';
import { Outlet } from "react-router";
import { AppProvider } from '../context/AppProvider';
import ModalManager from '../components/common/ModalManager';

const DefaultLayOut = () => {
    return (
        <div>
            {/* Your layout header, nav, etc. */}
            <AppProvider>
                <Outlet/> {/* This renders the child route, e.g., AMapComponent for /map */}
                <ModalManager />
            </AppProvider>
        </div>
    );
}

export default DefaultLayOut;
