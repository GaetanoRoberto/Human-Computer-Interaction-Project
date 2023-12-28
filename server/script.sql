BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "restaurants" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"isNewInserted" INTEGER NOT NULL, -- 0 pre-populated restaurants, 1 inserted at "runtime" (to avoid restaurateur reviewing his own restaurant)
	"image" TEXT NOT NULL,
	"name" 	TEXT NOT NULL,
	"location"	TEXT NOT NULL, -- position1-position2-... if handles more than one position, otherwise separate table
	"phone"		TEXT NOT NULL,
	"website" 	TEXT,
	"facebook" 	TEXT,
	"instagram" TEXT,
	"twitter" TEXT,
	"hours" 	TEXT NOT NULL, -- 8:30-10:30;12:30-15:30 otherwise separate table
	"description" 	TEXT NOT NULL
	--"priceRange" 	TEXT NOT NULL,
	--"cuisine"	TEXT NOT NULL,
	--"meals" 	TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "dishes" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"restaurantId"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"price"	FLOAT NOT NULL,
	"type" 	TEXT NOT NULL, -- pasta pizza dessert ...
	"image" TEXT NOT NULL,
	FOREIGN KEY("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ingredients" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"dishId"	INTEGER NOT NULL,
	"image"  TEXT NOT NULL,
	"name"	TEXT NOT NULL, --mozzarella
	"allergens" TEXT, -- lattosio,senza glutine,... otherwise separate table
	"brandName"	TEXT NOT NULL, -- santa lucia (ESEMPIO HOMEMADE NEL DB PER FAR CAPIRE SE NO MARCA)
	"brandLink" TEXT,
	--"kcal" INTEGER NOT NULL,
	--"protein" FLOAT NOT NULL,
	--"carbs" FLOAT NOT NULL,
	--"fats" FLOAT NOT NULL,
	FOREIGN KEY("dishId") REFERENCES "dishes"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "reviews" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"username" TEXT NOT NULL, -- to say who did the review and to check if an user already did a review on a restaurant [already exist (username,restaurantId)]
	"restaurantId"	INTEGER NOT NULL,
	"date" DATE NOT NULL,
	"title" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"quality" FLOAT NOT NULL,
	"safety" FLOAT NOT NULL,
	"price" FLOAT NOT NULL,
	FOREIGN KEY("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE
	FOREIGN KEY("username") REFERENCES "users"("username") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "users" (
	"username" TEXT PRIMARY KEY,
	"position" TEXT NOT NULL,
	"isRestaurateur" INTEGER NOT NULL -- 0 normal user, 1 restaurateur
);

-- filters in home and categories when add/edit restaurant hardcoded without backend (a costant array in costants.jsx)

INSERT INTO "restaurants" VALUES (1,0, 'http://localhost:3001/restaurants/sorbillo.png', 'Sorbillo', 'Via Bruno Buozzi, 3, 10121 Torino TO', '011 1923 4672', 'https://www.sorbillo.it/', 'https://www.facebook.com/PizzeriaGinoSorbillo/', 'https://www.instagram.com/sorbillo/', 'https://www.twitter.com/sorbillo/', '8:30-10:30;12:30-15:30', 'Gino Sorbillo belongs to one of the oldest pizza chef families in Naples. he grew up in the family pizzeria and soon learned the secrets of real Neapolitan pizza. With Gino Sorbillo, Neapolitan Pizza has reached very high quality levels and has rightfully earned its place among the best Italian gastronomic excellences.');
INSERT INTO "restaurants" VALUES (2,0, 'http://localhost:3001/restaurants/daMichele.png', 'All\'Antico Vinaio', 'Via Sant'Ottavio, 18, 10124 Torino TO', '011 698 8025', 'https://www.allanticovinaio.com/', 'https://www.facebook.com/AllAnticoVinaio/', 'https://www.instagram.com/allanticovinaiofirenze/', NULL , '11:00-22:00', 'The history of Antico Vinaio began in 1989, when the Mazzanti family took over a small rotisserie in via dei Neri, just 250 meters from the Uffizi Gallery. After Tommaso joined the company in 2006, the rotisserie transformed into a squash shop and in a short time the place became a point of reference for Florence and street food lovers. More than as an entrepreneur, and since the end of 2016 as owner of the family business, Tommaso simply feels like a winemaker. He never liked studying, but he already had a B piano.');
INSERT INTO "restaurants" VALUES (3,0, 'http://localhost:3001/restaurants/gustoDivino.jpg', 'Pizzium', 'Via Torquato Tasso, 5, 10122 Torino TO', '011 1958 5395', 'https://pizzium.com/', 'https://www.facebook.com/pizzium', 'https://www.instagram.com/pizzium/', 'NULL' , '12:30–15:00;19:00–23:30', 'Born in 2017 in Milan from an idea by Stefano Saturnino, Giovanni Arbellini and Ilaria Puddu, Pizzium offers classic Neapolitan pizza using the best of Italian raw materials. The Pizzium style is unmistakable, but each venue is unique because it draws inspiration from the land that hosts it, without giving up the best of Naples and Campania.');
INSERT INTO "restaurants" VALUES (4,0, 'http://localhost:3001/restaurants/osteria.png', 'Rossopomodoro', 'Via Nizza, 2, 10126 Torino TO', '011 1978 1792', 'https://www.rossopomodoro.it/', 'https://www.facebook.com/rossopomodoroofficial', 'https://www.instagram.com/rossopomodoro_italia/', 'https://twitter.com/i/flow/login?redirect_after_login=%2FRossopomodoroOF', '08:00–22:00', 'Founded in Naples - the home of pizza - in 1998, by three young people passionate about artisanal Neapolitan cuisine and pizza, Rossopomodoro has grown to become a point of reference for millions of people around the world. With over 100 restaurants in Italy and around the world, we have built an enviable reputation over 20 years, offering true Neapolitan pizza, with long-leavened dough cooked in a wood-fired oven, traditional Campania recipes and the best Italian excellences.');
INSERT INTO "restaurants" VALUES (5,0, 'http://localhost:3001/restaurants/saporiditalia.jpg', 'Assaje', 'Via Andrea Doria, 11, 10123 Torino TO', '011 780 2618', 'https://www.assaje.it/', 'https://www.facebook.com/pizzeriaassaje/', 'https://www.instagram.com/pizzeria_assaje/', NULL ,'12:00–15;19:00–00:00', 'The Assaje pizzeria in Milan is a concept born from a group of Neapolitans who decided to export the flavors of true Neapolitan pizza to the Lombard capital. Gourmet pizzas and traditional Neapolitan recipes are what Assaje restaurants offer. All the products are distributed by local farmers and the basic idea is to bring the true flavors of Campania back to the table. For this reason the suppliers are exclusively Neapolitan, so as to re-propose the true dishes of a gastronomic culture with an ancient history.');
INSERT INTO "restaurants" VALUES (6,0, 'http://localhost:3001/restaurants/trattoria.jpg', 'Skassapanza', 'Via Pasquale Paoli, 54a, 10134 Torino TO', '0117931455', 'https://skassapanza.it/', 'https://www.facebook.com/skassapanza', 'https://www.instagram.com/skassapanza/', NULL, '12:00–15:00;19:00–00:00', 'Skassapanza was born from the will of two friends, Vito and Enzo, who after years of entrepreneurial experience, with a strong passion for food, decided to open a hamburger/rotisserie aimed, immediately, at customizing their own menu. The idea was born precisely from this vision which, still today, is the peculiarity of the Skassapanza premises: you decide how to compose your hamburger');

INSERT INTO "dishes" VALUES (1,1, 'Pasta Carbonara', 10.99, 'pasta', 'http://localhost:3001/dishes/bismark.jpeg');
INSERT INTO "dishes" VALUES (2,1, 'Margherita Pizza', 12.99, 'pizza', 'http://localhost:3001/dishes/capricciosa.jpg');
INSERT INTO "dishes" VALUES (3,2, 'Chicken Alfredo', 15.99, 'pasta', 'http://localhost:3001/dishes/gorgonzola.png');
INSERT INTO "dishes" VALUES (4,2, 'Vegetarian Pizza', 13.99, 'pizza', 'http://localhost:3001/dishes/margherita.png');
INSERT INTO "dishes" VALUES (5,3, 'Lasagna', 14.99, 'pasta', 'http://localhost:3001/placeholder.png');
INSERT INTO "dishes" VALUES (6,3, 'Pepperoni Pizza', 16.99, 'pizza', 'http://localhost:3001/dishes/tonnoCipolla.png');

INSERT INTO "ingredients" VALUES (1,1, 'http://localhost:3001/ingredients/spaghetti.png' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients"(id,dishId,image,name,allergens,brandName) VALUES (2,1, 'http://localhost:3001/ingredients/bacon.jpg', 'Bacon', 'pork', 'HomeMade');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (3,2, 'http://localhost:3001/ingredients/tomato_sauce-png', 'Tomato Sauce', 'Ragu', 'http://www.ragu.com');
INSERT INTO "ingredients" VALUES (4,2, 'http://localhost:3001/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (5,3, 'http://localhost:3001/ingredients/chicken_breast.png', 'Chicken Breast', 'Tyson', 'http://www.tyson.com');
INSERT INTO "ingredients" VALUES (6,3, 'http://localhost:3001/ingredients/spaghetti.png','Alfredo Sauce', 'lactose', 'Classico', 'http://www.classico.com');

INSERT INTO "users" VALUES ('Andrea','position1',0);
INSERT INTO "users" VALUES ('Giuseppe','position2',0);
INSERT INTO "users" VALUES ('Luca','position3',0);
INSERT INTO "users" VALUES ('Giovanni','position4',0);
INSERT INTO "users" VALUES ('Alessandro','position5',0);
INSERT INTO "users" VALUES ('Davide','position6',0);
INSERT INTO "users" VALUES ('User','position7',0);
INSERT INTO "users" VALUES ('Restaurateur','position8',1);

INSERT INTO "reviews" VALUES (1,'Andrea', 1, DATE('2023-02-28') ,'Great Experience', 'Had a wonderful time!', 4.5, 4, 4);
INSERT INTO "reviews" VALUES (2,'Giuseppe', 2, DATE('2023-03-28'), 'Awesome Food', 'The pizza was fantastic!', 5, 4.5, 4);
INSERT INTO "reviews" VALUES (3,'Luca', 3, DATE('2023-02-21'), 'Delicious Pasta', 'Enjoyed the spaghetti!', 4, 4, 3.5);
INSERT INTO "reviews" VALUES (4,'Giovanni', 4, DATE('2023-04-22'), 'Pizza Lover’s Paradise', 'Great variety of pizzas!', 4.8, 4.2, 4.5);
INSERT INTO "reviews" VALUES (5,'Alessandro', 5, DATE('2023-02-15'), 'Cozy Atmosphere', 'Lovely place for dinner!', 4.2, 4, 3.8);
INSERT INTO "reviews" VALUES (6,'Davide', 6, DATE('2023-08-20'), 'Excellent Service', 'Staff was friendly and attentive!', 4.7, 4.5, 4.2);

COMMIT;
