import { Navigate } from "react-router-dom";
import type { JSX } from "react";

type PrivateRouteProps = {
    children: JSX.Element;
};

function PrivateRoute({ children }: PrivateRouteProps) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;