CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE usuarios (
    iduser INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(iduser) ON DELETE CASCADE
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad_disponible INT NOT NULL,
    categoria INT,
    discount INT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categoria(id) ON DELETE SET NULL
);
ALTER TABLE productos DROP COLUMN imagen;
ALTER TABLE productos ADD COLUMN imagen VARCHAR(255);
CREATE TABLE imagenes_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE carrito_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT
);

CREATE TABLE imagenes_documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    documento_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL, -- nombre o ruta del archivo
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE
);


ALTER TABLE productos 
ADD CONSTRAINT fk_categoria FOREIGN KEY (categoria) REFERENCES categoria(id) ON DELETE SET NULL;
ALTER TABLE productos ADD categoria INT NULL;
 SELECT c.id_carrito, cp.id AS id_carrito_producto, p.id AS id_producto, p.nombre, p.precio, cp.cantidad, p.imagen,p.discount,u.nombre,c.id_usuario,ca.nombre
             FROM carrito_productos cp
             JOIN productos p ON cp.id_producto = p.id
             JOIN carrito c ON cp.id_carrito = c.id_carrito
             join usuarios u on c.id_usuario = u.iduser
             join categoria ca on p.categoria = ca.id
             WHERE lower(p.nombre) like "%a%" and c.id_usuario = 19 order by discount asc ;
             
             
select p.nombre as producto_nombre,c.nombre as categoria_nombre,p.precio
from productos p
inner join categoria c on p.categoria = c.id
 where lower(c.nombre) like "%juegos%";

select * from categoria c where id = 2;
select * from productos
 where categoria is  null;
INSERT INTO productos (nombre, imagen, precio, cantidad_disponible,  discount) VALUES
('Pastel de Chocolate', 'chocolate.jpg', 25.99, 10,  10);

SELECT u.iduser, u.nombre, COUNT(cp.id_producto) AS cantidad_productos
FROM usuarios u
JOIN carrito c ON u.iduser = c.id_usuario
JOIN carrito_productos cp ON c.id_carrito = cp.id_carrito
GROUP BY u.iduser, u.nombre
HAVING COUNT(cp.id_producto) >= 1;
SELECT  COUNT(*) as total FROM usuarios;
SELECT c.nombre, COUNT(*) as cantidad_categoria, sum(p.precio*p.cantidad_disponible) as precio_total FROM productos p
 join categoria c on c.id = p.categoria
 GROUP BY p.categoria;

SELECT  group_concat(p.nombre),c.nombre ,categoria, COUNT(*) FROM productos p
join categoria c on p.categoria = c.id  

group by categoria;

select   count(*) as total from productos;
SELECT group_concat(nombre),count(*) as total_prducts_mismacantidad,GROUP_CONCAT(cantidad_disponible),precio
FROM productos 
where lower(nombre) like"%a%"
group by precio;



SELECT group_concat(p.nombre ) as producto_nombre,
c.nombre,count(p.categoria) as cantidad_productos,
c.id,group_concat(p.precio) as product_price 
FROM productos p
 join categoria c on c.id = p.categoria
where p.precio < 60
 GROUP BY p.categoria ;
 
 SELECT c.nombre, COUNT(*) as cantidad_categoria_productos FROM productos p
 join categoria c on c.id = p.categoria
 where lower(c.nombre) like "%juego%"  
 group by p.categoria;
 
 select group_concat(p.nombre), c.nombre,count(*)
 from productos p 
 join categoria c on p.categoria = c.id
 group by p.categoria;
 
 select p.nombre,c.nombre,p.precio 
 from productos p 
 join categoria c on p.categoria = c.id
 where lower(c.nombre) like "%juegos%" and p.precio order by p.precio asc ;
 
select p.nombre , c.nombre as categoria_nombre,p.precio
from productos p
join categoria c on p.categoria = c.id
where p.nombre  like"%mas%";



update productos set cantidad_disponible =   cantidad_disponible +1 where id = 1;
 
 select cp.id,cp.id_producto,cp.id_carrito,cp.cantidad,p.nombre,c.id_usuario
 from carrito_productos cp
 join productos p on cp.id_producto = p.id
 join carrito c on cp.id_carrito = c.id_carrito 
 where c.id_usuario = 18;
 
 
 
select * from carrito where id_usuario = 18;

select group_concat(p.nombre),count(*) as porductos_cantidad,group_concat(p.precio) as precio,c.nombre
from productos p
join categoria c on p.categoria = c.id
where p.precio >= 15 and c.nombre like "%juego%"
group by c.nombre
order by precio asc;
 
select group_concat(p.nombre),count(*),c.nombre,c.id
from productos p
join categoria c on p.categoria = c.id
where c.nombre like lower("%mando%") and p.cantidad_disponible >2 
group by p.categoria;

select p.nombre,c.nombre,p.discount,p.precio
from productos p
join categoria c on p.categoria = c.id
 where c.nombre like lower("%juegos%") and p.precio order by p.precio asc;
 
SELECT d.id, d.titulo, d.descripcion, i.nombre_archivo
      FROM documentos d
      LEFT JOIN imagenes_documentos i ON d.id = i.documento_id
      WHERE d.id = 1;
      
select group_concat(p.nombre order by p.precio asc) as nombre_productos,
c.nombre,count(*) as cantidad_que_tiene_la_misma_categoria,
group_concat(p.precio order by p.precio asc) as precio
from productos p
join categoria c on p.categoria = c.id
group by p.categoria;

	select p.nombre, p.precio,p.cantidad_disponible
	from productos p 
	where  lower(p.nombre) like lower("%SeCUelA%")
    order by p.cantidad_disponible desc;
    
    
    select d.titulo,d.descripcion,i.nombre_archivo
    from documentos d
    join imagenes_documentos i on d.id = i.documento_id
 


 






