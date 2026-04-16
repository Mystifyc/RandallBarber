INSERT INTO CLIENTES (NOMBRE, TELEFONO, CORREO, PASSWORD) VALUES
('Cliente Randall', '3011111111', 'cliente@randall.com', '123456'),
('Andrés Gómez', '3022222222', 'andres@gmail.com', '123456'),
('Sebastián Ruiz', '3033333333', 'sebastian@gmail.com', '123456');

INSERT INTO BARBEROS (ID, NOMBRE, TELEFONO, ESPECIALIDAD, ACTIVO, CORREO, PASSWORD) VALUES
(1, 'Juan Estilo', '3001112233', 'Fade', TRUE, 'barbero@randall.com', '123456'),
(2, 'Carlos Blade', '3002223344', 'Beard Styling', TRUE, 'carlos@randall.com', '123456'),
(3, 'Mateo Fresh', '3003334455', 'Classic Cut', TRUE, 'mateo@randall.com', '123456');

INSERT INTO ADMINISTRADORES (ID, NOMBRE, TELEFONO, CORREO, PASSWORD) VALUES
(1, 'Administrador Randall', '3009990000', 'admin@randall.com', '123456');

INSERT INTO SERVICIO (ID, NOMBRE, DURACION, PRECIO) VALUES
(1, 'Corte clásico', 45, 25000),
(2, 'Fade premium', 60, 35000),
(3, 'Arreglo de barba', 30, 20000),
(4, 'Corte + barba', 75, 45000);

INSERT INTO CITA (DIA, HORA, CLIENTE_ID, BARBERO_ID, SERVICIO_ID) VALUES
(DATE '2026-04-15', TIME '09:00:00', 1, 1, 1),
(DATE '2026-04-15', TIME '10:00:00', 2, 1, 3),
(DATE '2026-04-15', TIME '11:00:00', 3, 2, 2),
(DATE '2026-04-16', TIME '14:00:00', 1, 3, 4);