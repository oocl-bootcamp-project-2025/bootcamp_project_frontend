// router/index.js
import { createBrowserRouter } from "react-router-dom";
import AuthWrappedLayout from "../layout/AuthWrappedLayout";

// 直接导入组件（临时禁用懒加载以解决加载问题）
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import TokenTestPage from '../components/debug/TokenTestPage';
import AMapComponent from '../components/map/AMapComponent';
import MapContainer from '../components/map/MapContainer';
import ExpertProfilePage from '../components/pages/ExpertProfilePage';
import Homepage from '../components/pages/Homepage';
import ItineraryResults from '../components/pages/ItineraryResults';
import PostDetailPage from '../components/pages/PostDetailPage';
import UserProfilePage from '../components/pages/user/UserProfilePage';
import ItineraryWrapper from '../components/wrappers/ItineraryWrapper';
import TestItineraryResults from '../TestItineraryResults';

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
