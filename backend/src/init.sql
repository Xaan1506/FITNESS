PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  profile TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  calories REAL,
  protein REAL,
  carbs REAL,
  fats REAL,
  fiber REAL,
  vitamins TEXT,
  portion TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  calories_burned REAL,
  duration_min INTEGER,
  intensity TEXT,
  exercises TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  distance_km REAL,
  duration_min INTEGER,
  pace_kmh REAL,
  calories REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS weights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  weight_kg REAL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  goal JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Food items table: normalized list for nutrition lookups
CREATE TABLE IF NOT EXISTS food_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  calories REAL,
  protein REAL,
  carbs REAL,
  fats REAL,
  fiber REAL,
  category TEXT,
  UNIQUE(name, category)
);

-- Seed common foods (INSERT OR IGNORE to avoid duplicates)
INSERT OR IGNORE INTO food_items (name,calories,protein,carbs,fats,fiber,category) VALUES
('Apple',52,0.3,14,0.2,2.4,'fruit'),
('Banana',89,1.1,23,0.3,2.6,'fruit'),
('Orange',47,0.9,12,0.1,2.4,'fruit'),
('Mango',60,0.8,15,0.4,1.6,'fruit'),
('Grapes',69,0.6,18,0.4,0.9,'fruit'),
('Strawberry',33,0.7,8,0.3,2,'fruit'),
('Blueberry',57,0.7,14,0.3,2.4,'fruit'),
('Pineapple',50,0.5,13,0.1,1.4,'fruit'),
('Papaya',43,0.5,11,0.3,1.7,'fruit'),
('Watermelon',30,0.6,8,0.2,0.4,'fruit'),
('Kiwi',61,1.1,15,0.5,3,'fruit'),
('Avocado',160,2,9,15,7,'fruit'),
('Pear',57,0.4,15,0.1,3.1,'fruit'),

('Potato (white)',77,2,17,0.1,2.2,'vegetable'),
('Sweet potato',86,1.6,20,0.1,3,'vegetable'),
('Carrot',41,0.9,10,0.2,2.8,'vegetable'),
('Tomato',18,0.9,3.9,0.2,1.2,'vegetable'),
('Cucumber',16,0.7,3.6,0.1,0.5,'vegetable'),
('Spinach',23,2.9,3.6,0.4,2.2,'vegetable'),
('Broccoli',34,2.8,7,0.4,2.6,'vegetable'),
('Cauliflower',25,1.9,5,0.3,2,'vegetable'),
('Bell pepper (red)',31,1,6,0.3,2.1,'vegetable'),
('Eggplant',25,1,6,0.2,3,'vegetable'),
('Zucchini',17,1.2,3.1,0.3,1,'vegetable'),
('Onion',40,1.1,9.3,0.1,1.7,'vegetable'),
('Green peas',81,5.4,14,0.4,5.1,'vegetable'),
('Sweet corn',86,3.2,19,1.2,2.7,'vegetable'),

('Rolled oats',389,16.9,66.3,6.9,10.6,'grain'),
('Quinoa',368,14.1,64.2,6.1,7,'grain'),
('Barley',354,12.5,73.5,2.3,17.3,'grain'),
('Millet',336,7.5,72.9,1.5,3.6,'grain'),
('Semolina',360,12,72,1,3.9,'grain'),
('Cornmeal',365,9.4,76.9,3.9,7.3,'grain'),

('White rice (cooked)',130,2.4,28.7,0.3,0.4,'rice'),
('Brown rice (cooked)',111,2.6,23,0.9,1.8,'rice'),
('Basmati rice (cooked)',121,2.6,26.9,0.4,0.4,'rice'),
('Jasmine rice (cooked)',129,2.9,28,0.4,0.6,'rice'),
('Parboiled rice (cooked)',123,2.7,26,0.4,1.0,'rice'),

