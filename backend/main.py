from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
import json
from datetime import datetime, timedelta
import logging
import traceback
import numpy as np

# Configurar logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataPoint(BaseModel):
    fecha: str
    valor: float

    @validator('fecha')
    def validar_fecha(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
            return v
        except ValueError:
            raise ValueError('El formato de fecha debe ser YYYY-MM-DD')

    @validator('valor')
    def validar_valor(cls, v):
        if not isinstance(v, (int, float)):
            raise ValueError('El valor debe ser numérico')
        return float(v)

class ProyeccionRequest(BaseModel):
    datos_mensuales: List[DataPoint]
    datos_interanuales: List[DataPoint]
    periodos: Optional[int] = 12

    @validator('datos_mensuales', 'datos_interanuales')
    def validar_datos(cls, v):
        if not v:
            raise ValueError('La lista de datos no puede estar vacía')
        return v

    @validator('periodos')
    def validar_periodos(cls, v):
        if v <= 0:
            raise ValueError('El número de períodos debe ser positivo')
        if v > 60:
            raise ValueError('El número de períodos no puede ser mayor a 60')
        return v

def calcular_tendencia_reciente(datos_mensuales, ventana=3):
    """Calcula la tendencia de los últimos meses"""
    if len(datos_mensuales) < ventana:
        return None
    
    valores_recientes = [d.valor for d in datos_mensuales[-ventana:]]
    return np.mean(valores_recientes)

@app.post("/api/proyectar")
async def proyectar_inflacion(request: ProyeccionRequest):
    try:
        logger.info("Nueva solicitud de proyección recibida")
        
        # Ordenar datos por fecha
        datos_mensuales = sorted(request.datos_mensuales, key=lambda x: x.fecha)
        datos_interanuales = sorted(request.datos_interanuales, key=lambda x: x.fecha)
        
        # Obtener últimos valores
        ultimo_valor_mensual = datos_mensuales[-1].valor
        ultimo_valor_interanual = datos_interanuales[-1].valor
        fecha_ultima = datetime.strptime(datos_mensuales[-1].fecha, "%Y-%m-%d")
        
        logger.info(f"Último valor mensual: {ultimo_valor_mensual}%")
        logger.info(f"Último valor interanual: {ultimo_valor_interanual}%")
        
        # Calcular tendencia reciente (últimos 3 meses)
        tendencia_mensual = calcular_tendencia_reciente(datos_mensuales)
        logger.info(f"Tendencia mensual (últimos 3 meses): {tendencia_mensual}%")
        
        # Calcular tasa mensual proyectada
        # Usamos un promedio ponderado entre:
        # - La tendencia mensual reciente (peso: 0.6)
        # - La inflación interanual mensualizada (peso: 0.4)
        tasa_mensual_tendencia = tendencia_mensual / 100
        tasa_mensual_interanual = (pow(1 + ultimo_valor_interanual/100, 1/12) - 1)
        
        tasa_mensual_proyectada = (tasa_mensual_tendencia * 0.6) + (tasa_mensual_interanual * 0.4)
        logger.info(f"Tasa mensual proyectada: {tasa_mensual_proyectada * 100}%")
        
        # Calcular proyecciones
        proyecciones = []
        valor_base = ultimo_valor_interanual  # Usamos el último valor interanual como base
        tasa_acumulada = 1  # Para llevar el acumulado de las tasas mensuales
        
        for i in range(request.periodos):
            fecha_nueva = fecha_ultima + timedelta(days=30 * (i + 1))
            
            # Aplicamos la tasa mensual proyectada con un factor de aceleración
            factor_aceleracion = 1 + (i * 0.02)  # Incrementa 2% cada mes
            tasa_ajustada = tasa_mensual_proyectada * factor_aceleracion
            
            # Acumulamos la tasa mensual
            tasa_acumulada *= (1 + tasa_ajustada)
            
            # Calculamos el valor interanual proyectado
            valor_proyectado = ultimo_valor_interanual * tasa_acumulada
            
            proyeccion = {
                "fecha": fecha_nueva.strftime("%Y-%m-%d"),
                "valor": round(valor_proyectado, 2),
                "valor_inferior": round(valor_proyectado * 0.95, 2),
                "valor_superior": round(valor_proyectado * 1.05, 2)
            }
            logger.debug(f"Proyección {i+1}: {proyeccion}")
            proyecciones.append(proyeccion)

        # La inflación anual proyectada ya está calculada en el último valor
        inflacion_anual_proyectada = proyecciones[-1]["valor"]
        logger.info(f"Inflación anual proyectada: {inflacion_anual_proyectada}%")

        respuesta = {
            "proyecciones": proyecciones,
            "inflacion_anual_proyectada": round(inflacion_anual_proyectada, 2)
        }
        return respuesta

    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    logger.info("Iniciando servidor...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
