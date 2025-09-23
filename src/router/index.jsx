// router/index.js
import { lazy } from 'react';
import { createBrowserRouter } from "react-router-dom";
import DefaultLayOut from "../layout/DefaultLayOut";

// Lazy load components for better performance
const Homepage = lazy(() => import('../components/pages/Homepage'));
const AMapComponent = lazy(() => import('../components/map/AMapComponent'));
const MapContainer = lazy(() => import('../components/map/MapContainer'));
const ItineraryWrapper = lazy(() => import('../components/wrappers/ItineraryWrapper'));
const ExpertProfilePage = lazy(() => import('../components/pages/ExpertProfilePage'));
const PostDetailPage = lazy(() => import('../components/pages/PostDetailPage'));
const ItineraryResults = lazy(() => import('../components/pages/ItineraryResults'));
const TestItineraryResults = lazy(() => import('../TestItineraryResults'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayOut />,
    children: [
      {
        index: true, // 默认路由 -> 首页
        element: <Homepage />
      },
      {
        path: 'home',
        element: <Homepage />
      },
      {
        path: 'map',
        element: <AMapComponent />
      },
      {
        path: 'journey',
        element: <MapContainer />
      },
      {
        path: 'itinerary',
        element: <ItineraryWrapper />
      },
      {
        path: 'results',
        element: <ItineraryResults />
      },
      {
        path: 'test-results',
        element: <TestItineraryResults />
      },
      {
        path: 'expert/:id',
        element: <ExpertProfilePage />
      },
      {
        path: 'expert',
        element: <ExpertProfilePage />
      },
      {
        path: 'post/:id',
        element: <PostDetailPage />
      },
      {
        path: 'post',
        element: <PostDetailPage />
      }
    ]
  }
]);
