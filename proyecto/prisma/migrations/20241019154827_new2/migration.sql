-- CreateTable
CREATE TABLE "ciudad" (
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "ciudad_pkey" PRIMARY KEY ("nombre")
);

-- CreateTable
CREATE TABLE "discoteca" (
    "nombre" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "gestor" VARCHAR(100),
    "calificacion" DECIMAL(10,2),
    "n_reviews" INTEGER,
    "aforo" INTEGER,

    CONSTRAINT "discoteca_pkey" PRIMARY KEY ("nombre","ciudad")
);

-- CreateTable
CREATE TABLE "evento" (
    "nombre" VARCHAR(100) NOT NULL,
    "discoteca" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "fecha" DATE NOT NULL,
    "n_existencias" INTEGER,
    "marca" VARCHAR(100),

    CONSTRAINT "evento_pkey" PRIMARY KEY ("nombre","discoteca","ciudad","fecha")
);

-- CreateTable
CREATE TABLE "gestor_local" (
    "nombre_usuario" VARCHAR(100),
    "correo" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100),

    CONSTRAINT "gestor_local_pkey" PRIMARY KEY ("correo")
);

-- CreateTable
CREATE TABLE "posee" (
    "entrada" VARCHAR(100) NOT NULL,
    "evento" VARCHAR(100) NOT NULL,
    "discoteca" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "fecha" DATE NOT NULL,
    "nombre_usuario" VARCHAR(100) NOT NULL,
    "seguro_devolucion" BOOLEAN,

    CONSTRAINT "posee_pkey" PRIMARY KEY ("entrada","evento","discoteca","ciudad","fecha","nombre_usuario")
);

-- CreateTable
CREATE TABLE "puntua" (
    "discoteca" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "nombre_usuario" VARCHAR(100) NOT NULL,
    "calificacion" DECIMAL(10,2),

    CONSTRAINT "puntua_pkey" PRIMARY KEY ("discoteca","ciudad","nombre_usuario")
);

-- CreateTable
CREATE TABLE "tipoentrada" (
    "nombre" VARCHAR(100) NOT NULL,
    "evento" VARCHAR(100) NOT NULL,
    "discoteca" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "fecha" DATE NOT NULL,
    "n_existencias" INTEGER,
    "precio" DECIMAL(10,2),
    "n_max_existencias" INTEGER,

    CONSTRAINT "tipoentrada_pkey" PRIMARY KEY ("nombre","evento","discoteca","ciudad","fecha")
);

-- CreateTable
CREATE TABLE "usuario" (
    "nombre_usuario" VARCHAR(100),
    "ciudad" VARCHAR(100),
    "password" VARCHAR(100),
    "correo" VARCHAR(100) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("correo")
);

-- AddForeignKey
ALTER TABLE "discoteca" ADD CONSTRAINT "discoteca_ciudad_fkey" FOREIGN KEY ("ciudad") REFERENCES "ciudad"("nombre") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discoteca" ADD CONSTRAINT "discoteca_gestor_fkey" FOREIGN KEY ("gestor") REFERENCES "gestor_local"("correo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_discoteca_ciudad_fkey" FOREIGN KEY ("discoteca", "ciudad") REFERENCES "discoteca"("nombre", "ciudad") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posee" ADD CONSTRAINT "posee_entrada_evento_discoteca_ciudad_fecha_fkey" FOREIGN KEY ("entrada", "evento", "discoteca", "ciudad", "fecha") REFERENCES "tipoentrada"("nombre", "evento", "discoteca", "ciudad", "fecha") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posee" ADD CONSTRAINT "posee_nombre_usuario_fkey" FOREIGN KEY ("nombre_usuario") REFERENCES "usuario"("correo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "puntua" ADD CONSTRAINT "puntua_discoteca_ciudad_fkey" FOREIGN KEY ("discoteca", "ciudad") REFERENCES "discoteca"("nombre", "ciudad") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "puntua" ADD CONSTRAINT "puntua_nombre_usuario_fkey" FOREIGN KEY ("nombre_usuario") REFERENCES "usuario"("correo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tipoentrada" ADD CONSTRAINT "tipoentrada_evento_discoteca_ciudad_fecha_fkey" FOREIGN KEY ("evento", "discoteca", "ciudad", "fecha") REFERENCES "evento"("nombre", "discoteca", "ciudad", "fecha") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_ciudad_fkey" FOREIGN KEY ("ciudad") REFERENCES "ciudad"("nombre") ON DELETE NO ACTION ON UPDATE NO ACTION;
