CREATE
OR REPLACE FUNCTION get_other_chat_users(chat_id_input bigint, current_user_id uuid) RETURNS uuid [] AS $$ DECLARE all_users uuid [];

other_users uuid [];

BEGIN -- Get all users in the chat using the existing chat_users function
all_users := chat_users(chat_id_input);

-- Filter out the current user
SELECT
    array_agg(user_id) INTO other_users
FROM
    unnest(all_users) AS user_id
WHERE
    user_id != current_user_id;

RETURN other_users;

END;

$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION add_notification_after_message() RETURNS TRIGGER AS $ $ DECLARE other_users uuid [];

user_id uuid;

BEGIN -- Get other users in the chat excluding the current message sender
other_users := get_other_chat_users(NEW.chat_id, NEW.user_id);

-- Loop through each user and insert a notification
FOREACH user_id IN ARRAY other_users LOOP
INSERT INTO
    public.notifications (
        created_at,
        user_id,
        title,
        body,
        url,
        received,
        topic
    )
VALUES
    (
        NOW(),
        user_id,
        'New Message in Chat',
        NEW.text,
        NEW.url,
        false,
        'message_notification'
    );

END LOOP;

RETURN NEW;

END;

$ $ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER add_notification
AFTER
INSERT
    ON public.messages FOR EACH ROW EXECUTE FUNCTION add_notification_after_message();