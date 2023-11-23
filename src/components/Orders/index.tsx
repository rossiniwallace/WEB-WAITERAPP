import {useEffect, useState} from 'react';
import {OrderProps} from '../../types/Order';
import {OrderBoard} from '../OrderBoard';
import {Container} from './styles';
import {toast} from 'react-toastify';

import io from 'socket.io-client';
import {api} from '../../utils/api';

const socket = io('https://waiter-app-api-s9yw.onrender.com', {
  transports: ['websocket'],
});

export function Orders() {

  const [orders, setOrders] = useState<OrderProps[]>([]);

  useEffect(() => {
    socket.on('orders@new', (newOrder: OrderProps) => {
      console.log(newOrder);
      setOrders((prevState) => prevState.concat(newOrder));
      toast.info(
        `Um novo pedido para a mesa ${newOrder.table}!`
      );
    });
    return function cleanup() {
      socket.removeListener('orders@new');
    };
  }, []);

  useEffect(() => {
    api.get('/orders').then(({data}) => {
      setOrders(data);
    });
  }, []);


  const waiting = orders.filter((order) => order.status === 'WAITING');
  const inProduction = orders.filter((order) => order.status === 'IN_PRODUCTION');
  const done = orders.filter((order) => order.status === 'DONE');

  function handleCancelOrder(orderId: string) {
    setOrders((prevState) =>
      prevState.filter((order) => order.id !== orderId)
    );
  }

  function handleOrderStatusChange(orderId: string, status: OrderProps['status']) {
    setOrders((prevState) =>
      prevState.map((order) =>
        order.id   === orderId ? {...order, status} : order
      )
    );
  }

  return (
    <Container>
      <OrderBoard
        icon="🕓"
        title="Fila de espera"
        orders={waiting}
        onCancelOrder={handleCancelOrder}
        onChanceOrderStatus={handleOrderStatusChange}
      />
      <OrderBoard
        icon="👨🏻‍🍳"
        title="Em produção"
        orders={inProduction}
        onCancelOrder={handleCancelOrder}
        onChanceOrderStatus={handleOrderStatusChange}
      />
      <OrderBoard
        icon="✅"
        title="Pronto!"
        orders={done}
        onCancelOrder={handleCancelOrder}
        onChanceOrderStatus={handleOrderStatusChange}
      />
    </Container>
  );
}
