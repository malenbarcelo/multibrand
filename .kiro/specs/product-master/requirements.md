# Documento de Requerimientos — Maestro de Productos

## Introducción

El módulo Maestro de Productos es el componente central de la aplicación de gestión de precios de importación. Administra la lista maestra de productos importados, incluyendo datos del proveedor, precios FOB, unidades de medida, peso, volumen, y cálculos derivados de costeo y precio de venta. Cada ítem pertenece a una sucursal y un proveedor, y el sistema calcula automáticamente costos estimados y precios de venta en moneda local (ARS) según factores de costeo configurados por proveedor (por volumen o por coeficiente).

## Glosario

- **Sistema_Maestro**: Módulo del sistema que gestiona la lista maestra de productos importados.
- **Ítem**: Registro individual de producto en el maestro, identificado por código de ítem y proveedor.
- **Proveedor**: Entidad proveedora de productos importados, con moneda y método de costeo asociados.
- **Sucursal**: Unidad de negocio a la que pertenecen los ítems y los factores de costeo.
- **FOB**: Precio Free On Board por unidad de medida del producto, en la moneda del proveedor.
- **UM**: Unidad de medida del producto (ej: caja, pieza, docena).
- **Unidades_por_UM**: Cantidad de unidades individuales contenidas en una unidad de medida.
- **FOB_Unitario**: Precio FOB dividido por las unidades por UM.
- **Costeo_por_Volumen**: Método de cálculo de costo que utiliza factores basados en volumen físico (flete, seguro, despacho, gastos por volumen, gastos por porcentaje de precio).
- **Costeo_por_Coeficiente**: Método de cálculo de costo que aplica un coeficiente multiplicador al precio FOB.
- **Costo_Estimado_por_UM**: Costo estimado del producto por unidad de medida, calculado según el método de costeo del proveedor.
- **Costo_Estimado_Unitario**: Costo estimado por unidad individual (Costo_Estimado_por_UM / Unidades_por_UM).
- **Precio_Sugerido**: Precio de venta sugerido por unidad, calculado aplicando el margen de venta al Costo_Estimado_Unitario.
- **Factor_de_Precio_Especial**: Multiplicador opcional por ítem que ajusta el precio sugerido.
- **Precio_de_Venta_ARS**: Precio de venta final en pesos argentinos, redondeado hacia arriba al entero más cercano.
- **Margen**: Porcentaje de ganancia calculado como ((Precio_de_Venta_ARS / (Costo_Estimado_Unitario × Tipo_de_Cambio)) - 1) × 100.
- **Tipo_de_Cambio**: Último tipo de cambio registrado para la moneda del proveedor en la sucursal.
- **Número_de_Lista**: Versión de la lista de precios del proveedor; se usa para filtrar por la última lista vigente.
- **Eliminación_Lógica**: Mecanismo de eliminación que marca el campo `enabled` como 0 en lugar de borrar el registro.

## Requerimientos

### Requerimiento 1: Visualización de la lista maestra

**Historia de Usuario:** Como usuario, quiero ver la lista maestra de productos con sus datos principales y cálculos de costeo, para poder consultar rápidamente la información de precios.

#### Criterios de Aceptación

1. WHEN el usuario accede al módulo Maestro, THE Sistema_Maestro SHALL mostrar una tabla con las columnas: Proveedor, Item, Descripción, UM, UM por caja, Peso (kg), Volumen (m3), FOB/UM, FOB/unidad, Moneda, Costo estimado por unidad, Precio de venta (ARS) y Margen %.
2. THE Sistema_Maestro SHALL mostrar únicamente los ítems habilitados (enabled = 1) y con el último Número_de_Lista por proveedor y sucursal.
3. THE Sistema_Maestro SHALL ordenar los ítems por proveedor ascendente y luego por ítem ascendente de forma predeterminada.
4. THE Sistema_Maestro SHALL cargar los datos de la sucursal activa en la sesión del usuario.

### Requerimiento 2: Paginación por scroll infinito

