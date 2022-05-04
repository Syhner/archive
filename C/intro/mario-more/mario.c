#include <cs50.h>
#include <stdio.h>

int main(void)
{
    int height;
    do
    {
        height = get_int("Height: ");
    }
    while (height < 1 || height > 8);

    // For each row
    for (int row = 0; row < height; row++)
    {
        // Print left spaces
        for (int spaces = height - row; spaces > 1; spaces--)
        {
            printf(" ");
        }

        // Print left hashes
        for (int hashes = 0; hashes < row + 1; hashes++)
        {
            printf("#");
        }

        // Print gap
        printf("  ");

        // Print right hashes
        for (int hashes = 0; hashes < row + 1; hashes++)
        {
            printf("#");
        }

        // Move to next row
        printf("\n");
    }
}