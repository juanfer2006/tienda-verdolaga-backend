import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Los 30 productos reales de la Entrega 1 de Tienda Verdolaga
const productosSeed = [
  // --- 1. CAMISETAS (10 productos) ---
  {
    nombre: "Camiseta Verde Cl?sica, temporada 2011",
    categoria: "camisetas",
    precio: 249900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqPCRB-V_Lq1tjBTEsCF-5WnI57uUwhRhBGJ-A1Uct2KtHF3MKjQIsbYE&s=10",
    descripcion: "Dise?o tradicional con las cl?sicas franjas verdes y blancas, confeccionada en tejido transpirable."
  },
  {
    nombre: "Camiseta Blanca Verdolaga, temporada 2026",
    categoria: "camisetas",
    precio: 239900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuD2t_5jGZJY7KslmBIaGGcRAyYA9kfCNPxeKF5qYkFOs0A9Q7C7sI24jg&s=10",
    descripcion: "Edici?n visitante en color blanco con detalles verdes y escudo bordado de alta definici?n."
  },
  {
    nombre: "Camiseta Alternativa Negra, temporada 2025",
    categoria: "camisetas",
    precio: 229900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcaWFrHZRkvZ9WcwtIuhuwZroy-3i4blD3cKonW9alP_v4hsbMsMgO1_g3&s=10",
    descripcion: "Estilo moderno en fondo negro con detalles dorados."
  },
  {
    nombre: "Camiseta Retro ?poca Dorada, temporada 1989",
    categoria: "camisetas",
    precio: 219900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpdIZv4SfFq1oXwNxAZ-CZulrr373_VaYJfzPvQHzSOA&s=10",
    descripcion: "Dise?o de corte cl?sico con cuello tipo polo."
  },
  {
    nombre: "Camiseta de Entrenamiento",
    categoria: "camisetas",
    precio: 159900,
    imagen: "https://peopleplays.vtexassets.com/arquivos/ids/579530-800-auto?v=639059970442700000&width=800&height=auto&aspect=true",
    descripcion: "Prenda deportiva ligera con tecnolog?a de secado r?pido, pensada para la actividad f?sica diaria."
  },
  {
    nombre: "Camiseta Edici?n Homenaje Chapecoense, temporada 2026",
    categoria: "camisetas",
    precio: 259900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw80ICTxzR7iaAoFq6daJOSZrwXhrTeMujWV2HbPOhuWWNIWwc9fJm2VI&s=10",
    descripcion: "Edici?n especial homenaje a la tragedia de Chapecoense."
  },
  {
    nombre: "Camiseta con Firma Hist?rica de Alexis Henr?quez, temporada 2015",
    categoria: "camisetas",
    precio: 249900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ93Du7cPYG8g0pRAF8cpfYD5dw1m2FvDqpTZXAeK9QDYNiw1-gi_QLoY&s=10",
    descripcion: "Camiseta del legendario Alexis Henr?quez, temporada 2015."
  },
  {
    nombre: "Camiseta Coleccionable visitante, temporada 2004",
    categoria: "camisetas",
    precio: 239900,
    imagen: "https://fuegoverde.com.co/wp-content/uploads/2022/04/nacional-2004.jpg",
    descripcion: "Camiseta visitante del a?o 2004, a?o en el que el verde disput? dos finales de liga."
  },
  {
    nombre: "Camiseta Urbana Blow Up",
    categoria: "camisetas",
    precio: 129900,
    imagen: "https://velocitysavage.com/cdn/shop/files/camiseta-atletico-nacional-verde-edicion-blow-up-4276987.png?v=1772489527",
    descripcion: "Camiseta con estilo para lucir los colores en cualquier momento."
  },
  {
    nombre: "Camiseta Edici?n Leyenda del Arco Franco Armani, temporada 2016",
    categoria: "camisetas",
    precio: 229900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjgmeFYX7Zajod5pwrOZ9EPkKJHm0e75zhlzETlX2m9RpiTCfvmAqucT8U&s=10",
    descripcion: "Buzo de arquero manga larga morada."
  },

  // --- 2. ACCESORIOS (10 productos) ---
  {
    nombre: "Gorra Verde Urbana",
    categoria: "accesorios",
    precio: 69900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7iAltBycit9fNYL9YXzvtVocwBh3POZinJ3dHEe9R2w&s=10",
    descripcion: "Gorra con visera curva, broche ajustable y escudo verdolaga bordado en relieve."
  },
  {
    nombre: "Bufanda Verdolaga",
    categoria: "accesorios",
    precio: 45000,
    imagen: "https://fuegoverde.com.co/wp-content/uploads/2019/06/Bufanda-Tejida-Atletico-Nacional-Doble-Fax-Lana-Acrilica-3.jpg",
    descripcion: "Bufanda negra."
  },
  {
    nombre: "Termo Met?lico Verdolaga",
    categoria: "accesorios",
    precio: 55000,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU5Tqb0VdfLb9vHv137MLqd_JgeyPL-PNTBg2gk70V4MGrh0O3FcmQKfU&s=10",
    descripcion: "Botella de acero inoxidable con tapa herm?tica para mantener tus bebidas a temperatura ideal."
  },
  {
    nombre: "Llavero Escudo Met?lico",
    categoria: "accesorios",
    precio: 24900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTogk9TpZ4nqljyZITva2fKibGQaXLaTLpAYV5XUrwy3VrvWBZ9KrVsoM&s=10",
    descripcion: "Llavero de aleaci?n met?lica con acabado esmaltado de alta durabilidad y argolla reforzada."
  },
  {
    nombre: "Gorra campeon liga 2024",
    categoria: "accesorios",
    precio: 74900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI_ZjkYwJ-1OeADZmmPxYWP5QbWkDI19imEgawZZbCH8G2gWugDP7YFII&s=10",
    descripcion: "Gorra blanca de los festejos del t?tulo de liga 2024."
  },
  {
    nombre: "Taza Cer?mica Verdolaga",
    categoria: "accesorios",
    precio: 29900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOnhCpjSqjs41m7Q9hGs_pvlItdZqWKH8hN-QFCabweCTskSR8OJDNsA&s=10",
    descripcion: "Taza de cer?mica con la mascota del equipo y detalles verdes."
  },
  {
    nombre: "Mochila Deportiva de Viaje",
    categoria: "accesorios",
    precio: 119900,
    imagen: "https://http2.mlstatic.com/D_Q_NP_2X_824672-MCO83591749488_042025-T.webp",
    descripcion: "Morral blanco perfecto para viajes."
  },
  {
    nombre: "Set de Pines Esmaltados (3 Piezas)",
    categoria: "accesorios",
    precio: 34900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm4ycloYqzwz_BErDbAfoPl_rSUrPbiqHYibvQf0xE3w&s=10",
    descripcion: "Juego de 3 prendedores met?licos esmaltados para personalizar camisetas, chaquetas o mochilas."
  },
  {
    nombre: "Billetera de Cuero Sint?tico Verdolaga",
    categoria: "accesorios",
    precio: 49900,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_700798-MCO114183698145_072026-O.webp",
    descripcion: "Billetera compacta con grabado sutil del escudo, tarjetero y compartimento para billetes."
  },
  {
    nombre: "Pulsera de Acero Inoxidable y Cord?n",
    categoria: "accesorios",
    precio: 21900,
    imagen: "https://mktaddi.vteximg.com.br/arquivos/ids/87294751/85848d3f-97bd-43e6-9a62-d7a84ab6e634-PCD73G___36dc99956e244628ca05b4e835543821.jpg?v=639136076353300000",
    descripcion: "Brazalete ajustable elaborado con cord?n de alta resistencia y placa grabada en l?ser."
  },

  // --- 3. COLECCIONABLES (10 productos) ---
  {
    nombre: "Bandera Gigante 'Rey de copas'",
    categoria: "coleccionables",
    precio: 49900,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNn7VoxqjGZRDeWTzBL2g2by4PuJxVoM_x7p8K9LygoTK9yZRSnhUycNFa&s=10",
    descripcion: "Bandera resistente para alentar con orgullo."
  },
  {
    nombre: "Bal?n Coleccionable vintage",
    categoria: "coleccionables",
    precio: 85000,
    imagen: "https://lacanchatiendadeportiva.com.co/cdn/shop/files/rn-image_picker_lib_temp_e1c08d2a-b180-43d8-9f4b-e6ddc02c40a0.jpg?v=1764959849",
    descripcion: "Bal?n decorativo conmemorativo con detalles dorados."
  },
  {
    nombre: "Bal?n final liga 2024",
    categoria: "coleccionables",
    precio: 99000,
    imagen: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60",
    descripcion: "Bal?n de edici?n conmemorativa del t?tulo liguero 2024."
  },
  {
    nombre: "Cuadro decorativo campeon libertadores",
    categoria: "coleccionables",
    precio: 115000,
    imagen: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=60",
    descripcion: "Cuadro decorativo conmemorativo del t?tulo de la Libertadores."
  },
  {
    nombre: "balon atletico nacional",
    categoria: "coleccionables",
    precio: 92000,
    imagen: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500&auto=format&fit=crop&q=60",
    descripcion: "Bal?n representativo del club con dise?o cl?sico y detalles del escudo."
  },
  {
    nombre: "Placa Decorativa Met?lica",
    categoria: "coleccionables",
    precio: 59900,
    imagen: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60",
    descripcion: "Placa de aluminio estilo vintage con bordes envejecidos para decorar habitaciones o salas de entretenimiento."
  },
  {
    nombre: "Placa decorativa 'soy del verde, soy feliz'",
    categoria: "coleccionables",
    precio: 54000,
    imagen: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&auto=format&fit=crop&q=60",
    descripcion: "Placa decorativa inspirada en la energ?a y alegr?a de la hinchada verdolaga."
  },
  {
    nombre: "?lbum hist?rico tricampe?n",
    categoria: "coleccionables",
    precio: 87000,
    imagen: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=60",
    descripcion: "?lbum hist?rico conmemorativo del tricampeonato del club."
  },
  {
    nombre: "Escudo Decorativo 3D Multicapa",
    categoria: "coleccionables",
    precio: 129900,
    imagen: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&auto=format&fit=crop&q=60",
    descripcion: "Pieza artesanal de pared en madera calada con acabado en relieve y colores verde y blanco brillantes."
  },
  {
    nombre: "R?plica de Trofeo de Colecci?n libertadores 2016",
    categoria: "coleccionables",
    precio: 189900,
    imagen: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=500&auto=format&fit=crop&q=60",
    descripcion: "Figura decorativa en resina con ba?o plateado en homenaje a la conquista internacional del 2016."
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
