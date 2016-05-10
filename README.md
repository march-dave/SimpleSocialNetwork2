https://agile-island-48321.herokuapp.com/

heroku config:add JWT_SECRET="?????"
heroku config:add GITHUB_SECRET="?????"
heroku config:add FACEBOOK_SECRET="?????"
heroku config:add TWITTER_SECRET="?????"
heroku config:add GOOGLE_SECRET="?????"

heroku addons:create mongolab
