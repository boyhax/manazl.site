-- Create the host_types table
CREATE TABLE host_types (
    id SERIAL PRIMARY KEY,
    label_ar TEXT NOT NULL,
    label TEXT UNIQUE NOT NULL,
    icon TEXT,
    image TEXT
);

-- Create the amenities table
CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    label_ar TEXT NOT NULL,
    label TEXT UNIQUE NOT NULL,
    icon TEXT,
    image TEXT
);

-- Insert data into host_types
INSERT INTO
    host_types (label_ar, label, icon, image)
VALUES
    (
        'جناح',
        'Suite',
        'mdi:home-city-outline',
        'suite.jpg'
    ),
    ('فيلا', 'Villa', 'mdi:home-modern', 'villa.jpg'),
    ('غرفة', 'Room', 'mdi:bed', 'room.jpg'),
    ('مخيم', 'Camp', 'mdi:tent', 'camp.jpg');

-- Insert data into amenities
INSERT INTO
    amenities (label_ar, label, icon, image)
VALUES
    ('واي فاي', 'Wi-Fi', 'mdi:wifi', 'wifi.jpg'),
    ('تلفزيون', 'TV', 'mdi:television', 'tv.jpg'),
    ('مطبخ', 'Kitchen', 'mdi:chef-hat', 'kitchen.jpg'),
    (
        'غسالة',
        'Washer',
        'mdi:washing-machine',
        'washer.jpg'
    ),
    (
        'موقف سيارات مجاني',
        'Free parking',
        'mdi:parking',
        'free_parking.jpg'
    ),
    (
        'موقف سيارات مدفوع',
        'Paid parking',
        'mdi:cash-parking',
        'paid_parking.jpg'
    ),
    (
        'تكييف هواء',
        'Air conditioning',
        'mdi:air-conditioner',
        'air_conditioning.jpg'
    ),
    (
        'مكان عمل مخصص',
        'Dedicated workspace',
        'mdi:laptop',
        'workspace.jpg'
    ),
    ('مسبح', 'Pool', 'mdi:pool', 'pool.jpg'),
    (
        'حوض استحمام ساخن',
        'Hot tub',
        'mdi:hot-tub',
        'hot_tub.jpg'
    ),
    ('فناء', 'Patio', 'mdi:patio', 'patio.jpg'),
    (
        'شواية',
        'BBQ grill',
        'mdi:grill',
        'bbq_grill.jpg'
    ),
    (
        'منطقة طعام خارجية',
        'Outdoor dining area',
        'mdi:table-furniture',
        'outdoor_dining.jpg'
    ),
    (
        'موقد',
        'Fire pit',
        'mdi:fireplace',
        'fire_pit.jpg'
    ),
    (
        'صالة رياضية',
        'Gym',
        'mdi:weight-lifter',
        'gym.jpg'
    ),
    (
        'وصول إلى الشاطئ',
        'Beach access',
        'mdi:beach',
        'beach_access.jpg'
    ),
    (
        'تزلج الدخول والخروج',
        'Ski-in/Ski-out',
        'mdi:ski',
        'ski_in_out.jpg'
    ),
    (
        'إنذار حريق',
        'Smoke alarm',
        'mdi:smoke-detector',
        'smoke_alarm.jpg'
    ),
    (
        'مجموعة إسعافات أولية',
        'First aid kit',
        'mdi:first-aid',
        'first_aid_kit.jpg'
    );