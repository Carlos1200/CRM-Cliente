import React, { useContext } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

const Total = () => {
  //Utilizar context y extraer funciones y valores
  const pedidoContext = useContext(PedidoContext);
  const { total } = pedidoContext;

  return (
    <div className='flex items-center mt-5 justify-between bg-white p-3'>
      <h2 className='text-gray-800 text-lg'>Total a Pagar:</h2>
      <p className='text-gray-800 mt-0'>$ {total} </p>
    </div>
  );
};

export default Total;
