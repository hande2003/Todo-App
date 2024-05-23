// src/App.js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import Root from "./routes/root";
import ErrorElement from "../src/error";
import Register, { action as registerAction } from "./routes/register";
import Login, { action as loginAction } from "./routes/login";
import Todo, { loader as todoLoader } from "./routes/todo";
import { Suspense } from "react";
import { redirect } from "../../node_modules/react-router-dom/dist/index";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorElement />,
        children: [
            {
                errorElement: <ErrorElement />,
                children: [
                    {
                        index: true,
                        element: <Login />,
                        action: loginAction,
                        fallback: <p>Loading...</p>
                    },
                    {
                        path: '/todo',
                        element: <Todo />,
                        loader: todoLoader
                    },
                    {
                        path: '/register',
                        element: <Register />,
                        action: registerAction
                    }
                ]
            }
        ]
    },
    {
        path: "/logout",
        action: async () => {
            try {
                let res = await axios.post('/auth/logout', {});
                //console.log(res);

                if (res.status === 200) {
                    window.history.replaceState(null, null, '/');
                    return redirect("/"); // Redirect to login page
                }
            } catch (error) {
                console.error("Logout failed", error);
                window.history.replaceState(null, null, '/'); // Clear history state even if the logout request fails
                return redirect("/"); // Redirect to login page
            }
        }
    }
]);

let App = () => {
    return (
        <Suspense fallback={<div className="text-center">Loading... </div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}

export default App;
