# Leaderboard API

Minimalist Leaderboard Module for Node.js using MongoDB and Redis.

You can access the APi document from http://localhost:3000/api/v1/doc after running the project

-----

### Project detail [TR]

Sistemde iki adet veritabanı sistemi kullanılır. Bunlardan birincisi gerçek verileri tutan mongodb, ikincisi de hesaplanmış olarak leaderboard tutan redis'tir. 

Skor isteği yapıldığında, önce redis'e eklenir ve redis'e eklendikten sonra rabbimq kuyruğuna gönderilir. Rabbitmq üzerinden mongodb de kullanıcı kayıtlı değilse skoru hesaplanarak yeni kullanıcı eklenir. Eğer kayıtlıysa skoru hesaplanarak skor ve para değerleri güncellenir. Belirli bir arttırım değerinde -ödül havuzunun yüzdelik değeri düşerek- score ve para değerleri arttırılır. Ödül havuzu için düşülen değer ile de ödül havuzu değer arttırılır. Kullanıcı skor işlemleri tamamlandıktan sonra redis'ten silinir.

Gün bitiminde kullanıcıların gün içi değişimleri için tutulan önceki günün rank değeri tüm kullanıcılarda sıfırlanır. Kullanıcının sonraki gün ilk score isteğinde önceki gün rank değeri, önceki gündeki son rank değeri hesaplanarak yeniden oluşturulur. Leaderboard cache'i silinir.

Kullanıcıların skor isteklerinde rank değeri ilk yüz kullanıcı içinde bir değişime sebep olduysa redis -cache- verisi yeniden hesaplanarak redis'e eklenir. Leaderboard verisi ilk yüz kullanıcıyı, id'si gönderilen kullanıcıyı ve bu kullanıcının üç öncesi ve iki sonrasındaki kullanıcıları döner. Leaderboard redis'te bir sorun olmadığı durumda redis'ten -cache- alınır. Kullanıcı online durumu bu serviste değerlendirilseydi, online olan kullanıcılar da redis'te tutulabilirdi. 

Her pazartesi günü saat 00:00:00'da kullanıcı skorları sıfırlanır. Ödül havuzundaki biriken para birinci kullanıcıya yüzde yirmi, ikinci kullanıcıya yüzde onbeş, üçüncü kullanıcıya yüzde on ve kalan kullanıcıların sıralamalarına göre hesaplanarak dağıtılır ve ödül havuzu sıfırlanır. Leaderboard cache'i silinir.


**Sabit değerler (`constants` folder)**

- Kullanıcıların skor isteklerinin artım değeri değiştirilebilir. `score.js` dosyasında `INCREMENTAL_SCORE_VALUE`.
- Kullanıcının skor istekleri aralığı kısıtlanabilir. `score.js` dosyasında `PERIOD` değeri değiştirilerek score istekleri belirli bir sürede bir alınacak hale getirilebilir. 
- Ödül havuzundaki kullanıcıların ve skor isteklerinde ödül havuzuna gidecek miktarın yüzdelik değerleri ayarlanabilir. `score.js` dosyasında `PRIZE_POOL` içinde `PERCENTAGE` ile ödül havuzu yüzdelik değeri, `USER_PERCENTAGES` ile kullanıcıların ödül yüzdelikleri ayarlanabilir ve/veya kullanıcı eklenip çıkarılabilir.
- Leaderboard'da kaç kullanıcı döneceği leaderboard.js` dosyasındaki `USER_COUNT` değeri ile değiştirilebilir.
- Leaderboard'da kullanıcının öncesi ve sonrasında kaçar kullanıcı geleceği `leaderboard.js` dosyasındaki `surrounding` değerleri ile değiştirilebilir.
- `crontabTimes.js` dosyasına crontab zamanları eklenebilir veya çıkarılabilir.

**Konfigürasyon (`config` folder)**

- Ödül havuzu döngüsü `cron.js` dosyasındaki `PRIZE_POOL_LIFECYLE` değeriyle değiştirilebilir.
- Gün içi rank değişimlerinin döngüsü `cron.js` dosyasındaki `RANK_LIFECYLE` değeriyle değiştirilebilir.
- Database konfigürasyonları düzenlenebilir.

**Cron**

`core/cron.js` dosyası üzerinden cron işlemleri yönetilebilir.

-----


### Understanding the Folder Structure

    .
    ├── README.md           // documentation file
    ├── package.json        // dependencies
    ├── src
    └── .
        ├── apiDocs             // api documents folder.
        ├── config              // app config folder. this file contains db connection, api version, app port etc.
        ├── constants           // app constants folder. this file contains cron times, leaderboard and prizepool settings etc.
        ├── cores               // app base package settings folder.
        ├── libs                // aplication libraries
        ├── middlewares         // custom middlewares
        ├── models              // database models
        ├── services            // Api integations
        ├── utils               // Utilities
        ├── app.js              // main nodejs file


### Requirements

* Node 16.6.2
* MongoDB 4.4.6
* Redis 6.2.5

Clone the repository and:

    $ git clone https://github.com/necatierol/leaderboard-api.git
    $ cd leaderboard-api/

install requirements

    $ npm install

To run the project, Follow the following command:

    $ npm start

Lint your Javascript Files

    $ npm run lint
    
### Docker

* Docker
* Docker compose

Docker image building

    $ docker build --rm -t leaderboard_api .

To run the project, Follow the following command:

    $ docker-compose up

Or run project as a background task

    $ docker-compose up --detach


