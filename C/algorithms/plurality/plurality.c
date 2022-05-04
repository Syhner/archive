#include <cs50.h>
#include <stdio.h>
#include <string.h>

// Max number of candidates
#define MAX 9

// Candidates have name and vote count
typedef struct
{
    string name;
    int votes;
}
candidate;

// Array of candidates
candidate candidates[MAX];

// Number of candidates
int candidate_count;

// Function prototypes
bool vote(string name);
void print_winner(void);

int main(int argc, string argv[])
{
    // Check for invalid usage
    if (argc < 2)
    {
        printf("Usage: plurality [candidate ...]\n");
        return 1;
    }

    // Populate array of candidates
    candidate_count = argc - 1;
    if (candidate_count > MAX)
    {
        printf("Maximum number of candidates is %i\n", MAX);
        return 2;
    }
    for (int i = 0; i < candidate_count; i++)
    {
        candidates[i].name = argv[i + 1];
        candidates[i].votes = 0;
    }

    int voter_count = get_int("Number of voters: ");

    // Loop over all voters
    for (int i = 0; i < voter_count; i++)
    {
        string name = get_string("Vote: ");

        // Check for invalid vote
        if (!vote(name))
        {
            printf("Invalid vote.\n");
        }
    }

    // Display winner of election
    print_winner();
}

// Update vote totals given a new vote
bool vote(string name)
{
    // Check for a match
    int match_i;
    bool match = false;
    for (int i = 0; i < candidate_count; i++)
    {
        if (strcmp(name, candidates[i].name) == 0)
        {
            match_i = i;
            match = true;
        }
    }
    if (!match)
    {
        return false;
    }

    // Match found - increment vote for the candidate
    candidates[match_i].votes ++;

    return true;
}

// Print the winner (or winners) of the election
void print_winner(void)
{
    int winning_votes = 0;
    bool isWinner[candidate_count];

    // Loop over the candidates
    for (int i = 0; i < candidate_count; i++)
    {
        int votes = candidates[i].votes;

        // Current candidate has the most votes yet
        if (votes > winning_votes)
        {
            // Remove all other running winners
            for (int j = 0; j < i; j++)
            {
                isWinner[j] = false;
            }

            // Set the running winner and number of votes
            isWinner[i] = true;
            winning_votes = votes;
        }
        // Tied 1st position
        else if (votes == winning_votes)
        {
            isWinner[i] = true;
        }
        else
        {
            isWinner[i] = false;
        }
    }

    // Print the winners
    for (int i = 0; i < candidate_count; i++)
    {
        if (isWinner[i])
        {
            printf("%s\n", candidates[i].name);
        }
    }

    return;
}