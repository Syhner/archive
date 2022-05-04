from cs50 import get_int
from sys import exit

num = get_int("Number: ")
length = len(str(num))
start_2 = int(str(num)[:2])
start_1 = int(str(num)[:1])

checksum = 0

# Iterate backwards over the number
while num >= 1:
    # Odd digit to total
    checksum += num % 10
    num //= 10

    # Even digit to total
    doubled_digit = 2 * (num % 10)
    checksum += doubled_digit // 10 + doubled_digit % 10
    num //= 10

# Check the checksum
if checksum % 10 != 0:
    print("INVALID")
    print(checksum)
    exit(0)

if length == 15 and (start_2 == 23 or start_2 == 37):
    print("AMEX")
elif length == 16 and (start_2 >= 51 and start_2 <= 55):
    print("MASTERCARD")
elif (length == 13 or length == 16) and start_1 == 4:
    print("VISA")
else:
    print("INVALID")