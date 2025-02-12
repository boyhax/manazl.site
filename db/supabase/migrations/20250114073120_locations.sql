CREATE TABLE locations (
    slug TEXT UNIQUE NOT NULL,
    label_ar TEXT NOT NULL,
    label_en TEXT NOT NULL,
    url_name TEXT NOT NULL,
    type TEXT CHECK (type IN ('country', 'state', 'city')) NOT NULL,
    parent_slug TEXT REFERENCES locations(slug) ON DELETE CASCADE ON UPDATE CASCADE,
    location GEOGRAPHY(Point, 4326),
    -- Using PostGIS for spatial data
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);

-- Insert data with lat and lng
INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- Country
    (
        'oman',
        'عمان',
        'Oman',
        'oman',
        'country',
        NULL,
        ST_Point(58.5933, 23.6143),
        23.6143,
        58.5933
    ),
    -- State
    (
        'al-batinah',
        'الباطنة',
        'Al Batinah',
        'al-batinah',
        'state',
        'oman',
        ST_Point(57.4872, 23.6345),
        23.6345,
        57.4872
    ),
    -- Cities
    (
        'sohar',
        'صحار',
        'Sohar',
        'sohar',
        'city',
        'al-batinah',
        ST_Point(56.6836, 24.3421),
        24.3421,
        56.6836
    ),
    (
        'al-khaboura',
        'الخابورة',
        'Al Khaboura',
        'al-khaboura',
        'city',
        'al-batinah',
        ST_Point(56.4625, 23.9817),
        23.9817,
        56.4625
    ),
    (
        'suwaiq',
        'السويق',
        'Suwaiq',
        'suwaiq',
        'city',
        'al-batinah',
        ST_Point(56.3520, 23.8494),
        23.8494,
        56.3520
    ),
    (
        'al-awabi',
        'العوابي',
        'Al Awabi',
        'al-awabi',
        'city',
        'al-batinah',
        ST_Point(57.4039, 23.3173),
        23.3173,
        57.4039
    ),
    (
        'al-masn-a',
        'المصنعة',
        'Al Masnaah',
        'al-masn-a',
        'city',
        'al-batinah',
        ST_Point(57.5356, 23.4001),
        23.4001,
        57.5356
    ),
    (
        'al-rumais',
        'الرميس',
        'Al Rumais',
        'al-rumais',
        'city',
        'al-batinah',
        ST_Point(57.5798, 23.4267),
        23.4267,
        57.5798
    ),
    (
        'barka',
        'بركاء',
        'Barka',
        'barka',
        'city',
        'al-batinah',
        ST_Point(57.8885, 23.6782),
        23.6782,
        57.8885
    ),
    (
        'liwa',
        'لوى',
        'Liwa',
        'liwa',
        'city',
        'al-batinah',
        ST_Point(56.5667, 24.5295),
        24.5295,
        56.5667
    ),
    (
        'nakhl',
        'نخل',
        'Nakhl',
        'nakhl',
        'city',
        'al-batinah',
        ST_Point(57.7762, 23.3968),
        23.3968,
        57.7762
    ),
    (
        'rustaq',
        'الرستاق',
        'Rustaq',
        'rustaq',
        'city',
        'al-batinah',
        ST_Point(57.4244, 23.3905),
        23.3905,
        57.4244
    ),
    (
        'saham',
        'صحم',
        'Saham',
        'saham',
        'city',
        'al-batinah',
        ST_Point(56.8886, 24.1723),
        24.1723,
        56.8886
    ),
    (
        'shinas',
        'شناص',
        'Shinas',
        'shinas',
        'city',
        'al-batinah',
        ST_Point(56.4765, 24.7437),
        24.7437,
        56.4765
    ),
    (
        'wadi-al-ma-awal',
        'وادي المعاول',
        'Wadi Al Maawal',
        'wadi-al-ma-awal',
        'city',
        'al-batinah',
        ST_Point(57.4231, 23.4376),
        23.4376,
        57.4231
    ),
    (
        'other',
        'أخرى',
        'Other',
        'other',
        'city',
        'al-batinah',
        NULL,
        NULL,
        NULL
    );

    -- Insert Al Dakhiliya state and its cities
INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- State
    (
        'al-dakhiliya',
        'الداخلية',
        'Al Dakhiliya',
        'al-dakhiliya',
        'state',
        'oman',
        ST_Point(57.5284, 22.9331),
        22.9331,
        57.5284
    ),
    -- Cities
    (
        'bidbid',
        'بدبد',
        'Bidbid',
        'bidbid',
        'city',
        'al-dakhiliya',
        ST_Point(58.1285, 23.4088),
        23.4088,
        58.1285
    ),
    (
        'nizwa',
        'نزوى',
        'Nizwa',
        'nizwa',
        'city',
        'al-dakhiliya',
        ST_Point(57.5351, 22.9331),
        22.9331,
        57.5351
    ),
    (
        'adam',
        'أدم',
        'Adam',
        'adam',
        'city',
        'al-dakhiliya',
        ST_Point(57.5275, 22.3751),
        22.3751,
        57.5275
    ),
    (
        'bahla',
        'بهلاء',
        'Bahla',
        'bahla',
        'city',
        'al-dakhiliya',
        ST_Point(57.2986, 22.9601),
        22.9601,
        57.2986
    ),
    (
        'hamra',
        'الحمراء',
        'Hamra',
        'hamra',
        'city',
        'al-dakhiliya',
        ST_Point(57.1974, 23.1015),
        23.1015,
        57.1974
    ),
    (
        'izki',
        'ازكي',
        'Izki',
        'izki',
        'city',
        'al-dakhiliya',
        ST_Point(57.7663, 22.9361),
        22.9361,
        57.7663
    ),
    (
        'manah',
        'منح',
        'Manah',
        'manah',
        'city',
        'al-dakhiliya',
        ST_Point(57.5832, 22.8007),
        22.8007,
        57.5832
    ),
    (
        'sumail',
        'سمائل',
        'Sumail',
        'sumail',
        'city',
        'al-dakhiliya',
        ST_Point(58.0094, 23.3015),
        23.3015,
        58.0094
    );

    INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- State
    (
        'al-dhahirah',
        'الظاهرة',
        'Al Dhahirah',
        'al-dhahirah',
        'state',
        'oman',
        ST_Point(56.5452, 23.2327),
        23.2327,
        56.5452
    ),
    -- Cities
    (
        'yunqul',
        'ينقل',
        'Yunqul',
        'yunqul',
        'city',
        'al-dhahirah',
        ST_Point(56.6585, 23.1521),
        23.1521,
        56.6585
    ),
    (
        'dhank',
        'ضنك',
        'Dhank',
        'dhank',
        'city',
        'al-dhahirah',
        ST_Point(56.6713, 23.2158),
        23.2158,
        56.6713
    ),
    (
        'ibri',
        'عبري',
        'Ibri',
        'ibri',
        'city',
        'al-dhahirah',
        ST_Point(56.5343, 23.1401),
        23.1401,
        56.5343
    );

    -- Insert Al Sharqiya state and its cities
INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- State
    (
        'al-sharqiya',
        'الشرقية',
        'Al Sharqiya',
        'al-sharqiya',
        'state',
        'oman',
        ST_Point(56.2327, 22.9736),
        22.9736,
        56.2327
    ),
    -- Cities
    (
        'ibra',
        'إبراء',
        'Ibra',
        'ibra',
        'city',
        'al-sharqiya',
        ST_Point(56.4807, 22.7454),
        22.7454,
        56.4807
    ),
    (
        'al-kamil-and-al-waafi',
        'الكامل والوافي',
        'Al Kamil and Al Waafi',
        'al-kamil-and-al-waafi',
        'city',
        'al-sharqiya',
        ST_Point(56.4322, 22.7561),
        22.7561,
        56.4322
    ),
    (
        'al-mudaibi',
        'المضيبي',
        'Al Mudaibi',
        'al-mudaibi',
        'city',
        'al-sharqiya',
        ST_Point(56.7653, 22.8496),
        22.8496,
        56.7653
    ),
    (
        'al-qabil',
        'القابل',
        'Al Qabil',
        'al-qabil',
        'city',
        'al-sharqiya',
        ST_Point(56.8001, 22.7047),
        22.7047,
        56.8001
    ),
    (
        'bidiya',
        'بدية',
        'Bidiya',
        'bidiya',
        'city',
        'al-sharqiya',
        ST_Point(56.4539, 22.8169),
        22.8169,
        56.4539
    ),
    (
        'dima-and-al-taaiyin',
        'دماء والطائيين',
        'Dima and Al Taaiyin',
        'dima-and-al-taaiyin',
        'city',
        'al-sharqiya',
        ST_Point(56.2846, 22.9237),
        22.9237,
        56.2846
    ),
    (
        'ja-alan-bani-bu-ali',
        'جعلان بني بو علي',
        'Ja\'alan Bani Bu Ali',
        'ja-alan-bani-bu-ali',
        'city',
        'al-sharqiya',
        ST_Point(56.6154, 22.7311),
        22.7311,
        56.6154
    ),
    (
        'jalan-bani-buhassan',
        'جعلان بني بو حسن',
        'Jalan Bani buhassan',
        'jalan-bani-buhassan',
        'city',
        'al-sharqiya',
        ST_Point(56.7984, 22.7392),
        22.7392,
        56.7984
    ),
    (
        'masira',
        'مصيرة',
        'Masira',
        'masira',
        'city',
        'al-sharqiya',
        ST_Point(58.5771, 21.9790),
        21.9790,
        58.5771
    ),
    (
        'sinaw',
        'سناو',
        'Sinaw',
        'sinaw',
        'city',
        'al-sharqiya',
        ST_Point(56.5744, 22.5691),
        22.5691,
        56.5744
    ),
    (
        'sur',
        'صور',
        'Sur',
        'sur',
        'city',
        'al-sharqiya',
        ST_Point(56.6394, 22.5669),
        22.5669,
        56.6394
    ),
    (
        'wadi-bani-khalid',
        'وادي بني خالد',
        'Wadi Bani Khalid',
        'wadi-bani-khalid',
        'city',
        'al-sharqiya',
        ST_Point(56.3965, 22.6501),
        22.6501,
        56.3965
    ),
    (
        'other',
        'أخرى',
        'Other',
        'other',
        'city',
        'al-sharqiya',
        NULL,
        NULL,
        NULL
    );

-- Insert Al Wustaa state and its cities
INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- State
    (
        'al-wusta',
        'الوسطى',
        'Al Wustaa',
        'al-wusta',
        'state',
        'oman',
        ST_Point(56.6987, 19.8319),
        19.8319,
        56.6987
    ),
    -- Cities
    (
        'al-duqum',
        'الدقم',
        'Al Duqum',
        'al-duqum',
        'city',
        'al-wusta',
        ST_Point(57.6369, 19.7683),
        19.7683,
        57.6369
    ),
    (
        'al-jazur',
        'الجازر',
        'Al Jazur',
        'al-jazur',
        'city',
        'al-wusta',
        ST_Point(57.4389, 20.2564),
        20.2564,
        57.4389
    ),
    (
        'haima',
        'هيما',
        'Haima',
        'haima',
        'city',
        'al-wusta',
        ST_Point(57.6397, 20.4652),
        20.4652,
        57.6397
    ),
    (
        'mahut',
        'محوت',
        'Mahut',
        'mahut',
        'city',
        'al-wusta',
        ST_Point(58.1397, 19.7581),
        19.7581,
        58.1397
    ),
    (
        'other',
        'أخرى',
        'Other',
        'other',
        'city',
        'al-wusta',
        NULL,
        NULL,
        NULL
    );

