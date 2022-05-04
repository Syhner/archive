#include <math.h>

#include "helpers.h"

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            float blue = image[i][j].rgbtBlue;
            float green = image[i][j].rgbtGreen;
            float red = image[i][j].rgbtRed;

            int average = round((red + blue + green) / 3);

            image[i][j].rgbtBlue = image[i][j].rgbtGreen = image[i][j].rgbtRed = average;
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        // Loop through half of columns
        for (int j = 0; j < floor(width / 2); j++)
        {
            RGBTRIPLE temp = image[i][j];
            int reflect_col = width - (j + 1);
            image[i][j] = image[i][reflect_col];
            image[i][reflect_col] = temp;
        }
    }
    return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    // Create a copy of the image to reference
    RGBTRIPLE temp[height][width];
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            temp[i][j] = image[i][j];
        }
    }

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            // Initialise sums
            float blue_sum;
            float green_sum;
            float red_sum;
            int valid_pixels;

            blue_sum = green_sum = red_sum = valid_pixels = 0;
            // Loop over surrounding pixels
            for (int k = i - 1; k <= i + 1; k++)
            {
                for (int l = j - 1; l <= j + 1; l++)
                {
                    // If the pixel exists in the image
                    if (k >= 0 && k < width && l >= 0 && l < width)
                    {
                        blue_sum += temp[k][l].rgbtBlue;
                        green_sum += temp[k][l].rgbtGreen;
                        red_sum += temp[k][l].rgbtRed;
                        valid_pixels ++;
                    }

                    image[i][j].rgbtBlue = round(blue_sum / valid_pixels);
                    image[i][j].rgbtGreen = round(green_sum / valid_pixels);
                    image[i][j].rgbtRed = round(red_sum / valid_pixels);
                }
            }
        }
    }
    return;
}

int cap_to_255(int num)
{
    if (num > 255)
    {
        return 255;
    }

    return num;
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    // Create a copy of the image to reference
    RGBTRIPLE temp[height][width];
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            temp[i][j] = image[i][j];
        }
    }

    // Initalise Sobel arrays
    int Gx[3][3] = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
    int Gy[3][3] = {{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}};

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            // Initialise sums
            float Gx_blue;
            float Gx_green;
            float Gx_red;
            float Gy_blue;
            float Gy_green;
            float Gy_red;

            Gx_blue = Gx_green = Gx_red = Gy_blue = Gy_green = Gy_red = 0;

            // Loop over surrounding pixels
            for (int k = i - 1; k <= i + 1; k++)
            {
                for (int l = j - 1; l <= j + 1; l++)
                {
                    // If the pixel exists in the image
                    if (k >= 0 && k < width && l >= 0 && l < width)
                    {
                        Gx_blue += temp[k][l].rgbtBlue * Gx[k - i + 1][l - j + 1];
                        Gx_green += temp[k][l].rgbtGreen * Gx[k - i + 1][l - j + 1];
                        Gx_red += temp[k][l].rgbtRed * Gx[k - i + 1][l - j + 1];
                        Gy_blue += temp[k][l].rgbtBlue * Gy[k - i + 1][l - j + 1];
                        Gy_green += temp[k][l].rgbtGreen * Gy[k - i + 1][l - j + 1];
                        Gy_red += temp[k][l].rgbtRed * Gy[k - i + 1][l - j + 1];
                    }

                    image[i][j].rgbtBlue = cap_to_255(round(sqrt(Gx_blue * Gx_blue + Gy_blue * Gy_blue)));
                    image[i][j].rgbtGreen = cap_to_255(round(sqrt(Gx_green * Gx_green + Gy_green * Gy_green)));
                    image[i][j].rgbtRed = cap_to_255(round(sqrt(Gx_red * Gx_red + Gy_red * Gy_red)));
                }
            }
        }
    }
    return;
}
