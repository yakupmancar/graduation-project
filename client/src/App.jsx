import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Donemler from "./pages/Donemler";
import Dersler from "./pages/Dersler";
import Derslikler from "./pages/Derslikler";
import Subeler from "./pages/Subeler";
import DersTakvimi1 from "./pages/DersTakvimi1.jsx";
import DersTakvimi2 from "./pages/DersTakvimi2.jsx";
import SinavTakvimi from "./pages/SinavTakvimi";
import OgretimUyeleri from "./pages/OgretimUyeleri";
import GozetmenUyeler from "./pages/GozetmenUyeler";
import Profil from "./pages/Profil.jsx";
import Roller from "./pages/Roller.jsx";

const Layout = () => {
  return (
    <div>
      <section> <Navbar /> </section>
      <section className="flex gap-x-14">
        <Sidebar />
        <Outlet />
      </section>
      {/* <section> <Footer /> </section> */}
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/donemler",
        element: <Donemler />
      },
      {
        path: "/dersler",
        element: <Dersler />
      },
      {
        path: "/derslikler",
        element: <Derslikler />
      },
      {
        path: "/subeler",
        element: <Subeler />
      },
      {
        path: "/dersTakvimi1",
        element: <DersTakvimi1 />
      },
      {
        path: "/dersTakvimi2",
        element: <DersTakvimi2 />
      },
      {
        path: "/sinavTakvimi",
        element: <SinavTakvimi />
      },
      {
        path: "/ogretimUyeleri",
        element: <OgretimUyeleri />
      },
      {
        path: "/gozetmenUyeler",
        element: <GozetmenUyeler />
      },
      {
        path: "/profil/:id",
        element: <Profil />
      },
      {
        path: "/roller",
        element: <Roller />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
function App() {

  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  )
}

export default App
