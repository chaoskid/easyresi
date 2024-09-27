import { Link } from "react-router-dom";
import { Box, Flex, Heading, Text, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

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
            <Flex className="links" gap="20px" align="center">
                <Link to="/about" style={{ textDecoration: 'none' }}>
                    <Text 
                        padding="15px 20px" 
                        borderRadius="10px" 
                        color="#fff"
                        transition="background-color 0.3s"
                        _hover={{ bg: "#008080", borderRadius: "10px" }}
                    >
                        About
                    </Text>
                </Link>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Text 
                        padding="15px 20px" 
                        borderRadius="10px" 
                        color="#fff"
                        transition="background-color 0.3s"
                        _hover={{ bg: "#008080", borderRadius: "10px" }}
                    >
                        Dashboard
                    </Text>
                </Link>
                <Link to="/statistics" style={{ textDecoration: 'none' }}>
                    <Text 
                        padding="15px 20px" 
                        borderRadius="10px" 
                        color="#fff"
                        transition="background-color 0.3s"
                        _hover={{ bg: "#008080", borderRadius: "10px" }}
                    >
                        Statistics
                    </Text>
                </Link>
                <Link to="/questionnaire" style={{ textDecoration: 'none' }}>
                    <Text 
                        padding="15px 20px" 
                        borderRadius="10px" 
                        color="#fff"
                        transition="background-color 0.3s"
                        _hover={{ bg: "#008080", borderRadius: "10px" }}
                    >
                        Questionnaire
                    </Text>
                </Link>

                <Menu>
                    <MenuButton 
                        padding="15px 20px" 
                        borderRadius="10px" 
                        color="#fff" 
                        _hover={{ bg: "#008080" }}
                    >
                        Profile
                    </MenuButton>
                    <MenuList bg="#003366" borderColor="#003366" marginTop="20px">
                        <MenuItem>
                            <Link to="/account" style={{ color: '#333333', textDecoration: 'none' }}>Account</Link>
                        </MenuItem>
                        <MenuItem>
                            <Link to="/settings" style={{ color: '#333333', textDecoration: 'none' }}>Settings</Link>
                        </MenuItem>

                        {/* To Do: "Are you sure you want to log out?" button and session/local storage clean */}
                        <MenuItem>
                            <Link to="/login" style={{ color: '#333333', textDecoration: 'none' }}>Log Out</Link>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Box>
    );
}

export default Navbar;