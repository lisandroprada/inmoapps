# Simulador de Créditos UVA

Una aplicación web moderna para simular y analizar créditos UVA, desarrollada con Vue 3 y Tailwind CSS.

## Características

- 🏦 Simulador de créditos UVA con sistema francés
- 📈 Proyección de cuotas con inflación ajustable
- 📊 Gráficos interactivos de evolución de cuotas
- 💰 Soporte para clientes y no clientes con tasas diferenciadas
- 🌡️ Indicadores financieros en tiempo real
- 🌓 Soporte para modo oscuro
- 📱 Diseño responsivo

## Tecnologías Utilizadas

- Vue 3 con Composition API
- Tailwind CSS para estilos
- Chart.js para visualizaciones
- Vue Router para navegación
- Pinia para gestión de estado
- Axios para peticiones HTTP

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/lisandroprada/inmoapps.git
cd creditos-uva-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
creditos-uva-app/
├── src/
│   ├── assets/         # Recursos estáticos
│   ├── components/     # Componentes Vue
│   │   └── layout/     # Componentes de layout
│   ├── views/          # Páginas de la aplicación
│   ├── stores/         # Stores de Pinia
│   ├── router/         # Configuración de rutas
│   ├── App.vue         # Componente raíz
│   └── main.js         # Punto de entrada
├── public/             # Archivos públicos
└── package.json        # Dependencias y scripts
```

## Funcionalidades Principales

### Simulador de Créditos
- Monto del préstamo configurable
- Plazos disponibles: 5, 10 y 20 años
- Tasas diferenciadas:
  * Clientes: 3.5% TNA
  * No clientes: 8% TNA
- Cálculo automático de equivalencia en UVAs
- Cuota inicial en pesos y UVAs
- Proyección de cuotas a 24 meses

### Proyección con Inflación
- Inflación anual ajustable (0-500%)
- Cálculo automático de inflación mensual equivalente
- Actualización en tiempo real del gráfico de proyección
- Visualización de evolución de cuotas según inflación

### Indicadores Financieros
- Valor UVA actualizado
- Fecha de última actualización
- Integración con API de datos financieros
- Actualización automática de indicadores

### Interfaz de Usuario
- Diseño moderno y responsivo
- Modo oscuro/claro
- Validación de inputs en tiempo real
- Gráficos interactivos y dinámicos

## Uso del Simulador

1. Ingresar el monto del préstamo deseado
2. Seleccionar si es cliente del banco
3. Elegir el plazo del préstamo
4. Ajustar la inflación estimada según el escenario deseado
5. Ver los resultados actualizados automáticamente:
   - Monto en UVAs
   - Cuota inicial
   - Proyección de cuotas a 24 meses

## Contribuir

1. Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto

Lisandro Prada - [@lisandroprada](https://github.com/lisandroprada)
Link del Proyecto: [https://github.com/lisandroprada/inmoapps](https://github.com/lisandroprada/inmoapps)
