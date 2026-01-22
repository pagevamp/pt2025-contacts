CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() ,
    username VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    homeaddress VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    owes_me NUMERIC(10,2) DEFAULT 0,
    PRIMARY KEY (id,username)
);

