# Champions League API

> Backend API for Draw and Predict Champions League games

## Usage

see "config/config.env" and update the values/settings to your own
you can set matches delay date after draw and you can change some parameters like host influence and accident influence for predict

## Install Dependencies

```
npm install
```

## Database Seeder

power indexes of teams has been taken from https://projects.fivethirtyeight.com/global-club-soccer-rankings/

To seed the database with users and teams with data from the "\_data" folder, run 

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
Refer to http://peycargpsserver.ir:5000
Or download from current repo

```

Author: Sasan Soroush
