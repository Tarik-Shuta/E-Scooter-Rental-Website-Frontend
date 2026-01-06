import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface AdminRouteProps {
    children: ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default AdminRoute;
