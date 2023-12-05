import React, {useContext, useState}from "react";
import {useEffect} from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axiosApi from "../../../../utils/config/axios.config"
import { AppContext } from "../../../context/AppProvider";
import {Image, Box, Text, Button, Divider, Flex, Spinner } from "@chakra-ui/react";
import Cookies from "js-cookie";

const PruebaPresentacionBody = ({}) =>{
    const {isInPrueba,setIsInPrueba, tiempoInicial, role, token} = useContext(AppContext)
    const {id} = useParams()
    const [preguntas, setPreguntas] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionText, setQuestionText] = useState("");
    const [questionImage, setQuestionImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [opciones, setOpciones] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [questionId, setQuestionId] = useState(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState(()=>JSON.parse(sessionStorage.getItem("res")))

    const showQuestion = (index) => {
        resetState();
        let currentQuestion =  preguntas[index];
        console.log(currentQuestion)
        let questionNumber = index + 1;
        setQuestionImage(currentQuestion.imagen)
        setQuestionId(currentQuestion.id)
        setQuestionText(`${questionNumber}. ${currentQuestion.texto}`);
        setOpciones(currentQuestion.opciones)
        console.log(currentQuestion.id)
        obtenerRespuestas(currentQuestion.id)
    };  

    const obtenerRespuestas = (id) =>{
        if(respuestasSeleccionadas){
         if(respuestasSeleccionadas[id]!==undefined&&respuestasSeleccionadas[id]!==null){
            setSelectedAnswer(respuestasSeleccionadas[id])
            }
            
        }
    }

    const selectChoice = (index) =>{
        setSelectedAnswer(prev => index)
    }


    const resetState = () => {
        setOpciones([]);
        setSelectedAnswer(null);
    };

    const nextQuestion = () => {
        if(currentQuestionIndex+1 < preguntas.length){
            setCurrentQuestionIndex(currentQuestionIndex+1)
            procesoPregunta()
    }}
    const prevQuestion = () =>{ 
        if(currentQuestionIndex>0){
            setCurrentQuestionIndex(currentQuestionIndex-1)
            procesoPregunta()
        }
    }

    const terminarPrueba = async (id, mensaje) =>{
        const response = await axiosApi.post(`/api/convocatoria/${id}/terminarPrueba`,{},{
            headers:{
                Authorization: "Bearer " + token
            }
        }).catch(e=>{
            toast.error(e.response.data.error)
        })
        if(response.status===200){
            toast.success(mensaje)
        }
    }


    const procesoPregunta = () => {
        if(selectedAnswer!==null){
            // Actualizamos el objeto con la nueva respuesta y opción
            const updatedRespuestas = { ...respuestasSeleccionadas, [questionId]: selectedAnswer };
            //Actualizamos el estado
            setRespuestasSeleccionadas(updatedRespuestas);
            //Actualizamos el sessiónStorage
            sessionStorage.setItem("res", JSON.stringify(updatedRespuestas))
            //Envíamos la información
            enviarPregunta(questionId,tiempoInicial,selectedAnswer)
        }else{
            enviarPregunta(questionId,tiempoInicial,null)
        }
    }

    const enviarPregunta = async (id_pregunta, tiempo, opcionElegida) =>{
        const body={
            id_pregunta:id_pregunta,
            tiempo:tiempo,
            opcion:opcionElegida
        }
        console.log(body)
        const response = await axiosApi.put(`/api/convocatoria/${id}/guardarProgreso`,body,{
            headers:{
                Authorization:"Bearer " + token
            }
        }).catch(e =>{
            toast.error(e.response.data.error)
        })
    }


    const obtenerPreguntasPrueba = async (id) =>{
        const response = await axiosApi.get(`/api/convocatoria/${id}/getPreguntas`,{
            headers:{
                Authorization:"Bearer " + token
            }
        }).catch(e=>{
            toast.error("No se pueden obtener las preguntas de la prueba")
        })
        setPreguntas(response.data)
        setIsLoading(false)
    }

    if(tiempoInicial===0){
        terminarPrueba(id,"El tiempo se ha agotado, prueba finalizada con exito")
        setIsInPrueba(prev => "false")
        sessionStorage.setItem("isInPrueba", false)
    }

    useEffect(()=>{
        obtenerPreguntasPrueba(id)
    },[])

    useEffect(()=>{
        !isLoading && showQuestion(currentQuestionIndex)
    },[isLoading, currentQuestionIndex])

    if(isLoading){
        return(
            <Spinner mt={"300px"}/>
        )
    }

    return(
        <>
            <Box w={"400px"} p={"20px"} backgroundColor={"white"} borderRadius={"8px"}>
                <Text fontSize={"20px"}>{questionText}</Text>
                { questionImage && <Image w={"100%"} m={"10px auto"} objectFit={"cover"}
                    src={questionImage.url} />}
                <Divider m={"10px"}/>
                <Flex flexDir={"column"} gap={"10px"}>
                    {opciones&&opciones.map((o, index) => (
                        <Box
                            key={index}
                            textAlign={"left"} 
                            onClick={() => {
                                selectChoice(index)
                            }}
                            backgroundColor={selectedAnswer===index?"#e4fcbc":"cuarto.100"}
                            fontSize={"17px"}
                            borderRadius={"10px"}
                            p={"10px"}
                        >
                            {o}
                        </Box>
                    ))}
                    <Flex justifyContent={"space-between"}>
                        <Button colorScheme={"red"}   onClick={()=>prevQuestion()}>Anterior</Button>
                        {
                            currentQuestionIndex+1!==preguntas.length ?
                                <Button colorScheme={"blue"}  onClick={()=>{
                                    nextQuestion()
                                }
                                    }>Siguiente</Button>
                                    :
                                    <Button colorScheme={"green"} onClick={()=>{
                                        procesoPregunta()
                                        //terminarPrueba(id,"Prueba finalzada correctamente") 
                                        setIsInPrueba(prev => "false")
                                        sessionStorage.setItem("isInPrueba", false)
                                        //sessionStorage.removeItem("idConvocatoria")
                                        sessionStorage.removeItem("res")
                                        sessionStorage.removeItem("time")

                                    }}>Finalizar</Button>
                        }
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default PruebaPresentacionBody
