# kanji-assembly

> web site of the Kanji assembly puzzle

## Kanji Strokes

Kanji stroke follow to CJK Strokes in Unicode below the url.

https://www.unicode.org/Public/UCD/latest/charts/CodeCharts.pdf

## Information

VPSはAmazon lightsaiilを使用
ドメインはhttps://muumuu-domain.comから取得している : kanji-assembly.site

yarn buildは開発PCで行いFileZila経由でサーバーへ転送している。
(lightsailのメモリが足りなかったのが原因なので、上位のプランにしたら必要なくなると思う)

## Deploy

### Setup

yarn buildは開発PC側で行う。(メモリが足りなかったので)
zip pre-build -r .nuxt

1. install nodejs10 and yarn
   use setup-env.sh!
2. clone this repository master branch
   git clone <this-repository-url>
3. project init, build and start
   1. install packages
			```bash
			yarn
			```
	 2. create RSA keys
			see ssl/auth-token/readme

	 3. setup database
      ```bash
			NODE_ENV=production yarn sequelize db:migrate
			NODE_ENV=production yarn sequelize db:seed:undo --seed insert-kanji-data.js
			NODE_ENV=production yarn sequelize db:seed --seed insert-kanji-data.js
			```

	 4. config HTTPS
      use let's encrypt!

	 5. build and start
	    ```bash
 			yarn start
			```

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
