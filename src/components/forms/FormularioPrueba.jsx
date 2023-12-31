import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import axiosApi from "../../utils/config/axios.config"
import {  toast} from "react-hot-toast";
import { AppContext } from '../context/AppProvider';
import { useNavigate } from 'react-router-dom';
import Btn from "../pure/Btn"
import {
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  FormLabel,
  Checkbox,
  Flex,
  Spinner,
  Center
} from "@chakra-ui/react";

const initialValues = {
  nombre: '',
  descripcion: '',
  semestre: '',
  duracion: '',
  competencias: [],
  totalPreguntas: "",
};

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es requerido").max(70, "Máximo 70 caracteres").min(10, "Mínimo 10 caracteres").matches("^(?! )[a-zA-ZÀ-ÖØ-öø-ÿ0-9]+( [a-zA-ZÀ-ÖØ-öø-ÿ0-9]+)*(?<! )$", "El nombre solamente debe contener letras y números"),
  descripcion: Yup.string().required("La descripcion es requerida").max(200, "Máximo 200 caracteres").min(20, "Mínimo 20 caracteres").matches("^(?! )[a-zA-ZÀ-ÖØ-öø-ÿ0-9]+( [a-zA-ZÀ-ÖØ-öø-ÿ0-9]+)*(?<! )$", "El descripcion solamente debe contener letras y números"),
  semestre: Yup.string().required('El semestre es obligatorio').max(2,"Máximo dos caracteres").matches("[0-9]","El semestre solo puede contener números").matches(/^\d+$/,"Solo números positivos"),
  duracion: Yup.string().required('La duración es obligatoria').matches("[0-9]","El semestre solo puede contener números").matches(/^\d+$/,"Solo números positivos"),
  totalPreguntas: Yup.string().required("El total de preguntas de la prueba es obligatorio").matches("[0-9]","El semestre solo puede contener números").matches(/^\d+$/,"Solo números positivos"),
  competencias: Yup.array().required('Selecciona al menos una competencia'),


});




