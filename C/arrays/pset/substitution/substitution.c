#include <cs50.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main(int argc, string argv[])
{
    // Incorrect arguments
    if (argc != 2)
    {
        printf("Key must contain 26 characters.\n");
        return 1;
    }

    string key = argv[1];

    // Incorrect key length
    if (strlen(key) != 26)
    {
        printf("That key isn't valid! You must use a key of length 26.\n");
        return 1;
    }

    // For each character in the key
    for (int i = 0, n = strlen(key); i < n; i++)
    {
        // Ensure the character is alphabeticaal
        if (!isalpha(key[i]))
        {
            printf("That key isn't valid! You may only use alphaebetical characters.\n");
            return 1;
        }

        // Ensure the character hasn't already been added
        for (int j = 0; j < i; j++)
        {
            if (key[i] == key[j])
            {
                printf("That key isn't valid! You may only use each character once.\n");
                return 1;
            }
        }

        // Convert the character to uppercase and move on to the next character
        key[i] = toupper(key[i]);
    }

    string plaintext = get_string("plaintext:  ");
    string ciphertext = plaintext;

    // Convert the plaintext to ciphertext
    char c;
    for (int i = 0, n = strlen(plaintext); i < n; i++)
    {
        c = plaintext[i];
        if (c >= 'a' && c <= 'z')
        {
            ciphertext[i] = tolower(key[c - 97]);
        }
        else if (c >= 'A' && c <= 'Z')
        {
            ciphertext[i] = key[c - 65];
        }
        else
        {
            ciphertext[i] = c;
        }
    }

    printf("ciphertext: %s\n", ciphertext);
    return 0;
}