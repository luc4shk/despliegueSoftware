import {
  Box,
  Input,
  Textarea,
  Select,
  Flex,
  Stack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image
} from "@chakra-ui/react";
import { Formik, Form, Field} from "formik";
import { useRef, useState, useEffect, useContext } from "react";
import axiosApi from "../../utils/config/axios.config";
import { AppContext } from "../context/AppProvider";
import { toast } from "react-hot-toast";
import Btn from "../pure/Btn"
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";


export default function FormularioPreguntaImagen() {


  const {token} = useContext(AppContext)
  const [categorias, setCategorias] = useState(null);
  const inputRef = useRef();
  const navigate = useNavigate()

  const initialValues = {
    enunciado: "",
    opcionA: "",
    opcionB: "",
    opcionC: "",
    opcionD: "",
    respuesta: "",
    semestre: "",
    categoria: "",
    imagen: null,
  };

   const obtenerCategorias = async () => {
    let response = await axiosApi
      .get("api/categoria/?estado=1", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .catch((e) => {
        toast.error(e.response.data.error);
      });
    setCategorias(response.data);
  };

  const agregarPreguntaImagen = async (texto_pregunta, semestre,A,B,C,D,respuesta,categoria_id,imagen) =>{
    const formData = new FormData();
    formData.append("imagen", imagen);
    formData.append("texto_pregunta", texto_pregunta);
    formData.append("semestre", semestre);
    formData.append("A", A);
    formData.append("B", B);
    formData.append("C", C);
    formData.append("D", D);
    formData.append("respuesta", respuesta);
    formData.append("categoria_id", categoria_id);
       
    let response = await axiosApi.post("/api/question/createImageQuestion",formData,{
       headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    }).catch((e) => {
      toast.error(e.response.data.error);
    })

    if (response.status === 200) {
      toast.success("¡Pregunta agregada correctamente!");
      navigate("/preguntas");
    }
  }

  const validationSchema = Yup.object().shape({
    enunciado: Yup.string().required("El enunciado es requerido").min(10,"Mínimo 10 caracteres").max(850,"Máximo 850 caracteres"),
    opcionA:  Yup.string().required("La opción A es requerida"),
    opcionB:  Yup.string().required("La opción B es requerida"),
    opcionC:  Yup.string().required("La opción C es requerida"),
    opcionD:  Yup.string().required("La opción D es requerida"),
    respuesta: Yup.string()
    .required("La respuesta es requerida").max(1,"Máximo un caracter ")
    .matches(/^[A-Z]$/, "La respuesta debe ser una letra entre A-Z, debe ser mayúscula"),
    semestre: Yup.string().required("El semestre es requerido").max(2,"Máximo dos caracteres").matches("[0-9]","El semestre solo puede contener números"),
    categoria: Yup.string().required("La categoría es requerida"),
    imagen: Yup.mixed()
      .test("file-type", "El tipo de archivo es PNG/JPEG", (value) => {
        if (value) {
          return value.endsWith(".jpg") || value.endsWith(".png") || value.endsWith(".jpeg");
        }
        return true;
      })
      .required("La imagen es requerida"),
  });

  const handleFileChange = (e, setFieldValue) => {
    setFieldValue("imagen",inputRef.current.files[0])
  };

  useEffect(()=>{
    obtenerCategorias()
  },[])

  return (
    <Box>
      <Box
        boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;"}
        bg="white"
        p="20px"
        borderRadius="8px"
        w={{
          base: "270px",
          sm: "390px",
          md: "540px",
          lg: "640px",
          tableBreakpoint: "800px",
        }}
        overflow="hidden"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={({enunciado,semestre,opcionA,opcionB,opcionC,opcionD,respuesta,categoria})=>{
            agregarPreguntaImagen(enunciado,semestre,opcionA,opcionB,opcionC,opcionD,respuesta,categoria,inputRef.current.files[0])
          }}
        >
          {(props) => {
            const { errors, touched, setFieldValue } = props;
            return (
              <Form>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                    >
                      <FormLabel htmlFor="enunciado">Enunciado</FormLabel>
                      <FormControl
                        isInvalid={touched.enunciado && errors.enunciado}
                      >
                        <Field
                          as={Textarea}
                          mt="10px"
                          id="enunciado"
                          name="enunciado"
                          resize={"none"}
                        />
                        <FormErrorMessage>{errors.enunciado}</FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={["column","column","row"]}
                      mt={"10px"}
                      width={"100%"}
                      alignItems={"center"}
                      gap={"20px"}
                    >
                    <Box w={"100%"}>
                      <FormLabel>Imagen</FormLabel>
                      <Field
                      id="imagen"
                      name="imagen"
                      mt="10px"
                      mr={{ base: "0", sm: "5" }}
                      mb={{ base: "2", sm: "0" }}
                    >
                      {({ field }) => (
                        <FormControl
                          isInvalid={touched.imagen && errors.imagen}
                        >
                          <Input
                            type="file"
                            accept=".png, .jpeg"
                            name="imagen"
                            h={"40px"}
                            borderRadius={"0px"}
                            ref={inputRef}
                            variant="unstyled"
                            onChange={(event) => {
                              handleFileChange(event, setFieldValue);
                            }}
                            {...field}
                          />
                          <FormErrorMessage>{errors.imagen}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    </Box>
                    <Box w={"100%"}>
                    <FormLabel htmlFor="semestre">Semestre</FormLabel>
                      <FormControl
                        isInvalid={touched.semestre && errors.semestre}
                      >
                        <Field
                          as={Input}
                          id="semestre"
                          name="semestre"
                        />
                        <FormErrorMessage>{errors.semestre}</FormErrorMessage>
                      </FormControl>
                      </Box>
                    </Box>
            
                    <Box
                      mt="10px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      w="100%"
                    >
                      <FormLabel htmlFor="categoria">Categoría</FormLabel>
                      <FormControl
                        isInvalid={touched.categoria && errors.categoria}
                      >
                        <Field
                          as={Select}
                          id="categoria"
                          name="categoria"
                          border="2px solid gray"
                        >
                          <option>Seleccione una categoria</option>
                          {categorias && categorias.map((categoria, index) => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.nombre}
                            </option>
                          ))}
                        </Field>
                        <FormErrorMessage>{errors.categoria}</FormErrorMessage>
                      </FormControl>
                    </Box>
                <Box
                  mt="10px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    spacing="3"
                    alignItems="center"
                  >
                  </Stack>
                </Box>
                <Box
                  mt="10px"
                  gap={"10px"}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Flex flexDir={["column","column","row"]} gap={"20px"}>
                    <FormControl isInvalid={errors.opcionA && touched.opcionA}>
                      <FormLabel htmlFor="opcionA">Opción A</FormLabel>
                      <Field id="opcionA" name="opcionA" as={Textarea} resize={"none"} />
                      <FormErrorMessage>{errors.opcionA}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.opcionB && touched.opcionB}>
                      <FormLabel htmlFor="opcionB">Opción B</FormLabel>
                      <Field id="opcionB" name="opcionB" as={Textarea}  resize={"none"}/>
                      <FormErrorMessage>{errors.opcionB}</FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex flexDir={["column","column","row"]} gap={"20px"}>
                    <FormControl isInvalid={errors.opcionC && touched.opcionC}>
                      <FormLabel htmlFor="opcionC">Opción C</FormLabel>
                      <Field id="opcionC" name="opcionC" as={Textarea}  resize={"none"}/>
                      <FormErrorMessage>{errors.opcionC}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.opcionD && touched.opcionD}>
                      <FormLabel htmlFor="opcionD">Opción D</FormLabel>
                      <Field id="opcionD" name="opcionD" as={Textarea}  resize={"none"}/>
                      <FormErrorMessage>{errors.opcionD}</FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <FormControl
                    isInvalid={errors.respuesta && touched.respuesta}
                  >
                    <FormLabel htmlFor="respuesta">Respuesta</FormLabel>
                    <Field id="respuesta" name="respuesta" as={Input} />
                    <FormErrorMessage>{errors.respuesta}</FormErrorMessage>
                  </FormControl>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Btn 
                    isSubmit={true} 
                    mt={"15px"}
                    msg={"Agregar"}
                    w={"100%"}
                  />
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
}
