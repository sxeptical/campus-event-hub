import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { isLoggedin } from "../utils";

const ProtectedRoute = () => {
    const navigate = useNavigate();

    useEffect(() => {

        if (!isLoggedin()) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    return <Outlet /> // renders the child route

}

export default ProtectedRoute;