CREATE DATABASE IF NOT EXISTS demenagement
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE demenagement;


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,    
  nom VARCHAR(255),
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE demenagements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nom VARCHAR(255) NOT NULL,
  date_demenagement DATE,
  type_profil VARCHAR(50),
  distance_km INT,
  etage INT,
  ascenseur BOOLEAN DEFAULT FALSE,
  parking BOOLEAN DEFAULT FALSE,
  nb_personnes INT DEFAULT 1,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE pieces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  demenagement_id INT NOT NULL,
  nom VARCHAR(255) NOT NULL,
  FOREIGN KEY (demenagement_id) REFERENCES demenagements(id) ON DELETE CASCADE
);

CREATE TABLE objets_inventaire (
  id INT AUTO_INCREMENT PRIMARY KEY,
  piece_id INT NOT NULL,
  nom VARCHAR(255) NOT NULL,
  volume DECIMAL(6,3),
  quantite INT DEFAULT 1,
  type VARCHAR(20) DEFAULT 'meuble',
  FOREIGN KEY (piece_id) REFERENCES pieces(id) ON DELETE CASCADE
);

CREATE TABLE objets_personnels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nom VARCHAR(255) NOT NULL,
  volume DECIMAL(6,3),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE checklist_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  demenagement_id INT NOT NULL,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_limite DATE,
  type VARCHAR(50) DEFAULT 'demarche',
  complete BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (demenagement_id) REFERENCES demenagements(id) ON DELETE CASCADE
);