-- Se ejecuta automáticamente al crear el contenedor de MySQL
-- (montado en /docker-entrypoint-initdb.d, ver docker-compose.yml)

CREATE TABLE IF NOT EXISTS user_stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL,             -- Como...
    want VARCHAR(255) NOT NULL,             -- Quiero...
    benefit VARCHAR(255) NOT NULL,          -- Para qué...
    acceptance_criteria JSON NOT NULL,      -- Criterios de aceptación (lista)
    moscow ENUM('MUST', 'SHOULD', 'COULD', 'WONT') NOT NULL DEFAULT 'MUST',
    completed BOOLEAN NOT NULL DEFAULT FALSE
);
