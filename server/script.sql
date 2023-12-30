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

INSERT INTO "restaurants" VALUES (1,0, 'http://localhost:3001/restaurants/sorbillo.jpg', 'Sorbillo', 'Via Bruno Buozzi, 3, 10121 Torino TO;lat:45.0658389;lng:7.679759360170147', '011 1923 4672', 'https://www.sorbillo.it/', 'https://www.facebook.com/PizzeriaGinoSorbillo/', 'https://www.instagram.com/sorbillo/', 'https://www.twitter.com/sorbillo/', '8:30-10:30;12:30-15:30', 'Gino Sorbillo belongs to one of the oldest pizza chef families in Naples. he grew up in the family pizzeria and soon learned the secrets of real Neapolitan pizza. With Gino Sorbillo, Neapolitan Pizza has reached very high quality levels and has rightfully earned its place among the best Italian gastronomic excellences.');
INSERT INTO "restaurants" VALUES (2,0, 'http://localhost:3001/restaurants/anticovinaio.jpg', "All'Antico Vinaio", "Via Sant'Ottavio, 18, 10124 Torino TO;lat:45.0674448;lng:7.6941677", '011 698 8025', 'https://www.allanticovinaio.com/', 'https://www.facebook.com/AllAnticoVinaio/', 'https://www.instagram.com/allanticovinaiofirenze/', NULL , '11:00-22:00', 'The history of Antico Vinaio began in 1989, when the Mazzanti family took over a small rotisserie in via dei Neri, just 250 meters from the Uffizi Gallery. After Tommaso joined the company in 2006, the rotisserie transformed into a squash shop and in a short time the place became a point of reference for Florence and street food lovers. More than as an entrepreneur, and since the end of 2016 as owner of the family business, Tommaso simply feels like a winemaker. He never liked studying, but he already had a B piano.');
INSERT INTO "restaurants" VALUES (3,0, 'http://localhost:3001/restaurants/pizzium.jpg', 'Pizzium', 'Via Torquato Tasso, 5, 10122 Torino TO;lat:45.0738869;lng:7.6825461', '011 1958 5395', 'https://pizzium.com/', 'https://www.facebook.com/pizzium', 'https://www.instagram.com/pizzium/', 'NULL' , '12:30–15:00;19:00–23:30', 'Born in 2017 in Milan from an idea by Stefano Saturnino, Giovanni Arbellini and Ilaria Puddu, Pizzium offers classic Neapolitan pizza using the best of Italian raw materials. The Pizzium style is unmistakable, but each venue is unique because it draws inspiration from the land that hosts it, without giving up the best of Naples and Campania.');
INSERT INTO "restaurants" VALUES (4,0, 'http://localhost:3001/restaurants/rossopomodoro.jpg', 'Rossopomodoro', 'Via Nizza, 2, 10126 Torino TO;lat:45.0623010;lng:7.6781004', '011 1978 1792', 'https://www.rossopomodoro.it/', 'https://www.facebook.com/rossopomodoroofficial', 'https://www.instagram.com/rossopomodoro_italia/', 'https://twitter.com/i/flow/login?redirect_after_login=%2FRossopomodoroOF', '8:00–22:00', 'Founded in Naples - the home of pizza - in 1998, by three young people passionate about artisanal Neapolitan cuisine and pizza, Rossopomodoro has grown to become a point of reference for millions of people around the world. With over 100 restaurants in Italy and around the world, we have built an enviable reputation over 20 years, offering true Neapolitan pizza, with long-leavened dough cooked in a wood-fired oven, traditional Campania recipes and the best Italian excellences.');
INSERT INTO "restaurants" VALUES (5,0, 'http://localhost:3001/restaurants/assaje.jpg', 'Assaje', 'Via Andrea Doria, 11, 10123 Torino TO;lat:45.0640710;lng:7.6834790', '011 780 2618', 'https://www.assaje.it/', 'https://www.facebook.com/pizzeriaassaje/', 'https://www.instagram.com/pizzeria_assaje/', NULL ,'12:00–15:00;19:00–00:00', 'The Assaje pizzeria in Milan is a concept born from a group of Neapolitans who decided to export the flavors of true Neapolitan pizza to the Lombard capital. Gourmet pizzas and traditional Neapolitan recipes are what Assaje restaurants offer. All the products are distributed by local farmers and the basic idea is to bring the true flavors of Campania back to the table. For this reason the suppliers are exclusively Neapolitan, so as to re-propose the true dishes of a gastronomic culture with an ancient history.');
INSERT INTO "restaurants" VALUES (6,0, 'http://localhost:3001/restaurants/skassapanza.jpg', 'Skassapanza', 'Via Pasquale Paoli, 54a, 10134 Torino TO;lat:45.0351312;lng:7.6522041', '0117931455', 'https://skassapanza.it/', 'https://www.facebook.com/skassapanza', 'https://www.instagram.com/skassapanza/', NULL, '12:00–15:00;19:00–00:00', 'Skassapanza was born from the will of two friends, Vito and Enzo, who after years of entrepreneurial experience, with a strong passion for food, decided to open a hamburger/rotisserie aimed, immediately, at customizing their own menu. The idea was born precisely from this vision which, still today, is the peculiarity of the Skassapanza premises: you decide how to compose your hamburger');

