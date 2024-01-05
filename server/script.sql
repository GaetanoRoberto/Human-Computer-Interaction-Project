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
	"quality" INTEGER NOT NULL,
	"safety" INTEGER NOT NULL,
	"price" INTEGER NOT NULL,
	FOREIGN KEY("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE
	FOREIGN KEY("username") REFERENCES "users"("username") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "users" (
	"username" TEXT PRIMARY KEY,
	"position" TEXT NOT NULL,
	"isRestaurateur" INTEGER NOT NULL -- 0 normal user, 1 restaurateur
);

-- filters in home and categories when add/edit restaurant hardcoded without backend (a costant array in costants.jsx)

INSERT INTO "restaurants" VALUES (1,0, 'IP_ADDRESS_AND_PORT/restaurants/sorbillo.jpg', 'Sorbillo', 'Via Bruno Buozzi, 3, 10121 Torino TO;lat:45.0658389;lng:7.6797594', '+3901119234672', 'https://www.sorbillo.it/', 'https://www.facebook.com/PizzeriaGinoSorbillo/', 'https://www.instagram.com/sorbillo/', 'https://www.twitter.com/sorbillo/', '8:30-10:30;12:30-15:30', 'Gino Sorbillo belongs to one of the oldest pizza chef families in Naples. he grew up in the family pizzeria and soon learned the secrets of real Neapolitan pizza. With Gino Sorbillo, Neapolitan Pizza has reached very high quality levels and has rightfully earned its place among the best Italian gastronomic excellences.');
INSERT INTO "restaurants" VALUES (2,0, 'IP_ADDRESS_AND_PORT/restaurants/anticovinaio.jpg', "All'Antico Vinaio", "Via Sant'Ottavio, 18, 10124 Torino TO;lat:45.0674448;lng:7.6941677", '+390116988025', 'https://www.allanticovinaio.com/', 'https://www.facebook.com/AllAnticoVinaio/', 'https://www.instagram.com/allanticovinaiofirenze/', NULL , '11:00-22:00', 'The history of Antico Vinaio began in 1989, when the Mazzanti family took over a small rotisserie in via dei Neri, just 250 meters from the Uffizi Gallery. After Tommaso joined the company in 2006, the rotisserie transformed into a squash shop and in a short time the place became a point of reference for Florence and street food lovers. More than as an entrepreneur, and since the end of 2016 as owner of the family business, Tommaso simply feels like a winemaker. He never liked studying, but he already had a B piano.');
INSERT INTO "restaurants" VALUES (3,0, 'IP_ADDRESS_AND_PORT/restaurants/pizzium.jpg', 'Pizzium', 'Via Torquato Tasso, 5, 10122 Torino TO;lat:45.0738869;lng:7.6825461', '+3901119585395', 'https://pizzium.com/', 'https://www.facebook.com/pizzium', 'https://www.instagram.com/pizzium/', NULL , '12:30-15:00;19:00-23:30', 'Born in 2017 in Milan from an idea by Stefano Saturnino, Giovanni Arbellini and Ilaria Puddu, Pizzium offers classic Neapolitan pizza using the best of Italian raw materials. The Pizzium style is unmistakable, but each venue is unique because it draws inspiration from the land that hosts it, without giving up the best of Naples and Campania.');
INSERT INTO "restaurants" VALUES (4,0, 'IP_ADDRESS_AND_PORT/restaurants/rossopomodoro.jpg', 'Rossopomodoro', 'Via Nizza, 2, 10126 Torino TO;lat:45.0623010;lng:7.6781004', '+3901119781792', 'https://www.rossopomodoro.it/', 'https://www.facebook.com/rossopomodoroofficial', 'https://www.instagram.com/rossopomodoro_italia/', 'https://twitter.com/i/flow/login?redirect_after_login=%2FRossopomodoroOF', '8:00-22:00', 'Founded in Naples - the home of pizza - in 1998, by three young people passionate about artisanal Neapolitan cuisine and pizza, Rossopomodoro has grown to become a point of reference for millions of people around the world. With over 100 restaurants in Italy and around the world, we have built an enviable reputation over 20 years, offering true Neapolitan pizza, with long-leavened dough cooked in a wood-fired oven, traditional Campania recipes and the best Italian excellences.');
INSERT INTO "restaurants" VALUES (5,0, 'IP_ADDRESS_AND_PORT/restaurants/assaje.jpg', 'Assaje', 'Via Andrea Doria, 11, 10123 Torino TO;lat:45.0640710;lng:7.6834790', '+390117802618', 'https://www.assaje.it/', 'https://www.facebook.com/pizzeriaassaje/', 'https://www.instagram.com/pizzeria_assaje/', NULL ,'12:00-15:00;19:00-00:00', 'The Assaje pizzeria in Milan is a concept born from a group of Neapolitans who decided to export the flavors of true Neapolitan pizza to the Lombard capital. Gourmet pizzas and traditional Neapolitan recipes are what Assaje restaurants offer. All the products are distributed by local farmers and the basic idea is to bring the true flavors of Campania back to the table. For this reason the suppliers are exclusively Neapolitan, so as to re-propose the true dishes of a gastronomic culture with an ancient history.');
INSERT INTO "restaurants" VALUES (6,0, 'IP_ADDRESS_AND_PORT/restaurants/skassapanza.jpg', 'Skassapanza', 'Via Pasquale Paoli, 54a, 10134 Torino TO;lat:45.0351312;lng:7.6522041', '+390117931455', 'https://skassapanza.it/', 'https://www.facebook.com/skassapanza', 'https://www.instagram.com/skassapanza/', NULL, '12:00-15:00;19:00-00:00', 'Skassapanza was born from the will of two friends, Vito and Enzo, who after years of entrepreneurial experience, with a strong passion for food, decided to open a hamburger/rotisserie aimed, immediately, at customizing their own menu. The idea was born precisely from this vision which, still today, is the peculiarity of the Skassapanza premises: you decide how to compose your hamburger');

INSERT INTO "dishes" VALUES (1,1, 'Carbonara', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacarbonara.jpg');
INSERT INTO "dishes" VALUES (2,1, 'Margherita Pizza', 7.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/margherita.jpg');
INSERT INTO "dishes" VALUES (3,2, 'Pepperoni Pizza', 9.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/pepperonipizza.png');
INSERT INTO "dishes" VALUES (4,2, 'Vegetarian Pizza', 9.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/vegetariana.jpg');
INSERT INTO "dishes" VALUES (5,3, 'Pumpkin Lasagna', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/placeholder.png');
INSERT INTO "dishes" VALUES (6,3, 'Tonno e cipolla', 10.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/tonnoCipolla.jpg');
INSERT INTO "dishes" VALUES (7,1, 'Bismark', 10.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/bismark.jpg');
INSERT INTO "dishes" VALUES (8,2, 'Amatriciana', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastaamatriciana.jpg');
INSERT INTO "dishes" VALUES (9,3, 'Gricia', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastagricia.jpg');
INSERT INTO "dishes" VALUES (10,2, 'Cacio e pepe', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacacioepepe.jpg');
INSERT INTO "dishes" VALUES (11,1, 'Capricciosa', 10.99, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/capricciosa.jpg');
INSERT INTO "dishes" VALUES (12,1, 'Cheeseburger', 10.99, 'hamburger', 'IP_ADDRESS_AND_PORT/dishes/cheeseburger.jpg');
INSERT INTO "dishes" VALUES (13,2, 'Chocolate Cheesecake', 5.00, 'dessert', 'IP_ADDRESS_AND_PORT/dishes/chocolatecheesecake.jpg');
INSERT INTO "dishes" VALUES (14,3, 'Tiramisù', 5.00, 'desserts', 'IP_ADDRESS_AND_PORT/dishes/tiramisu.jpg');
INSERT INTO "dishes" VALUES (15,1, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater.jpg');
INSERT INTO "dishes" VALUES (16,2, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder.png');
INSERT INTO "dishes" VALUES (17,3, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola.jpeg');
INSERT INTO "dishes" VALUES (18,1, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero.jpg');
INSERT INTO "dishes" VALUES (19,2, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta.jpg');
INSERT INTO "dishes" VALUES (20,3, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite.jpg');
INSERT INTO "dishes" VALUES (21,2, 'Pesto pasta', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastapesto.jpg');
INSERT INTO "dishes" VALUES (22,4, 'Carbonara', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacarbonara.jpg');
INSERT INTO "dishes" VALUES (23,4, 'Margherita Pizza', 7.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/margherita.jpg');
INSERT INTO "dishes" VALUES (24,5, 'Pepperoni Pizza', 9.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/pepperonipizza.png');
INSERT INTO "dishes" VALUES (25,5, 'Vegetarian Pizza', 9.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/vegetariana.jpg');
INSERT INTO "dishes" VALUES (26,6, 'Pumpkin Lasagna', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/placeholder.png');
INSERT INTO "dishes" VALUES (27,6, 'Tonno e cipolla', 10.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/tonnoCipolla.jpg');
INSERT INTO "dishes" VALUES (28,4, 'Bismark', 10.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/bismark.jpg');
INSERT INTO "dishes" VALUES (29,5, 'Amatriciana', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastaamatriciana.jpg');
INSERT INTO "dishes" VALUES (30,6, 'Gricia', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastagricia.jpg');
INSERT INTO "dishes" VALUES (31,5, 'Cacio e pepe', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacacioepepe.jpg');
INSERT INTO "dishes" VALUES (32,4, 'Capricciosa', 10.99, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/capricciosa.jpg');
INSERT INTO "dishes" VALUES (33,4, 'Cheeseburger', 10.99, 'hamburger', 'IP_ADDRESS_AND_PORT/dishes/cheeseburger.jpg');
INSERT INTO "dishes" VALUES (34,5, 'Chocolate Cheesecake', 5.00, 'dessert', 'IP_ADDRESS_AND_PORT/dishes/chocolatecheesecake.jpg');
INSERT INTO "dishes" VALUES (35,6, 'Tiramisù', 5.00, 'desserts', 'IP_ADDRESS_AND_PORT/dishes/tiramisu.jpg');
INSERT INTO "dishes" VALUES (36,4, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater.jpg');
INSERT INTO "dishes" VALUES (37,5, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder.png');
INSERT INTO "dishes" VALUES (38,6, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola.jpeg');
INSERT INTO "dishes" VALUES (39,4, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero.jpg');
INSERT INTO "dishes" VALUES (40,5, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta.jpg');
INSERT INTO "dishes" VALUES (41,6, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite.jpg');
INSERT INTO "dishes" VALUES (42,5, 'Pesto pasta', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastapesto.jpg');


INSERT INTO "ingredients" VALUES (1,1, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (2,1, 'IP_ADDRESS_AND_PORT/ingredients/guanciale.jpg' , 'Guanciale', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (3,1, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks.jpg' , 'Egg yolks', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (4,1, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (5,1, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (6,2, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.jpg', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (7,2, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (8, 2, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (9,3, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (10,3, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (11, 3, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (12, 3, 'IP_ADDRESS_AND_PORT/ingredients/pepperoni.jpg', 'Pepperonis', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (13,4, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (14, 4, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (15, 4, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (16, 4, 'IP_ADDRESS_AND_PORT/ingredients/aubergine.jpg', 'Aubergines', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (17, 4, 'IP_ADDRESS_AND_PORT/ingredients/potatoes.jpg', 'Potatoes', NULL, 'McCain', 'http://www.mccain.com');
INSERT INTO "ingredients" VALUES (18, 4, 'IP_ADDRESS_AND_PORT/ingredients/spinach.jpg', 'Spinaches', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (19, 5, 'IP_ADDRESS_AND_PORT/ingredients/lasagna.jpg' , 'Lasagna', 'gluten', 'Homemade', NULL);
INSERT INTO "ingredients" VALUES (20, 5, 'IP_ADDRESS_AND_PORT/ingredients/pumpkin.jpg', 'Pumpkins', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (21, 5, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (22,5, 'IP_ADDRESS_AND_PORT/ingredients/bacon.jpg', 'Bacon', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (23, 6, 'IP_ADDRESS_AND_PORT/ingredients/tuna.jpg', 'Tuna', NULL, 'Rio Mare', 'http://www.riomare.it');
INSERT INTO "ingredients" VALUES (24, 6, 'IP_ADDRESS_AND_PORT/ingredients/onions.jpg', 'Onions', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (25,7, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.jpg', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (26, 7, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (27, 7, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (28,7, 'IP_ADDRESS_AND_PORT/ingredients/egg.jpg','Eggs', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (29,8, 'IP_ADDRESS_AND_PORT/ingredients/rigatoniglutenfree.jpg' , 'Gluten-free short rigatoni', NULL, 'Rummo', 'http://www.pastarummo.it');
INSERT INTO "ingredients" VALUES (30,8, 'IP_ADDRESS_AND_PORT/ingredients/guanciale.jpg' , 'Guanciale', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (31,8, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (32,8, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (33,9, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (34,9, 'IP_ADDRESS_AND_PORT/ingredients/guanciale.jpg' , 'Guanciale', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (35,9, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (36,9, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (37,10, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (38,10, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (39,10, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (40,11, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.jpg', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (41, 11, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (42, 11, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (43,11, 'IP_ADDRESS_AND_PORT/ingredients/egg.jpg','Eggs', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (44, 11, 'IP_ADDRESS_AND_PORT/ingredients/mushrooms.jpg', 'Mushrooms', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (45,11, 'IP_ADDRESS_AND_PORT/ingredients/bakedham.jpg','Baked ham', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (46, 12, 'IP_ADDRESS_AND_PORT/ingredients/buns.jpg', 'Buns', 'gluten', 'Mulino Bianco', 'http://www.mulinobianco.it');
INSERT INTO "ingredients" VALUES (47, 12, 'IP_ADDRESS_AND_PORT/ingredients/beef.jpg', 'Ground Beef', NULL, 'GrassFed', 'http://www.grassfed.com');
INSERT INTO "ingredients" VALUES (48, 12, 'IP_ADDRESS_AND_PORT/ingredients/cheddar.jpg', 'Cheddar', 'lactose', 'Kraft', 'http://www.kraft.com');
INSERT INTO "ingredients" VALUES (49, 12, 'IP_ADDRESS_AND_PORT/ingredients/onions.jpg', 'Onions', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (50, 12, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes.jpg', 'Tomatoes', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (51, 12, 'IP_ADDRESS_AND_PORT/ingredients/pickles.jpg', 'Pickles', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (52,13, 'IP_ADDRESS_AND_PORT/ingredients/darkchocolate.jpg' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com');
INSERT INTO "ingredients" VALUES (53,13, 'IP_ADDRESS_AND_PORT/ingredients/cottagecheese.jpg' , 'Cottage cheese', 'lactose', 'Exquisa', 'https://www.exquisa.it/');
INSERT INTO "ingredients" VALUES (54,13, 'IP_ADDRESS_AND_PORT/ingredients/egg.jpg','Eggs', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (55,14, 'IP_ADDRESS_AND_PORT/ingredients/darkchocolate.jpg' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com');
INSERT INTO "ingredients" VALUES (56,14, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks.jpg' , 'Egg yolks', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (57,14, 'IP_ADDRESS_AND_PORT/ingredients/rumbacardi.jpg' , 'White rum', 'alcohol', 'Bacardi', 'https://www.bacardi.com');
INSERT INTO "ingredients" VALUES (58,14, 'IP_ADDRESS_AND_PORT/ingredients/coffee.png' , 'Coffee', NULL, 'Lavazza', 'https://www.lavazza.it');
INSERT INTO "ingredients" VALUES (59,21, 'IP_ADDRESS_AND_PORT/ingredients/fusilliglutenfree.jpg' , 'Fusilli gluten-free', NULL, 'Rummo', 'http://www.pastarummo.it');
INSERT INTO "ingredients" VALUES (60, 21, 'IP_ADDRESS_AND_PORT/ingredients/parmesan_cheese.png', 'Parmesan Cheese', 'lactose', 'Kraft', 'http://www.kraft.com');
INSERT INTO "ingredients" VALUES (61, 21, 'IP_ADDRESS_AND_PORT/ingredients/basil.jpg', 'Fresh Basil', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (62, 21, 'IP_ADDRESS_AND_PORT/ingredients/garlic.jpg', 'Garlic', NULL, 'LocalFarm', NULL);

INSERT INTO "ingredients" VALUES (63,22, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (64,22, 'IP_ADDRESS_AND_PORT/ingredients/guanciale.jpg' , 'Guanciale', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (65,22, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks.jpg' , 'Egg yolks', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (66,22, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (67,22, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (68,23, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.jpg', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (69,23, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (70, 23, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (71,24, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (72,24, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (73, 24, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (74, 24, 'IP_ADDRESS_AND_PORT/ingredients/pepperoni.jpg', 'Pepperonis', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (75,25, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.png', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (76, 25, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (77, 25, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (78, 25, 'IP_ADDRESS_AND_PORT/ingredients/aubergine.jpg', 'Aubergines', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (79, 25, 'IP_ADDRESS_AND_PORT/ingredients/potatoes.jpg', 'Potatoes', NULL, 'McCain', 'http://www.mccain.com');
INSERT INTO "ingredients" VALUES (80, 25, 'IP_ADDRESS_AND_PORT/ingredients/spinach.jpg', 'Spinaches', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (81, 26, 'IP_ADDRESS_AND_PORT/ingredients/lasagna.jpg' , 'Lasagna', 'gluten', 'Homemade', NULL);
INSERT INTO "ingredients" VALUES (82, 26, 'IP_ADDRESS_AND_PORT/ingredients/pumpkin.jpg', 'Pumpkins', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (83, 26, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (84,26, 'IP_ADDRESS_AND_PORT/ingredients/bacon.jpg', 'Bacon', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (85, 27, 'IP_ADDRESS_AND_PORT/ingredients/tuna.jpg', 'Tuna', NULL, 'Rio Mare', 'http://www.riomare.it');
INSERT INTO "ingredients" VALUES (86, 27, 'IP_ADDRESS_AND_PORT/ingredients/onions.jpg', 'Onions', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (87,28, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.jpg', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (88, 28, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (89, 28, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (90,28, 'IP_ADDRESS_AND_PORT/ingredients/egg.jpg','Eggs', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (91,29, 'IP_ADDRESS_AND_PORT/ingredients/rigatoniglutenfree.jpg' , 'Gluten-free short rigatoni', NULL, 'Rummo', 'http://www.pastarummo.it');
INSERT INTO "ingredients" VALUES (92,29, 'IP_ADDRESS_AND_PORT/ingredients/guanciale.jpg' , 'Guanciale', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (93,29, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (94,29, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (95,30, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (96,30, 'IP_ADDRESS_AND_PORT/ingredients/guanciale.jpg' , 'Guanciale', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (97,30, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (98,30, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (99,31, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'http://www.barilla.com');
INSERT INTO "ingredients" VALUES (100,31, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'http://www.volpetti.com');
INSERT INTO "ingredients" VALUES (101,31, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" (id, dishId, image, name, brandName, brandLink) VALUES (102,32, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.jpg', 'Tomato Sauce', 'Mutti', 'https://mutti-parma.com');
INSERT INTO "ingredients" VALUES (103, 32, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'http://www.galbani.com');
INSERT INTO "ingredients" VALUES (104, 32, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Olive Oil', NULL, 'Monini', 'http://www.monini.com');
INSERT INTO "ingredients" VALUES (105,32, 'IP_ADDRESS_AND_PORT/ingredients/egg.jpg','Eggs', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (106, 32, 'IP_ADDRESS_AND_PORT/ingredients/mushrooms.jpg', 'Mushrooms', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (107,32, 'IP_ADDRESS_AND_PORT/ingredients/bakedham.jpg','Baked ham', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (108, 33, 'IP_ADDRESS_AND_PORT/ingredients/buns.jpg', 'Buns', 'gluten', 'Mulino Bianco', 'http://www.mulinobianco.it');
INSERT INTO "ingredients" VALUES (109, 33, 'IP_ADDRESS_AND_PORT/ingredients/beef.jpg', 'Ground Beef', NULL, 'GrassFed', 'http://www.grassfed.com');
INSERT INTO "ingredients" VALUES (110, 33, 'IP_ADDRESS_AND_PORT/ingredients/cheddar.jpg', 'Cheddar', 'lactose', 'Kraft', 'http://www.kraft.com');
INSERT INTO "ingredients" VALUES (111, 33, 'IP_ADDRESS_AND_PORT/ingredients/onions.jpg', 'Onions', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (112, 33, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes.jpg', 'Tomatoes', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (113, 33, 'IP_ADDRESS_AND_PORT/ingredients/pickles.jpg', 'Pickles', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (114,34, 'IP_ADDRESS_AND_PORT/ingredients/darkchocolate.jpg' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com');
INSERT INTO "ingredients" VALUES (115,34, 'IP_ADDRESS_AND_PORT/ingredients/cottagecheese.jpg' , 'Cottage cheese', 'lactose', 'Exquisa', 'https://www.exquisa.it/');
INSERT INTO "ingredients" VALUES (116,34, 'IP_ADDRESS_AND_PORT/ingredients/egg.jpg','Eggs', NULL, 'LocalBreeding', NULL);
INSERT INTO "ingredients" VALUES (117,35, 'IP_ADDRESS_AND_PORT/ingredients/darkchocolate.jpg' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com');
INSERT INTO "ingredients" VALUES (118,35, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks.jpg' , 'Egg yolks', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (119,35, 'IP_ADDRESS_AND_PORT/ingredients/rumbacardi.jpg' , 'White rum', 'alcohol', 'Bacardi', 'https://www.bacardi.com');
INSERT INTO "ingredients" VALUES (120,35, 'IP_ADDRESS_AND_PORT/ingredients/coffee.png' , 'Coffee', NULL, 'Lavazza', 'https://www.lavazza.it');
INSERT INTO "ingredients" VALUES (121,42, 'IP_ADDRESS_AND_PORT/ingredients/fusilliglutenfree.jpg' , 'Fusilli gluten-free', NULL, 'Rummo', 'http://www.pastarummo.it');
INSERT INTO "ingredients" VALUES (122, 42, 'IP_ADDRESS_AND_PORT/ingredients/parmesan_cheese.png', 'Parmesan Cheese', 'lactose', 'Kraft', 'http://www.kraft.com');
INSERT INTO "ingredients" VALUES (123, 42, 'IP_ADDRESS_AND_PORT/ingredients/basil.jpg', 'Fresh Basil', NULL, 'LocalFarm', NULL);
INSERT INTO "ingredients" VALUES (124, 42, 'IP_ADDRESS_AND_PORT/ingredients/garlic.jpg', 'Garlic', NULL, 'LocalFarm', NULL);


INSERT INTO "users" VALUES ('Andrea','Piazza Carlo Felice, 63, 10123 Torino TO;lat:45.0631586;lng:7.6800018',0);
INSERT INTO "users" VALUES ('Giuseppe','Via Roma, 357, 10123 Torino TO;lat:45.0644910;lng:7.6804360',0);  
INSERT INTO "users" VALUES ('Luca','Corso Bolzano, 8, 10121 Torino TO;lat:45.0690537;lng:7.6650231',0);
INSERT INTO "users" VALUES ('Giovanni','Corso Giacomo Matteotti, 42, 10121 Torino TO;lat:45.0693429;lng:7.6668350',0);
INSERT INTO "users" VALUES ('Alessandro','Via Piave, 1, 10122 Torino TO;lat:45.0748358;lng:7.6751709',0);
INSERT INTO "users" VALUES ('Davide','Via Cesare Battisti, 7, 10123 Torino TO;lat:45.0694684;lng:7.6856760',0);
INSERT INTO "users" VALUES ('User','Via Montebello, 6, 10124 Torino TO;lat:45.0682528;lng:7.6923044',0);
INSERT INTO "users" VALUES ('Restaurateur','Via Ascanio Vittozzi, 30, 10131 Torino TO;lat:45.0614369;lng:7.6992785',1);

INSERT INTO "reviews" VALUES (1,'Andrea', 1, DATE('2023-02-28') ,'Great Experience', 'Had a wonderful time!', 5, 4, 4);
INSERT INTO "reviews" VALUES (2,'Giuseppe', 2, DATE('2023-03-28'), 'Awesome Food', 'The pizza was fantastic!', 5, 4, 4);
INSERT INTO "reviews" VALUES (3,'Luca', 3, DATE('2023-02-21'), 'Delicious Pasta', 'Enjoyed the spaghetti!', 4, 4, 3);
INSERT INTO "reviews" VALUES (4,'Giovanni', 4, DATE('2023-04-22'), 'Pizza Lover’s Paradise', 'Great variety of pizzas!', 5, 4, 4);
INSERT INTO "reviews" VALUES (5,'Alessandro', 5, DATE('2023-02-15'), 'Cozy Atmosphere', 'Lovely place for dinner!', 4, 4, 3);
INSERT INTO "reviews" VALUES (6,'Davide', 6, DATE('2023-08-20'), 'Excellent Service', 'Staff was friendly and attentive!', 5, 4, 4);
INSERT INTO "reviews" VALUES (7,'Luca', 4, DATE('2023-02-21'), 'Delicious Pizza', 'Enjoyed the spaghetti!', 4, 4, 3);
INSERT INTO "reviews" VALUES (8,'Luca', 5, DATE('2023-02-21'), 'Delicious Hamburger', 'Enjoyed the spaghetti!', 4, 4, 3);


COMMIT;
