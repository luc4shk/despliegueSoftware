import {React, useRef, useContext, useEffect, useState} from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axiosApi from "../../utils/config/axios.config";
import { AppContext } from "../context/AppProvider";
import { Box, FormControl, Input, Image, Button, Flex, FormErrorMessage, Skeleton } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
export default function Formularioavatar() {
 // const {token,imagen, setImagen} = useContext(AppContext)
  const {token,imagen, setImagen} = useContext(AppContext)
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const inputRef = useRef()
  const initialValues = {
    avatar: null,
  };


  useEffect(()=>{
      getAdmin()
  },[])

 
  const getAdmin = async () =>{
    const data = await getAdministrator()
    setData({
      imagen:data.foto_perfil && data.foto_perfil.url
    })
    setIsLoading(false)

  }

  const getAdministrator = async () =>{
      
    let response = await axiosApi.get("/api/user/profile",{
      headers:{ Authorization:"Bearer " + token }
    })

    return response.data
  }


const actualizaravatar = async (file) =>{
   const formData = new FormData();
    formData.append("avatar", file);

  let response = await axiosApi.put(`/api/user/admin/updatePhoto`,formData,
  {
    headers: {
            "Content-Type": "multipart/form-data",
            Authorization:"Bearer " + token
        },
  })

  if(response.status === 200){
    getAdmin()
  }
}


 
const validationSchema = Yup.object().shape({
  avatar: Yup.mixed()
    .test("file-type", "El tipo de archivo es PNG/JPEG/JPG", (value) => {
      if (value) {
        return  value.endsWith(".png") || value.endsWith(".jpeg") || value.endsWith(".jpg")
      }
      return true;
    }).required("El avatar es requerido"),
});


  const handleFileChange = (event, setFieldValue) => {
    setFieldValue("avatar", inputRef.current.files[0]);

    };

  return (
    <Box
      w={["250px", "350px", "400px", "400px", "500px"]}
      bgColor="white"
      borderRadius="8px"
      height="auto"
      padding="20px"
      boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px"}
    >
      <Flex w="100%" alignItems="center" justifyContent="center" mb="15px">
        <Skeleton borderRadius={"50%"} isLoaded={!isLoading}>
        <Image
          src={data && data.imagen ? data.imagen : "https://res.cloudinary.com/dojljgscf/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1700790025/ufps_pro/perfil_vyserv.jpg?_s=public-apps"}
          key={data && data.imagen}
          width={["100px", "130px"]}
          height={["100px", "130px"]}
          borderRadius="50%"
          objectFit="cover"
          objectPosition="center"
          cache-control="no-cache"
          alt="Imagen de perfil"
        />
        </Skeleton>
      </Flex>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values) =>
        {
        toast.promise(actualizaravatar(inputRef.current.files[0]), {
        loading: 'Actualizando Imagen...',
        success: 'Imagen actualizada correctamente',
        error: 'La imagen no ha sido actualizada correctamente',
        });


      }}>
        {(props) => {
          const { errors, touched, setFieldValue } = props;

          return (
            <Form >
              <Flex flexDir={"column"} gap={"15px"}>
              <FormControl isInvalid={errors.avatar && touched.avatar} display="flex" justifyContent="center" flexDir={"column"}>
              <Skeleton borderRadius={"10px"} isLoaded={!isLoading}>
                <Field id="avatar" name="avatar" >
                  {({ field }) => (
                    <Input type="file" name="avatar" ref={inputRef}
                     variant="unstyled" onChange={(event) =>{ 
                      handleFileChange(event, setFieldValue)
                     }
                    } {...field} />
                  )}
                </Field>
              </Skeleton>
                <FormErrorMessage>{errors.avatar}</FormErrorMessage>
              </FormControl>
                <Skeleton borderRadius={"10px"} isLoaded={!isLoading}>
              <Button type="submit" w="100%">
                Actualizar
              </Button>

                </Skeleton>
              </Flex>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
