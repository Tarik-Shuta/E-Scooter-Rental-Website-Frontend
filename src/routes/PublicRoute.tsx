import { Navigate } from "react-router-dom";
import type {JSX} from "react";

type PublicRouteProps = {
    children: JSX.Element;
};

function PublicRoute({ children }: PublicRouteProps) {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute;
