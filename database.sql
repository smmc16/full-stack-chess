CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "games" (
	"id" SERIAL PRIMARY KEY,
	"room_id" VARCHAR (80) UNIQUE NOT NULL,
	"white" INT REFERENCES "user",
	"black" INT REFERENCES "user",
	"position" VARCHAR(1000) DEFAULT 'start',
	"turn" VARCHAR(1) DEFAULT 'w'
	);

CREATE TABLE "chat" (
	"id" SERIAL PRIMARY KEY,
	"room_id" VARCHAR(80),
	"user" VARCHAR(80),
	"message" VARCHAR(500)
	);	
    
INSERT INTO "games" (room_id, black) VALUES ('room', 1);