**Historia de Usuario:** Como usuario, quiero que la tabla cargue más ítems automáticamente al hacer scroll hacia abajo, para navegar grandes volúmenes de datos sin cambiar de página.

#### Criterios de Aceptación

1. THE Sistema_Maestro SHALL cargar una página inicial de 25 ítems al acceder al módulo.
2. WHEN el usuario hace scroll hacia abajo y alcanza el final de la tabla, THE Sistema_Maestro SHALL cargar la siguiente página de 25 ítems y agregarlos al final de la tabla.
3. WHILE una página ya fue cargada, THE Sistema_Maestro SHALL evitar cargar esa misma página nuevamente.
4. WHILE no existan más páginas disponibles, THE Sistema_Maestro SHALL dejar de solicitar datos adicionales al hacer scroll.

### Requerimiento 3: Filtrado de ítems

**Historia de Usuario:** Como usuario, quiero filtrar la lista maestra por proveedor, ítem y descripción, para encontrar productos específicos rápidamente.

#### Criterios de Aceptación

1. WHEN el usuario selecciona un proveedor en el filtro, THE Sistema_Maestro SHALL mostrar únicamente los ítems del proveedor seleccionado.
2. WHEN el usuario ingresa texto en el filtro de ítem, THE Sistema_Maestro SHALL mostrar los ítems cuyo código contenga el texto ingresado (búsqueda parcial).
3. WHEN el usuario ingresa texto en el filtro de descripción, THE Sistema_Maestro SHALL mostrar los ítems cuya descripción contenga el texto ingresado (búsqueda parcial).
4. WHEN el usuario aplica un filtro, THE Sistema_Maestro SHALL reiniciar la paginación a la página 1 y recargar los datos.
5. WHEN el usuario presiona el botón "Quitar filtros", THE Sistema_Maestro SHALL limpiar todos los filtros y recargar la lista completa desde la página 1.

### Requerimiento 4: Creación de ítems

**Historia de Usuario:** Como usuario, quiero crear nuevos ítems en el maestro de productos, para agregar productos a la lista de precios.

#### Criterios de Aceptación

1. WHEN el usuario presiona el botón "Crear item", THE Sistema_Maestro SHALL abrir el formulario de creación con todos los campos vacíos y el selector de proveedor habilitado.
2. THE Sistema_Maestro SHALL requerir los siguientes campos obligatorios: Proveedor, Item, Descripción, Precio por UM (FOB), UM, UM por caja, Volumen por caja (solo si el costeo es por volumen), Marca, Origen y Roturas.
3. THE Sistema_Maestro SHALL permitir los siguientes campos opcionales: Peso por caja (kg), Factor de precio especial y Observaciones.
4. WHEN el usuario completa los campos de costeo requeridos, THE Sistema_Maestro SHALL calcular y mostrar en tiempo real los valores de costeo y precio de venta.
5. IF el usuario intenta guardar un ítem con un código que ya existe para el mismo proveedor, THEN THE Sistema_Maestro SHALL mostrar un mensaje de error indicando que el ítem ya existe en la lista de precios de ese proveedor.
6. IF el usuario intenta guardar sin completar todos los campos obligatorios, THEN THE Sistema_Maestro SHALL mostrar un mensaje de error indicando que debe completar los campos marcados con *.
7. WHEN el ítem se crea exitosamente, THE Sistema_Maestro SHALL mostrar un mensaje de confirmación y recargar la tabla.

### Requerimiento 5: Edición de ítems

**Historia de Usuario:** Como usuario, quiero editar ítems existentes del maestro, para actualizar precios y datos de productos.

#### Criterios de Aceptación

1. WHEN el usuario presiona el ícono de edición o hace doble clic en una fila, THE Sistema_Maestro SHALL abrir el formulario de edición con los datos del ítem seleccionado precargados.
2. WHILE el formulario de edición está abierto, THE Sistema_Maestro SHALL deshabilitar el selector de proveedor para evitar cambios de proveedor.
3. WHEN el usuario modifica campos de costeo, THE Sistema_Maestro SHALL recalcular y mostrar en tiempo real los valores de costeo y precio de venta.
4. IF el usuario cambia el código de ítem a uno que ya existe para el mismo proveedor, THEN THE Sistema_Maestro SHALL mostrar un mensaje de error indicando que el ítem ya existe.
5. WHEN la edición se guarda exitosamente, THE Sistema_Maestro SHALL mostrar un mensaje de confirmación y recargar la tabla.

