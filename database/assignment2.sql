-- Adding data into the account table
INSERT INTO public.account (
account_firstname,
account_lastname,
account_email,
account_password
)
VALUES (
'Tony',
'Stark',
'tony@starknet.com',
'Iam1ronM@n'
);


-- modifying account type for Tony Stark to Admin
SET account_type = 'Admin' WHERE account_id = 1;


--deleting Tony Stark from the account table
DELETE FROM "account" WHERE account_id = 1;


--modifying the GM HUMMER to read 'huge interior' instead of 'small interiors'
UPDATE "inventory" 
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_id = 10;



-- selecting make, model and classification name where the lassification anme is "Sport"
SELECT 
inv_make,
inv_model,
classification_name
FROM "inventory"
INNER JOIN
"classification"
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';



-- adding '/vehicles' to the middle of the inv_image and inv_thumbnail paths
UPDATE "inventory"
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
inv_thumbnail = REPLACE (inv_thumbnail, '/images', '/images/vehicles');