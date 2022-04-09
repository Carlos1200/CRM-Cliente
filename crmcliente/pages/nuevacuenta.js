import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import Link from "next/link";

const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`;

const NuevaCuenta = () => {
  //State para el mensaje
  const [mensaje, guardarMensaje] = useState(null);

  //Mutacion para crear nuevos usuarios
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

  //Routing
  const router = useRouter();

  //Validación del formulario
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      apellido: Yup.string().required("El apellido es obligatorio"),
      email: Yup.string()
        .email("El email no es válido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .required("El password no puede ir vacio")
        .min(6, "El password debe ser de al menos 6 caracteres"),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, email, password } = valores;
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password,
            },
          },
        });

        //Usuario creado correctamente
        guardarMensaje(
          `Se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`
        );

        setTimeout(() => {
          guardarMensaje(null);
          router.push("/login");
        }, 3000);
      } catch (error) {
        guardarMensaje(error.message.replace("Error: ", ""));

        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <Layout>
      {mensaje && mostrarMensaje()}
      <h1 className='text-center text-2xl text-white font-light'>
        Crear Nueva Cuenta
      </h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-sm'>
          <form
            className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
            onSubmit={formik.handleSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='nombre'
                className='block text-gray text-sm font-bold mb-2'>
                Nombre
              </label>
              <input
                type='text'
                id='nombre'
                placeholder='Nombre Usuario'
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='apellido'
                className='block text-gray text-sm font-bold mb-2'>
                Apellido
              </label>
              <input
                type='text'
                id='apellido'
                placeholder='Apellido Usuario'
                value={formik.values.apellido}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {formik.touched.apellido && formik.errors.apellido ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.apellido}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='block text-gray text-sm font-bold mb-2'>
                Email
              </label>
              <input
                type='email'
                id='email'
                placeholder='E-mail Usuario'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='password'
                className='block text-gray text-sm font-bold mb-2'>
                Password
              </label>
              <input
                type='password'
                id='password'
                placeholder='Password Usuario'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}
            <input
              type='submit'
              className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
              value='Crear Cuenta'
            />
          </form>
          <Link href="/login">
            <a>
              <p className='text-center text-white text-xs italic'>
                Ya tienes una cuenta?{" "}
                <span className='font-bold'>Ingresa</span>
              </p>
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NuevaCuenta;
