-- 1. Tabla de Vehiculos
CREATE TABLE IF NOT EXISTS public.vehiculos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    icono VARCHAR(50) NOT NULL
);

-- Semilla de Vehiculos (Se ignoran si ya existen)
INSERT INTO public.vehiculos (nombre, icono) VALUES 
('Utilitario', 'car'),
('Furgoneta', 'truck'),
('Moto', 'bike')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Tabla de Servicios (Actualizada con vehiculo_id)
CREATE TABLE IF NOT EXISTS public.servicios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    duracion_minutos INT NOT NULL,
    activo BOOLEAN DEFAULT true,
    caracteristicas JSONB DEFAULT '[]'::jsonb,
    vehiculo_id UUID REFERENCES public.vehiculos(id) ON DELETE CASCADE
);

-- Si la tabla servicios ya existía, agregamos la columna vehiculo_id
ALTER TABLE public.servicios ADD COLUMN IF NOT EXISTS vehiculo_id UUID REFERENCES public.vehiculos(id) ON DELETE CASCADE;

-- Como ya tenías servicios viejos sin vehiculo_id, los asociamos por defecto al primer vehículo (Utilitario) 
-- para no romper nada, y luego puedes borrarlos o editarlos desde Supabase.
UPDATE public.servicios 
SET vehiculo_id = (SELECT id FROM public.vehiculos WHERE nombre = 'Utilitario' LIMIT 1) 
WHERE vehiculo_id IS NULL;

-- 3. Tabla de Días de Trabajo
CREATE TABLE IF NOT EXISTS public.dias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE,
    abierto BOOLEAN DEFAULT true,
    hora_inicio TIME DEFAULT '09:00:00',
    hora_fin TIME DEFAULT '18:00:00'
);

-- 4. Tabla de Turnos
CREATE TABLE IF NOT EXISTS public.turnos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dia_id UUID REFERENCES public.dias(id) ON DELETE CASCADE,
    hora TIME NOT NULL,
    cliente_nombre VARCHAR(150) NOT NULL,
    cliente_telefono VARCHAR(50) NOT NULL,
    servicio_id UUID REFERENCES public.servicios(id),
    estado VARCHAR(20) DEFAULT 'pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función 1: crear_turno
CREATE OR REPLACE FUNCTION public.crear_turno(
  p_fecha DATE,
  p_hora TIME,
  p_cliente VARCHAR,
  p_telefono VARCHAR,
  p_servicio_id UUID
)
RETURNS public.turnos
LANGUAGE plpgsql
AS $$
DECLARE
  v_dia_id UUID;
  v_turno public.turnos;
BEGIN
  SELECT id INTO v_dia_id FROM public.dias WHERE fecha = p_fecha;
  IF v_dia_id IS NULL THEN
    INSERT INTO public.dias (fecha, abierto, hora_inicio, hora_fin) VALUES (p_fecha, true, '09:00:00', '18:00:00') RETURNING id INTO v_dia_id;
  END IF;

  INSERT INTO public.turnos (dia_id, hora, cliente_nombre, cliente_telefono, servicio_id)
  VALUES (v_dia_id, p_hora, p_cliente, p_telefono, p_servicio_id)
  RETURNING * INTO v_turno;

  RETURN v_turno;
END;
$$;

-- Función 2: calcular_duracion_servicios
CREATE OR REPLACE FUNCTION public.calcular_duracion_servicios(p_servicio_id UUID)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_duracion INT;
BEGIN
  SELECT duracion_minutos INTO v_duracion FROM public.servicios WHERE id = p_servicio_id;
  RETURN COALESCE(v_duracion, 60);
END;
$$;

-- Función 3: horarios_disponibles
CREATE OR REPLACE FUNCTION public.horarios_disponibles(p_fecha DATE, p_duracion INT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_dia_id UUID;
  v_abierto BOOLEAN;
  v_horarios_ocupados RECORD;
  v_hora_inicio TIME;
  v_hora_fin TIME;
  v_hora_actual TIME;
  v_disponibles JSONB := '[]'::jsonb;
  v_conflicto BOOLEAN;
BEGIN
  SELECT id, abierto, hora_inicio, hora_fin INTO v_dia_id, v_abierto, v_hora_inicio, v_hora_fin FROM public.dias WHERE fecha = p_fecha;
  
  IF v_dia_id IS NOT NULL AND v_abierto = false THEN
    RETURN v_disponibles;
  END IF;

  IF v_dia_id IS NULL THEN
    v_hora_inicio := '09:00:00';
    v_hora_fin := '18:00:00';
  END IF;

  v_hora_actual := v_hora_inicio;

  WHILE v_hora_actual + (p_duracion || ' minutes')::interval <= v_hora_fin LOOP
    v_conflicto := false;
    IF v_dia_id IS NOT NULL THEN
      FOR v_horarios_ocupados IN 
        SELECT t.hora, s.duracion_minutos 
        FROM public.turnos t 
        JOIN public.servicios s ON t.servicio_id = s.id
        WHERE t.dia_id = v_dia_id AND t.estado != 'cancelado'
      LOOP
        IF (v_hora_actual < v_horarios_ocupados.hora + (v_horarios_ocupados.duracion_minutos || ' minutes')::interval)
           AND (v_hora_actual + (p_duracion || ' minutes')::interval > v_horarios_ocupados.hora) THEN
           v_conflicto := true;
           EXIT;
        END IF;
      END LOOP;
    END IF;

    IF NOT v_conflicto THEN
      v_disponibles := v_disponibles || to_jsonb(to_char(v_hora_actual, 'HH24:MI'));
    END IF;
    v_hora_actual := v_hora_actual + '30 minutes'::interval;
  END LOOP;

  RETURN v_disponibles;
END;
$$;
