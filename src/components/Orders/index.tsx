import { OrderProps } from '../../types/Order';
import { OrderBoard } from '../OrderBoard';
import { Container } from './styles';

const orders: OrderProps[] = [
  {
    '_id': '63751fb7282e8762d894188a',
    'table': '002',
    'status': 'WAITING',
    'products': [
      {
        'product': {
          'name': 'Coca Cola',
          'imagePath': '1668619890937-coca-cola.png',
          'price': 7,
        },
        'quantity': 1,
        '_id': '63751fb7282e8762d894188b'
      }
    ],
  }
];


export function Orders(){
  return (
    <Container>
      <OrderBoard icon='🕓' title='Fila de espera' orders={orders}/>
      <OrderBoard icon='👨🏻‍🍳' title='Em produção' orders={[]}/>
      <OrderBoard icon='✅' title='Pronto!' orders={[]}/>
    </Container>
  );
}
