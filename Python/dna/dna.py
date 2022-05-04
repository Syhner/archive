import csv
from sys import argv, exit


def main():

    # Check for command-line usage
    if len(argv) != 3:
        exit("Usage: python dna.py DATABASE.csv SEQUENCE.txt")

    db_filename = argv[1]
    seq_filename = argv[2]

    # Save STRs and profiles
    profiles = []
    with open(db_filename) as db:
        dict_reader = csv.DictReader(db)
        STRs = dict_reader.fieldnames[1:]

        reader = csv.reader(db)
        for row in reader:
            profiles.append(row)

    # Read DNA sequence file into a variable
    with open(seq_filename) as seq:
        sequence = seq.read()

    # Find longest match of each STR in DNA sequence
    max_counts = []
    for STR in STRs:
        matches = longest_match(sequence, STR)
        max_counts.append(str(matches))

    # Check database for matching profiles
    for profile in profiles:
        profile_counts = profile[1:]
        if profile_counts == max_counts:
            print(profile[0])
            exit(0)

    print("No match")

    return


def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    # Initialize variables
    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    # Check each character in sequence for most consecutive runs of subsequence
    for i in range(sequence_length):

        # Initialize count of consecutive runs
        count = 0

        # Check for a subsequence match in a "substring" (a subset of characters) within sequence
        # If a match, move substring to next potential match in sequence
        # Continue moving substring and checking for matches until out of consecutive matches
        while True:

            # Adjust substring start and end
            start = i + count * subsequence_length
            end = start + subsequence_length

            # If there is a match in the substring
            if sequence[start:end] == subsequence:
                count += 1

            # If there is no match in the substring
            else:
                break

        # Update most consecutive matches found
        longest_run = max(longest_run, count)

    # After checking for runs at each character in seqeuence, return longest run found
    return longest_run


main()
