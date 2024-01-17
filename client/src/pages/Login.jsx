import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import loginImg from '../assets/images/login.png';
import userIcon from '../assets/images/user.png';
import { AuthContext } from './../context/AuthContext';
import { BASE_URL } from './../utils/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {

    const [credentials, setCredentials] = useState({
        email: undefined,
        password: undefined
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const handleClick = async e => {
        e.preventDefault();

        dispatch({ type: 'LOGIN_START' })

        try {

            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message);
            } else {
                dispatch({ type: "LOGIN_SUCCESS", payload: result.data });
                navigate("/home");
            }

        } catch (err) {
            toast.error(err.message);
            dispatch({ type: "LOGIN_FAILURE", payload: err.message });
        }
    };


    return (
        <section>
            <Container>
                <Row>
                    <Col lg='8' className="m-auto">
                        <div className="login__container d-flex justify-content-between">
                            <div className="login__img">
                                <img src={loginImg} alt="" />
                            </div>

                            <div className="login__form">
                                <div className="user">
                                    <img src={userIcon} alt="" />
                                </div>

                                <h2>Acceder</h2>

                                <Form onSubmit={handleClick}>
                                    <FormGroup>
                                        <input type="email" placeholder="Email" required id="email"
                                            onChange={handleChange} />
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <input type={passwordShown ? "text" : "password"} placeholder="Contraseña" required id="password" onChange={handleChange} className="form-control" />
                                        <i onClick={togglePasswordVisibility} className="position-absolute top-50 end-0 translate-middle-y" style={{ cursor: 'pointer', marginRight: '10px' }}>{passwordShown ? <FaEye /> : <FaEyeSlash />}</i>
                                    </FormGroup>

                                    <Button className="btn secondary__btn auth__btn" type="submit">
                                        Ingresar
                                    </Button>
                                </Form>
                                <p>¿No tienes una cuenta? <Link to='/register'>Registrar</Link></p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Login;