import React, { useRef, useEffect, useContext } from "react";
import { Container, Row, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { AuthContext } from "./../../context/AuthContext";

const Header = () => {
    const headerRef = useRef(null);
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);

    const logout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/home");
    };

    const stickyHeaderFunc = () => {
        window.addEventListener("scroll", () => {
            if (
                document.body.scrollTop > 80 ||
                document.documentElement.scrollTop > 80
            ) {
                headerRef.current.classList.add("sticky__header");
            } else {
                headerRef.current.classList.remove("sticky__header");
            }
        });
    };

    useEffect(() => {
        stickyHeaderFunc();
        return () => window.removeEventListener("scroll", stickyHeaderFunc);
    }, []);

    return (
        <header className="header" ref={headerRef}>
            <Container>
                <Row className="justify-content-between align-items-center">
                    <h1 className="header-title">Tareas</h1>
                    <div className="nav__right d-flex align-items-center gap-4">
                        <div className="nav__btn d-flex align-items-center gap-4">
                            {user ? (
                                <>
                                    <h5 className="mb-0">{user.username}</h5>
                                    <Button className="btn btn-dark" onClick={logout}>
                                        Cerrar Sesión
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className="btn btn-dark">
                                        <Link to="/login">Acceder</Link>
                                    </Button>
                                    <Button className="btn btn-dark">
                                        <Link to="/register">Registrar</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Row>
            </Container>
        </header>
    );
};

export default Header;
