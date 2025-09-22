import { Suspense } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RouterProvider } from "react-router-dom";
import { router } from './router/index.jsx';
import LoadingSpinner from './components/common/LoadingSpinner';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
        <div className="min-h-screen max-w-md mx-auto bg-white relative shadow-xl">
          <Suspense fallback={<LoadingSpinner />}>
            <RouterProvider router={router} />
          </Suspense>
        </div>
      </div>
    </DndProvider>
  );
}