### Requerimiento 6: Eliminación lógica de ítems

**Historia de Usuario:** Como usuario, quiero eliminar ítems del maestro, para mantener la lista de precios actualizada sin perder datos históricos.

#### Criterios de Aceptación

1. WHEN el usuario presiona el ícono de eliminar en una fila o el botón "Eliminar item" en el formulario de edición, THE Sistema_Maestro SHALL mostrar un popup de confirmación indicando el ítem y proveedor a eliminar.
2. WHEN el usuario confirma la eliminación, THE Sistema_Maestro SHALL realizar una Eliminación_Lógica estableciendo el campo enabled a 0.
3. WHEN la eliminación se ejecuta exitosamente, THE Sistema_Maestro SHALL mostrar un mensaje de confirmación y recargar la tabla.
4. IF la eliminación falla, THEN THE Sistema_Maestro SHALL mostrar un mensaje de error.

### Requerimiento 7: Cálculo de costo estimado por volumen

**Historia de Usuario:** Como usuario, quiero que el sistema calcule automáticamente el costo estimado de un producto cuando el proveedor usa costeo por volumen, para conocer el costo de importación real.

#### Criterios de Aceptación

1. WHILE el proveedor del ítem tiene método de costeo "volume", THE Sistema_Maestro SHALL calcular el flete marítimo por UM como: flete × volumen / UM_por_caja, donde volumen se expresa en la unidad configurada del factor (m3 o ft3).
2. WHILE el proveedor del ítem tiene método de costeo "volume", THE Sistema_Maestro SHALL calcular el CIF por UM como: (FOB + flete_por_UM) × (1 + seguro).
3. WHILE el proveedor del ítem tiene método de costeo "volume", THE Sistema_Maestro SHALL calcular los derechos de aduana por UM como: CIF × porcentaje_despacho.
4. WHILE el proveedor del ítem tiene método de costeo "volume", THE Sistema_Maestro SHALL calcular los gastos por volumen por UM como: total_gastos_volumen × volumen / UM_por_caja.
5. WHILE el proveedor del ítem tiene método de costeo "volume", THE Sistema_Maestro SHALL calcular los gastos por porcentaje de precio por UM como: CIF × (agente_aduana + transferencia).
6. WHILE el proveedor del ítem tiene método de costeo "volume", THE Sistema_Maestro SHALL calcular el Costo_Estimado_por_UM como: CIF + derechos_aduana + gastos_volumen + gastos_porcentaje_precio.
7. THE Sistema_Maestro SHALL calcular el Costo_Estimado_Unitario como: Costo_Estimado_por_UM / Unidades_por_UM.

### Requerimiento 8: Cálculo de costo estimado por coeficiente

**Historia de Usuario:** Como usuario, quiero que el sistema calcule automáticamente el costo estimado cuando el proveedor usa costeo por coeficiente, para simplificar el cálculo de costos.

#### Criterios de Aceptación

1. WHILE el proveedor del ítem tiene método de costeo "coeficient", THE Sistema_Maestro SHALL calcular el Costo_Estimado_por_UM como: FOB × (1 + coeficiente).
2. WHILE el proveedor del ítem tiene método de costeo "coeficient", THE Sistema_Maestro SHALL calcular el Costo_Estimado_Unitario como: Costo_Estimado_por_UM / Unidades_por_UM.
3. WHILE el proveedor del ítem tiene método de costeo "coeficient", THE Sistema_Maestro SHALL mostrar el campo "Factor (%)" y ocultar los campos de factores por volumen en el formulario.

### Requerimiento 9: Cálculo de precio de venta

