#include <cs50.h>
#include <stdio.h>
#include <math.h>

int main(void)
{
    string text = get_string("Text: ");

    int i = 0;
    int character = text[i];
    int letters = 0;
    int words = 1;
    int sentences = 0;

    while (character != 0)
    {
        if (character >= 'A' && character <= 'Z')
        {
            letters++;
        }
        else if (character >= 'a' && character <= 'z')
        {
            letters++;
        }
        else if (character == ' ')
        {
            words++;
        }
        else if (character == '.' || character == '?' || character == '!')
        {
            sentences++;
        }

        i++;
        character = text[i];
    }

    float index = 0.0588 * ((float)letters / words) * 100 - 0.296 * ((float)sentences / words) * 100 - 15.8;
    int grade = (int) round(index);

    if (grade < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (grade >= 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", (int) round(index));
    }
}