#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef uint8_t BYTE;

int main(int argc, char *argv[])
{

    // Handle bad usage
    if (argc != 2)
    {
        printf("Usage: ./recover IMAGE\n");
        return 1;
    }
    else
    {
        // Open memory card
        char *infile_name = argv[1];
        FILE *infile = fopen(infile_name, "r");

        // Handle bad infile
        if (infile == NULL)
        {
            printf("Image could not be opened for reading!\n");
            return 1;
        }

        // Initlaise variables
        BYTE buffer[512];
        int count = 0;
        FILE *outfile = NULL;
        char filename[8];

        // Repeat until end of card
        while (fread(&buffer, 512, 1, infile))
        {
            // If start of new JPEG
            if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
            {
                // Close previous file if not first JPEG
                if (count > 0)
                {
                    fclose(outfile);
                }

                // Initialise new JPEG
                sprintf(filename, "%03i.jpg", count);
                outfile = fopen(filename, "w");
                count ++;
            }

            // If already found JPEG
            if (count > 0)
            {
                fwrite(&buffer, 512, 1, outfile);
            }
        }

        fclose(infile);
        fclose(outfile);
        return 0;
    }
}