// src/index.ts
async function obtenerRSS(url: string): Promise<string> {
  try {
    // Aquí implementarás la lógica para obtener el RSS
    console.log(`Obteniendo RSS de: ${url}`);
    return `Contenido RSS de ${url}`;
  } catch (error) {
    console.error('Error al obtener RSS:', error);
    throw error;
  }
}

// Función principal
async function main() {
  const urlElPais = 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada';
  const contenido = await obtenerRSS(urlElPais);
  console.log('Proyecto RSS El País iniciado');
  console.log(contenido);
}

// Ejecutar la función principal
main().catch((error) => console.error('Error en la aplicación:', error));
