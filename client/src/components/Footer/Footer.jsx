import React from "react";
import './footer.css';

import { Container } from 'reactstrap';

const Footer = () => {

    const year = new Date().getFullYear()

    return (
        <footer className="footer">
            <Container>
                <p className="copyright">
                    Copyright © {year}, diseñado y desarrollado por K3V1N. Todos los derechos reservados.</p>
            </Container>
        </footer>
    );
};

export default Footer;