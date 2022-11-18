import { Actions, ModalBody, OrderDetails, Overlay } from './styles';
import closeIcon from '../../assets/images/close-icon.svg';
import { OrderProps } from '../../types/Order';
import { formatCurrency } from '../../utils/formatCurrency';
import { useEffect } from 'react';

interface OrderModelProps {
  visible: boolean;
  order: OrderProps | null;
  onClose: () => void;
}

export function OrderModal({ visible, order ,onClose}: OrderModelProps) {

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent){
      if(event.key==='Escape'){
        onClose();
      }
    }

    document.addEventListener('keydown',handleKeyDown);

    return () => {
      document.removeEventListener('keydown',handleKeyDown);
    };

  },[onClose]);

  if (!visible || !order) {
    return null;
  }

  const total = order.products.reduce((total, {product, quantity })=> {
    return total +  (product.price * quantity);
  },0);

  return (
    <Overlay>
      <ModalBody>
        <header>
          <strong> Mesa {order.table}</strong>
          <button type='button' onClick={onClose}>
            <img src={closeIcon} alt='Fechar' />
          </button>
        </header>

        <div className="status-container">
          <small>Status do Pedido</small>
          <div>
            <span>
              {order.status === 'WAITING' && '🕓'}
              {order.status === 'IN_PRODUCTION' && '👨🏻‍🍳'}
              {order.status === 'DONE' && '✅'}
            </span>
            <strong>
              {order.status === 'WAITING' && 'Fila de espera'}
              {order.status === 'IN_PRODUCTION' && 'Em produção'}
              {order.status === 'DONE' && 'Pronto!'}
            </strong>
          </div>
        </div>

        <OrderDetails>
          <strong>Itens</strong>
          <div className="order-items">
            {order.products.map(({_id, product, quantity}) => (
              <div className="item" key={_id}>
                <img
                  height='28.51'
                  width='56'
                  src={`http://127.0.0.1:4000/uploads/${product.imagePath}`}
                  alt={product.name} />

                <span className="quantity">{quantity}x</span>

                <div className="product-details">
                  <strong>{product.name}</strong>
                  <span>{formatCurrency(product.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </OrderDetails>
        <Actions>
          <button type='button' className='primary'>
            <span>👨🏻‍🍳</span>
            <span>Iniciar Produção</span>
          </button>
          <button type='button' className='secondary'>
            <span>Cancelar Pedido</span>
          </button>
        </Actions>
      </ModalBody>
    </Overlay>
  );
}
