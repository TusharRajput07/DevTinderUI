import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feed from "./Feed";
import Login from "./Login";
import Profile from "./Profile";
import Error from "./Error";
import Home from "./Home";
import Matches from "./Matches";
import Requests from "./Requests";
import Recommend from "./Recommend";
import Chat from "./Chat";
import Layout from "./Layout";
import SessionExpired from "./SessionExpired";
import RequestProfile from "./RequestProfile";
import About from "./About";
import Contact from "./Contact";
import PrivacyPolicy from "./PrivacyPolicy";
import Terms from "./Terms";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "sessionExpired",
      element: <SessionExpired />,
    },
    {
      path: "about",
      element: <About />,
    },
    {
      path: "contact",
      element: <Contact />,
    },
    {
      path: "privacy",
      element: <PrivacyPolicy />,
    },
    {
      path: "terms",
      element: <Terms />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "Feed", element: <Feed /> },
        { path: "profile", element: <Profile /> },
        { path: "matches", element: <Matches /> },
        { path: "requests", element: <Requests /> },
        { path: "requests/:requestId", element: <RequestProfile /> },
        { path: "chat", element: <Chat /> },
        { path: "chat/:userId", element: <Chat /> },
        { path: "recommend", element: <Recommend /> },
        { path: "*", element: <Error /> },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