const FormularioPrueba = () => {
  const navigate = useNavigate()
  const { token } = useContext(AppContext);
  const [isLoading,setLoading] = useState(true)
  const [isLoading2,setLoading2] = useState(true)
  const [competencias, setCompetencias] = useState([]);
  const [categoriasObtenidas, setCategoriasObtenidas] = useState([])

  //Solicitamso las competencias
  useEffect(() => {
    axiosApi.get('/api/competencia', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        setCompetencias(response.data);
        setLoading(false) 
      })
      .catch((error) => {
      });
  }, []);

  //Solicitamos las categorias
  useEffect(()=>{
    axiosApi.get('/api/categoria',{
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).then((response) => {
      setCategoriasObtenidas(response.data);
      setLoading2(false)
    })
      .catch((error) => {
      });
  },[])




  const crearPrueba = async (values) =>{
    const arregloCategorias = []
    const arregloCategoriasID = []
    const arregloPreguntasPorCategorias = []

    const {categorias,descripcion,duracion,nombre, semestre,totalPreguntas} = values
    try{
      values && values.competencias.forEach((competenciaId) => {
        const competencia = competencias.find((c) => c.id === competenciaId);
        if (competencia) {
          // Agrega el valor de `categoria.nombre` a `categoriaId`
          values.categorias[competencia.id].forEach((categoria, index) => {
            const categoriaObj = competencia.Categorias[index];
            if (categoriaObj) {
              const categoriaFinal = categoriasObtenidas.find((c) => c.nombre === categoriaObj.nombre)
              categoria.categoriaId= categoriaFinal.id;
            }
          });
        }
      });
    }
    catch(e){
    }

    try{
      values.categorias.map((categoria, index)=>{
        if(categoria){
          const arreglo = []
          categoria.map((c,index)=>{
            const objeto = {} 
            objeto.categoria_id = c.categoriaId
            objeto.preguntas= c.numPreguntas
            objeto.valor= c.porcentaje
            arreglo.push(objeto)
            arregloCategoriasID.push(c.categoriaId)
            arregloPreguntasPorCategorias.push(c.numPreguntas)
          })   
          arregloCategorias.push(arreglo)
        }
      })
    }catch(e){

    }

    const body = {
      nombre: nombre,
      descripcion: descripcion,
      semestre: semestre.toString(),
      duracion: duracion,
      total_preguntas: totalPreguntas,
      competencias: values.competencias,
      valorCategorias: arregloCategorias,
    }


    const response = await axiosApi.post("/api/prueba/create",body,{
      headers: {
        Authorization: "Bearer " + token,
      },
    }).catch((e)=>{
      toast.error(e.response.data.error)
    })

    if(response.status===200){
      toast.success("¡Prueba creada correctamente!")
      navigate("/pruebas")
    }

  }


  return (
    <Box
      bgColor={"white"}

      boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;"}
      w={{
        base: "270px",
        sm: "390px",
        md: "540px",
        lg: "640px",
        tableBreakpoint: "800px",
      }}
      p={"20px"}
      borderRadius={"8px"}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          crearPrueba(values)
        }}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <Flex gap={"20px"} flexDir={["column", "column", "row"]}>
              <FormControl 
                display={"flex"} 
                flexDir={"column"} 
                gap={"10px"}
                isInvalid={errors.nombre  && touched.nombre}>
                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                <Field
                  w={"100%"}
                  as={Input} 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                />
                <FormErrorMessage>{errors.nombre}</FormErrorMessage>
              </FormControl>

              <FormControl 
                isInvalid={errors.descripcion && touched.descripcion}
                display={"flex"}
                flexDir={"column"}
                gap={"10px"}
              >
                <FormLabel 
                  htmlFor="descripcion"
                >Descripción:</FormLabel>
                <Field 
                  as={Input}
                  w={"100%"}
                  type="text" 
                  id="descripcion" 
                  name="descripcion" />
                <FormErrorMessage>{errors.descripcion}</FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex
              mt={"20px"}
              gap={"20px"}
              flexDir={["column", "column", "row"]}
            >
              <FormControl 
                isInvalid={errors.semestre && touched.semestre}
                display={"flex"}
                flexDir={"column"}
                gap={"10px"}
              >
                <FormLabel 
                  htmlFor="semestre">Semestre:</FormLabel>
                <Field 
                  as={Input}
                  type="number" 
                  min="0"
                  id="semestre" 
                  name="semestre"
                  w={"100%"}
                />
                <FormErrorMessage>{errors.semestre}</FormErrorMessage>
              </FormControl>

              <FormControl 
                isInvalid={errors.duracion && touched.duracion}
                display={"flex"}
                flexDir={"column"}
                gap={"10px"}
              >
                <FormLabel htmlFor="duracion">Duración (minutos):</FormLabel>
                <Field 
                  as={Input}
                  w={"100%"}
                  min="0"
                  type="number" id="duracion" name="duracion" />
                <FormErrorMessage>{errors.duracion}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl 
              isInvalid={errors.totalPreguntas && touched.totalPreguntas}
              display={"flex"}
              flexDir={"column"}
              gap={"10px"}
              m={"20px 0 20px 0"}

            >

              <FormLabel htmlFor="preguntas">Total Preguntas</FormLabel>
              <Field 
                as={Input}
                w={"100%"}
                min={"0"}
                type="number" id="totalPreguntas" name="totalPreguntas" />
              <FormErrorMessage>{errors.totalPreguntas}</FormErrorMessage>
            </FormControl>

            <FormLabel>Competencias:</FormLabel>
            {isLoading || isLoading2 ? <Center m={"20px 0"}><Spinner/></Center> :competencias.filter((competencia) => competencia.Categorias.length > 0 && categoriasObtenidas.some(c => c.Competencia.nombre===competencia.nombre)) // Filtrar competencias con categorías
                .map((competencia) => (
                  <Box key={competencia.id} m={"10px 0 10px 0"}>
                    <Box display={"flex"} alignItems={"center"}>
                      <Field
                        as={Checkbox}
                        name="competencias"
                        colorScheme="cyan"
                        mr={"15px"}
                        value={competencia.id}
                        checked={values.competencias.includes(competencia.id)}
                        onChange={(e) => {
                          const selectedId = competencia.id;
                          const selected = values.competencias.includes(selectedId);
                          if (selected) {
                            // Desseleccionar si ya estaba seleccionado
                            const updatedCompetencias = values.competencias.filter(
                              (id) => id !== selectedId
                            );
                            handleChange({
                              target: { name: 'competencias', value: updatedCompetencias },
                            });
                          } else {
                            // Seleccionar si no estaba seleccionado
                            handleChange({
                              target: {
                                name: 'competencias',
                                value: [...values.competencias, selectedId],
                              },
                            });
                          }
                        }}
                      />
                      <Box fontWeight={"semibold"} fontStyle={"italic"}>
                        {competencia.nombre}
                      </Box>
                    </Box>
                    <FormErrorMessage>{errors.competencias}</FormErrorMessage>
                    {values.competencias.includes(competencia.id) && (
                      <FieldArray name="categorias" 
                      >
                        {(arrayHelpers) =>
                            competencia.Categorias.map((categoria, index) =>{

                              const categoriaEncontrada = categoriasObtenidas && categoriasObtenidas.find(
                                (item) => item.nombre === categoria.nombre
                              );
                              if(categoriaEncontrada){
                                return (
                                  <Box
                                    w={"100%"}
                                    display={"flex"}
                                    flexDir={"column"}
                                    gap={"10px"}
                                    key={categoria.nombre}
                                  >
                                    <Box mt={"10px"}>{categoria.nombre}</Box>
                                    <Box
                                      w={"100%"}
                                      display={"flex"}
                                      flexDir={["column","column","row"]}
                                      gap={"15px"}
                                      justifyContent={"center"}
                                    >
                                      <Field
                                        as={Input}
                                        type="number"
                                        min={"0"}
                                        w={"100%"}
                                        name={`categorias.${competencia.id}.${index}.numPreguntas`}
                                        placeholder="Número de preguntas"
                                      />
                                      <Field
                                        as={Input}
                                        type="number"
                                        min={"0"}
                                        w={"100%"}
                                        name={`categorias.${competencia.id}.${index}.porcentaje`}
                                        placeholder="Porcentaje"
                                      />
                                      <Field
                                        display={"none"}
                                        as={Input}
                                        type="text"
                                        id={`categorias.${competencia.id}.${index}.categoriaNombre`}
                                        name={`categorias.${competencia.id}.${index}.categoriaNombre`}
                                        placeholder="Nombre"
                                      />
                                    </Box>
                                  </Box>
                                )}})
                        }
                      </FieldArray>

                    )}
                  </Box>
                ))
            }
            <Btn
              isSubmit={true}
              msg={"Guardar"}
              w={"100%"}

            />
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default FormularioPrueba;

