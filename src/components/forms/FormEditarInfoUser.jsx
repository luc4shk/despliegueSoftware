import { React, useEffect, useState, useContext } from "react";
import {
  Input,
  Box,
  Button,
  FormControl,
  Skeleton,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosApi from "../../utils/config/axios.config";
import { AppContext } from "../context/AppProvider";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function EditarInformacionAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  useEffect(() => {
    getUser();
  }, []);

  const getUsuario = async () => {
    let response = await axiosApi.get("/api/user/profile", {
      headers: { Authorization: "Bearer " + token },
    });

    return response.data;
  };


  

  const getUser = async () => {
    const data = await getUsuario();

    setData({
      nombre: data.nombre,
      apellido: data.apellido,
    });

    setIsLoading(false);
  };

  const actualizarDatos = async (nombre, apellido, estado = true) => {
    let response = await axiosApi
      .put(
        `/api/user/student/update`,
        {
          nombre: nombre,
          apellido: apellido,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .catch((e) => {
        toast.error("¡Error al actualizar los datos!");
      });

    if (response.status === 200) {
      toast.success("¡Datos Actualizados!");
      navigate("/user");
    }
  };



  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required("Campo requerido")
      .max(50, "Maximo 50 dígitos")
      .min(2, "Mínimo 2 digitos"),
    apellido: Yup.string()
      .required("Campo requerido")
      .max(55, "Maximo 55 dígitos")
      .min(2, "Mínimo 2 digitos"),
  });

  if(isLoading){
    return (
      <Box
                p={"20px"}
                borderRadius={"8px"}
                bgColor={"white"}
                minW={["200px", "350px", "400px", "500px"]}
                maxHeight={"auto"}
                overflow={"hidden"}
              >

                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  w={"100%"}
                  h={"100%"}
                  gap={"20px"}
                  action=""
                >
              <Skeleton w={"100%"} h={"70px"} borderRadius={"10px"} isLoaded={!isLoading}/>
              <Skeleton w={"100%"} h={"70px"} borderRadius={"10px"} isLoaded={!isLoading}/>
              <Skeleton w={"100%"} h={"40px"} borderRadius={"10px"} isLoaded={!isLoading}/>
                </Box>
       </Box> 
    )
  }

  return (
    <>
      <Formik
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={({ nombre, apellido }) => {
          actualizarDatos(nombre, apellido);
        }}
      >
        {(values) => {
          const { errors, isSubmitting, touched } = values;
          return (
            <Form>
              <Box
                p={"20px"}
                borderRadius={"8px"}
                bgColor={"white"}
                minW={["200px", "350px", "400px", "500px"]}
                maxHeight={"auto"}
                overflow={"hidden"}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  w={"100%"}
                  h={"100%"}
                  gap={"20px"}
                  action=""
                >
                  <FormControl
                    display={"flex"}
                    flexDirection={"column"}
                    isInvalid={errors.nombre && touched.nombre}
                  >
                    <label htmlFor="nombre">Nombre</label>
                    <Field
                      as={Input}
                      mt={"10px"}
                      id="nombre"
                      name="nombre"
                      type="text"
                      w={"100%"}
                    />
                    <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    display={"flex"}
                    flexDirection={"column"}
                    isInvalid={errors.apellido && touched.apellido}
                  >
                    <label htmlFor="apellido">Apellido</label>
                    <Field
                      as={Input}
                      mt={"10px"}
                      id="apellido"
                      name="apellido"
                      type="text"
                      w={"100%"}
                    />
                    <FormErrorMessage>{errors.apellido}</FormErrorMessage>
                  </FormControl>

                  <Button
                    w={"100%"}
                    type="submit"
                  >
                    Enviar
                  </Button>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
