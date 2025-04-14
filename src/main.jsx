import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './layout.jsx'
import './index.css';  // Yeh ensure karo
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { store } from "./Config/redux/store/stgore.js";
import { Provider } from "react-redux";
import Profile from "./pages/profile.jsx";




const router = createBrowserRouter([
{
  path : '',
  element : <Layout />,
  children :[
    {
      path: '',
      element: <Home />
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
      path: 'profile',
      element: <Profile /> 
    },
  {
      path: 'dashboard',
      element: <Dashboard /> 
    }

    
  ]
}

]
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
        <RouterProvider router={router}>
        </RouterProvider>
          </Provider>
)
