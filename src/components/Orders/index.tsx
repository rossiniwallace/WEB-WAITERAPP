import { useEffect, useState } from 'react';
import { OrderProps } from '../../types/Order';
import { OrderBoard } from '../OrderBoard';
import { Container } from './styles';

import sockerIo from 'socket.io-client';
import { api } from '../../utils/api';


export function Orders() {

  const [orders, setOrders] = useState<OrderProps[]>([]);

  useEffect(() => {
    const socket = sockerIo('http://127.0.0.1:4000', {
      transports: ['websocket']
    });

    socket.on('orders@new', (order) => {
      setOrders((prevState) => prevState.concat(order));
      console.log('Novo pedido cadastrado', order);
    });
  }, []);

  useEffect(() => {
    api.get('/orders').then(({ data }) => {
      setOrders(data);
    });
  }, []);

  const waiting = orders.filter((order) => order.status === 'WAITING');
  const inProduction = orders.filter((order) => order.status === 'IN_PRODUCTION');
  const done = orders.filter((order) => order.status === 'DONE');

  function handleCancelOrder(orderId: string) {
    setOrders((prevState) =>
      prevState.filter((order) => order._id !== orderId)
    );
  }

  function handleOrderStatusChange(orderId: string, status: OrderProps['status']) {
    setOrders((prevState) =>
      prevState.map((order) =>
        order._id === orderId ? { ...order, status } : order
      )
    );
  }
  return (
    <Container>
      <OrderBoard
        icon='🕓'
        title='Fila de espera'
        orders={waiting}
        onCancelOrder={handleCancelOrder}
        onChanceOrderStatus={handleOrderStatusChange}
      />
      <OrderBoard
        icon='👨🏻‍🍳'
        title='Em produção'
        orders={inProduction}
        onCancelOrder={handleCancelOrder}
        onChanceOrderStatus={handleOrderStatusChange}
      />
      <OrderBoard
        icon='✅'
        title='Pronto!'
        orders={done}
        onCancelOrder={handleCancelOrder}
        onChanceOrderStatus={handleOrderStatusChange}
      />
    </Container>
  );
}
