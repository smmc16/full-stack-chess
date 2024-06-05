CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "games" (
	"id" SERIAL PRIMARY KEY,
	"created" DATE DEFAULT CURRENT_DATE,
	"in_progress" BOOLEAN DEFAULT TRUE,
	"room_id" VARCHAR (80) UNIQUE NOT NULL,
	"white" INT REFERENCES "user",
	"black" INT REFERENCES "user",
	"position" VARCHAR(1000) DEFAULT 'start',
	"turn" VARCHAR(1) DEFAULT 'w',
	"winner" INT REFERENCES "user"
	);
    
INSERT INTO "games" (room_id, black) VALUES ('room', 1);
