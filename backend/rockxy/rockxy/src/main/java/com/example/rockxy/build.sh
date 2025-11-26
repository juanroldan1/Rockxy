#!/bin/bash
# build.sh - Script para construir el proyecto en Render

echo "Configurando Java 17..."

# Configurar JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Verificar versión de Java
echo "Versión de Java:"
java -version

# Ir al directorio del backend
cd backend/rockxy/rockxy

# Dar permisos al mvnw
chmod +x mvnw

# Construir el proyecto
echo "Construyendo el proyecto..."
./mvnw clean install -DskipTests

echo "Build completado"