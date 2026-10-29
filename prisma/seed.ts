import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Los 30 productos reales de la Entrega 1 de Tienda Verdolaga
const productosSeed = [
  // --- 1. CAMISETAS (10 productos) ---
  {
    nombre: "Camiseta Verde Clásica",
    categoria: "camisetas",
    precio: 249900,
    imagen: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=500&auto=format&fit=crop&q=60",
    descripcion: "Diseño tradicional con las clásicas franjas verdes y blancas, confeccionada en tejido transpirable."
  },
  {
    nombre: "Camiseta Blanca Verdolaga",
    categoria: "camisetas",
    precio: 239900,
    imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
    descripcion: "Edición visitante en color blanco con detalles verdes y escudo bordado de alta definición."
  },
  {
    nombre: "Camiseta Alternativa Negra",
    categoria: "camisetas",
    precio: 229900,
    imagen: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=60",
    descripcion: "Estilo moderno en fondo negro con vivos verdes neón y acabado de alto rendimiento deportivo."
  },
  {
    nombre: "Camiseta Retro Época Dorada",
    categoria: "camisetas",
    precio: 219900,
    imagen: "https://images.unsplash.com/photo-1580087433295-ab2600c1030e?w=500&auto=format&fit=crop&q=60",
    descripcion: "Diseño de corte clásico inspirado en las camisetas históricas de los años ochenta con cuello tipo polo."
  },
  {
    nombre: "Camiseta de Entrenamiento Pro",
    categoria: "camisetas",
    precio: 159900,
    imagen: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&auto=format&fit=crop&q=60",
    descripcion: "Prenda deportiva ligera con tecnología de secado rápido, pensada para la actividad física diaria."
  },
  {
    nombre: "Camiseta Edición Homenaje Continental",
    categoria: "camisetas",
    precio: 259900,
    imagen: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60",
    descripcion: "Edición especial inspirada en las grandes gestas del club durante las noches de torneos internacionales."
  },
  {
    nombre: "Camiseta con Diseño de Firma Histórica",
    categoria: "camisetas",
    precio: 249900,
    imagen: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format&fit=crop&q=60",
    descripcion: "Pieza conmemorativa para coleccionistas con un diseño estampado inspirado en la firma de ídolos verdolagas."
  },
  {
    nombre: "Camiseta Coleccionable Verde Esmeralda",
    categoria: "camisetas",
    precio: 239900,
    imagen: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60",
    descripcion: "Confección especial en tonalidad verde esmeralda con ribetes dorados para aficionados del equipo."
  },
  {
    nombre: "Camiseta Urbana 'El Más Grande'",
    categoria: "camisetas",
    precio: 129900,
    imagen: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=500&auto=format&fit=crop&q=60",
    descripcion: "Camiseta de algodón con estilo streetwear y tipografía retro para lucir los colores en cualquier momento."
  },
  {
    nombre: "Camiseta Edición Leyenda del Arco",
    categoria: "camisetas",
    precio: 229900,
    imagen: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=60",
    descripcion: "Buzo de arquero manga larga inspirado en las grandes figuras que defendieron la portería verdolaga."
  },

  // --- 2. ACCESORIOS (10 productos) ---
  {
    nombre: "Gorra Verde Urbana",
    categoria: "accesorios",
    precio: 69900,
    imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60",
    descripcion: "Gorra con visera curva, broche ajustable y escudo verdolaga bordado en relieve."
  },
  {
    nombre: "Bufanda Verdolaga Estadio",
    categoria: "accesorios",
    precio: 45000,
    imagen: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&auto=format&fit=crop&q=60",
    descripcion: "Bufanda tejida doble faz con flecos y la frase representativa de la hinchada."
  },
  {
    nombre: "Termo Metálico Verdolaga",
    categoria: "accesorios",
    precio: 55000,
    imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    descripcion: "Botella de acero inoxidable con tapa hermética para mantener tus bebidas a temperatura ideal."
  },
  {
    nombre: "Llavero Escudo Metálico",
    categoria: "accesorios",
    precio: 24900,
    imagen: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60",
    descripcion: "Llavero de aleación metálica con acabado esmaltado de alta durabilidad y argolla reforzada."
  },
  {
    nombre: "Gorra Retro Estilo Snapback",
    categoria: "accesorios",
    precio: 74900,
    imagen: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500&auto=format&fit=crop&q=60",
    descripcion: "Gorra con visera plana en contraste verde y blanco con bordado frontal de estética noventera."
  },
  {
    nombre: "Taza Cerámica 'Siempre Verdolaga'",
    categoria: "accesorios",
    precio: 29900,
    imagen: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60",
    descripcion: "Taza de cerámica de 11 oz apta para microondas y lavavajillas con frase motivacional."
  },
  {
    nombre: "Mochila Deportiva de Viaje",
    categoria: "accesorios",
    precio: 119900,
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    descripcion: "Morral espacioso con compartimento acolchado para portátil y bolsillos laterales de fácil acceso."
  },
  {
    nombre: "Set de Pines Esmaltados (3 Piezas)",
    categoria: "accesorios",
    precio: 34900,
    imagen: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&auto=format&fit=crop&q=60",
    descripcion: "Juego de 3 prendedores metálicos esmaltados para personalizar camisetas, chaquetas o mochilas."
  },
  {
    nombre: "Billetera de Cuero Sintético Verdolaga",
    categoria: "accesorios",
    precio: 49900,
    imagen: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60",
    descripcion: "Billetera compacta con grabado sutil del escudo, tarjetero y compartimento para billetes."
  },
  {
    nombre: "Pulsera de Acero Inoxidable y Cordón",
    categoria: "accesorios",
    precio: 21900,
    imagen: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&auto=format&fit=crop&q=60",
    descripcion: "Brazalete ajustable elaborado con cordón de alta resistencia y placa grabada en láser."
  },

  // --- 3. COLECCIONABLES (10 productos) ---
  {
    nombre: "Bandera Gigante 'Soy del Verde'",
    categoria: "coleccionables",
    precio: 49900,
    imagen: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60",
    descripcion: "Bandera de gran tamaño (1.50 x 1.00 m) elaborada en poliéster resistente para alentar con orgullo."
  },
  {
    nombre: "Balón Coleccionable Gloria",
    categoria: "coleccionables",
    precio: 119900,
    imagen: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500&auto=format&fit=crop&q=60",
    descripcion: "Balón decorativo conmemorativo con detalles dorados de los títulos y copas más importantes."
  },
  {
    nombre: "Balón Conmemorativo Bicampeón de América",
    categoria: "coleccionables",
    precio: 149900,
    imagen: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60",
    descripcion: "Balón de exhibición conmemorativo con panel serigrafiado en homenaje a las dos coronas continentales."
  },
  {
    nombre: "Poster Retro Enmarcado 'Noches de Copa'",
    categoria: "coleccionables",
    precio: 89900,
    imagen: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=60",
    descripcion: "Lámina decorativa de alta resolución con marco de madera negra inspirada en noches históricas del estadio."
  },
  {
    nombre: "Fotografía Histórica Vuelta Olímpica",
    categoria: "coleccionables",
    precio: 64900,
    imagen: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60",
    descripcion: "Impresión fotográfica en calidad museo que evoca la celebración y euforia de una final inolvidable."
  },
  {
    nombre: "Placa Decorativa Metálica 'Pasión Paisa'",
    categoria: "coleccionables",
    precio: 59900,
    imagen: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60",
    descripcion: "Placa de aluminio estilo vintage con bordes envejecidos para decorar habitaciones o salas de entretenimiento."
  },
  {
    nombre: "Miniatura de Camiseta con Pedestal",
    categoria: "coleccionables",
    precio: 79900,
    imagen: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&auto=format&fit=crop&q=60",
    descripcion: "Réplica en miniatura a escala de la camiseta titular clásica montada sobre una base de madera maciza."
  },
  {
    nombre: "Set de Tarjetas Ilustradas Históricas",
    categoria: "coleccionables",
    precio: 44900,
    imagen: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=60",
    descripcion: "Colección de 12 tarjetas ilustradas que repasan hitos y momentos memorables del club verdolaga."
  },
  {
    nombre: "Escudo Decorativo 3D Multicapa",
    categoria: "coleccionables",
    precio: 129900,
    imagen: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&auto=format&fit=crop&q=60",
    descripcion: "Pieza artesanal de pared en madera calada con acabado en relieve y colores verde y blanco brillantes."
  },
  {
    nombre: "Réplica de Trofeo de Colección",
    categoria: "coleccionables",
    precio: 189900,
    imagen: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=500&auto=format&fit=crop&q=60",
    descripcion: "Figura decorativa en resina con baño plateado en homenaje a los trofeos internacionales más recordados."
  }
];

