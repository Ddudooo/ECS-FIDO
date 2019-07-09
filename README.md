## ecs-fido
> Creator: Jungdoo Lee
> Date: 2019/6/10

# ECS-FIDO Team
WebPage: [ECS-FIDO](http://ecs-fido.com:3000)

## nodejs version
__Windows__ __v10.16.0__
__Linux__(ubuntu 16.04) __v4.2.6__

## __init package__
* require npm

```bash
$ git clone https://devtools.ncloud.com/2561579/ecs-fido.git	
$ cd ecs-fido
$ npm i
```
* you want not install dev package
(express-generator, nodemon, forever...)
```bash
$ npm i --production
```

### package.local.json
_this is local setting with npm start script_
If you have not installed the nodemon package
You must use package.local.json

## node command line
```bash
$ ln -s /usr/bin/nodejs /usr/local/bin/node
$ forever start -c nodemon bin/www
```

## __Start nodejs Webserver__

```bash
$ npm start
```

test
