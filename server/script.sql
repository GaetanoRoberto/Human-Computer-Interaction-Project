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

INSERT INTO "restaurants" VALUES (1,0, 'IP_ADDRESS_AND_PORT/restaurants/sorbillo.jpg', 'Sorbillo', 'Via Bruno Buozzi, 3, 10121 Torino TO;lat:45.0658389;lng:7.6797594', '+3901119234672', 'https://www.sorbillo.it/', 'https://www.facebook.com/PizzeriaGinoSorbillo/', 'https://www.instagram.com/sorbillo/', 'https://www.twitter.com/sorbillo/', 'Mon=8:30-10:30;12:30-15:30/Tue=8:30-10:30;12:30-15:30/Wed=8:30-10:30;12:30-15:30/Thu=8:30-10:30;12:30-15:30/Fri=8:30-10:30;12:30-15:30/Sat=8:30-10:30;12:30-15:30/Sun=8:30-10:30;12:30-15:30', 'Gino Sorbillo belongs to one of the oldest pizza chef families in Naples. he grew up in the family pizzeria and soon learned the secrets of real Neapolitan pizza. With Gino Sorbillo, Neapolitan Pizza has reached very high quality levels and has rightfully earned its place among the best Italian gastronomic excellences.');
INSERT INTO "restaurants" VALUES (2,0, 'IP_ADDRESS_AND_PORT/restaurants/anticovinaio.jpg', "All'Antico Vinaio", "Via Sant'Ottavio, 18, 10124 Torino TO;lat:45.0674448;lng:7.6941677", '+390116988025', 'https://www.allanticovinaio.com/', 'https://www.facebook.com/AllAnticoVinaio/', 'https://www.instagram.com/allanticovinaiofirenze/', NULL , 'Tue=11:00-22:00/Wed=11:00-22:00/Thu=11:00-22:00/Fri=11:00-22:00/Sat=11:00-22:00/Sun=11:00-22:00', 'The history of Antico Vinaio began in 1989, when the Mazzanti family took over a small rotisserie in via dei Neri, just 250 meters from the Uffizi Gallery. After Tommaso joined the company in 2006, the rotisserie transformed into a squash shop and in a short time the place became a point of reference for Florence and street food lovers. More than as an entrepreneur, and since the end of 2016 as owner of the family business, Tommaso simply feels like a winemaker. He never liked studying, but he already had a B plan.');
INSERT INTO "restaurants" VALUES (3,0, 'IP_ADDRESS_AND_PORT/restaurants/pizzium.jpg', 'Pizzium', 'Via Torquato Tasso, 5, 10122 Torino TO;lat:45.0738869;lng:7.6825461', '+3901119585395', 'https://pizzium.com/', 'https://www.facebook.com/pizzium', 'https://www.instagram.com/pizzium/', NULL , 'Mon=12:30-15:00;19:00-23:30/Tue=12:30-15:00;19:00-23:30/Wed=12:30-15:00;19:00-23:30/Thu=12:30-15:00;19:00-23:30/Fri=12:30-15:00;19:00-23:30/Sat=12:30-15:00;19:00-23:30/Sun=12:30-15:00;19:00-23:30', 'Born in 2017 in Milan from an idea by Stefano Saturnino, Giovanni Arbellini and Ilaria Puddu, Pizzium offers classic Neapolitan pizza using the best of Italian raw materials. The Pizzium style is unmistakable, but each venue is unique because it draws inspiration from the land that hosts it, without giving up the best of Naples and Campania.');
INSERT INTO "restaurants" VALUES (4,0, 'IP_ADDRESS_AND_PORT/restaurants/rossopomodoro.jpg', 'Rossopomodoro', 'Via Nizza, 2, 10126 Torino TO;lat:45.0623010;lng:7.6781004', '+3901119781792', 'https://www.rossopomodoro.it/', 'https://www.facebook.com/rossopomodoroofficial', 'https://www.instagram.com/rossopomodoro_italia/', 'https://twitter.com/i/flow/login?redirect_after_login=%2FRossopomodoroOF', 'Mon=8:00-22:00/Tue=8:00-22:00/Wed=8:00-22:00/Thu=8:00-22:00/Fri=8:00-22:00/Sat=8:00-22:00/Sun=8:00-22:00', 'Founded in Naples - the home of pizza - in 1998, by three young people passionate about artisanal Neapolitan cuisine and pizza, Rossopomodoro has grown to become a point of reference for millions of people around the world. With over 100 restaurants in Italy and around the world, we have built an enviable reputation over 20 years, offering true Neapolitan pizza, with long-leavened dough cooked in a wood-fired oven, traditional Campania recipes and the best Italian excellences.');
INSERT INTO "restaurants" VALUES (5,0, 'IP_ADDRESS_AND_PORT/restaurants/assaje.jpg', 'Assaje', 'Via Andrea Doria, 11, 10123 Torino TO;lat:45.0640710;lng:7.6834790', '+390117802618', 'https://www.assaje.it/', 'https://www.facebook.com/pizzeriaassaje/', 'https://www.instagram.com/pizzeria_assaje/', NULL ,'Mon=12:00-15:00;19:00-00:00/Tue=12:00-15:00;19:00-00:00/Wed=12:00-15:00;19:00-00:00/Fri=12:00-15:00;19:00-00:00/Sat=12:00-15:00;19:00-00:00/Sun=12:00-15:00;19:00-00:00', 'The Assaje pizzeria in Milan is a concept born from a group of Neapolitans who decided to export the flavors of true Neapolitan pizza to the Lombard capital. Gourmet pizzas and traditional Neapolitan recipes are what Assaje restaurants offer. All the products are distributed by local farmers and the basic idea is to bring the true flavors of Campania back to the table. For this reason the suppliers are exclusively Neapolitan, so as to re-propose the true dishes of a gastronomic culture with an ancient history.');
INSERT INTO "restaurants" VALUES (6,0, 'IP_ADDRESS_AND_PORT/restaurants/skassapanza.jpg', 'Skassapanza', 'Via Pasquale Paoli, 54a, 10134 Torino TO;lat:45.0351312;lng:7.6522041', '+390117931455', 'https://skassapanza.it/', 'https://www.facebook.com/skassapanza', 'https://www.instagram.com/skassapanza/', NULL, 'Mon=12:00-15:00;19:00-00:00/Tue=12:00-15:00;19:00-00:00/Wed=12:00-15:00;19:00-00:00/Fri=12:00-15:00;19:00-00:00/Sat=12:00-15:00;19:00-00:00/Sun=12:00-15:00;19:00-00:00', 'Skassapanza was born from the will of two friends, Vito and Enzo, who after years of entrepreneurial experience, with a strong passion for food, decided to open a hamburger/rotisserie aimed, immediately, at customizing their own menu. The idea was born precisely from this vision which, still today, is the peculiarity of the Skassapanza premises: you decide how to compose your hamburger.');
INSERT INTO "restaurants" VALUES (7,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Miscusi', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Mon=12:00-15:00;19:00-00:00/Tue=12:00-15:00;19:00-00:00/Wed=12:00-15:00;19:00-00:00/Fri=12:00-15:00;19:00-00:00/Sat=12:00-15:00;19:00-00:00/Sun=12:00-15:00;19:00-00:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
INSERT INTO "restaurants" VALUES (8,0, 'IP_ADDRESS_AND_PORT/restaurants/kebhouze.jpg', 'Kebhouze', "Via Sant'Ottavio, 12, 10124 Torino TO;lat:45.0672279;lng:7.6934870", '+390115360282', 'https://kebhouze.com/', 'https://www.facebook.com/kebhouze', 'https://www.instagram.com/kebhouze', 'https://twitter.com/kebhouze', 'Mon=12:00-15:00;19:00-22:00/Tue=12:00-15:00;19:00-22:00/Wed=12:00-15:00;19:00-22:00/Fri=12:00-15:00;19:00-22:00/Sat=12:00-15:00;19:00-22:00/Sun=12:00-15:00;19:00-22:00', 'Kebhouze presents a kebab in two versions, 100% Italian chicken or black angus. This last option constitutes great innovation in the kebab market. Particular attention was also paid during the project construction and product selection phase to the theme of environmental sustainability: the food packaging is completely eco-friendly, including the natural waters in tetrapacks branded Kebhouze.');
INSERT INTO "restaurants" VALUES (9,0, 'IP_ADDRESS_AND_PORT/restaurants/lapiadineria.jpg', 'La Piadineria', "C.so Vittorio Emanuele II, 30, 10123 Torino TO;lat:45.0604983;lng:7.6858390", '+390118391234', 'https://www.lapiadineria.com/', 'https://www.facebook.com/LaPiadineriaOfficial', 'https://www.instagram.com/la_piadineria_official/', 'https://twitter.com/LaPiadineria', 'Mon=12:00-15:00;19:00-22:00/Tue=12:00-15:00;19:00-22:00/Wed=12:00-15:00;19:00-22:00/Thu=12:00-15:00;19:00-22:00/Fri=12:00-15:00;19:00-22:00/Sat=12:00-15:00;19:00-22:00/Sun=12:00-15:00;19:00-22:00', 'In 1994, two boys decided to open a piadina shop in the center of Brescia. They are just over 20 years old, have an aunt from Emilia, a secret recipe and a mixer. The piadineria is already there: a hot and good piadina made on the spot, very fresh ingredients and a big dream.');
-- INSERT INTO "restaurants" VALUES (10,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Cannavacciuolo', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
-- INSERT INTO "restaurants" VALUES (11,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'PoorManger', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
-- INSERT INTO "restaurants" VALUES (12,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Poke', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
-- INSERT INTO "restaurants" VALUES (13,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Sushi', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
-- INSERT INTO "restaurants" VALUES (14,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Gelateria', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
-- INSERT INTO "restaurants" VALUES (15,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Tacos', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
-- INSERT INTO "restaurants" VALUES (16,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Toasteria', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
-- INSERT INTO "restaurants" VALUES (17,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Vegetariano', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');
-- INSERT INTO "restaurants" VALUES (18,0, 'IP_ADDRESS_AND_PORT/restaurants/miscusi.jpg', 'Posto GlutenFree', "Via Principi d'Acaja, 32, 10138 Torino TO;lat:45.0739081;lng:7.6625995", '+393386292876', 'https://www.miscusi.com/', 'https://www.facebook.com/miscusi.official', 'https://www.instagram.com/miscusi.family/', NULL, 'Sun=12:00-15:00;19:00-22:00', 'Miscusi exists to make people happy by spreading a Mediterranean lifestyle. In 2017, the first restaurant launched in Milan and in just five years, the brand expanded to 12 restaurants across six Italian cities and 2 restaurants in London. Miscusi obtained B-Corp certification in the summer of 2021, thus becoming part of a movement of companies with a common goal, to be protagonists of global change and regenerate society through business, by creating a positive social and environmental impact.');


INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Carbonara', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacarbonara.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Margherita', 7.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/margherita.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Pepperoni', 9.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/pepperonipizza.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Vegetarian', 9.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/vegetariana.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Pumpkin Lasagna', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Tonno e cipolla', 10.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/tonnoCipolla.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Bismark', 10.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/bismark.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Amatriciana', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastaamatriciana.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Gricia', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastagricia.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Cacio e pepe', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacacioepepe.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Capricciosa', 10.99, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/capricciosa.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (6, 'Cheeseburger', 10.99, 'hamburger', 'IP_ADDRESS_AND_PORT/dishes/cheeseburger.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Chocolate Cheesecake', 5.00, 'desserts', 'IP_ADDRESS_AND_PORT/dishes/chocolatecheesecake.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Tiramisù', 5.00, 'desserts', 'IP_ADDRESS_AND_PORT/dishes/tiramisu.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (1, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Pesto pasta', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastapesto.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Carbonara', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacarbonara1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Margherita', 7.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/margherita1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Pepperoni', 9.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/pepperonipizza1.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Vegetarian', 9.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/vegetariana2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Pumpkin Lasagna', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Tonno e cipolla', 10.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/tonnoCipolla1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Bismark', 10.00, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/bismark2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Amatriciana', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastaamatriciana1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Gricia', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastagricia1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Cacio e pepe', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacacioepepe1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Capricciosa', 10.99, 'pizza', 'IP_ADDRESS_AND_PORT/dishes/capricciosa1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Cheeseburger', 10.99, 'hamburger', 'IP_ADDRESS_AND_PORT/dishes/cheeseburger1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Chocolate Cheesecake', 5.00, 'desserts', 'IP_ADDRESS_AND_PORT/dishes/chocolatecheesecake1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Tiramisù', 5.00, 'desserts', 'IP_ADDRESS_AND_PORT/dishes/tiramisu1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola1.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (2, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Pesto pasta', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastapesto1.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Carbonara', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacarbonara2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Pumpkin Lasagna', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Amatriciana', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastaamatriciana2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Gricia', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastagricia2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Cacio e pepe', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastacacioepepe2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Pesto pasta', 10.00, 'pasta', 'IP_ADDRESS_AND_PORT/dishes/pastapesto2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola2.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (3, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite2.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Chicken Up', 12.00, 'kebab', 'IP_ADDRESS_AND_PORT/dishes/chickenup.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Little Italy', 13.00, 'kebab', 'IP_ADDRESS_AND_PORT/dishes/littleitaly.jpg');

INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Chicken Classic', 14.00, 'kebab', 'IP_ADDRESS_AND_PORT/dishes/chickenclassic.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Kebby King', 15.00, 'kebab', 'IP_ADDRESS_AND_PORT/dishes/kebbyking.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater3.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola3.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero3.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta3.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (4, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite3.jpg');

INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Il papripollo', 13.00, 'piadina', 'IP_ADDRESS_AND_PORT/dishes/ilpapripollo.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, "L'avopollo", 13.00, 'piadina', 'IP_ADDRESS_AND_PORT/dishes/avopollo.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Il patapollo', 13.00, 'piadina', 'IP_ADDRESS_AND_PORT/dishes/patapollo.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Il parmipollo', 13.00, 'piadina', 'IP_ADDRESS_AND_PORT/dishes/parmipollo.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater4.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola4.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero4.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta4.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (5, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite4.jpg');


INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (6, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater5.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (6, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (6, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola5.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (6, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero5.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (6, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta5.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (6, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite5.jpg');

INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater6.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola6.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero6.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta6.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (7, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite6.jpg');

INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater7.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola7.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero7.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta7.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (8, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite7.jpg');

INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Natural Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/naturalwater8.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Sparkling Water', 1.00, 'drinks', 'IP_ADDRESS_AND_PORT/placeholder2.png');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Coca cola', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacola8.jpeg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Coca cola zero', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/cocacolazero8.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Fanta', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/fanta8.jpg');
INSERT INTO "dishes" ("restaurantId", "name", "price", "type", "image") VALUES (9, 'Sprite', 2.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/sprite8.jpg');



-- INSERT INTO "dishes" VALUES (75,6, 'Moretti Beer 33cl', 3.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/birramoretti.jpg');
-- INSERT INTO "dishes" VALUES (76,7, 'Moretti Beer 33cl', 3.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/birramoretti.jpg');
-- INSERT INTO "dishes" VALUES (77,8, 'Moretti Beer 33cl', 3.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/birramoretti.jpg');
-- INSERT INTO "dishes" VALUES (78,9, 'Moretti Beer 33cl', 3.00, 'drinks', 'IP_ADDRESS_AND_PORT/dishes/birramoretti.jpg');

INSERT INTO "ingredients" VALUES (1,1, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (2,1, 'IP_ADDRESS_AND_PORT/ingredients/guanciale.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (3,1, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks.jpg' , 'Egg yolks', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (4,1, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (5,1, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (6,2, 'IP_ADDRESS_AND_PORT/ingredients/whiteflour.jpg' , 'White Flour', 'gluten', 'NaturaSI', 'https://www.naturasi.it/prodotti/farina-di-farro-bianca-naturasi-42883');
INSERT INTO "ingredients" VALUES (7,2, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (8,2, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (185, 2, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (9,3, 'IP_ADDRESS_AND_PORT/ingredients/whiteflour1.jpg' , 'White Flour', 'gluten', 'NaturaSI', 'https://www.naturasi.it/prodotti/farina-di-farro-bianca-naturasi-42883');
INSERT INTO "ingredients" VALUES (10,3, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce1.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (11,3, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella1.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (12, 3, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil1.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (186, 3, 'IP_ADDRESS_AND_PORT/ingredients/pepperoni.jpg', 'Pepperonis', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (13,4, 'IP_ADDRESS_AND_PORT/ingredients/whiteflour2.jpg' , 'White Flour', 'gluten', 'NaturaSI', 'https://www.naturasi.it/prodotti/farina-di-farro-bianca-naturasi-42883');
INSERT INTO "ingredients" VALUES (14,4, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce2.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (15, 4, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella2.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (16, 4, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil2.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (17, 4, 'IP_ADDRESS_AND_PORT/ingredients/aubergine.jpg', 'Aubergines', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (18, 4, 'IP_ADDRESS_AND_PORT/ingredients/potatoes.jpg', 'Potatoes', NULL, 'McCain', 'https://www.mccainpotatoes.com/products/classic-cut-fries');
INSERT INTO "ingredients" VALUES (187, 4, 'IP_ADDRESS_AND_PORT/ingredients/spinach.jpg', 'Spinaches', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (19, 5, 'IP_ADDRESS_AND_PORT/ingredients/lasagna.jpg' , 'Lasagna', 'gluten', 'Homemade', NULL);
INSERT INTO "ingredients" VALUES (20, 5, 'IP_ADDRESS_AND_PORT/ingredients/pumpkin.jpg', 'Pumpkins', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (21, 5, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella3.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (22,5, 'IP_ADDRESS_AND_PORT/ingredients/bacon.jpg', 'Bacon', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (23,6, 'IP_ADDRESS_AND_PORT/ingredients/whiteflour3.jpg' , 'White Flour', 'gluten', 'NaturaSI', 'https://www.naturasi.it/prodotti/farina-di-farro-bianca-naturasi-42883');
INSERT INTO "ingredients" VALUES (24, 6, 'IP_ADDRESS_AND_PORT/ingredients/tuna.jpg', 'Tuna', NULL, 'Rio Mare', 'https://www.riomare.it/prodotti/tonno-olio-di-oliva/tonno-allolio-di-oliva/');
INSERT INTO "ingredients" VALUES (188, 6, 'IP_ADDRESS_AND_PORT/ingredients/onions.jpg', 'Onions', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (25,7, 'IP_ADDRESS_AND_PORT/ingredients/whiteflour4.jpg' , 'White Flour', 'gluten', 'NaturaSI', 'https://www.naturasi.it/prodotti/farina-di-farro-bianca-naturasi-42883');
INSERT INTO "ingredients" VALUES (26,7, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce3.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (27, 7, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella4.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (28, 7, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil3.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (189,7, 'IP_ADDRESS_AND_PORT/ingredients/egg.jpg','Eggs', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (29,8, 'IP_ADDRESS_AND_PORT/ingredients/rigatoniglutenfree.jpg' , 'Gluten-free short rigatoni', NULL, 'Rummo', 'https://www.pastarummo.it/prodotti/senza-glutine/mezzi-rigatoni-gluten-free-51/');
INSERT INTO "ingredients" VALUES (30,8, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce10.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (31,8, 'IP_ADDRESS_AND_PORT/ingredients/guanciale1.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (32,8, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano1.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (197,8, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper1.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (33,9, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti1.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (34,9, 'IP_ADDRESS_AND_PORT/ingredients/guanciale2.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (35,9, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano2.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (36,9, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper2.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (37,10, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti2.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (38,10, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano3.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (39,10, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper3.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (40,11, 'IP_ADDRESS_AND_PORT/ingredients/whiteflour5.jpg' , 'White Flour', 'gluten', 'NaturaSI', 'https://www.naturasi.it/prodotti/farina-di-farro-bianca-naturasi-42883');
INSERT INTO "ingredients" VALUES (41, 11, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce4.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (42, 11, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella5.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (43, 11, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil4.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (44,11, 'IP_ADDRESS_AND_PORT/ingredients/egg1.jpg','Eggs', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (45, 11, 'IP_ADDRESS_AND_PORT/ingredients/mushrooms.jpg', 'Mushrooms', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (190,11, 'IP_ADDRESS_AND_PORT/ingredients/bakedham.jpg','Baked ham', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (46, 12, 'IP_ADDRESS_AND_PORT/ingredients/buns.jpg', 'Buns', 'gluten', 'Mulino Bianco', 'https://www.mulinobianco.it/pagnottelle-classiche');
INSERT INTO "ingredients" VALUES (47, 12, 'IP_ADDRESS_AND_PORT/ingredients/beef.jpg', 'Ground Beef', NULL, 'GrassFed', 'https://grassrunfarms.com/grass-fed-beef-products/85-15-ground-beef-brick/');
INSERT INTO "ingredients" VALUES (48, 12, 'IP_ADDRESS_AND_PORT/ingredients/cheddar.jpg', 'Cheddar', 'lactose', 'Kraft', 'https://www.mealswithkraft.com/en/products/kraft-cheddar-blocks/');
INSERT INTO "ingredients" VALUES (49, 12, 'IP_ADDRESS_AND_PORT/ingredients/onions1.jpg', 'Onions', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (50, 12, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes.jpg', 'Tomatoes', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (51, 12, 'IP_ADDRESS_AND_PORT/ingredients/pickles.jpg', 'Pickles', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (52,13, 'IP_ADDRESS_AND_PORT/ingredients/darkchocolate.jpg' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com/it/prodotti/nero/fondente-51');
INSERT INTO "ingredients" VALUES (53,13, 'IP_ADDRESS_AND_PORT/ingredients/cottagecheese.jpg' , 'Cottage cheese', 'lactose', 'Exquisa', 'https://www.exquisa.com/products/cottage-cheese/');
INSERT INTO "ingredients" VALUES (54,13, 'IP_ADDRESS_AND_PORT/ingredients/egg2.jpg','Eggs', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (55,14, 'IP_ADDRESS_AND_PORT/ingredients/darkchocolate1.jpg' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com/it/prodotti/nero/fondente-51');
INSERT INTO "ingredients" VALUES (56,14, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks1.jpg' , 'Egg yolks', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (57,14, 'IP_ADDRESS_AND_PORT/ingredients/rumbacardi.jpg' , 'White rum', 'alcohol', 'Bacardi', 'https://www.bacardi.com/our-rums/carta-blanca-rum/');
INSERT INTO "ingredients" VALUES (58,14, 'IP_ADDRESS_AND_PORT/ingredients/coffee.png' , 'Coffee', NULL, 'Lavazza', 'https://www.lavazza.it/it/capsule/a-modo-mio-crema-e-gusto');
INSERT INTO "ingredients" VALUES (59,21, 'IP_ADDRESS_AND_PORT/ingredients/fusilliglutenfree.jpg' , 'Fusilli gluten-free', NULL, 'Rummo', 'https://www.pastarummo.it/prodotti/senza-glutine/fusilli-gluten-free-48/');
INSERT INTO "ingredients" VALUES (60, 21, 'IP_ADDRESS_AND_PORT/ingredients/parmesan_cheese.png', 'Parmesan Cheese', 'lactose', 'Kraft', 'https://kraftnaturalcheese.com/parmesan-cheese/');
INSERT INTO "ingredients" VALUES (61, 21, 'IP_ADDRESS_AND_PORT/ingredients/basil.jpg', 'Fresh Basil', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (62, 21, 'IP_ADDRESS_AND_PORT/ingredients/garlic.jpg', 'Garlic', NULL, 'Local Farm', NULL);

INSERT INTO "ingredients" VALUES (63,22, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti3.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (64,22, 'IP_ADDRESS_AND_PORT/ingredients/guanciale3.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (65,22, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks2.jpg' , 'Egg yolks', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (66,22, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano4.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (67,22, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper4.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (68,23, 'IP_ADDRESS_AND_PORT/ingredients/glutenfreeflour.jpg' , 'Gluten Free Oat Flour', NULL, 'Sarchio', 'https://www.sarchio.com/en/bioproducts/whole-oat-flour');
INSERT INTO "ingredients" VALUES (69,23, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce5.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (70,23, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella6.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (191, 23, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil5.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (71,24, 'IP_ADDRESS_AND_PORT/ingredients/glutenfreeflour1.jpg' , 'Gluten Free Oat Flour', NULL, 'Sarchio', 'https://www.sarchio.com/en/bioproducts/whole-oat-flour');
INSERT INTO "ingredients" VALUES (72, 24, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce6.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (73,24, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella7.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (74, 24, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil6.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (192, 24, 'IP_ADDRESS_AND_PORT/ingredients/pepperoni1.jpg', 'Pepperonis', NULL, 'Local Farm', NULL);

INSERT INTO "ingredients" VALUES (75,25, 'IP_ADDRESS_AND_PORT/ingredients/glutenfreeflour2.jpg' , 'Gluten Free Oat Flour', NULL, 'Sarchio', 'https://www.sarchio.com/en/bioproducts/whole-oat-flour');
INSERT INTO "ingredients" VALUES (76, 25, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce7.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (77, 25, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella8.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (78, 25, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil7.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (79, 25, 'IP_ADDRESS_AND_PORT/ingredients/aubergine1.jpg', 'Aubergines', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (80, 25, 'IP_ADDRESS_AND_PORT/ingredients/potatoes1.jpg', 'Potatoes', NULL, 'McCain', 'https://www.mccainpotatoes.com/products/classic-cut-fries');
INSERT INTO "ingredients" VALUES (193, 25, 'IP_ADDRESS_AND_PORT/ingredients/spinach1.jpg', 'Spinaches', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (81, 26, 'IP_ADDRESS_AND_PORT/ingredients/lasagna1.jpg' , 'Lasagna', 'gluten', 'Homemade', NULL);
INSERT INTO "ingredients" VALUES (82, 26, 'IP_ADDRESS_AND_PORT/ingredients/pumpkin1.jpg', 'Pumpkins', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (83, 26, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella9.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (84,26, 'IP_ADDRESS_AND_PORT/ingredients/bacon1.jpg', 'Bacon', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (85,27, 'IP_ADDRESS_AND_PORT/ingredients/glutenfreeflour3.jpg' , 'Gluten Free Oat Flour', NULL, 'Sarchio', 'https://www.sarchio.com/en/bioproducts/whole-oat-flour');
INSERT INTO "ingredients" VALUES (86, 27, 'IP_ADDRESS_AND_PORT/ingredients/tuna1.jpg', 'Tuna', NULL, 'Rio Mare', 'https://www.riomare.it/prodotti/tonno-olio-di-oliva/tonno-allolio-di-oliva/');
INSERT INTO "ingredients" VALUES (194, 27, 'IP_ADDRESS_AND_PORT/ingredients/onions2.jpg', 'Onions', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (87,28, 'IP_ADDRESS_AND_PORT/ingredients/glutenfreeflour4.jpg' , 'Gluten Free Oat Flour', NULL, 'Sarchio', 'https://www.sarchio.com/en/bioproducts/whole-oat-flour');
INSERT INTO "ingredients" VALUES (88,28, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce8.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (89, 28, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella10.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (195, 28, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil8.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (90,28, 'IP_ADDRESS_AND_PORT/ingredients/egg3.jpg','Eggs', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (91,29, 'IP_ADDRESS_AND_PORT/ingredients/rigatoniglutenfree1.jpg' , 'Gluten-free short rigatoni', NULL, 'Rummo', 'https://www.pastarummo.it/prodotti/senza-glutine/mezzi-rigatoni-gluten-free-51/');
INSERT INTO "ingredients" VALUES (92,29, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce11.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (93,29, 'IP_ADDRESS_AND_PORT/ingredients/guanciale4.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (94,29, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano5.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (198,29, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper5.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (95,30, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti4.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (96,30, 'IP_ADDRESS_AND_PORT/ingredients/guanciale5.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (97,30, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano6.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (98,30, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper6.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (99,31, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti5.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (100,31, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano7.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (101,31, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper7.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (102,32, 'IP_ADDRESS_AND_PORT/ingredients/glutenfreeflour5.jpg' , 'Gluten Free Oat Flour', NULL, 'Sarchio', 'https://www.sarchio.com/en/bioproducts/whole-oat-flour');
INSERT INTO "ingredients" VALUES (103,32, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce9.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (104, 32, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella11.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (105, 32, 'IP_ADDRESS_AND_PORT/ingredients/olive_oil9.jpg', 'Extra Virgin Olive Oil', NULL, 'Monini', 'https://www.monini.com/it/p/olio-extra-vergine-classico');
INSERT INTO "ingredients" VALUES (106,32, 'IP_ADDRESS_AND_PORT/ingredients/egg4.jpg','Eggs', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (107, 32, 'IP_ADDRESS_AND_PORT/ingredients/mushrooms1.jpg', 'Mushrooms', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (196,32, 'IP_ADDRESS_AND_PORT/ingredients/bakedham1.jpg','Baked ham', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (108, 33, 'IP_ADDRESS_AND_PORT/ingredients/buns1.jpg', 'Buns', 'gluten', 'Mulino Bianco', 'https://www.mulinobianco.it/pagnottelle-classiche');
INSERT INTO "ingredients" VALUES (109, 33, 'IP_ADDRESS_AND_PORT/ingredients/beef1.jpg', 'Ground Beef', NULL, 'GrassFed', 'https://grassrunfarms.com/grass-fed-beef-products/85-15-ground-beef-brick/');
INSERT INTO "ingredients" VALUES (110, 33, 'IP_ADDRESS_AND_PORT/ingredients/cheddar_no_lactose.jpg', 'Lactose Free Cheddar', NULL, 'Paradise Island', 'https://paradise-foods.com');
INSERT INTO "ingredients" VALUES (111, 33, 'IP_ADDRESS_AND_PORT/ingredients/onions3.jpg', 'Onions', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (112, 33, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes1.jpg', 'Tomatoes', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (113, 33, 'IP_ADDRESS_AND_PORT/ingredients/pickles1.jpg', 'Pickles', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (114,34, 'IP_ADDRESS_AND_PORT/ingredients/darkchocolate2.jpg' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com/it/prodotti/granblocco/granblocco-extra-fondente');
INSERT INTO "ingredients" VALUES (115,34, 'IP_ADDRESS_AND_PORT/ingredients/cottagecheese1.jpg' , 'Cottage cheese', 'lactose', 'Exquisa', 'https://www.exquisa.com/products/cottage-cheese/');
INSERT INTO "ingredients" VALUES (116,34, 'IP_ADDRESS_AND_PORT/ingredients/egg5.jpg','Eggs', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (117,35, 'IP_ADDRESS_AND_PORT/ingredients/darkchocolate3.jpg' , 'Dark chocolate', 'gluten', 'Perugina', 'https://www.perugina.com/it/prodotti/granblocco/granblocco-extra-fondente');
INSERT INTO "ingredients" VALUES (118,35, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks3.jpg' , 'Egg yolks', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (119,35, 'IP_ADDRESS_AND_PORT/ingredients/rumbacardi1.jpg' , 'White rum', 'alcohol', 'Bacardi', 'https://www.bacardi.com/our-rums/carta-blanca-rum/');
INSERT INTO "ingredients" VALUES (120,35, 'IP_ADDRESS_AND_PORT/ingredients/coffee1.png' , 'Coffee', NULL, 'Lavazza', 'https://www.lavazza.it/it/capsule/a-modo-mio-crema-e-gusto');
INSERT INTO "ingredients" VALUES (121,42, 'IP_ADDRESS_AND_PORT/ingredients/fusilliglutenfree1.jpg' , 'Fusilli gluten-free', NULL, 'Rummo', 'https://www.pastarummo.it/prodotti/senza-glutine/fusilli-gluten-free-48/');
INSERT INTO "ingredients" VALUES (122, 42, 'IP_ADDRESS_AND_PORT/ingredients/parmesan_cheese1.png', 'Parmesan Cheese', 'lactose', 'Kraft', 'https://kraftnaturalcheese.com/parmesan-cheese/');
INSERT INTO "ingredients" VALUES (123, 42, 'IP_ADDRESS_AND_PORT/ingredients/basil1.jpg', 'Fresh Basil', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (124, 42, 'IP_ADDRESS_AND_PORT/ingredients/garlic1.jpg', 'Garlic', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (125,43, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti6.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (126,43, 'IP_ADDRESS_AND_PORT/ingredients/guanciale6.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (127,43, 'IP_ADDRESS_AND_PORT/ingredients/eggyolks4.jpg' , 'Egg yolks', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (128,43, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano8.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (129,43, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper8.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (130, 44, 'IP_ADDRESS_AND_PORT/ingredients/lasagna2.jpg' , 'Lasagna', 'gluten', 'Homemade', NULL);
INSERT INTO "ingredients" VALUES (131, 44, 'IP_ADDRESS_AND_PORT/ingredients/pumpkin2.jpg', 'Pumpkins', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (132, 44, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella12.jpg', 'Mozzarella Cheese', 'lactose', 'Galbani', 'https://www.galbani.com/products.php');
INSERT INTO "ingredients" VALUES (133,44, 'IP_ADDRESS_AND_PORT/ingredients/bacon2.jpg', 'Bacon', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (134,45, 'IP_ADDRESS_AND_PORT/ingredients/rigatoniglutenfree2.jpg' , 'Gluten-free short rigatoni', NULL, 'Rummo', 'https://www.pastarummo.it/prodotti/senza-glutine/mezzi-rigatoni-gluten-free-51/');
INSERT INTO "ingredients" VALUES (135,45, 'IP_ADDRESS_AND_PORT/ingredients/tomatosauce12.jpg', 'Tomato Sauce', 'nickel', 'Mutti', 'https://mutti-parma.com/product-category/tomato-puree/');
INSERT INTO "ingredients" VALUES (136,45, 'IP_ADDRESS_AND_PORT/ingredients/guanciale7.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (137,45, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano9.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (199,45, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper9.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (138,46, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti7.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (139,46, 'IP_ADDRESS_AND_PORT/ingredients/guanciale8.jpg' , 'Guanciale', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (140,46, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano10.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (141,46, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper10.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (142,47, 'IP_ADDRESS_AND_PORT/ingredients/spaghetti8.jpg' , 'Spaghetti', 'gluten', 'Barilla', 'https://www.barilla.com/it-it/prodotti/pasta/i-classici/spaghetti');
INSERT INTO "ingredients" VALUES (143,47, 'IP_ADDRESS_AND_PORT/ingredients/pecorinoromano11.jpg' , 'Pecorino Romano cheese', 'lactose', 'Volpetti', 'https://www.volpetti.com/prodotto/pecorino-romano-dop-12-mesi/');
INSERT INTO "ingredients" VALUES (144,47, 'IP_ADDRESS_AND_PORT/ingredients/blackpepper11.jpg' , 'Black pepper', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (145,48, 'IP_ADDRESS_AND_PORT/ingredients/fusilliglutenfree2.jpg' , 'Fusilli gluten-free', NULL, 'Rummo', 'https://www.pastarummo.it/prodotti/senza-glutine/fusilli-gluten-free-48/');
INSERT INTO "ingredients" VALUES (146, 48, 'IP_ADDRESS_AND_PORT/ingredients/parmesan_cheese2.png', 'Parmesan Cheese', 'lactose', 'Kraft', 'https://kraftnaturalcheese.com/parmesan-cheese/');
INSERT INTO "ingredients" VALUES (147, 48, 'IP_ADDRESS_AND_PORT/ingredients/basil2.jpg', 'Fresh Basil', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (148, 48, 'IP_ADDRESS_AND_PORT/ingredients/garlic2.jpg', 'Garlic', NULL, 'Local Farm', NULL);

INSERT INTO "ingredients" VALUES (149, 55, 'IP_ADDRESS_AND_PORT/ingredients/flatbread.jpg', 'Gluten Free Flat Bread', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (150, 55, 'IP_ADDRESS_AND_PORT/ingredients/chickenkebab.jpg', 'Chicken Kebab', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (151, 55, 'IP_ADDRESS_AND_PORT/ingredients/lettuce.jpg', 'Lettuce', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (152, 55, 'IP_ADDRESS_AND_PORT/ingredients/yogurt_sauce.jpg', 'Lactose Free Yogurt Sauce', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (153, 56, 'IP_ADDRESS_AND_PORT/ingredients/flatbread1.jpg', 'Gluten Free Flat Bread', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (154, 56, 'IP_ADDRESS_AND_PORT/ingredients/chickenkebab1.jpg', 'Chicken Kebab', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (155, 56, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes2.jpg', 'Nickel Free Tomatoes', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (156, 56, 'IP_ADDRESS_AND_PORT/ingredients/onions4.jpg', 'Onions', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (157, 57, 'IP_ADDRESS_AND_PORT/ingredients/flatbread2.jpg', 'Gluten Free Flat Bread', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (158, 57, 'IP_ADDRESS_AND_PORT/ingredients/chickenkebab2.jpg', 'Chicken Kebab', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (159, 57, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes3.jpg', 'Nickel Free Tomatoes', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (160, 57, 'IP_ADDRESS_AND_PORT/ingredients/lettuce1.jpg', 'Lettuce', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (161, 58, 'IP_ADDRESS_AND_PORT/ingredients/flatbread3.jpg', 'Gluten Free Flat Bread', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (162, 58, 'IP_ADDRESS_AND_PORT/ingredients/turkeykebab.jpg', 'Turkey Kebab', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (163, 58, 'IP_ADDRESS_AND_PORT/ingredients/radish.jpg', 'Radish', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (164, 58, 'IP_ADDRESS_AND_PORT/ingredients/maionese.jpg', 'Mayonnaise', NULL, 'Calvé', 'https://www.calve.it/prodotti/maionese/maionese-calve.html');

INSERT INTO "ingredients" VALUES (165, 65, 'IP_ADDRESS_AND_PORT/ingredients/flatbread4.jpg', 'Gluten Free Flat Bread', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (169, 65, 'IP_ADDRESS_AND_PORT/ingredients/mozzarella_nolactose.jpg', 'Lactose Free Mozzarella Cheese', NULL, 'Galbani', 'https://galbanicheese.com/our-cheeses/dairy-aisle');
INSERT INTO "ingredients" VALUES (170, 65, 'IP_ADDRESS_AND_PORT/ingredients/chicken.jpg', 'Chicken', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (171, 65, 'IP_ADDRESS_AND_PORT/ingredients/lettuce2.jpg', 'Lettuce', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (172, 65, 'IP_ADDRESS_AND_PORT/ingredients/paprica.jpg', 'Paprika', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (166, 66, 'IP_ADDRESS_AND_PORT/ingredients/flatbread5.jpg', 'Gluten Free Flat Bread', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (173, 66, 'IP_ADDRESS_AND_PORT/ingredients/maionese1.jpg', 'Mayonnaise', NULL, 'Calvé', 'https://www.calve.it/prodotti/maionese/maionese-calve.html');
INSERT INTO "ingredients" VALUES (174, 66, 'IP_ADDRESS_AND_PORT/ingredients/avocado.jpg', 'Avocado', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (175, 66, 'IP_ADDRESS_AND_PORT/ingredients/lettuce3.jpg', 'Lettuce', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (176, 66, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes4.jpg', 'Nickel Free Tomatoes', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (167, 67, 'IP_ADDRESS_AND_PORT/ingredients/flatbread6.jpg', 'Gluten Free Flat Bread', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (177, 67, 'IP_ADDRESS_AND_PORT/ingredients/maionese2.jpg', 'Mayonnaise', NULL, 'Calvé', 'https://www.calve.it/prodotti/maionese/maionese-calve.html');
INSERT INTO "ingredients" VALUES (178, 67, 'IP_ADDRESS_AND_PORT/ingredients/lettuce4.jpg', 'Lettuce', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (179, 67, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes5.jpg', 'Nickel Free Tomatoes', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (180, 67, 'IP_ADDRESS_AND_PORT/ingredients/potatoes2.jpg', 'Potatoes', NULL, 'McCain', 'https://www.mccainpotatoes.com/products/classic-cut-fries');
INSERT INTO "ingredients" VALUES (168, 68, 'IP_ADDRESS_AND_PORT/ingredients/flatbread7.jpg', 'Gluten Free Flat Bread', NULL, 'Home Made', NULL);
INSERT INTO "ingredients" VALUES (181, 68, 'IP_ADDRESS_AND_PORT/ingredients/parmesan_cheese3.png', 'Parmesan Cheese', 'lactose', 'Kraft', 'https://kraftnaturalcheese.com/parmesan-cheese/');
INSERT INTO "ingredients" VALUES (182, 68, 'IP_ADDRESS_AND_PORT/ingredients/lettuce5.jpg', 'Lettuce', NULL, 'Local Farm', NULL);
INSERT INTO "ingredients" VALUES (183, 68, 'IP_ADDRESS_AND_PORT/ingredients/chicken1.jpg', 'Chicken', NULL, 'Local Breeding', NULL);
INSERT INTO "ingredients" VALUES (184, 68, 'IP_ADDRESS_AND_PORT/ingredients/tomatoes6.jpg', 'Nickel Free Tomatoes', NULL, 'Local Farm', NULL);

INSERT INTO "users" VALUES ('Andrea','Piazza Carlo Felice, 63, 10123 Torino TO;lat:45.0631586;lng:7.6800018',0);
INSERT INTO "users" VALUES ('Giuseppe','Via Roma, 357, 10123 Torino TO;lat:45.0644910;lng:7.6804360',0);  
INSERT INTO "users" VALUES ('Luca','Corso Bolzano, 8, 10121 Torino TO;lat:45.0690537;lng:7.6650231',0);
INSERT INTO "users" VALUES ('Giovanni','Corso Giacomo Matteotti, 42, 10121 Torino TO;lat:45.0693429;lng:7.6668350',0);
INSERT INTO "users" VALUES ('Alessandro','Via Piave, 1, 10122 Torino TO;lat:45.0748358;lng:7.6751709',0);
INSERT INTO "users" VALUES ('Davide','Via Cesare Battisti, 7, 10123 Torino TO;lat:45.0694684;lng:7.6856760',0);
INSERT INTO "users" VALUES ('User','',0);
INSERT INTO "users" VALUES ('Restaurateur','Via Ascanio Vittozzi, 30, 10131 Torino TO;lat:45.0614369;lng:7.6992785',1);

INSERT INTO "reviews" VALUES (1,'Andrea', 1, DATE('2023-11-28') ,'Great experience', 'Had a wonderful time!', 5, 4, 4);
INSERT INTO "reviews" VALUES (2,'Giuseppe', 2, DATE('2023-07-28'), 'Awesome food', 'The pizza was fantastic!', 5, 4, 4);
INSERT INTO "reviews" VALUES (3,'Luca', 3, DATE('2023-06-21'), 'Delicious pasta', "Nice location! Can't wait to come back!", 4, 4, 3);
INSERT INTO "reviews" VALUES (4,'Giovanni', 4, DATE('2023-04-22'), "Pizza lover’s paradise", 'Great variety of pizzas!', 5, 4, 4);
INSERT INTO "reviews" VALUES (5,'Alessandro', 5, DATE('2023-07-15'), 'Cool place', 'Extremely positive experience. I will come back!', 5, 5, 5);
INSERT INTO "reviews" VALUES (6,'Davide', 6, DATE('2023-08-20'), 'I will not come back definitely', "We waited two hours for five pasta dishes and they tasted really bad. I don't recommend it.", 1, 1, 1);
INSERT INTO "reviews" VALUES (7,'Luca', 4, DATE('2023-06-21'), 'Delicious pizza', 'Enjoyed the pizza!', 5, 5, 5);
INSERT INTO "reviews" VALUES (8,'Luca', 5, DATE('2023-03-26'), 'Delicious spaghetti', 'I really enjoyed the Gricia!', 4, 5, 5);
INSERT INTO "reviews" VALUES (9,'User', 7, DATE('2024-01-15'), 'Best pasta of my life', "Genuinely one of the most delicious pasta dishes I've had. The flavours were just amazing. Never expected it to be so good.", 5, 5, 5);
INSERT INTO "reviews" VALUES (10,'Restaurateur', 5, DATE('2023-05-27'), 'Fantastic location, but we waited a bit', "Overall satisfied by this place, but they could be faster in serving the dishes", 4, 4, 5);
INSERT INTO "reviews" VALUES (11,'Restaurateur', 4, DATE('2023-02-21'), 'Cool place', 'Extremely positive experience. I will come back!', 5, 5, 5);


COMMIT;
