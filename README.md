# Red-activa-backend

## Indice

- [Levantar el server con node](#node)

## Requisitos

### Con node

- [Yarn](https://yarnpkg.com/)
- [Node.js](https://nodejs.org/) la version 20.19
- La base de datos que se use en el proyecto `PostgreSQL`

<h2 id="node">Pasos para levantar el server</h2>

1. Instalar dependencias:
   ```bash
   yarn install
   ```
2. Crear DB y popular el archivo `.env` basandose en `.env.sample`
3. Correr server en development (local):
   ```bash
   yarn dev
   ```
