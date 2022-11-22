import { useState } from 'react';
import { toast } from 'react-toastify';
import { OrderProps } from '../../types/Order';
import { api } from '../../utils/api';
import { OrderModal } from '../OrderModal';
import { Board, OrdersContainer } from './styles';

interface OrderBoardProps {
  icon: string;
  title: string;
  orders: OrderProps[];
  onCancelOrder:(orderId: string) => void;
  onChanceOrderStatus: (orderId: string,status: OrderProps['status']) => void
}

export function OrderBoard({icon,title, orders, onCancelOrder,onChanceOrderStatus}: OrderBoardProps){

  const [isModelVisible,setIsModalVisible] = useState(false);
  const [selectedOrder,setSelectedOrder] = useState<OrderProps| null>(null);
  const [isLoading,setIsLoading] = useState(false);

  function handleOpenModal(order: OrderProps) {
    setIsModalVisible(true);
    setSelectedOrder(order);
  }

  function handleCloseModal(){
    setIsModalVisible(false);
    setSelectedOrder(null);
  }

  async function handleChangeOrderStatus(){
    setIsLoading(true);

    const status = selectedOrder?.status === 'WAITING' ? 'IN_PRODUCTION' : 'DONE';

    await api.patch(`orders/${selectedOrder?._id}`, {status});

    toast.success(
      `O pedido da mesa ${selectedOrder?.table} teve o status alterado!`
    );

    onChanceOrderStatus(selectedOrder!._id, status);
    setIsLoading(false);
    setIsModalVisible(false);
  }

  async function handleCancelOrder(){
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await api.delete(`orders/${selectedOrder?._id}`);

    toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado!`);
    onCancelOrder(selectedOrder!._id);
    setIsLoading(false);
    setIsModalVisible(false);
  }

  return (
    <Board>
      <OrderModal
        visible={isModelVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onCancelOrder={handleCancelOrder}
        isLoading={isLoading}
        onChangeOrderStatus={handleChangeOrderStatus}
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
