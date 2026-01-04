import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from 'react';
import { getUser } from "../utils";

const OrganizerRoute = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = getUser();
        const isOrganizer = user && user.role === 'Organiser';
        if (!isOrganizer) {
            navigate("/dashboard", { replace: true })
        }
    }, []);
    return (<Outlet />);
}

export default OrganizerRoute;