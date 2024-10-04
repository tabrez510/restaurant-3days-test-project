import Login from "./auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import HeroSection from "./components/HeroSection";
import MainLayout from "./layout/MainLayout";
import AddCategory from "./components/AddCategory";
import AddRecipe from "./components/AddRecipe";
import { useUserStore } from "./store/useUserStore";
import { Navigate } from "react-router-dom";
import Orders from "./components/Orders";
// import { useEffect } from "react";
// import Loading from "./components/Loading";
// import { useThemeStore } from "./store/useThemeStore";

// const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, user } = useUserStore();
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!user?.isVerified) {
//     return <Navigate to="/verify-email" replace />;
//   }
//   return children;
// };

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if(isAuthenticated && user?.isVerified){
    return <Navigate to="/" replace/>
  }
  return children;
};

// const AdminRoute = ({children}:{children:React.ReactNode}) => {
//   const {user, isAuthenticated} = useUserStore();
//   if(!isAuthenticated){
//     return <Navigate to="/login" replace/>
//   }
//   if(!user?.admin){
//     return <Navigate to="/" replace/>
//   }

//   return children;
// }

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      // <ProtectedRoutes>
        <MainLayout />
      // </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <HeroSection />,
      },
    //   {
    //     path: "/profile",
    //     element: <Profile />,
    //   },
    //   {
    //     path: "/search/:text",
    //     element: <SearchPage />,
    //   },
    //   {
    //     path: "/restaurant/:id",
    //     element: <RestaurantDetail />,
    //   },
    //   {
    //     path: "/order/status",
    //     element: <Success />,
    //   },
    //   // admin services start from here
      {
        path: "/admin/category",
        // element:<AdminRoute><Restaurant /></AdminRoute>,
        element:<AddCategory />,
      },
      {
        path: "/admin/recipe",
        // element:<AdminRoute><AddMenu /></AdminRoute>,
        element:<AddRecipe />,
      },
      {
        path: "/admin/orders",
        // element:<AdminRoute><Orders /></AdminRoute>,
        element:<Orders />,
      },
    ],
  },
  {
    path: "/login",
    element:<AuthenticatedUser><Login /></AuthenticatedUser>,
  },
  {
    path: "/forgot-password",
    element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser>,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
]);

function App() {
  // const initializeTheme = useThemeStore((state:any) => state.initializeTheme);
  // const {checkAuthentication, isCheckingAuth} = useUserStore();
  // // checking auth every time when page is loaded
  // useEffect(()=>{
  //   checkAuthentication();
  //   initializeTheme();
  // },[checkAuthentication])

  // if(isCheckingAuth) return <Loading/>
  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;
