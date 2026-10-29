export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export interface Pedido {
  id: string;
  userId: string;
  productoId: string;
  cantidad: number;
  notas?: string | null;
  estado: EstadoPedido;
  createdAt: Date;
  updatedAt: Date;
}
