const fileQuestions = [
    {
        "text": "Türkiye Cumhuriyeti hangi tarihte ilan edilmiştir?",
        "options": [
            "29 Ekim 1923",
            "23 Nisan 1920",
            "19 Mayıs 1919",
            "30 Ağustos 1922"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye Büyük Millet Meclisi hangi tarihte açılmıştır?",
        "options": [
            "23 Nisan 1920",
            "29 Ekim 1923",
            "19 Mayıs 1919",
            "1 Kasım 1922"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Atatürk'ün Samsun'a çıktığı tarih hangisidir?",
        "options": [
            "19 Mayıs 1919",
            "23 Nisan 1920",
            "30 Ağustos 1922",
            "29 Ekim 1923"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'nin başkenti neresidir?",
        "options": [
            "Ankara",
            "İstanbul",
            "İzmir",
            "Bursa"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "İstiklal Marşı'nın yazarı kimdir?",
        "options": [
            "Mehmet Akif Ersoy",
            "Namık Kemal",
            "Ziya Gökalp",
            "Tevfik Fikret"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "İstiklal Marşı'nın bestecisi kimdir?",
        "options": [
            "Osman Zeki Üngör",
            "Mehmet Akif Ersoy",
            "Cemal Reşit Rey",
            "Ahmet Adnan Saygun"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin en yüksek dağı hangisidir?",
        "options": [
            "Ağrı Dağı",
            "Erciyes Dağı",
            "Uludağ",
            "Kaçkar Dağı"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'nin en uzun nehri hangisidir?",
        "options": [
            "Kızılırmak",
            "Fırat",
            "Dicle",
            "Sakarya"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin en büyük gölü hangisidir?",
        "options": [
            "Van Gölü",
            "Tuz Gölü",
            "Beyşehir Gölü",
            "Eğirdir Gölü"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'nin en kalabalık ili hangisidir?",
        "options": [
            "İstanbul",
            "Ankara",
            "İzmir",
            "Bursa"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'nin yüz ölçümü bakımından en büyük ili hangisidir?",
        "options": [
            "Konya",
            "Ankara",
            "Sivas",
            "Erzurum"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin en küçük yüz ölçümüne sahip ili hangisidir?",
        "options": [
            "Yalova",
            "Kilis",
            "Bartın",
            "Düzce"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Pamukkale Travertenleri hangi ilimizdedir?",
        "options": [
            "Denizli",
            "Aydın",
            "Muğla",
            "Burdur"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kapadokya en çok hangi doğal oluşumlarıyla bilinir?",
        "options": [
            "Peribacaları",
            "Travertenler",
            "Fiyortlar",
            "Buzullar"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Nemrut Dağı hangi ilimizdedir?",
        "options": [
            "Adıyaman",
            "Malatya",
            "Şanlıurfa",
            "Diyarbakır"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ani Harabeleri hangi ilimizdedir?",
        "options": [
            "Kars",
            "Erzurum",
            "Ağrı",
            "Van"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Efes Antik Kenti hangi ilimizdedir?",
        "options": [
            "İzmir",
            "Aydın",
            "Muğla",
            "Denizli"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Truva Antik Kenti hangi ilimizdedir?",
        "options": [
            "Çanakkale",
            "Balıkesir",
            "İzmir",
            "Bursa"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Göbeklitepe hangi ilimizdedir?",
        "options": [
            "Şanlıurfa",
            "Gaziantep",
            "Mardin",
            "Diyarbakır"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Mevlana Müzesi hangi ilimizdedir?",
        "options": [
            "Konya",
            "Ankara",
            "Kayseri",
            "Sivas"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Atatürk'ün doğduğu şehir hangisidir?",
        "options": [
            "Selanik",
            "İstanbul",
            "Ankara",
            "Manastır"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kurtuluş Savaşı'nın askeri safhasını sona erdiren antlaşma hangisidir?",
        "options": [
            "Mudanya Ateşkes Antlaşması",
            "Lozan Antlaşması",
            "Mondros Ateşkes Antlaşması",
            "Sevr Antlaşması"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye Cumhuriyeti'nin bağımsızlığını uluslararası alanda tanıtan antlaşma hangisidir?",
        "options": [
            "Lozan Antlaşması",
            "Sevr Antlaşması",
            "Mondros Ateşkes Antlaşması",
            "Ankara Antlaşması"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Saltanat hangi tarihte kaldırılmıştır?",
        "options": [
            "1 Kasım 1922",
            "3 Mart 1924",
            "29 Ekim 1923",
            "23 Nisan 1920"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Halifelik hangi tarihte kaldırılmıştır?",
        "options": [
            "3 Mart 1924",
            "1 Kasım 1922",
            "29 Ekim 1923",
            "23 Nisan 1920"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Misak-ı Milli kararları hangi mecliste kabul edilmiştir?",
        "options": [
            "Son Osmanlı Mebusan Meclisi",
            "Birinci TBMM",
            "Temsil Heyeti",
            "Sivas Kongresi"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Amasya Genelgesi'nin en önemli özelliği nedir?",
        "options": [
            "Milli Mücadele'nin gerekçe ve yöntemini belirtmesi",
            "Cumhuriyeti ilan etmesi",
            "Saltanatı kaldırması",
            "Lozan'ı imzalaması"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Sivas Kongresi'nde alınan önemli kararlardan biri hangisidir?",
        "options": [
            "Milli cemiyetlerin tek çatı altında birleştirilmesi",
            "Halifeliğin kaldırılması",
            "Soyadı Kanunu'nun kabulü",
            "Cumhuriyetin ilanı"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Erzurum Kongresi'nde alınan önemli kararlardan biri hangisidir?",
        "options": [
            "Milli sınırlar içinde vatan bir bütündür",
            "TBMM açılmıştır",
            "Lozan imzalanmıştır",
            "Saltanat kaldırılmıştır"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Cumhuriyetçilik ilkesi aşağıdakilerden hangisiyle doğrudan ilgilidir?",
        "options": [
            "Egemenliğin millete ait olması",
            "Din ve devlet işlerinin ayrılması",
            "Ekonomide devlet desteği",
            "Çağdaşlaşma"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Laiklik ilkesi aşağıdakilerden hangisiyle ilgilidir?",
        "options": [
            "Din ve devlet işlerinin ayrılması",
            "Halkın yönetime katılması",
            "Milli ekonominin güçlenmesi",
            "Sınıf ayrımının reddedilmesi"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Devletçilik ilkesi hangi alanla daha çok ilişkilidir?",
        "options": [
            "Ekonomi",
            "Dil",
            "Din",
            "Askerlik"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Soyadı Kanunu hangi alanda yapılan bir inkılaptır?",
        "options": [
            "Toplumsal alan",
            "Askeri alan",
            "Ekonomik alan",
            "Dış politika"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kabotaj Kanunu hangi alanla ilgilidir?",
        "options": [
            "Denizcilik",
            "Tarım",
            "Eğitim",
            "Sağlık"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de yasama yetkisi hangi kuruma aittir?",
        "options": [
            "Türkiye Büyük Millet Meclisi",
            "Cumhurbaşkanlığı",
            "Anayasa Mahkemesi",
            "Danıştay"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'de yürütme yetkisi kime aittir?",
        "options": [
            "Cumhurbaşkanı",
            "TBMM Başkanı",
            "Anayasa Mahkemesi",
            "Yargıtay Başkanı"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kanunların Anayasa'ya uygunluğunu denetleyen yüksek mahkeme hangisidir?",
        "options": [
            "Anayasa Mahkemesi",
            "Yargıtay",
            "Danıştay",
            "Sayıştay"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de idari davaların en üst inceleme mercii hangisidir?",
        "options": [
            "Danıştay",
            "Yargıtay",
            "Sayıştay",
            "Uyuşmazlık Mahkemesi"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Adli davaların en üst inceleme mercii hangisidir?",
        "options": [
            "Yargıtay",
            "Danıştay",
            "Sayıştay",
            "Anayasa Mahkemesi"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Devletin gelir ve giderlerini TBMM adına denetleyen kurum hangisidir?",
        "options": [
            "Sayıştay",
            "Danıştay",
            "Yargıtay",
            "Valilik"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Seçme ve seçilme hakkı hangi hak grubuna girer?",
        "options": [
            "Siyasi haklar",
            "Sosyal haklar",
            "Ekonomik haklar",
            "Kişisel haklar"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Anayasa'ya göre Türkiye Cumhuriyeti'nin yönetim şekli nedir?",
        "options": [
            "Cumhuriyet",
            "Monarşi",
            "Teokrasi",
            "Oligarşi"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Aşağıdakilerden hangisi yerel yönetim birimidir?",
        "options": [
            "Belediye",
            "Bakanlık",
            "Yargıtay",
            "Danıştay"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Vali aşağıdakilerden hangisinin temsilcisidir?",
        "options": [
            "Merkezi yönetim",
            "Belediye",
            "Mahalle yönetimi",
            "Üniversite"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Muhtar hangi yönetim biriminde görev yapar?",
        "options": [
            "Mahalle veya köy",
            "İl",
            "Bakanlık",
            "Büyükşehir belediyesi"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Birleşmiş Milletler'in temel amacı nedir?",
        "options": [
            "Uluslararası barış ve güvenliği korumak",
            "Para basmak",
            "Sadece ticareti düzenlemek",
            "Yerel seçim yapmak"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "NATO'nun temel amacı nedir?",
        "options": [
            "Ortak savunma",
            "Kültürel mirası koruma",
            "Para politikası yürütme",
            "Sağlık hizmeti verme"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "UNESCO daha çok hangi alanlarda faaliyet gösterir?",
        "options": [
            "Eğitim bilim ve kültür",
            "Askeri savunma",
            "Para politikası",
            "Petrol üretimi"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünya Sağlık Örgütü'nün kısa adı hangisidir?",
        "options": [
            "WHO",
            "NATO",
            "UNESCO",
            "IMF"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Uluslararası Para Fonu'nun kısa adı hangisidir?",
        "options": [
            "IMF",
            "WHO",
            "UNICEF",
            "NATO"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "UNICEF hangi alanda faaliyet gösterir?",
        "options": [
            "Çocuk hakları ve yardımları",
            "Askeri savunma",
            "Petrol ticareti",
            "Bankacılık"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünyanın en büyük okyanusu hangisidir?",
        "options": [
            "Pasifik Okyanusu",
            "Atlas Okyanusu",
            "Hint Okyanusu",
            "Arktik Okyanusu"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Dünyanın en uzun nehri olarak genel kabul gören nehir hangisidir?",
        "options": [
            "Nil Nehri",
            "Amazon Nehri",
            "Yangtze Nehri",
            "Mississippi Nehri"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünyanın en yüksek dağı hangisidir?",
        "options": [
            "Everest",
            "K2",
            "Kilimanjaro",
            "Ağrı Dağı"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Dünyanın en büyük çölü hangisidir?",
        "options": [
            "Antarktika Çölü",
            "Sahra Çölü",
            "Gobi Çölü",
            "Arabistan Çölü"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Dünyanın en büyük sıcak çölü hangisidir?",
        "options": [
            "Sahra Çölü",
            "Gobi Çölü",
            "Kalahari Çölü",
            "Atacama Çölü"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Güneş Sistemi'nin en büyük gezegeni hangisidir?",
        "options": [
            "Jüpiter",
            "Satürn",
            "Dünya",
            "Mars"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Güneş'e en yakın gezegen hangisidir?",
        "options": [
            "Merkür",
            "Venüs",
            "Dünya",
            "Mars"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kızıl Gezegen olarak bilinen gezegen hangisidir?",
        "options": [
            "Mars",
            "Venüs",
            "Jüpiter",
            "Satürn"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Ay'a ilk ayak basan insan kimdir?",
        "options": [
            "Neil Armstrong",
            "Yuri Gagarin",
            "Buzz Aldrin",
            "Alan Shepard"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Uzaya çıkan ilk insan kimdir?",
        "options": [
            "Yuri Gagarin",
            "Neil Armstrong",
            "Buzz Aldrin",
            "John Glenn"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Nobel Kimya Ödülü alan Türk bilim insanı kimdir?",
        "options": [
            "Aziz Sancar",
            "Cahit Arf",
            "Oktay Sinanoğlu",
            "Feza Gürsey"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Cahit Arf hangi bilim alanıyla tanınır?",
        "options": [
            "Matematik",
            "Tıp",
            "Edebiyat",
            "Arkeoloji"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Orhan Pamuk hangi alanda Nobel Ödülü almıştır?",
        "options": [
            "Edebiyat",
            "Kimya",
            "Fizik",
            "Barış"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Sefiller romanının yazarı kimdir?",
        "options": [
            "Victor Hugo",
            "Dostoyevski",
            "Tolstoy",
            "Balzac"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Suç ve Ceza romanının yazarı kimdir?",
        "options": [
            "Dostoyevski",
            "Tolstoy",
            "Victor Hugo",
            "Goethe"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "İnce Memed romanının yazarı kimdir?",
        "options": [
            "Yaşar Kemal",
            "Orhan Kemal",
            "Kemal Tahir",
            "Sabahattin Ali"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kürk Mantolu Madonna romanının yazarı kimdir?",
        "options": [
            "Sabahattin Ali",
            "Yaşar Kemal",
            "Reşat Nuri Güntekin",
            "Halide Edip Adıvar"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Çalıkuşu romanının yazarı kimdir?",
        "options": [
            "Reşat Nuri Güntekin",
            "Yakup Kadri Karaosmanoğlu",
            "Halide Edip Adıvar",
            "Peyami Safa"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Nutuk adlı eser kime aittir?",
        "options": [
            "Mustafa Kemal Atatürk",
            "İsmet İnönü",
            "Ziya Gökalp",
            "Mehmet Akif Ersoy"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Safahat adlı eser kime aittir?",
        "options": [
            "Mehmet Akif Ersoy",
            "Namık Kemal",
            "Tevfik Fikret",
            "Yahya Kemal Beyatlı"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Divan edebiyatında gazel türü daha çok hangi konuyu işler?",
        "options": [
            "Aşk ve güzellik",
            "Savaş tarihi",
            "Bilimsel deney",
            "Coğrafi keşif"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Dede Korkut Hikayeleri hangi kültüre aittir?",
        "options": [
            "Türk kültürü",
            "Yunan kültürü",
            "Roma kültürü",
            "Mısır kültürü"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türk edebiyatında ilk psikolojik roman kabul edilen eser hangisidir?",
        "options": [
            "Eylül",
            "İntibah",
            "Araba Sevdası",
            "Aşk-ı Memnu"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türk edebiyatında ilk edebi roman kabul edilen eser hangisidir?",
        "options": [
            "İntibah",
            "Taaşşuk-ı Talat ve Fitnat",
            "Eylül",
            "Mai ve Siyah"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nin kurucusu kimdir?",
        "options": [
            "Osman Bey",
            "Orhan Bey",
            "Ertuğrul Gazi",
            "Yıldırım Bayezid"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Osmanlı Devleti'nin ilk başkenti neresidir?",
        "options": [
            "Söğüt",
            "Bursa",
            "Edirne",
            "İstanbul"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Osmanlı Devleti'nde ilk düzenli ordu hangi padişah döneminde kurulmuştur?",
        "options": [
            "Orhan Bey",
            "Osman Bey",
            "I. Murad",
            "Fatih Sultan Mehmet"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "İstanbul'u fetheden Osmanlı padişahı kimdir?",
        "options": [
            "Fatih Sultan Mehmet",
            "Yavuz Sultan Selim",
            "Kanuni Sultan Süleyman",
            "II. Bayezid"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "İstanbul'un fethi hangi yılda gerçekleşmiştir?",
        "options": [
            "1453",
            "1071",
            "1299",
            "1517"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Malazgirt Savaşı hangi yılda yapılmıştır?",
        "options": [
            "1071",
            "1453",
            "1299",
            "1922"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Malazgirt Savaşı hangi hükümdar döneminde kazanılmıştır?",
        "options": [
            "Alparslan",
            "Melikşah",
            "Osman Bey",
            "Fatih Sultan Mehmet"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Anadolu Selçuklu Devleti'nin başkenti neresidir?",
        "options": [
            "Konya",
            "Sivas",
            "Kayseri",
            "Erzurum"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Talas Savaşı'nın Türk tarihi açısından en önemli sonucu nedir?",
        "options": [
            "Türklerin İslamiyet'i tanıma sürecinin hızlanması",
            "İstanbul'un fethedilmesi",
            "Osmanlı'nın kurulması",
            "Cumhuriyetin ilan edilmesi"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Kavimler Göçü'nün başlamasında etkili olan Türk topluluğu hangisidir?",
        "options": [
            "Hunlar",
            "Göktürkler",
            "Uygurlar",
            "Kıpçaklar"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türk adını devlet adı olarak kullanan ilk Türk devleti hangisidir?",
        "options": [
            "Göktürkler",
            "Hunlar",
            "Uygurlar",
            "Avarlar"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Yerleşik hayata geçen ilk Türk devleti hangisidir?",
        "options": [
            "Uygurlar",
            "Hunlar",
            "Göktürkler",
            "Avarlar"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Orhun Yazıtları hangi Türk devletine aittir?",
        "options": [
            "Göktürkler",
            "Uygurlar",
            "Hunlar",
            "Karahanlılar"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türklerin İslamiyet'i kabul eden ilk büyük Türk devleti hangisidir?",
        "options": [
            "Karahanlılar",
            "Gazneliler",
            "Büyük Selçuklular",
            "Osmanlılar"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'nin en uzun kara sınırı hangi ülke iledir?",
        "options": [
            "Suriye",
            "İran",
            "Irak",
            "Yunanistan"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'nin en kısa kara sınırı hangi ülke iledir?",
        "options": [
            "Nahçıvan",
            "Gürcistan",
            "Ermenistan",
            "Yunanistan"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin üç tarafı hangi denizlerle çevrilidir?",
        "options": [
            "Karadeniz Ege Akdeniz",
            "Marmara Hazar Kızıldeniz",
            "Ege Hazar Akdeniz",
            "Karadeniz Marmara Hazar"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Karadeniz ikliminin en belirgin özelliği nedir?",
        "options": [
            "Her mevsim yağışlı olması",
            "Yazların çok kurak geçmesi",
            "Kışların aşırı sıcak olması",
            "Çöl bitki örtüsünün görülmesi"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Akdeniz ikliminin doğal bitki örtüsü hangisidir?",
        "options": [
            "Maki",
            "Bozkır",
            "Tundra",
            "Tayga"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "İç Anadolu Bölgesi'nin yaygın bitki örtüsü hangisidir?",
        "options": [
            "Bozkır",
            "Maki",
            "Orman",
            "Tundra"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'de çay tarımı en çok hangi bölgede yapılır?",
        "options": [
            "Doğu Karadeniz",
            "İç Anadolu",
            "Güneydoğu Anadolu",
            "Marmara"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'de fındık üretimi en çok hangi bölgede yapılır?",
        "options": [
            "Karadeniz Bölgesi",
            "Ege Bölgesi",
            "Akdeniz Bölgesi",
            "İç Anadolu Bölgesi"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'de zeytin üretimi en çok hangi bölgede yaygındır?",
        "options": [
            "Ege Bölgesi",
            "Doğu Anadolu Bölgesi",
            "İç Anadolu Bölgesi",
            "Karadeniz Bölgesi"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "GAP Projesi hangi bölgeyi geliştirmeyi amaçlar?",
        "options": [
            "Güneydoğu Anadolu Bölgesi",
            "Karadeniz Bölgesi",
            "Ege Bölgesi",
            "Marmara Bölgesi"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de deprem riskinin yüksek olmasının temel nedeni nedir?",
        "options": [
            "Aktif fay hatları üzerinde yer alması",
            "Ekvatora yakın olması",
            "Denizlerle çevrili olması",
            "Ormanların fazla olması"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Aşağıdakilerden hangisi doğal afet değildir?",
        "options": [
            "Trafik kazası",
            "Deprem",
            "Sel",
            "Heyelan"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Heyelan en çok hangi bölgemizde görülür?",
        "options": [
            "Karadeniz Bölgesi",
            "İç Anadolu Bölgesi",
            "Güneydoğu Anadolu Bölgesi",
            "Ege Bölgesi"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Çığ olayları Türkiye'de daha çok hangi bölgede görülür?",
        "options": [
            "Doğu Anadolu Bölgesi",
            "Marmara Bölgesi",
            "Ege Bölgesi",
            "Akdeniz Bölgesi"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünyanın en kalabalık ülkesi uzun süre hangi ülke olarak bilinmiştir?",
        "options": [
            "Çin",
            "Kanada",
            "Avustralya",
            "Mısır"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Yüz ölçümü bakımından dünyanın en büyük ülkesi hangisidir?",
        "options": [
            "Rusya",
            "Kanada",
            "Çin",
            "ABD"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Avrupa'nın en uzun nehri hangisidir?",
        "options": [
            "Volga",
            "Tuna",
            "Ren",
            "Seine"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Afrika kıtasının en yüksek dağı hangisidir?",
        "options": [
            "Kilimanjaro",
            "Everest",
            "Atlas Dağları",
            "Fuji"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Mısır piramitleri hangi şehir yakınlarında bulunur?",
        "options": [
            "Kahire",
            "İskenderiye",
            "Luksor",
            "Asvan"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Eyfel Kulesi hangi şehirde bulunur?",
        "options": [
            "Paris",
            "Roma",
            "Berlin",
            "Madrid"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kolezyum hangi şehirde bulunur?",
        "options": [
            "Roma",
            "Atina",
            "Paris",
            "Londra"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Tac Mahal hangi ülkededir?",
        "options": [
            "Hindistan",
            "Pakistan",
            "İran",
            "Mısır"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Machu Picchu hangi ülkededir?",
        "options": [
            "Peru",
            "Brezilya",
            "Şili",
            "Arjantin"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Özgürlük Heykeli hangi şehirde bulunur?",
        "options": [
            "New York",
            "Washington",
            "Boston",
            "Chicago"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Pisa Kulesi hangi ülkededir?",
        "options": [
            "İtalya",
            "Fransa",
            "İspanya",
            "Yunanistan"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Dünyanın yedi harikasından günümüze ulaşan tek yapı hangisidir?",
        "options": [
            "Keops Piramidi",
            "Babil'in Asma Bahçeleri",
            "Rodos Heykeli",
            "Artemis Tapınağı"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "İnsan vücudundaki en büyük organ hangisidir?",
        "options": [
            "Deri",
            "Karaciğer",
            "Kalp",
            "Akciğer"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "İnsan vücudunda kanı pompalayan organ hangisidir?",
        "options": [
            "Kalp",
            "Akciğer",
            "Mide",
            "Böbrek"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Fotosentez yapan canlılarda genellikle hangi pigment bulunur?",
        "options": [
            "Klorofil",
            "Hemoglobin",
            "Keratin",
            "Melanin"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Suyun kimyasal formülü nedir?",
        "options": [
            "H2O",
            "CO2",
            "O2",
            "NaCl"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Sofra tuzunun kimyasal adı nedir?",
        "options": [
            "Sodyum klorür",
            "Kalsiyum karbonat",
            "Potasyum nitrat",
            "Magnezyum sülfat"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünya'nın uydusu hangisidir?",
        "options": [
            "Ay",
            "Mars",
            "Venüs",
            "Jüpiter"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Dünya'nın kendi ekseni etrafındaki dönüş süresi yaklaşık ne kadardır?",
        "options": [
            "24 saat",
            "7 gün",
            "30 gün",
            "365 gün"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Dünya'nın Güneş etrafındaki dolanma süresi yaklaşık ne kadardır?",
        "options": [
            "365 gün 6 saat",
            "24 saat",
            "30 gün",
            "12 saat"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Mevsimlerin oluşmasının temel nedeni nedir?",
        "options": [
            "Dünya'nın eksen eğikliği ve Güneş etrafındaki hareketi",
            "Ay'ın Dünya etrafında dönmesi",
            "Dünya'nın düz olması",
            "Bulutların hareketi"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ses boşlukta yayılır mı?",
        "options": [
            "Hayır",
            "Evet",
            "Sadece gündüz yayılır",
            "Sadece sıcak havada yayılır"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Işık yılı neyin birimidir?",
        "options": [
            "Uzunluk",
            "Zaman",
            "Kütle",
            "Sıcaklık"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Aşağıdaki renklerden hangisi ana renklerden biridir?",
        "options": [
            "Kırmızı",
            "Turuncu",
            "Mor",
            "Pembe"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'nin para birimi nedir?",
        "options": [
            "Türk lirası",
            "Euro",
            "Dolar",
            "Sterlin"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Avrupa Birliği'nin ortak para birimi hangisidir?",
        "options": [
            "Euro",
            "Dolar",
            "Frank",
            "Sterlin"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Satrançta şahı tehdit eden hamleye ne denir?",
        "options": [
            "Şah",
            "Mat",
            "Rok",
            "Piyon"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Satrançta oyun hangi taşların hareketiyle başlar?",
        "options": [
            "Beyaz taşlar",
            "Siyah taşlar",
            "Vezir",
            "Şah"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Olimpiyat oyunlarının simgesinde kaç halka vardır?",
        "options": [
            "5",
            "4",
            "6",
            "7"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Futbolda bir takım sahada kaç oyuncuyla oynar?",
        "options": [
            "11",
            "10",
            "9",
            "12"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Basketbolda bir takım sahada kaç oyuncuyla oynar?",
        "options": [
            "5",
            "6",
            "7",
            "11"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Voleybolda bir takım sahada kaç oyuncuyla oynar?",
        "options": [
            "6",
            "5",
            "7",
            "11"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'nin ilk kadın savaş pilotu kimdir?",
        "options": [
            "Sabiha Gökçen",
            "Halide Edip Adıvar",
            "Afet İnan",
            "Nene Hatun"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Nene Hatun hangi savaşla özdeşleşmiştir?",
        "options": [
            "93 Harbi",
            "Trablusgarp Savaşı",
            "Kurtuluş Savaşı",
            "Çanakkale Savaşı"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Çanakkale Savaşı hangi savaşın cephelerinden biridir?",
        "options": [
            "I. Dünya Savaşı",
            "Kurtuluş Savaşı",
            "II. Dünya Savaşı",
            "Balkan Savaşları"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye Cumhuriyeti'nin ilk cumhurbaşkanı kimdir?",
        "options": [
            "Mustafa Kemal Atatürk",
            "İsmet İnönü",
            "Celal Bayar",
            "Cemal Gürsel"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye Cumhuriyeti'nin ikinci cumhurbaşkanı kimdir?",
        "options": [
            "İsmet İnönü",
            "Mustafa Kemal Atatürk",
            "Celal Bayar",
            "Adnan Menderes"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Lozan Antlaşması hangi yıl imzalanmıştır?",
        "options": [
            "1923",
            "1920",
            "1922",
            "1924"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Montrö Boğazlar Sözleşmesi hangi konuda Türkiye'ye önemli haklar sağlamıştır?",
        "options": [
            "Boğazlar üzerindeki egemenlik",
            "Kara sınırları",
            "Eğitim sistemi",
            "Para politikası"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Hatay hangi yıl Türkiye'ye katılmıştır?",
        "options": [
            "1939",
            "1923",
            "1936",
            "1945"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'nin ilk kadın milletvekilleri hangi dönemde meclise girmiştir?",
        "options": [
            "1935 seçimleri",
            "1920 seçimleri",
            "1923 seçimleri",
            "1950 seçimleri"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Kadınlara belediye seçimlerine katılma hakkı Türkiye'de hangi yıl verilmiştir?",
        "options": [
            "1930",
            "1923",
            "1934",
            "1938"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Kadınlara milletvekili seçme ve seçilme hakkı Türkiye'de hangi yıl verilmiştir?",
        "options": [
            "1934",
            "1926",
            "1930",
            "1945"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türk Medeni Kanunu hangi ülkeden örnek alınarak hazırlanmıştır?",
        "options": [
            "İsviçre",
            "Fransa",
            "Almanya",
            "İtalya"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türk Ceza Kanunu hazırlanırken hangi ülke örnek alınmıştır?",
        "options": [
            "İtalya",
            "İsviçre",
            "Almanya",
            "İngiltere"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türk Dil Kurumu hangi yıl kurulmuştur?",
        "options": [
            "1932",
            "1931",
            "1928",
            "1935"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türk Tarih Kurumu hangi yıl kurulmuştur?",
        "options": [
            "1931",
            "1932",
            "1928",
            "1935"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'de Engelliler Haftası hangi tarihler arasında kutlanır?",
        "options": [
            "10-16 Mayıs",
            "1-7 Mart",
            "3-9 Aralık",
            "19-25 Mayıs"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "3 Aralık dünyada hangi özel gün olarak kabul edilir?",
        "options": [
            "Dünya Engelliler Günü",
            "Dünya Çevre Günü",
            "Dünya Sağlık Günü",
            "Dünya Çocuk Günü"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Engelli bireylerin toplumsal yaşama eşit katılımını sağlamak için en önemli kavram hangisidir?",
        "options": [
            "Erişilebilirlik",
            "Ayrımcılık",
            "İzolasyon",
            "Kısıtlama"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Görme engelli bireylerin okuma yazma için kullandığı kabartmalı alfabe hangisidir?",
        "options": [
            "Braille alfabesi",
            "Latin alfabesi",
            "Mors alfabesi",
            "Kiril alfabesi"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "İşitme engelli bireylerin iletişimde sıkça kullandığı yöntem hangisidir?",
        "options": [
            "İşaret dili",
            "Mors kodu",
            "Telgraf",
            "Şifreli yazı"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Tekerlekli sandalye kullanan bireyler için binalarda bulunması gereken temel erişilebilirlik uygulaması hangisidir?",
        "options": [
            "Rampa",
            "Turnike",
            "Merdiven",
            "Döner kapı"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Engelli bireylerin eğitim hakkından eşit şekilde yararlanabilmesi hangi anlayışla ilişkilidir?",
        "options": [
            "Kapsayıcı eğitim",
            "Ezbere eğitim",
            "Uzaktan yasaklama",
            "Sınırlandırılmış eğitim"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Aşağıdakilerden hangisi engelli bireylere yönelik doğru bir toplumsal yaklaşımdır?",
        "options": [
            "Bireyin ihtiyaçlarına saygı duymak",
            "Acıyarak yaklaşmak",
            "Yok saymak",
            "Kararlarını onun yerine almak"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Erişilebilir toplu taşıma araçlarında aşağıdakilerden hangisi bulunmalıdır?",
        "options": [
            "Engelli rampası veya asansör sistemi",
            "Sadece yüksek basamak",
            "Dar giriş kapısı",
            "Tutunma yeri olmayan alan"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Engelli bireylerin bağımsız yaşamını destekleyen en önemli unsurlardan biri hangisidir?",
        "options": [
            "Erişilebilir çevre düzenlemesi",
            "Toplumdan uzaklaştırma",
            "Hakların sınırlandırılması",
            "Sadece yardım bekleme"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Braille alfabesi en çok hangi engel grubundaki bireyler tarafından kullanılır?",
        "options": [
            "Görme engelliler",
            "İşitme engelliler",
            "Bedensel engelliler",
            "Ortopedik engelliler"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Engelli bireylere yönelik ayrımcılığın önlenmesi hangi temel insan hakkıyla doğrudan ilgilidir?",
        "options": [
            "Eşitlik hakkı",
            "Sadece mülkiyet hakkı",
            "Vergi hakkı",
            "Ticaret hakkı"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Görme engelli bireylerin kaldırımlarda yön bulmasını kolaylaştıran özel yüzeylere ne ad verilir?",
        "options": [
            "Hissedilebilir yüzey",
            "Kaygan yüzey",
            "Süsleme taşı",
            "Dekoratif zemin"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Engelli bireylerin sosyal hayata katılımını artırmak için aşağıdakilerden hangisi yapılmalıdır?",
        "options": [
            "Fiziksel ve sosyal engeller azaltılmalıdır",
            "Etkinliklere alınmamalıdır",
            "Karar süreçlerinden uzak tutulmalıdır",
            "Toplumdan ayrılmalıdır"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Aşağıdakilerden hangisi engelliliğe neden olabilecek çevresel faktörlerden biridir?",
        "options": [
            "Erişilebilir olmayan şehir düzeni",
            "Kapsayıcı eğitim",
            "Rampa yapılması",
            "İşaret dili desteği"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Engellilik konusunda modern yaklaşım bireyi değil daha çok neyi değiştirmeyi hedefler?",
        "options": [
            "Toplumsal ve çevresel engelleri",
            "Bireyin kimliğini",
            "Bireyin haklarını",
            "Bireyin eğitim hakkını"
        ],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "İşaret dili çevirmeni en çok hangi durumda erişilebilirliği artırır?",
        "options": [
            "İşitme engelli bireylerin bilgiye erişiminde",
            "Yol yapımında",
            "Elektrik üretiminde",
            "Spor sahası çiziminde"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Engelli bireylere yönelik farkındalık çalışmalarının temel amacı nedir?",
        "options": [
            "Toplumda eşitlik ve duyarlılık oluşturmak",
            "Engelli bireyleri toplumdan ayırmak",
            "Sadece yardım toplamak",
            "Hakları sınırlandırmak"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Aşağıdakilerden hangisi erişilebilirlik örneğidir?",
        "options": [
            "Sesli trafik lambası",
            "Yüksek kaldırım",
            "Dar kapı",
            "Sadece merdivenli giriş"
        ],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Engelli bireylerin kamusal hizmetlerden yararlanmasında temel ilke ne olmalıdır?",
        "options": [
            "Eşit ve erişilebilir hizmet",
            "Ayrı tutma",
            "Kısıtlama",
            "Görmezden gelme"
        ],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin Avrupa kıtasında toprağı bulunan bölgesi hangisidir?",
        "options": ["Marmara Bölgesi", "Ege Bölgesi", "Karadeniz Bölgesi", "Akdeniz Bölgesi"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'nin Asya ve Avrupa kıtalarını birbirine bağlayan boğazlarından biri hangisidir?",
        "options": ["İstanbul Boğazı", "Cebelitarık Boğazı", "Hürmüz Boğazı", "Süveyş Kanalı"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Marmara Denizi'ni Ege Denizi'ne bağlayan boğaz hangisidir?",
        "options": ["Çanakkale Boğazı", "İstanbul Boğazı", "Kerç Boğazı", "Bering Boğazı"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin en batısında yer alan ili hangisidir?",
        "options": ["Çanakkale", "İzmir", "Edirne", "Aydın"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'nin en doğusunda yer alan ili hangisidir?",
        "options": ["Iğdır", "Ağrı", "Van", "Hakkari"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'nin en kuzeyinde yer alan ili hangisidir?",
        "options": ["Sinop", "Samsun", "Artvin", "Kırklareli"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin en güneyinde yer alan ili hangisidir?",
        "options": ["Hatay", "Mersin", "Şanlıurfa", "Antalya"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Marmara Bölgesi'nin en belirgin özelliği aşağıdakilerden hangisidir?",
        "options": ["Sanayi ve nüfus yoğunluğunun fazla olması", "Türkiye'nin en yüksek bölgesi olması", "Çöl ikliminin görülmesi", "En az nüfusa sahip olması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ege Bölgesi'nde kıyıların girintili çıkıntılı olmasının temel nedeni nedir?",
        "options": ["Dağların kıyıya dik uzanması", "Dağların kıyıya paralel uzanması", "Buzulların etkili olması", "Çölleşmenin fazla olması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Karadeniz Bölgesi'nde kıyı ile iç kesimler arasında ulaşımın zor olmasının temel nedeni nedir?",
        "options": ["Dağların kıyıya paralel uzanması", "Ovaların çok geniş olması", "Çöllerin bulunması", "Deniz seviyesinin düşük olması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de turunçgil üretiminin en yaygın olduğu bölge hangisidir?",
        "options": ["Akdeniz Bölgesi", "Doğu Anadolu Bölgesi", "İç Anadolu Bölgesi", "Karadeniz Bölgesi"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'de pamuk üretimi için en uygun iklim koşulu hangisidir?",
        "options": ["Sıcak ve sulama imkanı olan alanlar", "Soğuk ve karlı alanlar", "Nemli ve serin alanlar", "Yüksek dağ zirveleri"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de linyit yataklarının yaygın olması hangi enerji kaynağıyla ilgilidir?",
        "options": ["Termik enerji", "Hidroelektrik enerji", "Jeotermal enerji", "Rüzgar enerjisi"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de jeotermal enerji potansiyeli en fazla hangi bölgede yaygındır?",
        "options": ["Ege Bölgesi", "Karadeniz Bölgesi", "Doğu Anadolu Bölgesi", "Güneydoğu Anadolu Bölgesi"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Bor madeninin Türkiye ekonomisi açısından önemi nedir?",
        "options": ["Türkiye'nin dünya rezervlerinde önemli paya sahip olması", "Sadece tarımda kullanılması", "Hiç ihraç edilmemesi", "Yalnızca süs eşyası yapılması"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Zonguldak çevresi hangi madenle tanınır?",
        "options": ["Taş kömürü", "Bor", "Krom", "Bakır"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Murgul ve Küre çevresi daha çok hangi madenle bilinir?",
        "options": ["Bakır", "Altın", "Linyit", "Tuz"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'de yaz turizminin en fazla geliştiği kıyılar hangileridir?",
        "options": ["Ege ve Akdeniz kıyıları", "Karadeniz ve Marmara kıyıları", "Van Gölü kıyıları", "İç Anadolu gölleri"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Uludağ en çok hangi turizm türüyle bilinir?",
        "options": ["Kış turizmi", "Deniz turizmi", "Çöl turizmi", "Yayla turizmi"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'de yayla turizminin en yaygın olduğu bölge hangisidir?",
        "options": ["Karadeniz Bölgesi", "Güneydoğu Anadolu Bölgesi", "Marmara Bölgesi", "İç Anadolu Bölgesi"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Aşağıdakilerden hangisi Türkiye'de milli park örneğidir?",
        "options": ["Yedigöller Milli Parkı", "Süveyş Milli Parkı", "Sahara Milli Parkı", "Volga Milli Parkı"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de nüfusun batıda daha yoğun olmasının nedenlerinden biri hangisidir?",
        "options": ["Sanayi ve iş imkanlarının fazla olması", "Yükseltinin çok fazla olması", "İklimin aşırı soğuk olması", "Ulaşımın az gelişmiş olması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Bir yerde nüfus yoğunluğu hesaplanırken hangi iki veri kullanılır?",
        "options": ["Nüfus ve yüz ölçümü", "Sıcaklık ve yağış", "Doğum ve ölüm", "Dağ ve ova sayısı"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de köyden kente göçün temel nedenlerinden biri hangisidir?",
        "options": ["İş ve eğitim imkanları", "Denizlerin tuzluluğu", "Dağların rengi", "Gün uzunluğu"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Sanayi faaliyetlerinin gelişmesi bir şehirde genellikle neyi artırır?",
        "options": ["Göç alma ve nüfus yoğunluğunu", "Yağış miktarını", "Dağ oluşumunu", "Deniz seviyesini"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Osmanlı Devleti'nde başkent sırasıyla hangi şehirlerde bulunmuştur?",
        "options": ["Söğüt Bursa Edirne İstanbul", "İstanbul Bursa Ankara İzmir", "Konya Sivas Bursa Edirne", "Edirne İstanbul Söğüt Ankara"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nde ilk para hangi padişah döneminde bastırılmıştır?",
        "options": ["Osman Bey", "Orhan Bey", "I. Murad", "Fatih Sultan Mehmet"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nde devşirme sistemi daha çok hangi amaçla kullanılmıştır?",
        "options": ["Devlet adamı ve asker yetiştirmek", "Tarım vergisi toplamak", "Deniz ticareti yapmak", "Toprak ölçümü yapmak"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Yeniçeri Ocağı hangi Osmanlı padişahı döneminde kaldırılmıştır?",
        "options": ["II. Mahmud", "III. Selim", "Fatih Sultan Mehmet", "Kanuni Sultan Süleyman"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nde Tanzimat Fermanı hangi padişah döneminde ilan edilmiştir?",
        "options": ["Abdülmecid", "II. Mahmud", "Abdülaziz", "II. Abdülhamid"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Islahat Fermanı'nın temel amacı aşağıdakilerden hangisidir?",
        "options": ["Azınlıklara yeni haklar tanımak", "Saltanatı kaldırmak", "Cumhuriyeti ilan etmek", "Yeniçeri Ocağı'nı kurmak"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "I. Meşrutiyet hangi Osmanlı padişahı döneminde ilan edilmiştir?",
        "options": ["II. Abdülhamid", "Abdülmecid", "III. Selim", "V. Mehmet Reşat"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nin ilk anayasası hangisidir?",
        "options": ["Kanun-i Esasi", "Teşkilat-ı Esasiye", "1924 Anayasası", "Mecelle"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nde hukuk alanında hazırlanan Mecelle hangi alanla ilgilidir?",
        "options": ["Medeni hukuk", "Denizcilik", "Askerlik", "Dış ticaret"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nin Duraklama Dönemi genel olarak hangi olayla başlatılır?",
        "options": ["Sokullu Mehmet Paşa'nın ölümü", "İstanbul'un fethi", "Malazgirt Savaşı", "Cumhuriyetin ilanı"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nin Avrupa karşısında ilk büyük toprak kaybı hangi antlaşmayla olmuştur?",
        "options": ["Karlofça Antlaşması", "Pasarofça Antlaşması", "Bucaş Antlaşması", "Zitvatorok Antlaşması"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nin ilk kez savaş tazminatı ödediği antlaşma hangisidir?",
        "options": ["Küçük Kaynarca Antlaşması", "Karlofça Antlaşması", "Edirne Antlaşması", "Yaş Antlaşması"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Osmanlı Devleti'nin Kırım'ın bağımsızlığını kabul ettiği antlaşma hangisidir?",
        "options": ["Küçük Kaynarca Antlaşması", "Karlofça Antlaşması", "Berlin Antlaşması", "Londra Antlaşması"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'de 1921 Anayasası'nın diğer adı nedir?",
        "options": ["Teşkilat-ı Esasiye Kanunu", "Kanun-i Esasi", "Medeni Kanun", "Takrir-i Sükun Kanunu"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Tevhid-i Tedrisat Kanunu hangi alanla ilgilidir?",
        "options": ["Eğitim birliği", "Toprak reformu", "Denizcilik", "Seçim sistemi"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Tekke zaviye ve türbelerin kapatılması hangi ilkeyle daha çok ilişkilidir?",
        "options": ["Laiklik", "Devletçilik", "Milliyetçilik", "Cumhuriyetçilik"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Şapka Kanunu hangi alanda yapılan bir inkılaptır?",
        "options": ["Toplumsal yaşam", "Dış politika", "Tarım", "Yargı"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Takvim saat ve ölçülerde yapılan değişikliklerin temel amacı nedir?",
        "options": ["Batı ile uyumu sağlamak", "Saltanatı güçlendirmek", "Tarımı azaltmak", "Askerliği kaldırmak"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Aşar vergisinin kaldırılması en çok hangi kesimi rahatlatmıştır?",
        "options": ["Köylü ve çiftçi", "Tüccar", "Asker", "Memur"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "İzmir İktisat Kongresi hangi alanda kararlar alınması için toplanmıştır?",
        "options": ["Ekonomi", "Eğitim", "Askerlik", "Spor"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Atatürk döneminde kurulan ilk muhalefet partisi hangisidir?",
        "options": ["Terakkiperver Cumhuriyet Fırkası", "Serbest Cumhuriyet Fırkası", "Demokrat Parti", "Cumhuriyet Halk Fırkası"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Serbest Cumhuriyet Fırkası'nın kurucusu kimdir?",
        "options": ["Fethi Okyar", "Kazım Karabekir", "İsmet İnönü", "Celal Bayar"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'nin Milletler Cemiyeti'ne katıldığı yıl hangisidir?",
        "options": ["1932", "1923", "1936", "1939"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Montrö Boğazlar Sözleşmesi hangi yıl imzalanmıştır?",
        "options": ["1936", "1923", "1932", "1939"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Balkan Antantı hangi ülkeler arasında kurulmuştur?",
        "options": ["Türkiye Yunanistan Yugoslavya Romanya", "Türkiye İran Irak Afganistan", "Türkiye Almanya İtalya Fransa", "Türkiye Bulgaristan Suriye Mısır"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Sadabat Paktı hangi alanla ilgilidir?",
        "options": ["Bölgesel güvenlik ve iş birliği", "Edebiyat", "Sanayi üretimi", "Para basımı"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'de çok partili hayata kesin geçiş hangi partiyle başlamıştır?",
        "options": ["Demokrat Parti", "Serbest Cumhuriyet Fırkası", "Terakkiperver Cumhuriyet Fırkası", "Adalet Partisi"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Demokrasi kavramı temel olarak ne anlama gelir?",
        "options": ["Halkın yönetime katılması", "Tek kişinin yönetimi", "Askeri yönetim", "Soyluların yönetimi"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Anayasa'da değiştirilemeyecek hükümler arasında aşağıdakilerden hangisi yer alır?",
        "options": ["Devletin şeklinin cumhuriyet olması", "Her ilin plaka kodu", "Belediye sınırları", "Okul tatil günleri"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Hukuk devleti ilkesinin temel amacı nedir?",
        "options": ["Devlet gücünün hukukla sınırlandırılması", "Kanunların kişiye göre uygulanması", "Yargının kaldırılması", "Seçimlerin yapılmaması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Sosyal devlet anlayışı aşağıdakilerden hangisini amaçlar?",
        "options": ["Toplumsal refah ve adaleti sağlamak", "Sadece asker sayısını artırmak", "Yargıyı kapatmak", "Vergileri tamamen kaldırmak"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Laik devlet anlayışında temel ilke nedir?",
        "options": ["Devlet işlerinin dini kurallardan bağımsız yürütülmesi", "Yönetimin tek kişiye verilmesi", "Seçimlerin kaldırılması", "Hukukun yok sayılması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kanun teklif etme yetkisi Türkiye'de kime aittir?",
        "options": ["Milletvekillerine", "Valilere", "Muhtarlara", "Belediye başkanlarına"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'de genel seçimler olağan koşullarda kaç yılda bir yapılır?",
        "options": ["5 yılda bir", "4 yılda bir", "3 yılda bir", "7 yılda bir"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Cumhurbaşkanlığı seçimi olağan koşullarda kaç yılda bir yapılır?",
        "options": ["5 yılda bir", "4 yılda bir", "6 yılda bir", "7 yılda bir"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Milletvekili seçilme yaşı Türkiye'de kaçtır?",
        "options": ["18", "21", "25", "30"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de seçimlerin genel yönetim ve denetimini hangi kurum yapar?",
        "options": ["Yüksek Seçim Kurulu", "Sayıştay", "Danıştay", "Yargıtay"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Aşağıdakilerden hangisi temel hak ve özgürlüklerden biridir?",
        "options": ["Yaşama hakkı", "Trafik cezası", "Vergi borcu", "Resmi tatil"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Dilekçe hakkı hangi amaçla kullanılır?",
        "options": ["Yetkili makamlara istek ve şikayet iletmek", "Para basmak", "Askeri karar almak", "Yargı kararı vermek"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Bilgi edinme hakkı hangi alanla ilgilidir?",
        "options": ["Kamu kurumlarından bilgi talep etme", "Sadece ticaret yapma", "Vergiden muaf olma", "Askerlikten kaçınma"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Vergi vermek Anayasa'ya göre hangi tür yükümlülüktür?",
        "options": ["Vatandaşlık ödevi", "Siyasi hak", "Kişisel özgürlük", "Sosyal hak"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Aşağıdakilerden hangisi anayasal bir kurumdur?",
        "options": ["Anayasa Mahkemesi", "Spor kulübü", "Mahalle bakkalı", "Özel şirket"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Birleşmiş Milletler'in merkezi hangi şehirdedir?",
        "options": ["New York", "Paris", "Cenevre", "Brüksel"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "NATO'nun merkezi hangi şehirdedir?",
        "options": ["Brüksel", "New York", "Paris", "Roma"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "UNESCO'nun merkezi hangi şehirdedir?",
        "options": ["Paris", "Londra", "Berlin", "Madrid"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Avrupa Birliği'nin temelleri hangi kıtada atılmıştır?",
        "options": ["Avrupa", "Asya", "Afrika", "Güney Amerika"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Avrupa Birliği bayrağında kaç yıldız vardır?",
        "options": ["12", "10", "15", "27"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kızılhaç ve Kızılay hareketi genel olarak hangi alanda faaliyet gösterir?",
        "options": ["İnsani yardım", "Para politikası", "Askeri saldırı", "Petrol üretimi"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "OPEC hangi alanla ilgili uluslararası bir kuruluştur?",
        "options": ["Petrol", "Eğitim", "Sağlık", "Spor"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Interpol hangi alanda uluslararası iş birliği sağlar?",
        "options": ["Polis teşkilatları arası iş birliği", "Tarım üretimi", "Uzay araştırmaları", "Kültür festivali"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "G20 ülkeleri daha çok hangi konularda iş birliği yapar?",
        "options": ["Küresel ekonomi ve finans", "Sadece spor", "Sadece edebiyat", "Sadece turizm"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünya Ticaret Örgütü'nün kısa adı hangisidir?",
        "options": ["WTO", "WHO", "WFP", "UNICEF"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Dünya Bankası'nın temel faaliyet alanlarından biri hangisidir?",
        "options": ["Kalkınma projelerine finansman sağlamak", "Olimpiyat düzenlemek", "Savaş ilan etmek", "Ülke sınırı çizmek"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "İpek Yolu tarih boyunca en çok hangi amaçla kullanılmıştır?",
        "options": ["Ticaret", "Uzay yolculuğu", "Denizaltı ulaşımı", "Spor müsabakaları"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Baharat Yolu tarih boyunca hangi ürünlerin taşınmasıyla önem kazanmıştır?",
        "options": ["Baharat ve değerli mallar", "Petrol ve doğalgaz", "Elektronik cihazlar", "Otomobil parçaları"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Coğrafi keşiflerin başlamasında etkili olan temel nedenlerden biri hangisidir?",
        "options": ["Yeni ticaret yolları bulma isteği", "Matbaanın yasaklanması", "Sanayi Devrimi'nin bitmesi", "Uzay yarışının başlaması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Matbaanın Avrupa'da yaygınlaşması aşağıdakilerden hangisini hızlandırmıştır?",
        "options": ["Bilginin yayılmasını", "Feodalizmin güçlenmesini", "Okuryazarlığın azalmasını", "Ticaretin tamamen bitmesini"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Rönesans hareketi ilk olarak hangi ülkede başlamıştır?",
        "options": ["İtalya", "Fransa", "Almanya", "İngiltere"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Reform hareketleri daha çok hangi alanla ilgilidir?",
        "options": ["Din", "Spor", "Madencilik", "Denizcilik"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Fransız İhtilali'nin yaydığı en önemli fikirlerden biri hangisidir?",
        "options": ["Milliyetçilik", "Mutlak monarşi", "Feodal bağlılık", "Sömürgecilik"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Sanayi Devrimi ilk olarak hangi ülkede başlamıştır?",
        "options": ["İngiltere", "Fransa", "İtalya", "Rusya"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Sanayi Devrimi'nin üretime en önemli etkisi hangisidir?",
        "options": ["Makineleşmenin artması", "El işçiliğinin tek üretim şekli olması", "Ticaretin durması", "Nüfusun tamamen azalması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "I. Dünya Savaşı hangi yıllar arasında yaşanmıştır?",
        "options": ["1914-1918", "1939-1945", "1919-1923", "1789-1799"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "II. Dünya Savaşı hangi yıllar arasında yaşanmıştır?",
        "options": ["1939-1945", "1914-1918", "1923-1938", "1947-1991"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Soğuk Savaş dönemi daha çok hangi iki güç bloğu arasında yaşanmıştır?",
        "options": ["ABD ve SSCB", "Türkiye ve Yunanistan", "Fransa ve Almanya", "İtalya ve İspanya"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Berlin Duvarı hangi ülkede bulunuyordu?",
        "options": ["Almanya", "Fransa", "Polonya", "Avusturya"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünyanın en geniş kıtası hangisidir?",
        "options": ["Asya", "Afrika", "Avrupa", "Antarktika"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Dünyanın en küçük kıtası hangisidir?",
        "options": ["Avustralya", "Avrupa", "Antarktika", "Güney Amerika"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ekvator çizgisi Dünya'yı hangi iki yarım küreye ayırır?",
        "options": ["Kuzey ve Güney", "Doğu ve Batı", "Kara ve Deniz", "Sıcak ve Soğuk"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Başlangıç meridyeni hangi gözlemevinden geçer?",
        "options": ["Greenwich", "Paris", "Roma", "Kahire"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünya üzerinde yerel saat farklarının oluşmasının temel nedeni nedir?",
        "options": ["Dünya'nın kendi ekseni etrafında dönmesi", "Ay'ın evreleri", "Mevsimler", "Okyanus akıntıları"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kutup noktalarına gidildikçe meridyenler arasındaki mesafe ne olur?",
        "options": ["Azalır", "Artar", "Değişmez", "Tamamen yok olur"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Haritalarda küçültme oranını gösteren kavram hangisidir?",
        "options": ["Ölçek", "Lejant", "Koordinat", "Paralel"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Haritalarda kullanılan işaretlerin anlamını gösteren bölüme ne ad verilir?",
        "options": ["Lejant", "Ölçek", "Meridyen", "Rakım"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Deniz seviyesinden yüksekliğe ne ad verilir?",
        "options": ["Rakım", "Enlem", "Boylam", "Basınç"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Atmosferde hava olaylarının gerçekleştiği katman hangisidir?",
        "options": ["Troposfer", "Stratosfer", "Mezosfer", "Termosfer"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Ozon tabakası atmosferin hangi katmanında yoğun olarak bulunur?",
        "options": ["Stratosfer", "Troposfer", "Mezosfer", "Ekzosfer"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Depremin yer altında başladığı noktaya ne ad verilir?",
        "options": ["Odak noktası", "Merkez üssü", "Fay hattı", "Krater"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Depremin yeryüzünde en şiddetli hissedildiği noktaya ne ad verilir?",
        "options": ["Merkez üssü", "Odak noktası", "Magma odası", "Delta"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Yanardağ patlamaları sonucunda yeryüzüne çıkan erimiş kayaçlara ne denir?",
        "options": ["Lav", "Tortul", "Humus", "Fosil"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Akarsuların denize döküldüğü yerde biriktirme yaparak oluşturduğu şekle ne denir?",
        "options": ["Delta", "Falez", "Krater", "Vadi"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dalga aşındırmasıyla oluşan dik kıyı şekline ne ad verilir?",
        "options": ["Falez", "Delta", "Plato", "Ova"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Buzulların aşındırmasıyla oluşan kıyı tipine ne denir?",
        "options": ["Fiyort", "Limanlı kıyı", "Dalmaçya kıyı", "Enine kıyı"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Akarsular tarafından derince yarılmış yüksek düzlüklere ne ad verilir?",
        "options": ["Plato", "Ova", "Vadi", "Delta"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Yer kabuğunu oluşturan büyük parçalara ne ad verilir?",
        "options": ["Levha", "Bulut", "Akıntı", "Katman"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünya'nın en dış katmanı hangisidir?",
        "options": ["Yer kabuğu", "Çekirdek", "Manto", "Magma"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Canlıların en küçük yapı ve görev birimi hangisidir?",
        "options": ["Hücre", "Doku", "Organ", "Sistem"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kalıtsal özellikleri taşıyan yapı hangisidir?",
        "options": ["DNA", "Klorofil", "Hemoglobin", "Enzim"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Bitkilerde su ve mineral taşınmasını sağlayan doku hangisidir?",
        "options": ["Ksilem", "Floem", "Epidermis", "Meristem"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Bitkilerde organik besinlerin taşınmasını sağlayan doku hangisidir?",
        "options": ["Floem", "Ksilem", "Kambiyum", "Stoma"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "İnsanlarda oksijen taşıyan kan hücreleri hangisidir?",
        "options": ["Alyuvar", "Akyuvar", "Trombosit", "Plazma"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Bağışıklık sisteminde görevli kan hücreleri hangisidir?",
        "options": ["Akyuvar", "Alyuvar", "Trombosit", "Plazma"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kanın pıhtılaşmasında görevli kan hücreleri hangisidir?",
        "options": ["Trombosit", "Alyuvar", "Akyuvar", "Hemoglobin"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Solunum sisteminin temel organı hangisidir?",
        "options": ["Akciğer", "Kalp", "Böbrek", "Mide"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "İnsan vücudunda idrarı oluşturan organ hangisidir?",
        "options": ["Böbrek", "Kalp", "Karaciğer", "Mide"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Sindirim sisteminde besinlerin emiliminin en fazla gerçekleştiği organ hangisidir?",
        "options": ["İnce bağırsak", "Mide", "Kalın bağırsak", "Yemek borusu"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Karaciğerin salgıladığı safra hangi organ içinde depolanır?",
        "options": ["Safra kesesi", "Mide", "Pankreas", "Dalak"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "İnsülin hormonu hangi organ tarafından salgılanır?",
        "options": ["Pankreas", "Karaciğer", "Böbrek", "Akciğer"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Vücudun denge ve koordinasyon merkezi beynin hangi bölümüdür?",
        "options": ["Beyincik", "Omurilik", "Beyin sapı", "Hipofiz"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Refleks olaylarında temel olarak hangi yapı görev alır?",
        "options": ["Omurilik", "Mide", "Kalp", "Karaciğer"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kemiklerin birbirine bağlandığı yerlere ne denir?",
        "options": ["Eklem", "Kas", "Sinir", "Damar"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kasların kemiklere bağlanmasını sağlayan yapıya ne ad verilir?",
        "options": ["Tendon", "Eklem", "Kıkırdak", "Bağ dokusu"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Diş minesinin temel özelliği nedir?",
        "options": ["Vücuttaki en sert yapılardan biri olması", "Sürekli kan pompalaması", "Oksijen taşıması", "Ses üretmesi"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Sesin oluşmasını sağlayan yapı hangisidir?",
        "options": ["Ses telleri", "Kulak zarı", "Diş minesi", "Göz merceği"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Gözde ışığın kırılmasını sağlayan saydam yapı hangisidir?",
        "options": ["Kornea", "Kulak zarı", "Dil", "Deri"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Gözde görüntünün oluştuğu tabaka hangisidir?",
        "options": ["Retina", "Kornea", "İris", "Göz kapağı"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Maddenin katı sıvı ve gaz halleri genel olarak neye örnektir?",
        "options": ["Fiziksel hal", "Kimyasal tepkime", "Canlılık özelliği", "Elektrik yükü"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Buzun erimesi hangi tür değişime örnektir?",
        "options": ["Fiziksel değişim", "Kimyasal değişim", "Yanma", "Paslanma"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Demirin paslanması hangi tür değişime örnektir?",
        "options": ["Kimyasal değişim", "Fiziksel değişim", "Erime", "Donma"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Asitlerin turnusol kağıdına etkisi genellikle nasıldır?",
        "options": ["Mavi turnusolu kırmızıya çevirir", "Kırmızı turnusolu maviye çevirir", "Renk değiştirmez", "Kağıdı yok eder"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Bazların turnusol kağıdına etkisi genellikle nasıldır?",
        "options": ["Kırmızı turnusolu maviye çevirir", "Mavi turnusolu kırmızıya çevirir", "Renk değiştirmez", "Kağıdı yakar"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "pH değeri 7 olan bir madde genel olarak nasıl kabul edilir?",
        "options": ["Nötr", "Asidik", "Bazik", "Radyoaktif"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Elektrik devresinde akımın geçmesini sağlayan kapalı yola ne denir?",
        "options": ["Devre", "Yalıtkan", "Mıknatıs", "Basınç"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Elektrik akımını iyi ileten maddelere ne denir?",
        "options": ["İletken", "Yalıtkan", "Saydam", "Esnek"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Elektrik akımını iletmeyen maddelere ne denir?",
        "options": ["Yalıtkan", "İletken", "Manyetik", "Sıvı"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kuvvetin birimi nedir?",
        "options": ["Newton", "Joule", "Watt", "Volt"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Enerjinin birimi nedir?",
        "options": ["Joule", "Newton", "Pascal", "Amper"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Gücün birimi nedir?",
        "options": ["Watt", "Volt", "Newton", "Litre"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Basıncın birimi nedir?",
        "options": ["Pascal", "Joule", "Newton", "Kelvin"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Sıcaklığın SI birimi nedir?",
        "options": ["Kelvin", "Celsius", "Fahrenheit", "Joule"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Işığın boşluktaki hızı yaklaşık olarak ne kadardır?",
        "options": ["300.000 km/s", "150.000 km/s", "30.000 km/s", "3.000 km/s"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Gökkuşağının oluşmasında temel olarak hangi olay etkilidir?",
        "options": ["Işığın kırılması ve yansıması", "Sesin yayılması", "Deprem dalgaları", "Mıknatıslanma"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Güneş tutulması hangi durumda gerçekleşir?",
        "options": ["Ay'ın Dünya ile Güneş arasına girmesi", "Dünya'nın Ay ile Güneş arasına girmesi", "Güneş'in Dünya ile Ay arasına girmesi", "Ay'ın yok olması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ay tutulması hangi durumda gerçekleşir?",
        "options": ["Dünya'nın Güneş ile Ay arasına girmesi", "Ay'ın Güneş ile Dünya arasına girmesi", "Güneş'in Dünya ile Ay arasına girmesi", "Ay'ın Güneş'e yaklaşması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Merkür gezegeninin Güneş'e yakın olmasına rağmen çok büyük sıcaklık farkları yaşamasının nedeni nedir?",
        "options": ["Atmosferinin çok zayıf olması", "Çok büyük okyanuslara sahip olması", "Çok fazla bitki bulunması", "Dünya'ya uzak olması"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Venüs gezegeninin çok sıcak olmasının temel nedeni nedir?",
        "options": ["Yoğun sera etkisi", "Güneş'ten en uzak gezegen olması", "Hiç atmosferinin olmaması", "Buzullarla kaplı olması"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Satürn gezegeni en çok hangi özelliğiyle tanınır?",
        "options": ["Halkaları", "En küçük gezegen olması", "Kızıl renkli olması", "Dünya'nın uydusu olması"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Plüton günümüzde nasıl sınıflandırılır?",
        "options": ["Cüce gezegen", "Yıldız", "Uydu", "Asteroit kuşağı"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Güneş bir yıldız mıdır?",
        "options": ["Evet", "Hayır", "Sadece gezegendir", "Sadece uydudur"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Güneş'in enerjisinin temel kaynağı nedir?",
        "options": ["Nükleer füzyon", "Kömür yanması", "Elektrik motoru", "Rüzgar gücü"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Samanyolu nedir?",
        "options": ["Bir galaksi", "Bir gezegen", "Bir uydu", "Bir ülke"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Edebiyatta olay çevresinde gelişen ve uzun anlatı türü olan eser hangisidir?",
        "options": ["Roman", "Deneme", "Makale", "Fıkra"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kısa olay anlatılarına ne ad verilir?",
        "options": ["Hikaye", "Roman", "Destan", "Makale"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Bir kişinin kendi hayatını anlattığı yazı türüne ne denir?",
        "options": ["Otobiyografi", "Biyografi", "Deneme", "Eleştiri"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Bir kişinin hayatının başkası tarafından anlatıldığı yazı türüne ne denir?",
        "options": ["Biyografi", "Otobiyografi", "Günlük", "Fıkra"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Günlük türünün temel özelliği nedir?",
        "options": ["Günü gününe yazılması", "Sadece bilimsel olması", "Mutlaka şiir olması", "Anonim olması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Gezi yazısı hangi konu etrafında oluşur?",
        "options": ["Gezilip görülen yerler", "Sadece savaşlar", "Matematik problemleri", "Kimyasal deneyler"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Makale türünün temel özelliği nedir?",
        "options": ["Bilimsel ve kanıtlayıcı anlatım içermesi", "Tamamen hayal ürünü olması", "Sadece günlük dilde yazılması", "Mutlaka kafiyeli olması"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Deneme türünde yazar genellikle nasıl bir anlatım kullanır?",
        "options": ["Kişisel ve özgür anlatım", "Resmi mahkeme dili", "Matematiksel ispat", "Sadece emir cümleleri"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Destan türünün temel özelliği nedir?",
        "options": ["Milletlerin kahramanlıklarını anlatması", "Günlük haberleri aktarması", "Sadece yemek tarifi vermesi", "Hukuk maddeleri içermesi"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Masal türünün temel özelliklerinden biri hangisidir?",
        "options": ["Olağanüstü olaylara yer vermesi", "Tamamen belgeye dayanması", "Sadece tarih öğretmesi", "Gerçek kişilerle sınırlı olması"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türk edebiyatında roman türünün ilk örneği kabul edilen eser hangisidir?",
        "options": ["Taaşşuk-ı Talat ve Fitnat", "Eylül", "İntibah", "Sinekli Bakkal"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Araba Sevdası romanının yazarı kimdir?",
        "options": ["Recaizade Mahmut Ekrem", "Namık Kemal", "Halit Ziya Uşaklıgil", "Ahmet Mithat Efendi"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Aşk-ı Memnu romanının yazarı kimdir?",
        "options": ["Halit Ziya Uşaklıgil", "Reşat Nuri Güntekin", "Peyami Safa", "Yakup Kadri Karaosmanoğlu"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Yaban romanının yazarı kimdir?",
        "options": ["Yakup Kadri Karaosmanoğlu", "Halide Edip Adıvar", "Orhan Kemal", "Tarık Buğra"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Ateşten Gömlek romanının yazarı kimdir?",
        "options": ["Halide Edip Adıvar", "Sabahattin Ali", "Yaşar Kemal", "Peyami Safa"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Dokuzuncu Hariciye Koğuşu romanının yazarı kimdir?",
        "options": ["Peyami Safa", "Reşat Nuri Güntekin", "Orhan Pamuk", "Kemal Tahir"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Devlet Ana romanının yazarı kimdir?",
        "options": ["Kemal Tahir", "Yaşar Kemal", "Orhan Kemal", "Tarık Buğra"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Tutunamayanlar romanının yazarı kimdir?",
        "options": ["Oğuz Atay", "Orhan Pamuk", "Ahmet Hamdi Tanpınar", "Yusuf Atılgan"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Saatleri Ayarlama Enstitüsü romanının yazarı kimdir?",
        "options": ["Ahmet Hamdi Tanpınar", "Oğuz Atay", "Peyami Safa", "Kemal Tahir"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Kuyucaklı Yusuf romanının yazarı kimdir?",
        "options": ["Sabahattin Ali", "Orhan Kemal", "Yaşar Kemal", "Tarık Buğra"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Hababam Sınıfı'nın yazarı kimdir?",
        "options": ["Rıfat Ilgaz", "Aziz Nesin", "Kemal Sunal", "Münir Özkul"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Nasreddin Hoca fıkraları genel olarak hangi anlatım özelliğiyle bilinir?",
        "options": ["Mizah ve düşündürücülük", "Bilimsel kanıt", "Resmi hukuk dili", "Savaş taktiği"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Karagöz ve Hacivat hangi geleneksel Türk sanatına örnektir?",
        "options": ["Gölge oyunu", "Opera", "Bale", "Roman"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Orta oyunu geleneksel olarak hangi alana girer?",
        "options": ["Türk tiyatrosu", "Maden sanatı", "Denizcilik", "Haritacılık"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Minyatür sanatı en çok hangi özelliğiyle bilinir?",
        "options": ["Küçük boyutlu ayrıntılı resimler", "Büyük taş heykeller", "Metal para basımı", "Cam üfleme"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ebru sanatı hangi malzeme üzerinde oluşturulan desenlerle bilinir?",
        "options": ["Su yüzeyi", "Mermer blok", "Cam levha", "Deri kumaş"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Hat sanatı hangi alanla ilgilidir?",
        "options": ["Güzel yazı", "Heykel", "Müzik", "Mimarlık"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Mimar Sinan'ın ustalık eseri olarak kabul edilen yapı hangisidir?",
        "options": ["Selimiye Camii", "Süleymaniye Camii", "Şehzade Camii", "Mihrimah Sultan Camii"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Süleymaniye Camii hangi şehirde bulunur?",
        "options": ["İstanbul", "Edirne", "Bursa", "Konya"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Selimiye Camii hangi şehirde bulunur?",
        "options": ["Edirne", "İstanbul", "Bursa", "Ankara"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ayasofya hangi şehirde bulunur?",
        "options": ["İstanbul", "Ankara", "İzmir", "Bursa"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Topkapı Sarayı hangi şehirde bulunur?",
        "options": ["İstanbul", "Edirne", "Bursa", "Konya"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Dolmabahçe Sarayı hangi şehirde bulunur?",
        "options": ["İstanbul", "Ankara", "İzmir", "Antalya"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Anıtkabir hangi şehirde bulunur?",
        "options": ["Ankara", "İstanbul", "Samsun", "İzmir"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Atatürk Orman Çiftliği hangi şehirde kurulmuştur?",
        "options": ["Ankara", "İstanbul", "İzmir", "Bursa"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin ilk milli parkı hangisidir?",
        "options": ["Yozgat Çamlığı Milli Parkı", "Yedigöller Milli Parkı", "Uludağ Milli Parkı", "Köprülü Kanyon Milli Parkı"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Aspendos Antik Tiyatrosu hangi ilimizdedir?",
        "options": ["Antalya", "İzmir", "Aydın", "Muğla"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Sümela Manastırı hangi ilimizdedir?",
        "options": ["Trabzon", "Rize", "Artvin", "Giresun"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Safranbolu evleri hangi ilimizdedir?",
        "options": ["Karabük", "Kastamonu", "Bolu", "Bartın"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Odunpazarı evleri hangi ilimizdedir?",
        "options": ["Eskişehir", "Kütahya", "Bursa", "Afyonkarahisar"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ahlat Selçuklu mezar taşları hangi ilimizdedir?",
        "options": ["Bitlis", "Van", "Muş", "Erzurum"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "İshak Paşa Sarayı hangi ilimizdedir?",
        "options": ["Ağrı", "Van", "Erzurum", "Kars"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Balıklıgöl hangi ilimizdedir?",
        "options": ["Şanlıurfa", "Gaziantep", "Mardin", "Adıyaman"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Hasankeyf hangi ilimizdedir?",
        "options": ["Batman", "Mardin", "Diyarbakır", "Siirt"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Mardin daha çok hangi mimari özelliğiyle tanınır?",
        "options": ["Taş evleri", "Ahşap yayla evleri", "Cam gökdelenleri", "Buzdan yapıları"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Erciyes Dağı hangi ilimizdedir?",
        "options": ["Kayseri", "Niğde", "Sivas", "Nevşehir"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Uludağ hangi ilimizdedir?",
        "options": ["Bursa", "Kocaeli", "Bolu", "Sakarya"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Palandöken Kayak Merkezi hangi ilimizdedir?",
        "options": ["Erzurum", "Bursa", "Kayseri", "Kars"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Ilgaz Dağı Milli Parkı hangi iki il arasında yer alır?",
        "options": ["Kastamonu ve Çankırı", "Bolu ve Düzce", "Erzurum ve Kars", "Muğla ve Aydın"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Sapanca Gölü hangi ilimizle özdeşleşmiştir?",
        "options": ["Sakarya", "Bolu", "Kocaeli", "Bursa"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Abant Gölü hangi ilimizdedir?",
        "options": ["Bolu", "Sakarya", "Düzce", "Kastamonu"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Beyşehir Gölü ağırlıklı olarak hangi il sınırları içindedir?",
        "options": ["Konya", "Isparta", "Burdur", "Afyonkarahisar"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Tuz Gölü hangi bölgemizde yer alır?",
        "options": ["İç Anadolu Bölgesi", "Ege Bölgesi", "Akdeniz Bölgesi", "Marmara Bölgesi"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Türkiye'de tuz üretimiyle bilinen büyük göl hangisidir?",
        "options": ["Tuz Gölü", "Van Gölü", "Eğirdir Gölü", "Sapanca Gölü"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Manyas Kuş Cenneti hangi ilimizdedir?",
        "options": ["Balıkesir", "Bursa", "Çanakkale", "Kocaeli"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Dalyan İztuzu Plajı hangi canlı türünün korunmasıyla bilinir?",
        "options": ["Caretta caretta", "Penguen", "Kutup ayısı", "Panda"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Galata Kulesi hangi şehirde bulunur?",
        "options": ["İstanbul", "Ankara", "İzmir", "Bursa"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Kız Kulesi hangi şehirde bulunur?",
        "options": ["İstanbul", "İzmir", "Antalya", "Trabzon"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Saat Kulesi ile özdeşleşen şehirlerimizden biri hangisidir?",
        "options": ["İzmir", "Erzurum", "Sinop", "Kars"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Cumalıkızık köyü hangi ilimizdedir?",
        "options": ["Bursa", "Eskişehir", "Kütahya", "Balıkesir"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Hattuşa Antik Kenti hangi ilimizdedir?",
        "options": ["Çorum", "Yozgat", "Sivas", "Amasya"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Alacahöyük hangi ilimizdedir?",
        "options": ["Çorum", "Ankara", "Kırıkkale", "Tokat"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Kültepe Kaniş Karum hangi ilimizdedir?",
        "options": ["Kayseri", "Nevşehir", "Sivas", "Konya"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Assos Antik Kenti hangi ilimizdedir?",
        "options": ["Çanakkale", "Balıkesir", "İzmir", "Aydın"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Bergama Antik Kenti hangi ilimizdedir?",
        "options": ["İzmir", "Aydın", "Manisa", "Denizli"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Priene Antik Kenti hangi ilimizdedir?",
        "options": ["Aydın", "İzmir", "Muğla", "Denizli"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Knidos Antik Kenti hangi ilimizdedir?",
        "options": ["Muğla", "Antalya", "İzmir", "Aydın"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Side Antik Kenti hangi ilimizdedir?",
        "options": ["Antalya", "Mersin", "Muğla", "Aydın"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Perge Antik Kenti hangi ilimizdedir?",
        "options": ["Antalya", "İzmir", "Aydın", "Muğla"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Çatalhöyük Neolitik Kenti hangi ilimizdedir?",
        "options": ["Konya", "Çorum", "Kayseri", "Nevşehir"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Troya Antik Kenti UNESCO Dünya Mirası Listesi'ne hangi ilimizden girmiştir?",
        "options": ["Çanakkale", "İzmir", "Balıkesir", "Bursa"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin ilk kadın başbakanı kimdir?",
        "options": ["Tansu Çiller", "Sabiha Gökçen", "Halide Edip Adıvar", "Fatma Aliye"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'nin ilk kadın doktorlarından biri olarak bilinen kişi kimdir?",
        "options": ["Safiye Ali", "Sabiha Gökçen", "Afet İnan", "Nene Hatun"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Türkiye'nin ilk kadın romancılarından biri kimdir?",
        "options": ["Fatma Aliye", "Halide Edip Adıvar", "Adalet Ağaoğlu", "Latife Tekin"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Dünyada ilk başarılı motorlu uçuşu gerçekleştiren kardeşler kimlerdir?",
        "options": ["Wright Kardeşler", "Lumiere Kardeşler", "Grimm Kardeşler", "Montgolfier Kardeşler"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Sinemanın öncüleri olarak kabul edilen Lumiere Kardeşler hangi alanda tanınır?",
        "options": ["Sinema", "Havacılık", "Matematik", "Müzik"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Telefonun icadıyla en çok ilişkilendirilen kişi kimdir?",
        "options": ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Albert Einstein"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Ampulün geliştirilmesiyle en çok ilişkilendirilen mucit kimdir?",
        "options": ["Thomas Edison", "Alexander Graham Bell", "Isaac Newton", "Galileo Galilei"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Yer çekimi kanunuyla en çok ilişkilendirilen bilim insanı kimdir?",
        "options": ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Marie Curie"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Görelilik teorisiyle tanınan bilim insanı kimdir?",
        "options": ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Charles Darwin"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Evrim teorisiyle tanınan bilim insanı kimdir?",
        "options": ["Charles Darwin", "Albert Einstein", "Nikola Tesla", "Louis Pasteur"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Radyum ve polonyum elementleriyle çalışmalarıyla bilinen bilim insanı kimdir?",
        "options": ["Marie Curie", "Ada Lovelace", "Rosalind Franklin", "Jane Goodall"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Pastörizasyon yöntemiyle tanınan bilim insanı kimdir?",
        "options": ["Louis Pasteur", "Gregor Mendel", "Galileo Galilei", "Arşimet"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Genetiğin babası olarak bilinen bilim insanı kimdir?",
        "options": ["Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Isaac Newton"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Dünya'nın Güneş etrafında döndüğünü savunan bilim insanlarından biri kimdir?",
        "options": ["Kopernik", "Aristoteles", "Ptolemaios", "Hipokrat"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Teleskopla yaptığı gözlemlerle astronomiye önemli katkı sağlayan bilim insanı kimdir?",
        "options": ["Galileo Galilei", "Edison", "Pasteur", "Darwin"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Suyun kaldırma kuvvetiyle ilgili buluşuyla tanınan bilim insanı kimdir?",
        "options": ["Arşimet", "Newton", "Einstein", "Tesla"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Tıp biliminin babası olarak bilinen kişi kimdir?",
        "options": ["Hipokrat", "Arşimet", "Platon", "Sokrates"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Felsefede Sokrates'in öğrencisi olan ünlü filozof kimdir?",
        "options": ["Platon", "Aristoteles", "Descartes", "Kant"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Platon'un öğrencisi olan ünlü filozof kimdir?",
        "options": ["Aristoteles", "Sokrates", "Kant", "Nietzsche"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Mona Lisa tablosunun ressamı kimdir?",
        "options": ["Leonardo da Vinci", "Michelangelo", "Pablo Picasso", "Vincent van Gogh"],
        "correct": 0,
        "difficulty": "kolay"
    },
    {
        "text": "Yıldızlı Gece tablosunun ressamı kimdir?",
        "options": ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Guernica tablosunun ressamı kimdir?",
        "options": ["Pablo Picasso", "Salvador Dali", "Vincent van Gogh", "Rembrandt"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Çığlık tablosunun ressamı kimdir?",
        "options": ["Edvard Munch", "Claude Monet", "Pablo Picasso", "Michelangelo"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Kaplumbağa Terbiyecisi tablosunun ressamı kimdir?",
        "options": ["Osman Hamdi Bey", "İbrahim Çallı", "Şeker Ahmet Paşa", "Fikret Mualla"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Osman Hamdi Bey hangi alanlarla tanınır?",
        "options": ["Ressamlık ve müzecilik", "Futbol ve voleybol", "Havacılık ve uzay", "Kimya ve fizik"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Türkiye'de müzeciliğin kurucularından kabul edilen kişi kimdir?",
        "options": ["Osman Hamdi Bey", "Mimar Sinan", "Cahit Arf", "Evliya Çelebi"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Seyahatname adlı eserin yazarı kimdir?",
        "options": ["Evliya Çelebi", "Katip Çelebi", "Naima", "Piri Reis"],
        "correct": 0,
        "difficulty": "orta"
    },
    {
        "text": "Kitab-ı Bahriye adlı denizcilik eseri kime aittir?",
        "options": ["Piri Reis", "Evliya Çelebi", "Katip Çelebi", "Mimar Sinan"],
        "correct": 0,
        "difficulty": "zor"
    },
    {
        "text": "Cihannüma adlı eser kime aittir?",
        "options": ["Katip Çelebi", "Piri Reis", "Evliya Çelebi", "Naima"],
        "correct": 0,
        "difficulty": "zor"
    }
];