async function main() {
  console.log('🌱 Iniciando carga de datos en la base de datos (Seed)...');

  // 1. Limpiar datos existentes respetando orden de relaciones
  await prisma.pedido.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.user.deleteMany();

  // 2. Crear usuarios de prueba con contraseña hasheada
  const passwordHash = await bcrypt.hash('Verdolaga2026*', 10);

  const admin = await prisma.user.create({
    data: {
      nombre: 'Administrador Tienda Verdolaga',
      email: 'admin@tiendaverdolaga.com',
      password: passwordHash,
      telefono: '3001234567',
      role: Role.ADMIN,
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      nombre: 'Hincha Verdolaga',
      email: 'hincha@gmail.com',
      password: passwordHash,
      telefono: '3109876543',
      role: Role.USER,
    },
  });

  console.log(`👤 Usuarios creados:`);
  console.log(`   - Admin: ${admin.email} (rol: ${admin.role})`);
  console.log(`   - User:  ${normalUser.email} (rol: ${normalUser.role})`);
  console.log(`   - Contraseña de prueba para ambos: Verdolaga2026*`);

  // 3. Crear los 30 productos de Tienda Verdolaga
  for (const prod of productosSeed) {
    await prisma.producto.create({
      data: prod,
    });
  }

  const totalProductos = await prisma.producto.count();
  console.log(`📦 Catálogo cargado exitosamente: ${totalProductos} productos.`);

  // 4. Crear un pedido de prueba inicial
  const primerProducto = await prisma.producto.findFirst();
  if (primerProducto) {
    await prisma.pedido.create({
      data: {
        userId: normalUser.id,
        productoId: primerProducto.id,
        cantidad: 1,
        notas: 'Entrega en portería. Pedido inicial de prueba de la Entrega 3.',
      },
    });
    console.log(`🛒 Pedido de prueba generado para el usuario '${normalUser.nombre}'.`);
  }

  console.log('✅ Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
