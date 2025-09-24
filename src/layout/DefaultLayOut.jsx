import { Outlet } from "react-router";
import ModalManager from '../components/common/ModalManager';
import { AppProvider } from '../context/AppProvider';

const DefaultLayOut = () => {
    return (
        <div>
            {/* Your layout header, nav, etc. */}
            <AppProvider>
                <Outlet /> {/* This renders the child route, e.g., AMapComponent for /map */}
                <ModalManager />
            </AppProvider>
        </div>
    );
}

export default DefaultLayOut;
