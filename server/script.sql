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

INSERT INTO "restaurants" VALUES (1,0, 'http://localhost:3001/restaurants/sorbillo.png', 'Sorbillo', 'Via Bruno Buozzi, 3, 10121 Torino TO', '011 1923 4672', 'https://www.sorbillo.it/', 'https://www.facebook.com/PizzeriaGinoSorbillo/', 'https://www.instagram.com/sorbillo/', 'https://www.twitter.com/sorbillo/' ,'8:30-10:30;12:30-15:30', 'Gino Sorbillo appartiene ad una delle famiglie di pizzaioli più antiche di Napoli. cresce nella pizzeria di famiglia e ben presto impara i segreti della vera pizza napoletana. Con Gino Sorbillo la Pizza Napoletana è giunta a livelli qualitativi altissimi e si è guadagnata di diritto spazio tra le migliori eccellenze gastronomiche italiane.');
INSERT INTO "restaurants" VALUES (2,0, 'http://localhost:3001/restaurants/daMichele.png', 'Restaurant 2', 'Location 2', '987654321', 'http://www.restaurant2.com', 'restaurant2-facebook', 'restaurant2-instagram', 'restaurant2-twitter' , '9:00-11:00;13:00-16:00', 'Description for Restaurant 2');
INSERT INTO "restaurants" VALUES (3,0, 'http://localhost:3001/restaurants/gustoDivino.jpg', 'Restaurant 3', 'Location 3', '555555555', 'http://www.restaurant3.com', 'restaurant3-facebook', 'restaurant3-instagram', 'restaurant3-twitter' , '10:00-12:00;14:00-17:00', 'Description for Restaurant 3');
INSERT INTO "restaurants" VALUES (4,0, 'http://localhost:3001/restaurants/osteria.png', 'Restaurant 4', 'Location 4', '999999999', 'http://www.restaurant4.com', 'restaurant4-facebook', 'restaurant4-instagram', 'restaurant4-twitter', '11:30-13:30;16:30-19:30', 'Description for Restaurant 4');
INSERT INTO "restaurants" VALUES (5,0, 'http://localhost:3001/restaurants/saporiditalia.jpg', 'Restaurant 5', 'Location 5', '777777777', 'http://www.restaurant5.com', 'restaurant5-facebook', 'restaurant5-instagram', 'restaurant5-twitter' ,'12:00-14:00;18:00-21:00', 'Description for Restaurant 5');
INSERT INTO "restaurants" VALUES (6,0, 'http://localhost:3001/restaurants/trattoria.jpg', 'Restaurant 6', 'Location 6', '333333333', 'http://www.restaurant6.com', 'restaurant6-facebook', 'restaurant6-instagram', 'restaurant6-twitter', '14:00-16:00;20:00-23:00', 'Description for Restaurant 6');

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
