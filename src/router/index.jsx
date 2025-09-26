// router/index.js
import { lazy } from 'react';
import { createBrowserRouter } from "react-router-dom";
import AuthWrappedLayout from "../layout/AuthWrappedLayout";

// Lazy load components for better performance
const Homepage = lazy(() => import('../components/pages/Homepage'));
const AMapComponent = lazy(() => import('../components/map/AMapComponent'));
const MapContainer = lazy(() => import('../components/map/MapContainer'));
const ItineraryWrapper = lazy(() => import('../components/wrappers/ItineraryWrapper'));
const ExpertProfilePage = lazy(() => import('../components/pages/ExpertProfilePage'));
const PostDetailPage = lazy(() => import('../components/pages/PostDetailPage'));
const ItineraryResults = lazy(() => import('../components/pages/ItineraryResults'));
const TestItineraryResults = lazy(() => import('../TestItineraryResults'));
const Login = lazy(() => import('../components/auth/Login'));
const Register = lazy(() => import('../components/auth/Register'));
const TokenTestPage = lazy(() => import('../components/debug/TokenTestPage'));
const UserProfilePage = lazy(() => import('../components/pages/user/UserProfilePage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthWrappedLayout />,
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
        path: 'itinerary/:id',
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
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'token-test',
        element: <TokenTestPage />
      },
      {
        path: 'user/profile',
        element: <UserProfilePage />
      }
    ]
  }
]);
