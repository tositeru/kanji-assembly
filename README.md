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
			取得するときはサーバーを閉じること
			```bash
			sudo certbot certonly
			```

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

## 自動更新

## cronを使う

```shell
# /etc/cron.d/letsencrypt
sudo certbot renew && sudo systemctl restart kanji-assembly
```

## サーバー起動コマンドをデーモン化する

cronでサーバーを再起動するにはサーバー起動コマンド関係をデーモン化する必要があるので作る。

1. コマンドを作る
2. systemctl用のファイルを作る
		```
		# /usr/lib/systemd/system/<daemon name>.service
		[Unit]
		Description = kanji assembly server
		After=network-online.target

		[Service]
		Type=simple
		ExecStart = <shell script path>
		ExecStop = <shell script path>
		Restart=always

		[Install]
		WantedBy=multi-user.target
		```

		※設定を書き換えるときは/etc/systemd/system/にコピーしてから変更すること

3. 起動・無効化
		sudo systemctl enable \<daemon name\>
		sudo systemctl start \<daemon name\>

		sudo systemctl stop \<daemon name\>

		確認の仕方
		```bash
		sudo systemctl list-unit-files --type=service | grep <daemon name>
		```
		依存関係を調べる
		```bash
		systemctl list-dependencies
		```