INSERT INTO "dishes" VALUES (1,1, 'Carbonara', 10.00, 'pasta', 'http://localhost:3001/dishes/pastacarbonara.jpeg');
INSERT INTO "dishes" VALUES (2,1, 'Margherita Pizza', 7.00, 'pizza', 'http://localhost:3001/dishes/margherita.jpg');
INSERT INTO "dishes" VALUES (3,2, 'Pepperoni Pizza', 9.00, 'pizza', 'http://localhost:3001/dishes/pepperonipizza.png');
INSERT INTO "dishes" VALUES (4,2, 'Vegetarian Pizza', 9.00, 'pizza', 'http://localhost:3001/dishes/vegetariana.png');
INSERT INTO "dishes" VALUES (5,3, 'Pumpkin Lasagna', 10.00, 'pasta', 'http://localhost:3001/placeholder.png');
INSERT INTO "dishes" VALUES (6,3, 'Tonno e cipolla', 10.00, 'pizza', 'http://localhost:3001/dishes/tonnoCipolla.png');
INSERT INTO "dishes" VALUES (7,1, 'Bismark', 10.00, 'pizza', 'http://localhost:3001/dishes/bismark.jpeg');
INSERT INTO "dishes" VALUES (8,2, 'Amatriciana', 10.00, 'pasta', 'http://localhost:3001/dishes/pastaamatriciana.jpeg');
INSERT INTO "dishes" VALUES (9,3, 'Gricia', 10.00, 'pasta', 'http://localhost:3001/dishes/pastagricia.jpeg');
INSERT INTO "dishes" VALUES (10,2, 'Cacio e pepe', 10.00, 'pasta', 'http://localhost:3001/dishes/pastacacioepepe.jpeg');
INSERT INTO "dishes" VALUES (11,1, 'Capricciosa', 10.99, 'pizza', 'http://localhost:3001/dishes/capricciosa.jpeg');
INSERT INTO "dishes" VALUES (12,1, 'Cheeseburger', 10.99, 'hamburger', 'http://localhost:3001/dishes/cheeseburger.jpeg');
INSERT INTO "dishes" VALUES (13,2, 'Chocolate Cheesecake', 5.00, 'dessert', 'http://localhost:3001/dishes/chocolatecheesecake.jpeg');
INSERT INTO "dishes" VALUES (14,3, 'Tiramisù', 5.00, 'desserts', 'http://localhost:3001/dishes/tiramisu.jpeg');
INSERT INTO "dishes" VALUES (15,1, 'Natural Water', 1.00, 'drinks', 'http://localhost:3001/dishes/naturalwater.jpeg');
INSERT INTO "dishes" VALUES (16,2, 'Sparkling Water', 1.00, 'drinks', 'http://localhost:3001/dishes/sparklingwater.jpeg');
INSERT INTO "dishes" VALUES (17,3, 'Coca cola', 2.00, 'drinks', 'http://localhost:3001/dishes/cocacola.jpeg');
INSERT INTO "dishes" VALUES (18,1, 'Coca cola zero', 2.00, 'drinks', 'http://localhost:3001/dishes/cocacolazero.jpeg');
INSERT INTO "dishes" VALUES (19,2, 'Fanta', 2.00, 'drinks', 'http://localhost:3001/dishes/fanta.jpeg');
INSERT INTO "dishes" VALUES (20,3, 'Sprite', 2.00, 'drinks', 'http://localhost:3001/dishes/sprite.jpeg');
INSERT INTO "dishes" VALUES (21,2, 'Pesto pasta', 10.00, 'pasta', 'http://localhost:3001/dishes/pastapesto.jpeg');