-- Insert Buraimi state and its cities
INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- State
    (
        'buraimi',
        'البريمي',
        'Buraimi',
        'buraimi',
        'state',
        'oman',
        ST_Point(55.9740, 24.2477),
        24.2477,
        55.9740
    ),
    -- Cities
    (
        'al-buraimi',
        'البريمي',
        'Al Buraimi',
        'al-buraimi',
        'city',
        'buraimi',
        ST_Point(55.9523, 24.2481),
        24.2481,
        55.9523
    ),
    (
        'al-sinainah',
        'السنينة',
        'Al Sinainah',
        'al-sinainah',
        'city',
        'buraimi',
        ST_Point(55.9694, 24.2215),
        24.2215,
        55.9694
    ),
    (
        'mahdah',
        'محضة',
        'Mahdah',
        'mahdah',
        'city',
        'buraimi',
        ST_Point(55.8252, 24.0507),
        24.0507,
        55.8252
    ),
    (
        'other',
        'أخرى',
        'Other',
        'other',
        'city',
        'buraimi',
        NULL,
        NULL,
        NULL
    );

    INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- State
    (
        'dhofar',
        'ظفار',
        'Dhofar',
        'dhofar',
        'state',
        'oman',
        ST_Point(54.0912, 17.0117),
        17.0117,
        54.0912
    ),
    -- Cities
    (
        'salala',
        'صلالة',
        'Salala',
        'salala',
        'city',
        'dhofar',
        ST_Point(54.0842, 17.0150),
        17.0150,
        54.0842
    ),
    (
        'taqah',
        'طاقة',
        'Taqah',
        'taqah',
        'city',
        'dhofar',
        ST_Point(54.4661, 17.0108),
        17.0108,
        54.4661
    ),
    (
        'mirbat',
        'مرباط',
        'Mirbat',
        'mirbat',
        'city',
        'dhofar',
        ST_Point(54.5492, 17.0365),
        17.0365,
        54.5492
    ),
    (
        'al-mazyona',
        'المزيونة',
        'Al Mazyona',
        'al-mazyona',
        'city',
        'dhofar',
        ST_Point(53.7059, 17.1810),
        17.1810,
        53.7059
    ),
    (
        'dhalkut',
        'ضلكوت',
        'Dhalkut',
        'dhalkut',
        'city',
        'dhofar',
        ST_Point(53.8005, 17.0931),
        17.0931,
        53.8005
    ),
    (
        'muqshin',
        'مقشن',
        'Muqshin',
        'muqshin',
        'city',
        'dhofar',
        ST_Point(53.8000, 17.0160),
        17.0160,
        53.8000
    ),
    (
        'rakhyut',
        'رخيوت',
        'Rakhyut',
        'rakhyut',
        'city',
        'dhofar',
        ST_Point(53.8005, 17.5400),
        17.5400,
        53.8005
    ),
    (
        'sadah',
        'سدح',
        'Sadah',
        'sadah',
        'city',
        'dhofar',
        ST_Point(53.7233, 17.0225),
        17.0225,
        53.7233
    ),
    (
        'shalim-and-the-hallaniyat-island',
        'شليم وجزر الحلانيات',
        'Shalim and The Hallaniyat Island',
        'shalim-and-the-hallaniyat-island',
        'city',
        'dhofar',
        ST_Point(53.9548, 17.2215),
        17.2215,
        53.9548
    ),
    (
        'thumrait',
        'ثمريت',
        'Thumrait',
        'thumrait',
        'city',
        'dhofar',
        ST_Point(54.4541, 17.3933),
        17.3933,
        54.4541
    );

-- Insert Musandam state and its cities
INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- State
    (
        'musandam',
        'مسندم',
        'Musandam',
        'musandam',
        'state',
        'oman',
        ST_Point(56.2328, 26.0847),
        26.0847,
        56.2328
    ),
    -- Cities
    (
        'bukha',
        'بخا',
        'Bukha',
        'bukha',
        'city',
        'musandam',
        ST_Point(56.2711, 26.2297),
        26.2297,
        56.2711
    ),
    (
        'dibba',
        'دبا',
        'Dibba',
        'dibba',
        'city',
        'musandam',
        ST_Point(56.2745, 26.2709),
        26.2709,
        56.2745
    ),
    (
        'khasab',
        'خصب',
        'Khasab',
        'khasab',
        'city',
        'musandam',
        ST_Point(56.2686, 26.1748),
        26.1748,
        56.2686
    ),
    (
        'limah',
        'ليمه',
        'Limah',
        'limah',
        'city',
        'musandam',
        ST_Point(56.1702, 26.2110),
        26.2110,
        56.1702
    ),
    (
        'madha',
        'مدحاء',
        'Madha',
        'madha',
        'city',
        'musandam',
        ST_Point(56.1248, 26.2486),
        26.2486,
        56.1248
    );


