import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import * as Yup from "yup";
  import { Formik, Field, Form } from "formik";
  import toast from "react-hot-toast";
  import CardLogo from "../pure/CardLogo";
  import React from "react";
import axiosApi from "../../utils/config/axios.config";
import Btn from "../pure/Btn";
  
  export default function EmailRecuperación() {
    const initialValues = {
      email: "",
    };
  
  const requestPassword = async (email, url) =>{
    let body={
      email:email,
      redirectURL:url
    }
    let response = await axiosApi.post("/api/auth/requestPasswordReset",body,{

    }).catch((e)=>{
      throw new Error(e.response.data.error)
    })

  }
  
    const validationSchema = Yup.object().shape({
      email: Yup.string().email("Correo Inválido").required("Correo requerido"),
    });
  
    return (
      <CardLogo wd={"450px"} hg={"370px"}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={({email}) => {
          //  requestPassword(email, "https://cheerful-strudel-8a37c7.netlify.app/#/newPassword")
            toast.promise(requestPassword(email, "https://cheerful-strudel-8a37c7.netlify.app/#/newPassword")
, {
             loading: 'Buscando Correo...',
             success: '¡Mensaje enviado correctamente!',
             error: (e)=>e+"",
            });
          }}
        >
          {(props) => {
            const {  errors, touched } = props;
  
            return (
              <Form>
                <FormControl isInvalid={errors.email && touched.email}>
                  <FormLabel textAlign="center" htmlFor="email">
                    Ingresa tu correo para buscar tu cuenta
                  </FormLabel>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    variant="filled"
                    borderColor="gray.300"
                    type="email"
                    mt={4}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <Btn
                  isSubmit={true}
                  mt={8}
                  w="full"
                  msg={"Buscar"} 
                />
              </Form>
            );
          }}
        </Formik>
      </CardLogo>
    );
  }