**Historia de Usuario:** Como usuario, quiero que el sistema calcule el precio de venta sugerido y el precio final en moneda local, para definir precios de venta competitivos.

#### Criterios de Aceptación

1. THE Sistema_Maestro SHALL calcular el Precio_Sugerido como: Costo_Estimado_Unitario × (1 + margen_de_venta_porcentaje).
2. THE Sistema_Maestro SHALL calcular el precio sugerido en moneda local como: techo entero de (Precio_Sugerido × Tipo_de_Cambio).
3. WHERE el ítem tiene un Factor_de_Precio_Especial definido, THE Sistema_Maestro SHALL calcular el precio de venta como: Precio_Sugerido × Factor_de_Precio_Especial.
4. WHERE el ítem no tiene Factor_de_Precio_Especial, THE Sistema_Maestro SHALL usar el Precio_Sugerido como precio de venta.
5. THE Sistema_Maestro SHALL calcular el Precio_de_Venta_ARS como: techo entero de (precio_de_venta × Tipo_de_Cambio).
6. THE Sistema_Maestro SHALL calcular el Margen como: ((Precio_de_Venta_ARS / (Costo_Estimado_Unitario × Tipo_de_Cambio)) - 1) × 100.

### Requerimiento 10: Descarga a Excel

**Historia de Usuario:** Como usuario, quiero descargar la lista maestra a un archivo Excel, para compartir y analizar los datos fuera del sistema.

#### Criterios de Aceptación

1. WHEN el usuario presiona el botón "Descargar lista", THE Sistema_Maestro SHALL generar un archivo Excel con las columnas: Proveedor, Item, Descripción, UM, UM/Caja, Peso Neto (kg), Volumen/Caja (m3), FOB, Moneda, Costo/UN, Precio/UN, TC y Precio/UN en moneda local.
2. THE Sistema_Maestro SHALL aplicar los filtros activos al momento de la descarga para generar el archivo.
3. THE Sistema_Maestro SHALL ordenar los datos del archivo por proveedor ascendente y luego por ítem ascendente.
4. THE Sistema_Maestro SHALL nombrar el archivo descargado como "Lista de precios.xlsx".

### Requerimiento 11: Visualización de factores de costeo

**Historia de Usuario:** Como usuario, quiero poder ver los factores de costeo del proveedor seleccionado desde el formulario de edición/creación, para entender cómo se compone el costo.

#### Criterios de Aceptación

1. WHEN el usuario selecciona un proveedor en el formulario, THE Sistema_Maestro SHALL habilitar el botón "VER FACTORES".
2. WHEN el usuario presiona "VER FACTORES" y el proveedor usa costeo por volumen, THE Sistema_Maestro SHALL mostrar un popup con los datos de factores por volumen incluyendo volumen estándar, contenedor estándar, moneda y tipo de cambio.
3. WHEN el usuario presiona "VER FACTORES" y el proveedor usa costeo por coeficiente, THE Sistema_Maestro SHALL mostrar un popup con los datos de factores por coeficiente.

### Requerimiento 12: Número de lista (versionado)

**Historia de Usuario:** Como usuario, quiero que el sistema gestione números de lista por proveedor, para mantener un historial de versiones de listas de precios.

#### Criterios de Aceptación

1. THE Sistema_Maestro SHALL filtrar por defecto los ítems que tengan el último Número_de_Lista por proveedor y sucursal.
2. THE Sistema_Maestro SHALL determinar el último Número_de_Lista mediante una subconsulta que obtiene el máximo list_number para cada combinación de proveedor y sucursal.

### Requerimiento 13: Cálculo de FOB unitario

**Historia de Usuario:** Como usuario, quiero ver el precio FOB por unidad individual, para comparar costos entre productos con diferentes unidades de medida.

#### Criterios de Aceptación

1. THE Sistema_Maestro SHALL calcular el FOB_Unitario como: FOB / Unidades_por_UM.
2. THE Sistema_Maestro SHALL mostrar el FOB_Unitario en la columna "FOB / unidad" de la tabla principal con 3 decimales.
