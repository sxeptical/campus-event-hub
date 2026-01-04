import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from 'react';
import { getUser } from "../util";

const OrganizerRoute = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = getUser();
        const isAdmin = user && user.role === 'admin';
        if (!isAdmin) {
            navigate("/permission-error")
        }
    }, []);
    return (<Outlet />);
}

export default OrganizerRoute;