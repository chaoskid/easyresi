import { Link } from "react-router-dom";
import { Box, Heading } from '@chakra-ui/react';

const Navbar = () => {
    return (
        <Box 
            className="navbar" 
            bg="#003366" 
            padding="0 20px" 
            height="100px"
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
        >
            <Heading 
                size="lg" 
                fontSize="3rem"
                color="#fff"
                margin="0"
                fontWeight={"normal"}
            >
                <Link to="/" style={{ textDecoration: 'none', color: '#fff', marginLeft: '15px' }}>Easy Resi</Link>
            </Heading>
        </Box>
    );
}

export default Navbar;