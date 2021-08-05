import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;

const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      nombre
      email
    }
  }
`;

const EditarCliente = () => {
  //Obtener el ID actual
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  //consultar para obtener el cliente
  const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id: pid,
    },
  });

  //Actualizar Cliente
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

  //Schema de validacion
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    empresa: Yup.string().required("El campo empresa es obligatorio"),
    email: Yup.string()
      .email("Email no valido")
      .required("El email es obligatorio"),
  });

  if (loading) return "Cargando";

  const { obtenerCliente } = data;

  //Modifica el cliente en la base de datos
  const actualizarInfoCliente = async (valores) => {
    const { nombre, apellido, empresa, email, telefono } = valores;
    try {
      const { data } = await actualizarCliente({
        variables: {
          id: pid,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
          },
        },
      });
      console.log(data);
      //Sweet alert
      Swal.fire("Actualizado!", "El cliente se ha actualizado", "success");
      //Redireccionar
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>

      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit={(valores) => {
              actualizarInfoCliente(valores);
            }}>
            {(props) => {
              return (
                <form
                  className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                  onSubmit={props.handleSubmit}>
                  <div className='mb-4'>
                    <label
                      htmlFor='nombre'
                      className='block text-gray text-sm font-bold mb-2'>
                      Nombre
                    </label>
                    <input
                      type='text'
                      id='nombre'
                      placeholder='Nombre Cliente'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>
                  {props.touched.nombre && props.errors.nombre ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.nombre}</p>
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
                      placeholder='Apellido Cliente'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.apellido}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>
                  {props.touched.apellido && props.errors.apellido ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.apellido}</p>
                    </div>
                  ) : null}
                  <div className='mb-4'>
                    <label
                      htmlFor='empresa'
                      className='block text-gray text-sm font-bold mb-2'>
                      Empresa
                    </label>
                    <input
                      type='text'
                      id='empresa'
                      placeholder='Empresa Cliente'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.empresa}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>
                  {props.touched.empresa && props.errors.empresa ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.empresa}</p>
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
                      placeholder='Email Cliente'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>
                  {props.touched.email && props.errors.email ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.email}</p>
                    </div>
                  ) : null}
                  <div className='mb-4'>
                    <label
                      htmlFor='telefono'
                      className='block text-gray text-sm font-bold mb-2'>
                      Teléfono
                    </label>
                    <input
                      type='tel'
                      id='telefono'
                      placeholder='Teléfono Cliente'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.telefono}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>
                  <input
                    type='submit'
                    value='Editar Cliente'
                    className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarCliente;
