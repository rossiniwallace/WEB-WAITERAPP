import { useState } from 'react';
import { OrderProps } from '../../types/Order';
import { OrderModal } from '../OrderModal';
import { Board, OrdersContainer } from './styles';

interface OrderBoardProps {
  icon: string;
  title: string;
  orders: OrderProps[];
}

export function OrderBoard({icon,title, orders}: OrderBoardProps){

  const [isModelVisible,setIsModelVisible] = useState(false);
  const [selectedOrder,setSelectedOrder] = useState<OrderProps| null>(null);

  function handleOpenModal(order: OrderProps) {
    setIsModelVisible(true);
    setSelectedOrder(order);
  }

  function handleCloseModal(){
    setIsModelVisible(false);
    setSelectedOrder(null);
  }

  return (
    <Board>
      <OrderModal
        visible={isModelVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
      />

      <header>
        <span>{icon}</span>
        <strong>{title}</strong>
        <span>({orders.length})</span>
      </header>
      {orders.length > 0 && (
        <OrdersContainer>
          {orders.map((order) => (
            <button type='button' key={order._id} onClick={() => handleOpenModal(order)}>
              <strong>Mesa {order.table}</strong>
              <span>{order.products.length} itens</span>
            </button>
          ))}
        </OrdersContainer>
      )}
    </Board>
  );
}
