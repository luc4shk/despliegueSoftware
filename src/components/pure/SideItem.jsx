import { Button, Flex, Icon, Text } from '@chakra-ui/react'
import { useNavigate,useLocation, Link} from 'react-router-dom'
import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppProvider'
export default function SideItem({icon, msg, active, index, tamanio, path}) {
    
     const [ruta, setRuta] = useState(path&&path[0])
     const navigate = useNavigate()
     const loc = useLocation()
    const { setToken, setRole, setUser, setIsInPrueba, setTiempoInicial} = useContext(AppContext)


  const isCurrentPath = () => {
  if (path && Array.isArray(path)) {
    return path.some(mainRoute => loc.pathname.startsWith(mainRoute));
  }
  return false;
};


    return (
    <>
    <Link
    to={ruta !== undefined ? ruta : ""}
    >
       <Button
        w={'100%'}
        borderRadius={"8px"}
        _hover={{
            backgroundColor: "#3F4358",
            textDecoration:"none",
        }}
        transition={"all 0.3s"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        variant={'unstyled'}
        fontWeight={"semibold"}
        fontSize={"17px"}
        onClick={()=>{
            if(index===10000){
                setToken(sessionStorage.removeItem("token"))
                sessionStorage.removeItem("token")
                setTiempoInicial(sessionStorage.removeItem("time"))
                sessionStorage.removeItem("time")
                setIsInPrueba(sessionStorage.removeItem(("isInPrueba")))
                sessionStorage.removeItem("isInPrueba")
                setUser(null)
                setRole(null)
                navigate("/")
            } 
        }} 
        background={isCurrentPath() ? '#5D5F6E' : 'transparent'}
    >
           <Flex w={"100%"} gap={"15px"} p={"10px"} color={"white"} justifyContent={tamanio ? 'flex-start' : 'center'} alignItems={"center"}>
            <Icon as={icon} fontSize={"19.5px"}   />
            {msg!="" ? <Text fontWeight={"normal"}>{msg}</Text> : msg}
        </Flex>
    
    </Button>
    </Link>
   
    </>
    )
}

