# Champions League API

> Backend API for Draw and Predict Champions League games

## Usage

See "config/config.env" and update the values/settings
You can set matches delay date after draw and you can change some parameters like host influence and accident influence for predict

## Install Dependencies

```
npm install
```

## Database Seeder

Power indexes has been taken from https://projects.fivethirtyeight.com/global-club-soccer-rankings/

To seed the database from the "\_data" folder, run 

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```
## API collection
```
Refer to http://peycargpsserver.ir:5000/
Or download from current repo

```

Author: Sasan Soroush