-- Insert Muscat state and its citys
INSERT INTO
    locations (
        slug,
        label_ar,
        label_en,
        url_name,
        type,
        parent_slug,
        location,
        lat,
        lng
    )
VALUES
    -- State
    (
        'muscat',
        'مسقط',
        'Muscat',
        'muscat',
        'state',
        'oman',
        ST_Point(58.5922, 23.5887),
        23.5887,
        58.5922
    ),
    -- citys
    (
        'bosher',
        'بوشر',
        'Bosher',
        'bosher',
        'city',
        'muscat',
        ST_Point(58.4165, 23.5774),
        23.5774,
        58.4165
    ),
    (
        'al-khoud',
        'الخوض',
        'Al Khoud',
        'al-khoud',
        'city',
        'muscat',
        ST_Point(58.3624, 23.5936),
        23.5936,
        58.3624
    ),
    (
        'al-mouj',
        'الموج',
        'Al Mouj',
        'al-mouj',
        'city',
        'muscat',
        ST_Point(58.2465, 23.6232),
        23.6232,
        58.2465
    ),
    (
        'azaiba',
        'العذيبة',
        'Azaiba',
        'azaiba',
        'city',
        'muscat',
        ST_Point(58.3523, 23.6155),
        23.6155,
        58.3523
    ),
    (
        'al-maabilah',
        'المعبيلة',
        'Al Maabilah',
        'al-maabilah',
        'city',
        'muscat',
        ST_Point(58.2757, 23.6074),
        23.6074,
        58.2757
    ),
    (
        'al-mawaleh',
        'الموالح',
        'Al Mawaleh',
        'al-mawaleh',
        'city',
        'muscat',
        ST_Point(58.3146, 23.6331),
        23.6331,
        58.3146
    ),
    (
        'qurm',
        'القرم',
        'Qurm',
        'qurm',
        'city',
        'muscat',
        ST_Point(58.4253, 23.5820),
        23.5820,
        58.4253
    ),
    (
        'ghala',
        'غلا',
        'Ghala',
        'ghala',
        'city',
        'muscat',
        ST_Point(58.3577, 23.5804),
        23.5804,
        58.3577
    ),
    (
        'madinat-as-sultan-qaboos',
        'مدينة السلطان قابوس',
        'Madinat As Sultan Qaboos',
        'madinat-as-sultan-qaboos',
        'city',
        'muscat',
        ST_Point(58.3794, 23.5769),
        23.5769,
        58.3794
    ),
    (
        'amerat',
        'العامرات',
        'Amerat',
        'amerat',
        'city',
        'muscat',
        ST_Point(58.3806, 23.5470),
        23.5470,
        58.3806
    ),
    (
        'muscat-hills',
        'مسقط هيلز',
        'Muscat Hills',
        'muscat-hills',
        'city',
        'muscat',
        ST_Point(58.2824, 23.6248),
        23.6248,
        58.2824
    ),
    (
        'al-sifah',
        'السيفة',
        'Al-Sifah',
        'al-sifah',
        'city',
        'muscat',
        ST_Point(58.3928, 23.4727),
        23.4727,
        58.3928
    ),
    (
        'seeb',
        'السيب',
        'Seeb',
        'seeb',
        'city',
        'muscat',
        ST_Point(58.2265, 23.6070),
        23.6070,
        58.2265
    ),
    (
        'qantab',
        'قنتب',
        'Qantab',
        'qantab',
        'city',
        'muscat',
        ST_Point(58.3354, 23.6023),
        23.6023,
        58.3354
    ),
    (
        'ghubrah',
        'الغبرة',
        'Ghubrah',
        'ghubrah',
        'city',
        'muscat',
        ST_Point(58.4002, 23.5964),
        23.5964,
        58.4002
    ),
    (
        'yiti',
        'يتي',
        'Yiti',
        'yiti',
        'city',
        'muscat',
        ST_Point(58.3115, 23.4980),
        23.4980,
        58.3115
    ),
    (
        'al-khuwair',
        'الخوير',
        'Al Khuwair',
        'al-khuwair',
        'city',
        'muscat',
        ST_Point(58.4011, 23.5889),
        23.5889,
        58.4011
    ),
    (
        'al-hail',
        'الحيل',
        'Al-Hail',
        'al-hail',
        'city',
        'muscat',
        ST_Point(58.4189, 23.5378),
        23.5378,
        58.4189
    ),
    (
        'ansab',
        'الأنصب',
        'Ansab',
        'ansab',
        'city',
        'muscat',
        ST_Point(58.4010, 23.5633),
        23.5633,
        58.4010
    ),
    (
        'halban',
        'حلبان',
        'Halban',
        'halban',
        'city',
        'muscat',
        ST_Point(58.2571, 23.5997),
        23.5997,
        58.2571
    ),
    (
        'barr-al-jissah',
        'بر الجصة',
        'Barr al Jissah',
        'barr-al-jissah',
        'city',
        'muscat',
        ST_Point(58.3470, 23.5881),
        23.5881,
        58.3470
    ),
    (
        'misfah',
        'المسفاة',
        'Misfah',
        'misfah',
        'city',
        'muscat',
        ST_Point(58.3661, 23.5990),
        23.5990,
        58.3661
    ),
    (
        'al-bustan',
        'البستان',
        'Al-Bustan',
        'al-bustan',
        'city',
        'muscat',
        ST_Point(58.3740, 23.5880),
        23.5880,
        58.3740
    ),
    (
        'al-jafnayn',
        'الجفنين',
        'Al Jafnayn',
        'al-jafnayn',
        'city',
        'muscat',
        ST_Point(58.3555, 23.5621),
        23.5621,
        58.3555
    ),
    (
        'quriyat',
        'قريات',
        'Quriyat',
        'quriyat',
        'city',
        'muscat',
        ST_Point(58.4384, 23.5073),
        23.5073,
        58.4384
    ),
    (
        'hamriya',
        'الحمرية',
        'Hamriya',
        'hamriya',
        'city',
        'muscat',
        ST_Point(58.4423, 23.5322),
        23.5322,
        58.4423
    ),
    (
        'rusail',
        'الرسيل',
        'Rusail',
        'rusail',
        'city',
        'muscat',
        ST_Point(58.4235, 23.5410),
        23.5410,
        58.4235
    ),
    (
        'darsait',
        'دارسيت',
        'Darsait',
        'darsait',
        'city',
        'muscat',
        ST_Point(58.3675, 23.5558),
        23.5558,
        58.3675
    ),
    (
        'ruwi',
        'روي',
        'Ruwi',
        'ruwi',
        'city',
        'muscat',
        ST_Point(58.4111, 23.5662),
        23.5662,
        58.4111
    ),
    (
        'wadi-al-kabir',
        'وادي الكبير',
        'Wadi Al Kabir',
        'wadi-al-kabir',
        'city',
        'muscat',
        ST_Point(58.3994, 23.5812),
        23.5812,
        58.3994
    ),
    (
        'manumah',
        'المنومه',
        'Manumah',
        'manumah',
        'city',
        'muscat',
        ST_Point(58.4344, 23.5694),
        23.5694,
        58.4344
    ),
    (
        'al-wuttayah',
        'الوطية',
        'Al-Wuttayah',
        'al-wuttayah',
        'city',
        'muscat',
        ST_Point(58.3934, 23.5846),
        23.5846,
        58.3934
    ),
    (
        'muttrah',
        'مطرح',
        'Muttrah',
        'muttrah',
        'city',
        'muscat',
        ST_Point(58.4527, 23.6045),
        23.6045,
        58.4527
    ),
    (
        'sidab',
        'سداب',
        'Sidab',
        'sidab',
        'city',
        'muscat',
        ST_Point(58.4458, 23.6129),
        23.6129,
        58.4458
    ),
    (
        'yenkit',
        'ينكت',
        'Yenkit',
        'yenkit',
        'city',
        'muscat',
        ST_Point(58.4182, 23.4890),
        23.4890,
        58.4182
    );