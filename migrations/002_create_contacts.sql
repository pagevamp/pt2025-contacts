CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phonenumber VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL,
    userRef VARCHAR(255) NOT NULL,
    FOREIGN KEY ( userRef) REFERENCES users(username) ON DELETE CASCADE,
    UNIQUE (userRef, email)
);
