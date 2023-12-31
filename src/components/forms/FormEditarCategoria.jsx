import { Box,Skeleton, Select,Flex, Center, Textarea, Input } from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import { React, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { toast} from "react-hot-toast";
import axiosApi from "../../utils/config/axios.config";
import { useParams, useNavigate} from "react-router-dom";
import { AppContext } from "../context/AppProvider";
import Btn from "../pure/Btn";

export default function FormularioEditarCategoria() {
  const {id} = useParams()
  const { token } = useContext(AppContext);
  const navigate = useNavigate()
  const [datos, setDatos] = useState({});
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [competencias, setCompetencias] = useState();
  const [compeSeleccionada, setCompeSeleccionada] = useState();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es requerido").matches("^(?! )[a-zA-ZÀ-ÖØ-öø-ÿ]+( [a-zA-ZÀ-ÖØ-öø-ÿ]+)*(?<! )$","El nombre solamente debe contener letras").min(2,"Mínimo 2 caracteres").max(70,"Maximo 70 caracteres"),
    competencia: Yup.string().required("La competencia es requerida, verifique si la perteneciente a esta categoria esta desactivada"),
    estado: Yup.string().required("El estado es requerido"),
    descripcion: Yup.string().required("La descripción es requerida").matches("^(?! )[a-zA-ZÀ-ÖØ-öø-ÿ.,\r\n0-9]+( [a-zA-ZÀ-ÖØ-öø-ÿ,.\r\n0-9]+)*(?<! )$","La descripción solamente debe contener letras").min(5,"Mínimo 5 caracteres").max(240,"Máximo 240 caracteres"),
  });

  const obtenerCompetencias = async () => {
    let response = await axiosApi
      .get("/api/competencia", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .catch((e) => {
        toast.error("Fallo al traer los las competencias");
      });
    setCompetencias(response.data);
    setLoading(false);
  };

  const actualizarCategoria = async (
    nombre,
    descripcion,
    competencia,
    estado,
    id
  ) => {
    let body = {
      nombre: nombre,
      descripcion: descripcion,
      estado: estado,
      competencia_id: competencia,
    };

    let response = await axiosApi
      .put(`/api/categoria/update/${id}`, body, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .catch((e) => {
        toast.error(e.response.data.error);
      })

    if (response.status === 200) {
      toast.success("¡Categoría actualizada correctamente!");
      navigate("/categorias")

    }

  };



  const getCategoriaById = async (id) => {
    let response = await axiosApi
      .get(`/api/categoria/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .catch((e) => {
        toast.error(e.response.data.error);
      });

    const categoria = response.data;
    const competenciaEncontrada = competencias.find(
      (comp) => comp.nombre === categoria.Competencia.nombre
    );

    setDatos({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      estado: categoria.estado.toString(),
      competencia: competenciaEncontrada ? competenciaEncontrada.id : null,
    });

    setLoading2(false);
  };

  useEffect(() => {
    obtenerCompetencias();
  }, []);

  useEffect(() => {
    if (competencias && competencias.length > 0) {
      getCategoriaById(id);
    }
  }, [competencias]);



  if (loading || loading2) {
    return(
      <Box
        boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;"}
      >
        <Center h="100%">
          <Box
            p="20px"
            w={["220px", "320px", "370px", "420px"]}
            borderRadius="8px"
            bgColor="white"
            overflow="hidden" >
            <Flex flexDir={"column"} gap={"10px"}>
            <Skeleton w={"100%"} borderRadius={"10px"} h={"82px"} isLoaded={!loading&&!loading2}></Skeleton>
            <Skeleton w={"100%"} borderRadius={"10px"} h={"82px"} isLoaded={!loading&&!loading2}></Skeleton>
            <Skeleton w={"100%"} borderRadius={"10px"} h={"82px"} isLoaded={!loading&&!loading2}></Skeleton>
            <Skeleton w={"100%"} borderRadius={"10px"} h={"132px"} isLoaded={!loading&&!loading2}></Skeleton>
            <Skeleton w={"100%"} borderRadius={"10px"} h={"30px"} isLoaded={!loading&&!loading2}></Skeleton>
            </Flex>
          </Box>
        </Center>
      </Box>
    );
  }

  return (
    <Box
      boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;"}
    >
      <Center h="100%">
        <Box
          p="20px"
          borderRadius="8px"
          bgColor="white"
          overflow="hidden"
        >
          <Formik
            initialValues={datos}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={({ nombre, descripcion, estado, competencia }) => {
              const estadoValue = estado === "true";
              let desc = descripcion.replace(/\n+/g,"\n")
              const competenciaInt = parseInt(competencia)
              actualizarCategoria(
                nombre,
                desc,
                competenciaInt,
                estadoValue,
                id
              );
            }}
          >
            {(props) => {
              const { errors, touched, setFieldValue } = props;
              return (
                <Form>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                    >
                      <FormControl
                        id="nombre"
                        isInvalid={errors.nombre && touched.nombre}
                      >
                        <FormLabel htmlFor="nombre">Nombre</FormLabel>
                        <Field
                          as={Input}
                          mt="10px"
                          name="nombre"
                          type="text"
                          maxW={["200px", "300px", "350px", "400px"]}
                          w="400px"
                        />
                        <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Box
                      mt="10px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      w={["200px", "300px", "350px", "400px"]}
                    >
                      <FormControl
                        id="competencia"
                        isInvalid={errors.competencia && touched.competencia}
                      >
                        <FormLabel htmlFor="competencia">Competencia</FormLabel>
                        <Field
                          as={Select}
                          id="competencia"
                          name="competencia"
                          maxW={["200px", "300px", "350px", "400px"]}
                          w="100%"
                          border="2px solid gray"
                          mt="10px"
                          onChange={(e) => {
                            setFieldValue("competencia", e.target.value);
                            setCompeSeleccionada(e.target.value);
                          }}
                        >
                          {competencias &&
                              competencias.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.nombre}
                                </option>
                              ))}
                        </Field>
                        <FormErrorMessage>
                          {errors.competencia}
                        </FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Box
                      mt="10px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      w={["200px", "300px", "350px", "400px"]}
                    >
                      <FormControl
                        id="estado"
                        isInvalid={errors.estado && touched.estado}
                      >
                        <FormLabel htmlFor="estado">Estado</FormLabel>
                        <Field
                          as={Select}
                          name="estado"
                          maxW={["200px", "300px", "350px", "400px"]}
                          w="100%"
                          border="2px solid gray"
                          mt="10px"
                        >
                          <option value="true">Activo</option>
                          <option value="false">Inactivo</option>
                        </Field>
                        <FormErrorMessage>{errors.estado}</FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Box
                      mt="10px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                    >
                      <FormControl
                        id="descripcion"
                        isInvalid={errors.descripcion && touched.descripcion}
                      >
                        <FormLabel htmlFor="descripcion">Descripción</FormLabel>
                        <Field
                          as={Textarea}
                          name="descripcion"
                          resize="vertical"
                          h="100px"
                          maxW={["200px", "300px", "350px", "400px"]}
                          w="400px"
                        />
                        <FormErrorMessage>
                          {errors.descripcion}
                        </FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Btn
                      isSubmit={true}
                      w={["200px", "300px", "350px", "400px"]}
                      mt={"10px"}
                      msg={"Guardar"}
                    />
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Center>
    </Box>
  );
}
