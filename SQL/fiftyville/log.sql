-- (n) is observation n

-- Inspect the structure of the database
.tables

-- Inspect the schema of the crime scene reports
.schema crime_scene_reports

-- Get the report for the crime we have been given
SELECT description FROM crime_scene_reports
WHERE month = 7 AND day = 28 AND year = 2021 AND street = 'Humphrey Street';
-- (1) The theft took place at 10:15 am
-- (2) Interviews with 3 witnesses were taken on the same day, all of which mention the bakery

-- (2) Get the names and transcripts of the 3 witnesses that mention the bakery
SELECT name, transcript FROM interviews
WHERE month = 7 AND day = 28 AND year = 2021 AND transcript LIKE '%bakery%';
-- (3) Ruth - Thief got into a car within within 10 mins of crime, should be on security footage
-- (4) Eugene - Recognises thief, saw them withdrawing money earlier in the morning on Leggett Street
-- (5) Raymond - Thief called for less than 1 min while leaving bakery, planning to take the earliest flight tomorrow

-- (3) People who's cars were seen exiting the crime scene within 10 minutes of the crime
SELECT name FROM people
JOIN bakery_security_logs ON bakery_security_logs.license_plate = people.license_plate
WHERE month = 7 AND day = 28 AND year = 2021
AND hour = 10 AND minute >= 5 AND minute <= 25
AND activity = 'exit'
ORDER BY name;
-- (3.1) Owner of escape car is one of: Barry, Bruce, Diana, Iman, Kelsey, Luca, Sofia, Vanessa

-- (4) People withdrawing from the ATM on Leggett Street on the day of the crime
SELECT DISTINCT name FROM people
JOIN bank_accounts ON bank_accounts.person_id = people.id
JOIN atm_transactions ON atm_transactions.account_number = bank_accounts.account_number
WHERE month = 7 AND day = 28 AND year = 2021
AND atm_transactions.transaction_type = 'withdraw'
AND atm_transactions.atm_location = 'Leggett Street'
ORDER BY name;
-- (4.1) The thief is one of: Benista, Brooke, Bruce, Diana, Iman, Kenny, Luca, Taylor

-- (5) People making a <1min phone call on that day, as the thief did
SELECT name, phone_calls.duration FROM people
JOIN phone_calls ON phone_calls.caller = people.phone_number
WHERE month = 7 AND day = 28 AND year = 2021 AND phone_calls.duration < 60
ORDER BY name;
-- (5.1) The thief is one of: Benista, Bruce, Carina, Diana, Kelsey, Kenny, Sofia, Taylor

-- (5) People receiving a <1min phone call on that day
SELECT name, phone_calls.duration FROM people
JOIN phone_calls ON phone_calls.receiver = people.phone_number
WHERE month = 7 AND day = 28 AND year = 2021 AND phone_calls.duration < 60
ORDER BY name;
-- (5.2) The accomplice is one of: Anna, Doris, Jack, Jacqueline, James, Larry, Melissa, Philip, Robin

-- (5) Check the time of the soonest flight on the next day
SELECT hour, minute FROM flights
JOIN airports on airports.id = origin_airport_id
WHERE month = 7 AND day = 29 AND year = 2021
AND airports.city = 'Fiftyville';
-- (5.3) The soonest flight is at 8:20 am

-- (5, 5.3) Names of people that took flights out of Fiftyville on the day and time
SELECT name, hour, minute FROM people
JOIN passengers ON passengers.passport_number = people.passport_number
JOIN flights ON flights.id = passengers.flight_id
JOIN airports ON airports.id = flights.origin_airport_id
WHERE month = 7 AND day = 29 AND year = 2021 AND hour = 8 AND minute = 20
AND airports.city = 'Fiftyville'
ORDER BY name;
-- (5.4) The thief is one of: Bruce, Doris, Edward, Kelsey, Kenny, Luca, Sofia, Taylor

-- Using (4.1, 5.1, 5.4) the thief is: Bruce or Kenny or Taylor.
-- Considering (3.2) the thief is most likely Bruce, since he also owns a car which
-- was seen exiting the crime scene, which was entered by the thief, by eyewitness account.

-- (5, 5.3) Finding the destination city
SELECT city FROM airports
JOIN flights ON flights.destination_airport_id = airports.id
JOIN passengers ON passengers.flight_id = flights.id
JOIN people ON people.passport_number = passengers.passport_number
WHERE name = 'Bruce' AND month = 7 AND day = 29 AND year = 2021
AND hour = 8 AND minute = 20;
-- New york city is the destination city

-- (5) Finding his accomplice through the matching phone call duation
SELECT name, phone_calls.duration FROM people
JOIN phone_calls ON phone_calls.receiver = people.phone_number
WHERE month = 7 AND day = 28 AND year = 2021 AND phone_calls.duration =
    (SELECT duration FROM phone_calls
    JOIN people ON people.phone_number = phone_calls.caller
    WHERE month = 7 AND day = 28 AND year = 2021 AND phone_calls.duration < 60
    AND people.name = 'Bruce');
-- Robin is the accomplice