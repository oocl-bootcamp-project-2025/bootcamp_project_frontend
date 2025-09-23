import { Outlet } from "react-router";

const DefaultLayOut = () => {
    return (
        <div>
            {/* Your layout header, nav, etc. */}
            <Outlet/> {/* This renders the child route, e.g., AMapComponent for /map */}
        </div>
    );
}

export default DefaultLayOut;