('Lentils (boiled)',116,9,20,0.4,8,'pulse'),
('Chickpeas (boiled)',164,8.9,27.4,2.6,7.6,'pulse'),
('Kidney beans (boiled)',127,8.7,22.8,0.5,6.4,'pulse'),
('Black beans (boiled)',132,8.9,23.7,0.5,8.7,'pulse'),
('Moong dal (boiled)',105,7,19,0.4,7,'pulse'),
('Toor dal (boiled)',105,6,18,0.5,6,'pulse'),

('Whole wheat flour',340,13.2,72.6,2.5,10.7,'grain'),
('Roti (whole wheat)',120,3.6,18,3,3,'bread'),
('Paratha (plain)',300,6,30,15,2,'bread'),
('Bread (white slice)',79,2.7,14,1,0.8,'bread'),
('Bread (whole wheat slice)',80,3.5,13,1,1.9,'bread'),
('Pita bread',275,9,55,1.5,3.5,'bread'),

('Milk (whole)',61,3.2,4.8,3.3,0,'dairy'),
('Yogurt (plain)',59,3.5,4.7,3.3,0,'dairy'),
('Cheddar cheese',403,24.9,1.3,33.1,0,'dairy'),
('Paneer',265,18.3,1.2,20.8,0,'dairy'),
('Butter',717,0.9,0.1,81.1,0,'dairy'),
('Ghee',900,0,0,100,0,'dairy'),

('Cheeseburger',295,17,30,12,1.5,'fast food'),
('French fries',312,3.4,41,15,3.8,'fast food'),
('Pizza (cheese)',266,11,33,10,2.3,'fast food'),
('Fried chicken',246,24,8,14,0,'fast food'),
('Hot dog',290,10,26,18,1.2,'fast food'),

('Potato chips',536,7,53,35,4.2,'snack'),
('Popcorn (air-popped)',387,12.9,77.9,4.5,14.5,'snack'),
('Almonds',579,21.2,21.6,49.9,12.5,'snack'),
('Peanuts',567,25.8,16.1,49.2,8.5,'snack'),
('Cashews',553,18.2,30.2,43.9,3.3,'snack'),
('Granola',471,9.4,64.3,16.9,7,'snack'),

('Idli',58,2,12,0.4,1,'indian'),
('Dosa',168,4,34,1.8,1.7,'indian'),
('Samosa',262,6,26,15,2.5,'indian'),
('Curd (plain)',98,3.6,4.7,6.3,0,'indian'),
('Chole',160,6.8,20,6.4,5.5,'indian'),
('Rajma',127,6.5,19,2.5,4.5,'indian'),
('Biryani',150,4,20,6,1.2,'indian'),
('Palak paneer',200,7.5,6,14,2.5,'indian'),

('Chicken breast',165,31,0,3.6,0,'non-veg'),
('Chicken thigh',209,26,0,10.9,0,'non-veg'),
('Egg (large)',78,6.3,0.6,5.3,0,'non-veg'),
('Salmon',208,20,0,13,0,'non-veg'),
('Tuna (canned)',132,28,0,1,0,'non-veg'),
('Mutton',294,25,0,21,0,'non-veg'),
('Pork',242,27,0,14,0,'non-veg'),
('Shrimp',99,24,0.2,0.3,0,'non-veg'),

('Black tea',1,0.1,0.2,0,0,'beverage'),
('Coffee (black)',2,0.1,0,0,0,'beverage'),
('Milk (whole) 100ml',61,3.2,4.8,3.3,0,'beverage'),
('Orange juice',45,0.7,10.4,0.2,0.2,'beverage'),
('Apple juice',46,0.1,11.3,0.1,0.2,'beverage'),
('Cola',42,0,10.6,0,0,'beverage'),
('Beer',43,0.4,3.6,0,0,'beverage'),
('Red wine',85,0.1,2.6,0,0,'beverage'),
('Protein shake',100,18,6,1.5,0,'beverage'),

('Pasta (cooked)',131,5,25,1.1,1.3,'grain'),
('Momo (steamed)',140,6,18,5,1.5,'indian'),
('Pav bhaji (100g)',150,3.5,18,6,3,'indian');
