// Implements a dictionary's functionality

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#include "dictionary.h"

// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
}
node;

// Choose number of buckets in hash table
const unsigned int N = 65536; // = 2 ^ 16

// Hash table
node *table[N];

int dict_size = 0;

// Returns true if word is in dictionary, else false
bool check(const char *word)
{
    // Hash word to obtain hash value
    int hash_value = hash(word);

    // Access linked list at that index in the hash table
    node *cursor = table[hash_value];

    // Traverse linked list, looking for the word
    while (cursor != NULL)
    {
        if (strcasecmp(word, cursor->word) == 0)
        {
            return true;
        }

        cursor = cursor->next;
    }

    return false;
}

// Hashes word to a number
unsigned int hash(const char *word)
{
    int sum = 0;

    // Sum the ASCII value of each character
    for (int i = 0; i < strlen(word); i++)
    {
        // Convert any uppercase characters to lowercase
        if (isupper(word[i]))
        {
            sum += tolower(word[i]);
        }
        else
        {
            sum += word[i];
        }
    }

    return sum % N;
}

// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary)
{
    // Open dictionary file
    FILE *file = fopen(dictionary, "r");

    // Check if file was opened
    if (file == NULL)
    {
        return false;
    }

    // Read strings from file one at a time
    char buffer[LENGTH + 1];

    while (fscanf(file, "%s", buffer) != EOF) // Get single words from dictionary
    {
        // Create new node for each word
        node *n = malloc(sizeof(node));

        if (n == NULL)
        {
            fclose(file);
            return false;
        }

        strcpy(n->word, buffer);
        n->next = NULL;

        // Hash word to obtain a hash value
        unsigned int index = hash(buffer);

        // Insert node into hash table
        n->next = table[index];
        table[index] = n;
        dict_size ++;
    }

    fclose(file);

    return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void)
{
    return dict_size;
}

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void)
{
    // Iterate over buckets of hash table
    for (int i = 0; i < N; i++)
    {
        node *cursor = table[i];

        while (cursor != NULL)
        {
            node *tmp = cursor;
            cursor = cursor-> next;
            free(tmp);
        }
    }

    return true;
}
