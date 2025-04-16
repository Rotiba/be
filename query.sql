CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE Videos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    producer VARCHAR(100),
    genre VARCHAR(50),
    ageRating VARCHAR(10),
    blobUrl VARCHAR(255) NOT NULL,
    uploaderId INT REFERENCES Users(id),
    uploadDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE Comments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    videoId INT REFERENCES Videos(id),
    userId INT REFERENCES Users(id),
    comment TEXT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Ratings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    videoId INT REFERENCES Videos(id),
    userId INT REFERENCES Users(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    UNIQUE (videoId, userId)
);

-- Insert sample data
INSERT INTO Users (username, password, role) VALUES 
('admin', 'admin123', 'creator'),
('user1', 'user123', 'consumer');