INSERT INTO "ingredients" VALUES (1,1, 'http://localhost:3001/ingredients/spaghetti.png' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (2,1, 'http://localhost:3001/ingredients/guanciale.png' , 'Guanciale', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (3,1, 'http://localhost:3001/ingredients/eggyolks.png' , 'Egg yolks', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (4,1, 'http://localhost:3001/ingredients/pecorinoromano.png' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (5,1, 'http://localhost:3001/ingredients/blackpepper.png' , 'Black pepper', '', '', 'LocalFarm');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (6,2, 'http://localhost:3001/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (7,2, 'http://localhost:3001/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (8, 2, 'http://localhost:3001/ingredients/olive_oil.jpg', 'Olive Oil', '', 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (9,3, 'http://localhost:3001/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (10,3, 'http://localhost:3001/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (11, 3, 'http://localhost:3001/ingredients/olive_oil.jpg', 'Olive Oil', '', 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (12, 3, 'http://localhost:3001/ingredients/pepperoni.jpg', 'Pepperonis', '', '', 'LocalFarm');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (13,4, 'http://localhost:3001/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (14, 4, 'http://localhost:3001/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (15, 4, 'http://localhost:3001/ingredients/olive_oil.jpg', 'Olive Oil', '', 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (16, 4, 'http://localhost:3001/ingredients/aubergine.jpg', 'Aubergines', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (17, 4, 'http://localhost:3001/ingredients/potatoes.jpg', 'Potatoes', '', 'McCain', 'http://www.mccain.com');
INSERT INTO "ingredients" VALUES (18, 4, 'http://localhost:3001/ingredients/spinach.jpg', 'Spinaches', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (19, 5, 'http://localhost:3001/ingredients/lasagna.png' , 'Lasagna', 'gluten', '', 'Homemade');
INSERT INTO "ingredients" VALUES (20, 5, 'http://localhost:3001/ingredients/pumpkin.jpg', 'Pumpkins', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (21, 5, 'http://localhost:3001/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients"(id,dishId,image,name,allergens,brandName) VALUES (22,5, 'http://localhost:3001/ingredients/bacon.jpg', 'Bacon', '', 'LocalBreeding');
INSERT INTO "ingredients" VALUES (22, 6, 'http://localhost:3001/ingredients/tuna.jpg', 'Tuna', '', '', 'http://www.riomare.it');
INSERT INTO "ingredients" VALUES (23, 6, 'http://localhost:3001/ingredients/onions.jpg', 'Onions', '', '', 'LocalFarm');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (24,7, 'http://localhost:3001/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (25, 7, 'http://localhost:3001/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (26, 7, 'http://localhost:3001/ingredients/olive_oil.jpg', 'Olive Oil', '', 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (27,7, 'http://localhost:3001/ingredients/egg.png','Eggs', '', '', 'LocalBreeding');
INSERT INTO "ingredients" VALUES (28,8, 'http://localhost:3001/ingredients/pennetteglutenfree.png' , 'Rigatoni gluten-free', '', 'Rummo', 'http://www.pastarummo.it');
INSERT INTO "ingredients" VALUES (29,8, 'http://localhost:3001/ingredients/guanciale.png' , 'Guanciale', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (30,8, 'http://localhost:3001/ingredients/pecorinoromano.png' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (31,8, 'http://localhost:3001/ingredients/blackpepper.png' , 'Black pepper', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (32,9, 'http://localhost:3001/ingredients/spaghetti.png' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (33,9, 'http://localhost:3001/ingredients/guanciale.png' , 'Guanciale', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (34,9, 'http://localhost:3001/ingredients/pecorinoromano.png' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (35,9, 'http://localhost:3001/ingredients/blackpepper.png' , 'Black pepper', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (36,10, 'http://localhost:3001/ingredients/spaghetti.png' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (37,10, 'http://localhost:3001/ingredients/pecorinoromano.png' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (38,10, 'http://localhost:3001/ingredients/blackpepper.png' , 'Black pepper', '', '', 'LocalFarm');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (39,11, 'http://localhost:3001/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (40, 11, 'http://localhost:3001/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (41, 11, 'http://localhost:3001/ingredients/olive_oil.jpg', 'Olive Oil', '', 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (42,11, 'http://localhost:3001/ingredients/egg.png','Eggs', '', '', 'LocalBreeding');
INSERT INTO "ingredients" VALUES (43, 11, 'http://localhost:3001/ingredients/mushrooms.jpg', 'Mushrooms', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (44,11, 'http://localhost:3001/ingredients/bakedham.png','Baked ham', '', '', 'LocalBreeding');
INSERT INTO "ingredients" VALUES (45, 12, 'http://localhost:3001/ingredients/buns.png', 'Buns', 'gluten', 'Mulino Bianco', 'http://www.mulinobianco.it');
INSERT INTO "ingredients" VALUES (46, 12, 'http://localhost:3001/ingredients/beef.png', 'Ground Beef', '', 'GrassFed', 'http://www.grassfed.com');
INSERT INTO "ingredients" VALUES (47, 12, 'http://localhost:3001/ingredients/cheddar.jpg', 'Cheddar', 'lactose', 'Kraft', 'http://www.kraft.com');
INSERT INTO "ingredients" VALUES (48, 12, 'http://localhost:3001/ingredients/onions.jpg', 'Onions', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (49, 12, 'http://localhost:3001/ingredients/tomatoes.jpg', 'Tomatoes', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (50, 12, 'http://localhost:3001/ingredients/cucumbers.jpg', 'Cucumbers', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (51,13, 'http://localhost:3001/ingredients/darkchocolate.png' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com');
INSERT INTO "ingredients" VALUES (52,13, 'http://localhost:3001/ingredients/cottagecheese.png' , 'Cottage cheese', 'lactose', 'Exquisa', 'https://www.exquisa.it/');
INSERT INTO "ingredients" VALUES (53,13, 'http://localhost:3001/ingredients/egg.png','Eggs', '', '', 'LocalBreeding');
INSERT INTO "ingredients" VALUES (54,14, 'http://localhost:3001/ingredients/darkchocolate.png' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com');
INSERT INTO "ingredients" VALUES (55,14, 'http://localhost:3001/ingredients/eggyolks.png' , 'Egg yolks', '', '', 'LocalFarm');
INSERT INTO "ingredients" VALUES (56,14, 'http://localhost:3001/ingredients/rumbacardi.png' , 'White rum', 'alcohol', 'Bacardi', 'https://www.bacardi.com');
INSERT INTO "ingredients" VALUES (57,14, 'http://localhost:3001/ingredients/coffee.png' , 'Coffee', '', 'Lavazza', 'https://www.lavazza.it');
INSERT INTO "ingredients" VALUES (58,21, 'http://localhost:3001/ingredients/fusilliglutenfree.png' , 'Fusilli gluten-free', '', 'Rummo', 'http://www.pastarummo.it');
INSERT INTO "ingredients" VALUES (59, 21, 'http://localhost:3001/ingredients/parmesan_cheese.png', 'Parmesan Cheese', 'lactose', 'Kraft', 'http://www.kraft.com');
INSERT INTO "ingredients" (id, dishId, image, name, allergens, brandName) VALUES (60, 21, 'http://localhost:3001/ingredients/basil.jpg', 'Fresh Basil', '', 'LocalFarm');
INSERT INTO "ingredients" (id, dishId, image, name, allergens, brandName) VALUES (61, 21, 'http://localhost:3001/ingredients/garlic.png', 'Garlic', '', 'LocalFarm');


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
