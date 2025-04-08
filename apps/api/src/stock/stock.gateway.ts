import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true }) // El cors es para permitir conexiones de otros dominios.
export class StockGateway {
  @WebSocketServer()
  server: Server;

  // Este método manda una alerta cuando el stock sea igual o menor a 5
  updateStock(productId: string, productName: string, newStock: number) {
    if (newStock <= 5) {
      console.log('Emitiendo alerta de bajo stock', { productId, productName, newStock });
      this.server.emit('lowStockAlert', { productId, productName, newStock });
    }
  }
}
