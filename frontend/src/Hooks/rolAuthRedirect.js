import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RolContext } from "../context/rolContext";

// ✅ Esta es una función que sí puede usar hooks
const useRolAuthRedirect = () => {
    const navigate = useNavigate();
    const { rol } = useContext(RolContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            if (rol === "user") {
                navigate("/");
            }
        } else {
            navigate("/login");
        }
    }, [navigate, rol]);
};

export default useRolAuthRedirect;
