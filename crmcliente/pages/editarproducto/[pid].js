import React from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import { gql, useQuery, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
      nombre
      precio
      existencia
    }
  }
`;

const MODIFICAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      id
      nombre
      existencia
      precio
    }
  }
`;

const EditarProducto = () => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  //Consultar para obtener el producto
  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id: pid,
    },
  });

  //Modificar Productos
  const [actualizarProducto] = useMutation(MODIFICAR_PRODUCTO);

  //Schema de validacion
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required("El nombre del producto es obligatorio"),
    existencia: Yup.number()
      .required("Agrega la cantidad disponible")
      .positive("No se aceptan numeros negativos")
      .integer("La existencia deben ser numeros enteros"),
    precio: Yup.number()
      .required("Agrega el precio del producto")
      .positive("No se aceptan numeros negativos"),
  });

  if (loading) return "Cargando..";

  if (!data) {
    return "Accion no permitida";
  }

  const actualizarInfoProducto = async (valores) => {
    const { nombre, existencia, precio } = valores;
    try {
      await actualizarProducto({
        variables: {
          id: pid,
          input: {
            nombre,
            existencia,
            precio,
          },
        },
      });

      //Mostrar una alerta
      Swal.fire(
        "Correcto",
        "El producto se actualizo correctamente",
        "success"
      );
      //Redirigir a productos
      router.push("/productos");
    } catch (error) {
      console.log(error);
    }
  };

  const { obtenerProducto } = data;

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            enableReinitialize
            initialValues={obtenerProducto}
            validationSchema={schemaValidacion}
            onSubmit={(valores) => {
              actualizarInfoProducto(valores);
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
                      placeholder='Nombre Producto'
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
                      htmlFor='existencia'
                      className='block text-gray text-sm font-bold mb-2'>
                      Candtidad disponible
                    </label>
                    <input
                      type='number'
                      id='existencia'
                      placeholder='Distencia existencia'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existencia}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>
                  {props.touched.existencia && props.errors.existencia ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.existencia}</p>
                    </div>
                  ) : null}
                  <div className='mb-4'>
                    <label
                      htmlFor='precio'
                      className='block text-gray text-sm font-bold mb-2'>
                      Precio
                    </label>
                    <input
                      type='number'
                      id='precio'
                      placeholder='precio Producto'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>
                  {props.touched.precio && props.errors.precio ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.precio}</p>
                    </div>
                  ) : null}

                  <input
                    type='submit'
                    value='Editar Productos'
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

export default EditarProducto;
